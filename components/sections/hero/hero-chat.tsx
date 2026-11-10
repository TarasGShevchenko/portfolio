'use client'

import { Fragment, useEffect, useRef, useState, type FormEvent, type ReactNode } from 'react'
import { Avatar } from '@/components/avatar'
import { QUICK_TOPICS, topicAnswer, type Topic } from '@/lib/profile'

type Message = {
  id: number
  role: 'user' | 'assistant'
  content: string
  // Answered from prepared replies rather than by the AI.
  prepared?: boolean
}

const MAX_QUESTION = 500

// URLs and emails in answers become links; everything else stays plain text.
const LINK = /(https?:\/\/[^\s)]+|[\w.+-]+@[\w-]+\.[\w.-]+)/g

function Linkified({ text }: { text: string }) {
  return text.split(LINK).map((part, i) =>
    i % 2 === 1 ? (
      <a
        key={i}
        href={part.includes('@') && !part.startsWith('http') ? `mailto:${part}` : part}
        target={part.startsWith('http') ? '_blank' : undefined}
        rel='noreferrer'
        className='text-signal underline underline-offset-4'
      >
        {part}
      </a>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

export function HeroChat({ greeting }: { greeting: ReactNode }) {
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const nextId = useRef(0)
  const log = useRef<HTMLDivElement>(null)
  const request = useRef<AbortController | null>(null)

  useEffect(() => () => request.current?.abort(), [])

  // Keep the newest message in view while an answer streams in.
  useEffect(() => {
    const el = log.current
    if (el) el.scrollTop = el.scrollHeight
  }, [messages])

  const add = (role: Message['role'], content: string, prepared?: boolean) => {
    const id = nextId.current++
    setMessages((m) => [...m, { id, role, content, prepared }])
    return id
  }
  const update = (id: number, patch: Partial<Message>) =>
    setMessages((m) => m.map((msg) => (msg.id === id ? { ...msg, ...patch } : msg)))

  // Quick buttons answer from the profile instantly; no AI call, no quota spent.
  function askTopic(topic: Topic, question: string) {
    if (busy) return
    add('user', question)
    add('assistant', topicAnswer(topic), true)
  }

  async function ask(question: string) {
    const text = question.trim().slice(0, MAX_QUESTION)
    if (!text || busy) return

    const history = [...messages, { role: 'user' as const, content: text }].map(
      ({ role, content }) => ({ role, content }),
    )
    add('user', text)
    const answerId = add('assistant', '')
    setInput('')
    setBusy(true)

    const controller = new AbortController()
    request.current = controller
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ messages: history }),
        signal: controller.signal,
      })
      if (!response.ok || !response.body) {
        const data: { error?: string } | null = await response.json().catch(() => null)
        throw new Error(data?.error ?? 'Something went wrong. Please try again.')
      }
      const prepared = response.headers.get('x-chat-mode') === 'offline'
      const reader = response.body.pipeThrough(new TextDecoderStream()).getReader()
      let answer = ''
      for (;;) {
        const { done, value } = await reader.read()
        if (done) break
        answer += value
        update(answerId, { content: answer, prepared })
      }
      if (!answer.trim())
        update(answerId, { content: 'Sorry, I lost my train of thought. Ask again?' })
    } catch (e) {
      if (controller.signal.aborted) return
      update(answerId, {
        content: e instanceof Error ? e.message : 'Something went wrong. Please try again.',
      })
    } finally {
      setBusy(false)
    }
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    void ask(input)
  }

  const chatting = messages.length > 0

  return (
    <div className='relative flex w-full max-w-2xl flex-col items-center text-center'>
      <div
        className={`flex flex-col items-center transition-all duration-500 ${chatting ? 'scale-90' : ''}`}
      >
        {greeting}
      </div>

      {chatting && (
        <div
          ref={log}
          aria-live='polite'
          className='no-scrollbar mt-8 flex max-h-[42svh] w-full flex-col gap-4 overflow-y-auto overscroll-contain px-1 text-left'
        >
          {messages.map((m) =>
            m.role === 'user' ? (
              <p
                key={m.id}
                className='max-w-[85%] animate-rise self-end rounded-2xl rounded-br-md bg-signal px-4 py-2.5 text-background'
              >
                {m.content}
              </p>
            ) : (
              <div key={m.id} className='flex max-w-[92%] animate-rise gap-3 self-start'>
                <Avatar size='sm' />
                <div className='rounded-2xl rounded-tl-md border border-line/10 bg-surface px-4 py-2.5'>
                  {m.content ? (
                    <p className='whitespace-pre-line'>
                      <Linkified text={m.content} />
                    </p>
                  ) : (
                    <span className='typing' aria-label='Typing'>
                      <i />
                      <i />
                      <i />
                    </span>
                  )}
                  {m.prepared && m.content && (
                    <p className='mt-2 text-xs text-muted'>Prepared answer</p>
                  )}
                </div>
              </div>
            ),
          )}
        </div>
      )}

      <form onSubmit={onSubmit} className={`w-full ${chatting ? 'mt-5' : 'mt-10'}`}>
        <label htmlFor='chat-input' className='sr-only'>
          Ask me anything
        </label>
        <div className='flex items-center gap-2 rounded-full border border-line/15 bg-surface p-1.5 shadow-[0_12px_32px_color-mix(in_oklab,var(--signal)_14%,transparent)]'>
          <input
            id='chat-input'
            type='text'
            value={input}
            onChange={(e) => setInput(e.target.value)}
            maxLength={MAX_QUESTION}
            autoComplete='off'
            placeholder='Ask me anything…'
            className='min-w-0 flex-1 bg-transparent px-4 text-base outline-none placeholder:text-muted focus-visible:outline-none'
          />
          <button
            type='submit'
            disabled={busy || !input.trim()}
            aria-label='Send'
            className='inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-signal text-background transition-opacity disabled:opacity-40'
          >
            <svg width='18' height='18' viewBox='0 0 24 24' fill='none' aria-hidden='true'>
              <path
                d='M5 12h14M13 6l6 6-6 6'
                stroke='currentColor'
                strokeWidth={2}
                strokeLinecap='round'
                strokeLinejoin='round'
              />
            </svg>
          </button>
        </div>
      </form>

      <div className='mt-4 flex flex-wrap justify-center gap-2'>
        {QUICK_TOPICS.map(({ topic, label, question }) => (
          <button
            key={topic}
            type='button'
            onClick={() => askTopic(topic, question)}
            disabled={busy}
            className='rounded-full border border-line/15 px-4 py-1.5 text-sm transition-colors hover:border-signal hover:text-signal disabled:opacity-50'
          >
            {label}
          </button>
        ))}
      </div>

      <p className='mt-4 text-xs text-muted'>AI answers can be inaccurate.</p>
    </div>
  )
}
