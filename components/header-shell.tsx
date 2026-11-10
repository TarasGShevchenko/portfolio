'use client'

import { useSyncExternalStore, type ReactNode } from 'react'

// Distance (px) the page must scroll before the header gets its background.
const SCROLL_THRESHOLD = 12

function subscribe(onChange: () => void) {
  window.addEventListener('scroll', onChange, { passive: true })
  return () => window.removeEventListener('scroll', onChange)
}

// A boolean snapshot, so React re-renders only when the threshold is crossed, not on every
// scroll event. The server snapshot is "not scrolled": the header starts transparent.
const isScrolled = () => window.scrollY > SCROLL_THRESHOLD
const isScrolledOnServer = () => false

export function HeaderShell({ children }: { children: ReactNode }) {
  const scrolled = useSyncExternalStore(subscribe, isScrolled, isScrolledOnServer)

  return (
    <header
      data-scrolled={scrolled || undefined}
      className='group/header fixed inset-x-0 top-0 z-50 border-b border-transparent transition-[background-color,border-color,backdrop-filter] duration-300 data-scrolled:border-line/15 data-scrolled:bg-background/80 data-scrolled:backdrop-blur-md'
    >
      {children}
    </header>
  )
}
