'use client'

import { useRef } from 'react'
import { NavLinks } from '@/components/nav-links'
import { Wordmark } from '@/components/wordmark'
import type { NavItem } from '@/lib/site'

const MENU_ID = 'mobile-menu'

// Built on the Popover API: the browser handles Esc, light dismiss and the top layer.
// Page scroll is locked by CSS while it is open (see .mobile-menu in globals.css).
export function MobileMenu({ items, contactEmail }: { items: NavItem[]; contactEmail?: string }) {
  const menu = useRef<HTMLDivElement>(null)
  const close = () => menu.current?.hidePopover()
  const linkClass = 'text-5xl font-extrabold leading-none'

  return (
    <>
      <button
        type='button'
        popoverTarget={MENU_ID}
        aria-label='Open menu'
        className='inline-flex size-9 items-center justify-center rounded-full border border-line/40 transition-colors hover:border-signal hover:text-signal md:hidden'
      >
        <svg width='18' height='18' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
          <path d='M4 8h16M4 16h16' strokeWidth={1.75} strokeLinecap='round' />
        </svg>
      </button>

      <div
        id={MENU_ID}
        ref={menu}
        popover='auto'
        aria-label='Menu'
        className='mobile-menu fixed inset-0 m-0 h-dvh max-h-none w-full max-w-none flex-col border-0 bg-background p-0 text-foreground open:flex md:hidden'
      >
        <div className='flex h-(--header-h) items-center justify-between px-4 sm:px-8'>
          <Wordmark onClick={close} />
          <button
            type='button'
            popoverTarget={MENU_ID}
            popoverTargetAction='hide'
            aria-label='Close menu'
            className='inline-flex size-9 items-center justify-center rounded-full border border-line/40 transition-colors hover:border-signal hover:text-signal'
          >
            <svg
              width='18'
              height='18'
              viewBox='0 0 24 24'
              stroke='currentColor'
              aria-hidden='true'
            >
              <path d='M6 6l12 12M18 6L6 18' strokeWidth={1.75} strokeLinecap='round' />
            </svg>
          </button>
        </div>

        <nav
          aria-label='Main'
          className='flex flex-1 flex-col justify-center px-4 sm:px-8'
          style={{ fontVariationSettings: "'wdth' 75, 'opsz' 96" }}
        >
          <NavLinks
            items={items}
            onNavigate={close}
            className='flex flex-col gap-6'
            itemClassName={linkClass}
          />
        </nav>

        {contactEmail && (
          <div className='border-t border-line/20 px-4 py-6 sm:px-8'>
            <p className='text-sm text-muted'>Start a project</p>
            <a
              href={`mailto:${contactEmail}`}
              className='text-lg underline decoration-signal decoration-2 underline-offset-4'
            >
              {contactEmail}
            </a>
          </div>
        )}
      </div>
    </>
  )
}
