import { CopyButton } from '@/components/copy-button'
import { SectionEyebrow } from '@/components/section-eyebrow'
import { SpotlightGrid } from '@/components/spotlight-grid'
import { contacts, socials } from '@/lib/site'

const inboxes = [
  {
    audience: 'For clients',
    title: 'Have a project?',
    text: 'Landing pages, web and mobile apps, AI features. Tell me what you’re building and what it should achieve.',
    email: contacts.clients,
    subject: 'Project inquiry',
    action: 'Start a project',
  },
  {
    audience: 'For recruiters',
    title: 'Hiring?',
    text: 'Full-stack and front-end roles. Send the role and the team, and I’ll get back to you.',
    email: contacts.recruiters,
    subject: 'Job opportunity',
    action: 'Write to me',
  },
]

// 05 Contact: one inbox for clients, one for recruiters, then the other channels.
export function ContactSection() {
  return (
    <section
      id='contact'
      aria-labelledby='contact-title'
      className='relative isolate scroll-mt-(--header-h-scrolled) overflow-hidden px-4 py-28 sm:px-8 md:py-40'
    >
      {/* Accent glow rising from the bottom edge. */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 bg-[radial-gradient(55%_60%_at_50%_100%,color-mix(in_oklab,var(--signal)_14%,transparent),transparent)]'
      />

      <div className='relative mx-auto flex max-w-6xl flex-col items-center text-center'>
        {/* Top-left like every other section; the rest of the block stays centered. */}
        <div className='self-stretch'>
          <SectionEyebrow number='05' label='Contact' />
        </div>
        <h2
          id='contact-title'
          className='mt-8 max-w-4xl text-[clamp(2.5rem,7vw,5.5rem)] leading-[1.02] font-bold text-balance'
        >
          Got a project or a role? <span className='text-signal'>Let’s talk.</span>
        </h2>
        <p className='mt-6 max-w-xl text-lg text-line/80'>
          Pick the inbox that fits and write a few lines about what you need.
        </p>

        <SpotlightGrid className='mt-14 grid w-full max-w-4xl gap-4 text-left md:grid-cols-2'>
          {inboxes.map((inbox) => (
            <article key={inbox.email} className='spotlight-card flex flex-col gap-4 p-7 sm:p-8'>
              <span className='font-mono text-xs tracking-[0.14em] text-signal uppercase'>
                {inbox.audience}
              </span>
              <h3 className='text-2xl font-semibold sm:text-3xl'>{inbox.title}</h3>
              <p className='text-line/80'>{inbox.text}</p>
              <a
                href={`mailto:${inbox.email}`}
                className='mt-2 self-start text-lg break-all underline-offset-4 hover:text-signal hover:underline sm:text-xl'
              >
                {inbox.email}
              </a>
              <div className='mt-auto flex flex-wrap gap-3 pt-2'>
                <a
                  href={`mailto:${inbox.email}?subject=${encodeURIComponent(inbox.subject)}`}
                  className='inline-flex h-11 items-center rounded-full bg-signal px-5 text-sm font-semibold text-background transition-opacity hover:opacity-90'
                >
                  {inbox.action}
                </a>
                <CopyButton value={inbox.email} label='Copy email' />
              </div>
            </article>
          ))}
        </SpotlightGrid>

        <div className='mt-12 flex flex-wrap items-center justify-center gap-3'>
          <span className='text-sm text-muted'>Or find me on</span>
          {socials.map((s) => (
            <a
              key={s.href}
              href={s.href}
              target='_blank'
              rel='noreferrer'
              className='inline-flex h-10 items-center gap-1.5 rounded-full border border-line/15 px-4 text-sm transition-colors hover:border-signal hover:text-signal'
            >
              {s.label} <span aria-hidden='true'>↗</span>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
