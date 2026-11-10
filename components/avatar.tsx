// The Starg initial in an accent ring until there is a photo.
// TODO(Taras): swap the initials for <Image src='/avatar.jpg' …> once a photo is in public/.
export function Avatar({ size = 'lg' }: { size?: 'sm' | 'lg' }) {
  const box = size === 'lg' ? 'size-24 text-3xl p-[3px]' : 'size-8 text-xs p-[1.5px]'
  return (
    <span
      aria-hidden='true'
      className={`inline-flex shrink-0 rounded-full bg-[conic-gradient(from_140deg,var(--signal),transparent_40%,var(--signal))] ${box}`}
    >
      <span className='flex size-full items-center justify-center rounded-full bg-surface font-bold'>
        S
      </span>
    </span>
  )
}
