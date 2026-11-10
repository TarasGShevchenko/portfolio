import { Avatar } from '@/components/avatar'
import { DotGrid } from '@/components/dot-grid'
import { HeroChat } from './hero-chat'

// Centered first screen: who Starg is, then a chat to ask the rest. The header floats
// transparently over it.
export function HeroSection() {
  return (
    <section
      aria-labelledby='hero-title'
      className='relative isolate flex min-h-svh flex-col items-center justify-center px-4 pt-[calc(var(--header-h)+1.5rem)] pb-16 sm:px-8'
    >
      {/* Interactive dot grid, fading out towards the edges so the hero blends into the page. */}
      <DotGrid className='pointer-events-none absolute inset-0 size-full [mask-image:radial-gradient(80%_75%_at_50%_45%,#000_45%,transparent)]' />

      {/* Soft accent glow behind the greeting. */}
      <div
        aria-hidden='true'
        className='pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_50%_35%,color-mix(in_oklab,var(--signal)_16%,transparent),transparent)]'
      />

      <HeroChat
        greeting={
          <>
            <Avatar />
            <h1
              id='hero-title'
              className='mt-6 text-[clamp(2.5rem,7vw,4.75rem)] leading-[1.02] font-bold'
            >
              Hey, I’m Starg <span className='inline-block origin-[70%_70%] animate-wave'>👋</span>
            </h1>
            <p className='mt-3 text-lg text-muted sm:text-xl'>
              Full-stack developer. Fintech, trading and mobile apps, and landing pages for
              companies.
            </p>
          </>
        }
      />
    </section>
  )
}
