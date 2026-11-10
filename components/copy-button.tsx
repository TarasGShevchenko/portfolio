'use client'

import { useEffect, useState } from 'react'

// Copies a value to the clipboard and confirms for a moment.
export function CopyButton({ value, label = 'Copy' }: { value: string; label?: string }) {
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (!copied) return
    const id = setTimeout(() => setCopied(false), 1800)
    return () => clearTimeout(id)
  }, [copied])

  async function copy() {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
    } catch {
      // Clipboard can be blocked (permissions, insecure context); the address stays visible.
    }
  }

  return (
    <button
      type='button'
      onClick={copy}
      aria-label={copied ? 'Copied' : `${label} ${value}`}
      className='inline-flex h-11 items-center gap-2 rounded-full border border-line/15 px-5 text-sm font-medium transition-colors hover:border-signal hover:text-signal'
    >
      <span aria-live='polite'>{copied ? 'Copied ✓' : label}</span>
    </button>
  )
}
