import Groq from 'groq-sdk'
import { serverEnv } from '@/lib/env.server'
import { offlineAnswer, systemPrompt } from '@/lib/profile'
import { allow } from '@/lib/rate-limit'

// The hero chat. Streams plain text. Runs on Groq's free tier; when there is no key, the
// visitor or the free daily quota is exhausted, or Groq fails, it answers with a prepared
// reply instead (x-chat-mode: offline), so the chat never just breaks.

const MODEL = 'openai/gpt-oss-20b'
const MAX_MESSAGES = 12
const MAX_QUESTION = 500
const MAX_MESSAGE = 2000

type ChatMessage = { role: 'user' | 'assistant'; content: string }

const groq = serverEnv.groqApiKey ? new Groq({ apiKey: serverEnv.groqApiKey }) : null

function parseMessages(body: unknown): ChatMessage[] | null {
  const raw = (body as { messages?: unknown } | null)?.messages
  if (!Array.isArray(raw) || raw.length === 0) return null
  const messages: ChatMessage[] = []
  for (const m of raw.slice(-MAX_MESSAGES)) {
    const { role, content } = (m ?? {}) as Record<string, unknown>
    if ((role !== 'user' && role !== 'assistant') || typeof content !== 'string') return null
    messages.push({ role, content: content.slice(0, MAX_MESSAGE) })
  }
  const last = messages.at(-1)
  if (last?.role !== 'user' || !last.content.trim() || last.content.length > MAX_QUESTION) {
    return null
  }
  return messages
}

function textResponse(body: string | ReadableStream<Uint8Array>, mode: 'ai' | 'offline') {
  return new Response(body, {
    headers: {
      'content-type': 'text/plain; charset=utf-8',
      'cache-control': 'no-store',
      'x-chat-mode': mode,
    },
  })
}

function clientIp(request: Request) {
  return request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
}

export async function POST(request: Request) {
  const messages = parseMessages(await request.json().catch(() => null))
  if (!messages) {
    return Response.json(
      { error: `Ask something in up to ${MAX_QUESTION} characters.` },
      { status: 400 },
    )
  }
  const question = messages.at(-1)!.content

  // Keeps one visitor from spending the whole free daily quota: 20 questions per 10 minutes.
  if (!groq || !allow(`ip:${clientIp(request)}`, 20, 10 * 60_000)) {
    return textResponse(offlineAnswer(question), 'offline')
  }

  let stream
  try {
    stream = await groq.chat.completions.create(
      {
        model: MODEL,
        messages: [{ role: 'system', content: systemPrompt() }, ...messages],
        stream: true,
        max_completion_tokens: 600,
        reasoning_effort: 'low',
        include_reasoning: false,
      },
      { signal: request.signal },
    )
  } catch (error) {
    // 429 = free quota used up for now; anything else is logged. Either way, answer offline.
    if (!(error instanceof Groq.RateLimitError)) console.error('Chat request failed', error)
    return textResponse(offlineAnswer(question), 'offline')
  }

  const encoder = new TextEncoder()
  const body = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content
          if (text) controller.enqueue(encoder.encode(text))
        }
      } catch (error) {
        if (!request.signal.aborted) {
          console.error('Chat stream failed', error)
          controller.enqueue(encoder.encode('\n\n(Connection lost. Please ask again.)'))
        }
      } finally {
        try {
          controller.close()
        } catch {
          // Already closed because the visitor left.
        }
      }
    },
    cancel() {
      stream.controller.abort()
    },
  })

  return textResponse(body, 'ai')
}
