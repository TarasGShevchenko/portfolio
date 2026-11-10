import { experience, formatPeriod } from '@/lib/experience'
import { ExperienceScroller, type ExperienceItem } from './experience-scroller'
import './experience.css'

// Pinned experience: the section holds the screen while scrolling steps through the roles,
// 01 to the last one; only then does the page move on.
export function ExperienceSection() {
  const items: ExperienceItem[] = experience.map((role, i) => ({
    number: String(i + 1).padStart(2, '0'),
    period: formatPeriod(role),
    current: role.end === null,
    ...role,
  }))

  return (
    <section id='experience' aria-labelledby='experience-title' className='relative'>
      <ExperienceScroller
        items={items}
        heading={
          <>
            <p className='flex items-center gap-3 text-xs font-medium tracking-[0.12em] text-muted uppercase sm:text-sm'>
              <span aria-hidden='true' className='h-px w-8 bg-signal' />
              Experience
            </p>
            <h2
              id='experience-title'
              className='mt-3 max-w-3xl text-[clamp(1.5rem,3.2vw,2.5rem)] leading-tight font-bold text-balance'
            >
              Since 2021 at Right and Above: fintech, trading and mobile apps.
            </h2>
          </>
        }
      />

      {/* The animated panel is visual; this list carries the same content for screen readers. */}
      <ol className='sr-only'>
        {items.map((item) => (
          <li key={item.number}>
            {item.project}. {item.title}, {item.company}. {item.period}. {item.points.join(' ')}{' '}
            {item.stack.length > 0 && `Stack: ${item.stack.join(', ')}.`}
          </li>
        ))}
      </ol>
    </section>
  )
}
