import type { Metadata, Viewport } from 'next'
import { Bricolage_Grotesque } from 'next/font/google'
import { env, isProduction } from '@/lib/env'
import './globals.css'

const bricolage = Bricolage_Grotesque({
  variable: '--font-bricolage',
  subsets: ['latin', 'latin-ext'],
  axes: ['opsz', 'wdth'],
})

export const metadata: Metadata = {
  metadataBase: new URL(env.siteUrl),
  title: 'starg.shop — coming soon',
  description: 'Landing pages built for companies, and the portfolio behind them.',
  // Only production may be indexed; local and staging stay out of search results.
  robots: isProduction ? { index: true, follow: true } : { index: false, follow: false },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#1c2c8f' },
    { media: '(prefers-color-scheme: light)', color: '#f4f6fc' },
  ],
}

// Runs before first paint: applies a saved theme choice so the page never flashes the
// OS theme first. Without a saved choice, CSS follows prefers-color-scheme.
// The 'theme' key must match THEME_STORAGE_KEY in components/theme-toggle.tsx.
const themeScript = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    // suppressHydrationWarning: the inline script may set data-theme before React hydrates.
    <html lang='en' className={`${bricolage.variable} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className='flex min-h-full flex-col'>{children}</body>
    </html>
  )
}
