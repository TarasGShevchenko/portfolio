'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { NavItem } from '@/lib/site'

type Props = {
  items: NavItem[]
  className?: string
  itemClassName?: string
  onNavigate?: () => void
}

function isActive(pathname: string | null, href: string) {
  return pathname === href || (pathname?.startsWith(`${href}/`) ?? false)
}

function NavList({
  items,
  className,
  itemClassName = '',
  onNavigate,
  pathname,
}: Props & { pathname: string | null }) {
  return (
    <ul className={className}>
      {items.map((item) => (
        <li key={item.href}>
          {item.ready ? (
            <Link
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive(pathname, item.href) ? 'page' : undefined}
              className={`nav-link ${itemClassName}`}
            >
              {item.label}
            </Link>
          ) : (
            // Page not built yet: a label, not a link.
            <span aria-disabled='true' className={`nav-link nav-link-draft ${itemClassName}`}>
              {item.label}
              <sup className='ml-1 text-[0.6em] tracking-[0.12em] text-signal uppercase'>soon</sup>
            </span>
          )}
        </li>
      ))}
    </ul>
  )
}

function ActiveNavList(props: Props) {
  return <NavList {...props} pathname={usePathname()} />
}

// With cacheComponents, usePathname suspends on routes whose params are only known at
// request time. The Suspense fallback is the same list without the active state, so the
// layout stays prerendered.
export function NavLinks(props: Props) {
  return (
    <Suspense fallback={<NavList {...props} pathname={null} />}>
      <ActiveNavList {...props} />
    </Suspense>
  )
}
