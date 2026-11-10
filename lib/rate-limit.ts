import 'server-only'

// Sliding-window limiter kept in memory. On Vercel every function instance has its own
// memory, so this is a speed bump against casual abuse, not a hard guarantee; swap in a
// shared store (e.g. Upstash Redis) if the endpoint ever gets hammered.
const hits = new Map<string, number[]>()

export function allow(key: string, limit: number, windowMs: number) {
  const now = Date.now()
  const recent = (hits.get(key) ?? []).filter((t) => now - t < windowMs)
  const ok = recent.length < limit
  if (ok) recent.push(now)
  if (hits.size > 10_000) hits.clear()
  hits.set(key, recent)
  return ok
}
