import Link from 'next/link'

export function Wordmark({ onClick }: { onClick?: () => void }) {
  return (
    <Link
      href='/'
      onClick={onClick}
      aria-label='starg.shop, home'
      className='text-xl font-bold'
      style={{ fontVariationSettings: "'wdth' 85, 'opsz' 48" }}
    >
      starg<span className='text-signal'>.</span>shop
    </Link>
  )
}
