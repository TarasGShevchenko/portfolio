import { Marquee } from '@/components/marquee'
import { tech } from '@/lib/tech'

// Two endless strips of technologies right after the hero, drifting in opposite directions
// and speeding up while the page scrolls.
export function TechMarquee() {
  const first = [...tech.frontend, ...tech.backend]
  const second = [...tech.databases, ...tech.devops, ...tech.testing, ...tech.tools]

  return (
    <section
      aria-label='Technologies I work with'
      className='flex flex-col gap-4 border-y border-line/10 [mask-image:linear-gradient(90deg,transparent,#000_8%,#000_92%,transparent)] py-10 sm:gap-6 sm:py-14'
    >
      <Marquee
        items={first}
        direction='left'
        itemClassName='text-[clamp(1.75rem,4.5vw,3.75rem)] font-semibold whitespace-nowrap'
      />
      <Marquee
        items={second}
        direction='right'
        itemClassName='marquee-outline text-[clamp(1.75rem,4.5vw,3.75rem)] font-semibold whitespace-nowrap'
      />
    </section>
  )
}
