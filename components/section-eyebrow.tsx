// Small label in the top-left of a section: "02 —— Who I am".
export function SectionEyebrow({ number, label }: { number: string; label: string }) {
  return (
    <p className='flex items-center gap-3 font-mono text-xs tracking-[0.14em] text-muted uppercase sm:text-sm'>
      <span className='text-signal'>{number}</span>
      <span aria-hidden='true' className='h-px w-8 bg-line/25' />
      {label}
    </p>
  )
}
