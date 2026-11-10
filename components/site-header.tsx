import Link from 'next/link'
import { HeaderShell } from '@/components/header-shell'
import { MobileMenu } from '@/components/mobile-menu'
import { NavLinks } from '@/components/nav-links'
import { ThemeToggle } from '@/components/theme-toggle'
import { Wordmark } from '@/components/wordmark'
import { env, isProduction } from '@/lib/env'
import { contacts, navigation } from '@/lib/site'

// Fixed and transparent over the top of the page (the future hero), with a background once
// the page scrolls (HeaderShell). Pages start their content below it with pt-(--header-h).
export function SiteHeader() {
  return (
    <HeaderShell>
      <a
        href='#content'
        className='sr-only rounded-full bg-signal px-4 py-2 text-background focus:not-sr-only focus:absolute focus:top-3 focus:left-4'
      >
        Skip to content
      </a>

      <div className='mx-auto flex h-(--header-h) max-w-6xl items-center justify-between gap-6 px-4 transition-[height] duration-300 group-data-scrolled/header:h-(--header-h-scrolled) sm:px-8'>
        <Wordmark />

        <nav aria-label='Main' className='hidden md:block'>
          <NavLinks items={navigation} className='flex items-center gap-8 text-[0.95rem]' />
        </nav>

        <div className='flex items-center gap-2.5'>
          {!isProduction && (
            <span
              className='hidden h-9 items-center rounded-full border border-dashed border-signal px-3 text-xs tracking-[0.12em] text-signal uppercase sm:inline-flex'
              title='Deployment environment'
            >
              {env.appEnv}
            </span>
          )}
          <ThemeToggle />
          <Link
            href='/#contact'
            className='hidden h-9 items-center rounded-full border-2 border-signal px-4 text-sm font-semibold text-signal transition-colors hover:bg-signal hover:text-background sm:inline-flex'
          >
            Start a project
          </Link>
          <MobileMenu items={navigation} contactEmail={contacts.clients} />
        </div>
      </div>

      {/* Reading progress along the bottom edge; CSS-only where scroll timelines exist. */}
      <span aria-hidden='true' className='scroll-progress' />
    </HeaderShell>
  )
}
