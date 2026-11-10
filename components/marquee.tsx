'use client'

import { useEffect, useRef } from 'react'

type Props = {
  items: string[]
  direction?: 'left' | 'right'
  className?: string
  itemClassName?: string
}

const BASE_SPEED = 45 // px per second
const SCROLL_BOOST = 0.9 // extra px per second for each px/frame the page scrolls
const HOVER_FACTOR = 0.2 // slows down while hovered

// Endless strip of items. Drifts on its own and speeds up while the page scrolls. The
// track is anchored to the right edge and only ever moved right by 0…one-copy-width
// (wrapped with modulo), so no negative offsets are needed in either direction.
export function Marquee({ items, direction = 'left', className = '', itemClassName = '' }: Props) {
  const track = useRef<HTMLDivElement>(null)
  const hovered = useRef(false)

  useEffect(() => {
    const el = track.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let width = 0
    let x = 0
    let boost = 0
    let lastTime = performance.now()
    let lastScroll = window.scrollY
    let frame = 0
    let visible = false

    const measure = () => {
      width = (el.firstElementChild as HTMLElement | null)?.offsetWidth ?? 0
    }

    const tick = (now: number) => {
      const dt = Math.min(now - lastTime, 50) / 1000
      lastTime = now
      const scrolled = Math.abs(window.scrollY - lastScroll)
      lastScroll = window.scrollY
      boost += (scrolled - boost) * 0.12

      const speed = (BASE_SPEED + boost * SCROLL_BOOST * 60) * (hovered.current ? HOVER_FACTOR : 1)
      if (width > 0) {
        // Moving right = growing offset; moving left = shrinking it. Wrapped into [0, width).
        x = (((x + (direction === 'right' ? speed : -speed) * dt) % width) + width) % width
        el.style.transform = `translate3d(${x}px, 0, 0)`
      }
      frame = visible ? requestAnimationFrame(tick) : 0
    }

    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      if (visible && !frame) {
        lastTime = performance.now()
        lastScroll = window.scrollY
        frame = requestAnimationFrame(tick)
      }
    })
    const resizeObserver = new ResizeObserver(measure)

    measure()
    observer.observe(el)
    resizeObserver.observe(el)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      resizeObserver.disconnect()
    }
  }, [direction])

  // Three copies: the visible one plus spares on the left to slide in seamlessly.
  const copy = (key: number) => (
    <div key={key} aria-hidden={key > 0 || undefined} className='flex shrink-0 items-center'>
      {items.map((item) => (
        <span key={item} className='flex items-center'>
          <span className={`marquee-item ${itemClassName}`}>{item}</span>
          <span
            aria-hidden='true'
            className='mx-5 size-2 shrink-0 rounded-full bg-signal sm:mx-8'
          />
        </span>
      ))}
    </div>
  )

  return (
    <div
      className={`flex justify-end overflow-hidden ${className}`}
      onPointerEnter={() => (hovered.current = true)}
      onPointerLeave={() => (hovered.current = false)}
    >
      <div ref={track} className='flex shrink-0 will-change-transform'>
        {[2, 1, 0].map(copy)}
      </div>
    </div>
  )
}
