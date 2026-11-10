'use client'

import type { PointerEvent, ReactNode } from 'react'

// Cards with a soft accent spotlight that follows the cursor. One listener on the grid
// writes the pointer position into each card's --x/--y (always positive, relative to the
// card); the glow itself is CSS (.spotlight-card in globals.css).
export function SpotlightGrid({
  children,
  className = '',
}: {
  children: ReactNode
  className?: string
}) {
  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== 'mouse') return
    for (const card of event.currentTarget.querySelectorAll<HTMLElement>('.spotlight-card')) {
      const rect = card.getBoundingClientRect()
      const rawX = event.clientX - rect.left
      const rawY = event.clientY - rect.top
      const x = Math.max(0, Math.min(rect.width, rawX))
      const y = Math.max(0, Math.min(rect.height, rawY))
      // Fades with distance from the card, so only the cards near the cursor light up.
      const distance = Math.hypot(rawX - x, rawY - y)
      card.style.setProperty('--x', `${x}px`)
      card.style.setProperty('--y', `${y}px`)
      card.style.setProperty('--glow', Math.max(0, 1 - distance / 220).toFixed(3))
    }
  }

  return (
    <div onPointerMove={onPointerMove} className={className}>
      {children}
    </div>
  )
}
