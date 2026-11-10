// Site-wide navigation and links, shared by the header, the mobile menu and the footer.

export type NavItem = {
  label: string
  href: `/${string}`
  // false until the page exists: the item renders as a "soon" label instead of a link,
  // so neither visitors nor <Link> prefetching ever hit a 404.
  ready: boolean
}

export const navigation: NavItem[] = [
  { label: 'Work', href: '/work', ready: false },
  { label: 'Landing pages', href: '/landing-pages', ready: false },
  { label: 'About', href: '/about', ready: false },
]

export const socials = [
  { label: 'GitHub', href: 'https://github.com/TarasGShevchenko' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/tarasgsheva' },
  { label: 'Telegram', href: 'https://t.me/stargcorp' },
] as const

export const author = 'Taras Shevchenko'
