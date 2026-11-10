import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque } from 'next/font/google'
import { SiteFooter } from '@/components/site-footer'
import { SiteHeader } from '@/components/site-header'
import { env, isProduction } from '@/lib/env'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin', 'latin-ext'],
  axes: ['opsz', 'wdth'],
})

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: 'starg.shop — landing pages by Taras Shevchenko',
  description: 'Landing pages built for companies, and the portfolio behind them.',
  // Only production may be indexed; local and staging stay out of search results.
  robots: isProduction ? { index: true, follow: true } : { index: false, follow: false },
}

export const viewport: Viewport = {
  // Matches the default (dark) --background in globals.css.
  themeColor: '#0a0a0b',
}

// Runs before first paint: applies a saved theme choice so the page never flashes the
// default dark theme first. Without a saved choice the site stays dark.
// The 'theme' key must match THEME_STORAGE_KEY in components/theme-toggle.tsx.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // suppressHydrationWarning: the inline script may set data-theme before React hydrates.
    <html lang='en' className={`${bricolage.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className='flex min-h-full flex-col'>
        <SiteHeader />
        <main id='content' className='flex flex-1 flex-col'>
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
