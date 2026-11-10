import { LocalTime } from '@/components/local-time'
import { SectionEyebrow } from '@/components/section-eyebrow'
import { SpotlightGrid } from '@/components/spotlight-grid'
import { experience, formatMonth } from '@/lib/experience'
import { focus } from '@/lib/focus'
import { profile } from '@/lib/profile'

// 04 Current focus: what Taras works on now, mostly AI. Facts on the left, the focus areas
// on the right as cards with a cursor-following spotlight.
export function FocusSection() {
  const current = experience.find((r) => r.end === null)
  const facts = [
    current && { label: 'Role', value: `${current.title} at ${current.company}` },
    current && { label: 'Since', value: formatMonth(current.start) },
    { label: 'Based in', value: profile.location },
  ].filter(Boolean) as { label: string; value: string }[]

  return (
    <section
      id='focus'
      aria-labelledby='focus-title'
      className='mx-auto grid w-full max-w-6xl gap-12 px-4 py-28 sm:px-8 md:py-40 lg:grid-cols-12 lg:gap-14'
    >
      <div className='flex flex-col gap-10 lg:col-span-4'>
        <SectionEyebrow number='04' label='Current focus' />

        <dl className='flex flex-col gap-5 border-t border-line/10 pt-6 text-sm'>
          {facts.map((f) => (
            <div key={f.label} className='flex flex-col gap-1'>
              <dt className='text-muted'>{f.label}</dt>
              <dd>{f.value}</dd>
            </div>
          ))}
          <div className='flex flex-col gap-1'>
            <dt className='text-muted'>Local time</dt>
            <dd className='flex items-center gap-2'>
              <span aria-hidden='true' className='size-1.5 animate-pulse rounded-full bg-signal' />
              <LocalTime timeZone='Europe/Kyiv' /> in Kyiv
            </dd>
          </div>
        </dl>
      </div>

      <div className='lg:col-span-8'>
        <h2
          id='focus-title'
          className='text-[clamp(2rem,4.6vw,3.75rem)] leading-[1.08] font-bold text-balance'
        >
          {focus.headline[0]}
          <span className='text-signal'>{focus.headline[1]}</span>
          {focus.headline[2]}
        </h2>
        <p className='mt-6 max-w-2xl text-lg leading-relaxed text-line/80'>{focus.intro}</p>

        <SpotlightGrid className='mt-12 grid gap-4 sm:grid-cols-2'>
          {focus.areas.map((area, i) => (
            <article key={area.title} className='spotlight-card flex flex-col gap-3 p-6'>
              <span className='font-mono text-xs text-signal'>
                {String(i + 1).padStart(2, '0')}
              </span>
              <h3 className='text-xl font-semibold'>{area.title}</h3>
              <p className='text-line/80'>{area.text}</p>
              <p className='mt-auto border-t border-line/10 pt-3 text-sm text-muted'>
                <span className='text-foreground'>Proof: </span>
                {area.proof}
              </p>
            </article>
          ))}
        </SpotlightGrid>

        <p className='mt-8 flex items-center gap-3 text-muted'>
          <span aria-hidden='true' className='h-px w-6 bg-signal' />
          {focus.next}
        </p>
      </div>
    </section>
  )
}
