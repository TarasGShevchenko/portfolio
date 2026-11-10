'use client'

import { useEffect, useRef, type CSSProperties } from 'react'

// A paragraph whose words light up one after another as it scrolls through the viewport.
// Only one CSS variable (--p, 0..1) is updated per frame; each word works out its own
// opacity from it (see .reveal-word in globals.css). Wrap a word in **…** to accent it.
export function ScrollRevealText({ text, className = '' }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null)
  const words = text.split(/\s+/)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--p', '1')
      return
    }
    let frame = 0
    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const vh = window.innerHeight
      // Starts when the top passes 85% of the screen, done when the bottom reaches 55%.
      const progress = (vh * 0.85 - rect.top) / (rect.height + vh * 0.3)
      el.style.setProperty('--p', Math.min(1, Math.max(0, progress)).toFixed(4))
    }
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [])

  return (
    <p ref={ref} className={className} style={{ '--n': words.length } as CSSProperties}>
      {words.map((raw, i) => {
        const accent = raw.startsWith('**')
        const word = raw.replaceAll('**', '')
        return (
          <span
            key={i}
            className={`reveal-word ${accent ? 'text-signal' : ''}`}
            style={{ '--i': i } as CSSProperties}
          >
            {word}{' '}
          </span>
        )
      })}
    </p>
  )
}
