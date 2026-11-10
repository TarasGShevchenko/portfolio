import { cacheLife } from 'next/cache'
import { NavLinks } from '@/components/nav-links'
import { env } from '@/lib/env'
import { author, navigation, socials } from '@/lib/site'

// Cached so pages stay prerendered; refreshes daily, so the year rolls over on its own.
async function currentYear() {
  'use cache'
  cacheLife('days')
  return new Date().getFullYear()
}

const label = 'text-xs font-medium tracking-[0.12em] text-muted uppercase'

export async function SiteFooter() {
  const year = await currentYear()

  return (
    <footer className='border-t border-line/10 px-4 pt-14 pb-8 sm:px-8'>
      <div className='mx-auto grid max-w-6xl gap-10 sm:grid-cols-2 lg:grid-cols-[2fr_1fr_1fr]'>
        <div className='flex flex-col gap-4'>
          <p className='max-w-[18ch] text-3xl leading-tight font-bold sm:text-4xl'>
            Have a product that needs a page?
          </p>
          {env.contactEmail && (
            <a
              href={`mailto:${env.contactEmail}`}
              className='self-start text-lg text-signal underline-offset-4 hover:underline'
            >
              {env.contactEmail}
            </a>
          )}
        </div>

        <nav aria-label='Footer' className='flex flex-col gap-4'>
          <span className={label}>Sections</span>
          <NavLinks items={navigation} className='flex flex-col gap-2' />
        </nav>

        <div className='flex flex-col gap-4'>
          <span className={label}>Elsewhere</span>
          <ul className='flex flex-col gap-2'>
            {socials.map((s) => (
              <li key={s.href}>
                <a href={s.href} target='_blank' rel='noreferrer' className='nav-link'>
                  {s.label} <span aria-hidden='true'>↗</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className='mx-auto mt-14 flex max-w-6xl flex-wrap items-center justify-between gap-4 border-t border-line/10 pt-6 text-sm text-muted'>
        <span>
          © {year} {author}
        </span>
        <a href='#' className='nav-link'>
          Back to top <span aria-hidden='true'>↑</span>
        </a>
      </div>
    </footer>
  )
}
