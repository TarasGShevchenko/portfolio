'use client'

export const THEME_STORAGE_KEY = 'theme'

type Theme = 'light' | 'dark'

function currentTheme(): Theme {
  const attr = document.documentElement.getAttribute('data-theme')
  if (attr === 'light' || attr === 'dark') return attr
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function ThemeToggle() {
  function toggle() {
    const next: Theme = currentTheme() === 'dark' ? 'light' : 'dark'
    document.documentElement.setAttribute('data-theme', next)
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next)
    } catch {
      // Storage can be unavailable (private mode); the theme still switches for this visit.
    }
  }

  return (
    <button
      type='button'
      onClick={toggle}
      aria-label='Switch between light and dark theme'
      title='Switch theme'
      className='inline-flex size-9 items-center justify-center rounded-full border border-line/40 text-foreground transition-colors hover:border-signal hover:text-signal'
    >
      {/* Icons are swapped by CSS (see .theme-icon-* in globals.css), not by React state. */}
      <svg
        className='theme-icon-moon'
        width='18'
        height='18'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.75}
        strokeLinecap='round'
        strokeLinejoin='round'
        aria-hidden='true'
      >
        <path d='M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z' />
      </svg>
      <svg
        className='theme-icon-sun'
        width='18'
        height='18'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth={1.75}
        strokeLinecap='round'
        aria-hidden='true'
      >
        <circle cx='12' cy='12' r='4' />
        <path d='M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4' />
      </svg>
    </button>
  )
}
