'use client'

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react'
import type { Role } from '@/lib/experience'

export type ExperienceItem = Role & { number: string; period: string; current: boolean }

// Scroll distance (in viewport heights) spent on each role while the section is pinned.
const STEP_SVH = 70

// The section is tall; inside it a full-screen panel sticks to the top. Scroll progress
// through the section picks the active role, so the page "stands still" while 01, 02, …
// swap in place, and moves on after the last one.
export function ExperienceScroller({
  items,
  heading,
}: {
  items: ExperienceItem[]
  heading: ReactNode
}) {
  const track = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const count = items.length

  useEffect(() => {
    const el = track.current
    if (!el) return
    let frame = 0
    const update = () => {
      frame = 0
      const rect = el.getBoundingClientRect()
      const scrollable = rect.height - window.innerHeight
      const progress = scrollable > 0 ? Math.min(1, Math.max(0, -rect.top / scrollable)) : 0
      el.style.setProperty('--exp-progress', progress.toFixed(4))
      setActive(Math.min(count - 1, Math.floor(progress * count)))
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
  }, [count])

  // Jump to the middle of a role's slice of the scroll.
  function goTo(index: number) {
    const el = track.current
    if (!el) return
    const top = el.getBoundingClientRect().top + window.scrollY
    const scrollable = el.offsetHeight - window.innerHeight
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    window.scrollTo({
      top: top + (scrollable * (index + 0.5)) / count,
      behavior: reduce ? 'auto' : 'smooth',
    })
  }

  return (
    <div
      ref={track}
      className='exp-track'
      style={{ height: `calc(${count * STEP_SVH}svh + 100svh)` } as CSSProperties}
    >
      <div className='exp-panel sticky top-0 mx-auto flex h-svh max-w-6xl flex-col px-4 pt-[calc(var(--header-h-scrolled)+1.5rem)] pb-6 sm:px-8 md:pb-10'>
        <div>{heading}</div>

        <div aria-hidden='true' className='exp-stage mt-6 flex-1 md:mt-8'>
          {/* Odometer: every number stacked in a column, slid so the active one shows. */}
          <div className='exp-counter'>
            <div className='exp-digits' style={{ '--active': active } as CSSProperties}>
              {items.map((item, i) => (
                <span key={item.number} data-on={i === active || undefined}>
                  {item.number}
                </span>
              ))}
            </div>
            <span className='exp-total'>/ {String(count).padStart(2, '0')}</span>
          </div>

          <div className='exp-cards'>
            {items.map((item, i) => (
              <article
                key={item.number}
                className='exp-card'
                data-state={i === active ? 'on' : i < active ? 'past' : 'next'}
                inert={i !== active}
              >
                <p className='flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-muted'>
                  {item.period && <span className='font-mono'>{item.period}</span>}
                  {item.current && (
                    <span className='inline-flex items-center gap-1.5 text-signal'>
                      <span className='size-1.5 animate-pulse rounded-full bg-signal' />
                      Now
                    </span>
                  )}
                </p>

                <h3 className='mt-3 text-[clamp(1.75rem,3.6vw,3rem)] leading-[1.05] font-bold'>
                  {item.project}
                </h3>
                <p className='mt-2 text-line/75'>
                  {item.title} · {item.company}
                </p>

                <ul className='mt-5 flex max-w-xl flex-col gap-2.5 text-line/85 md:text-lg'>
                  {item.points.map((point) => (
                    <li key={point} className='flex gap-3'>
                      <span className='mt-[0.7em] h-px w-3 shrink-0 bg-signal' />
                      {point}
                    </li>
                  ))}
                </ul>

                <div className='mt-6 flex flex-wrap items-center gap-2'>
                  {item.stack.map((tech) => (
                    <span
                      key={tech}
                      className='rounded-full border border-line/15 px-3 py-1 text-xs text-line/80'
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Progress rail: one tick per role; click to jump. */}
        <div aria-hidden='true' className='exp-rail'>
          {items.map((item, i) => (
            <button
              key={item.number}
              type='button'
              tabIndex={-1}
              onClick={() => goTo(i)}
              data-on={i === active || undefined}
              data-done={i < active || undefined}
              title={item.project}
              className='exp-tick'
            />
          ))}
        </div>
      </div>
    </div>
  )
}
