import { cacheLife } from 'next/cache'
import { ScrollRevealText } from '@/components/scroll-reveal-text'
import { SectionEyebrow } from '@/components/section-eyebrow'
import { experience } from '@/lib/experience'
import { allTech } from '@/lib/tech'

const ABOUT =
  'I’m Starg, or Taras Shevchenko: a full-stack developer from Kyiv. Since 2021 I’ve been building **financial platforms,** **trading systems** and **mobile apps,** from high-load backends and integrations with external services to user-friendly interfaces. Today I build with **AI** and craft landing pages that help companies sell.'

// Full years since the first role; cached daily like the footer year, so the page stays
// prerendered and the number updates on its own.
async function yearsOfExperience() {
  'use cache'
  cacheLife('days')
  const first = experience.at(-1)?.start ?? '2021-05'
  const [year, month] = first.split('-').map(Number)
  const now = new Date()
  return Math.floor(now.getFullYear() - year + (now.getMonth() + 1 - month) / 12)
}

export async function WhoIAmSection() {
  const years = await yearsOfExperience()
  const stats = [
    { value: `${years}+`, label: 'Years in development' },
    {
      value: String(experience.filter((r) => r.project !== 'Internship').length),
      label: 'Products at Right and Above',
    },
    { value: `${allTech.length}`, label: 'Technologies and tools' },
  ]

  return (
    <section
      id='who'
      aria-labelledby='who-title'
      className='mx-auto w-full max-w-6xl px-4 py-28 sm:px-8 md:py-40'
    >
      <h2 id='who-title' className='sr-only'>
        Who I am
      </h2>
      <SectionEyebrow number='02' label='Who I am' />

      <ScrollRevealText
        text={ABOUT}
        className='mt-8 max-w-5xl text-[clamp(1.75rem,4.2vw,3.5rem)] leading-[1.2] font-medium'
      />

      <dl className='mt-16 grid gap-8 border-t border-line/10 pt-10 sm:grid-cols-3 md:mt-24'>
        {stats.map((s) => (
          <div key={s.label} className='flex flex-col gap-2'>
            <dt className='order-2 text-sm text-muted'>{s.label}</dt>
            <dd className='order-1 text-5xl font-bold text-foreground sm:text-6xl'>{s.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
