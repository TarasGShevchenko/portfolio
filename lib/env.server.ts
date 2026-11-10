import 'server-only'

// Secrets, readable only on the server. Public values live in lib/env.ts.
export const serverEnv = {
  // Free key from console.groq.com; without it the chat answers from prepared replies.
  groqApiKey: process.env.GROQ_API_KEY || undefined,
} as const
