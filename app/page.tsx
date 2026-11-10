import { ContactSection } from '@/components/sections/contact-section'
import { ExperienceSection } from '@/components/sections/experience/experience-section'
import { FocusSection } from '@/components/sections/focus-section'
import { HeroSection } from '@/components/sections/hero/hero-section'
import { TechMarquee } from '@/components/sections/tech-marquee'
import { WhoIAmSection } from '@/components/sections/who-i-am-section'

export default function Home() {
  return (
    <>
      <HeroSection />
      <TechMarquee />
      <WhoIAmSection />
      <ExperienceSection />
      <FocusSection />
      <ContactSection />
    </>
  )
}
