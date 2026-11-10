'use client'

import { useSyncExternalStore } from 'react'

const format = (timeZone: string) =>
  new Intl.DateTimeFormat('en-GB', { timeZone, hour: '2-digit', minute: '2-digit' }).format(
    new Date(),
  )

// Live clock for a time zone, ticking every 15 s. The server renders "--:--" (it can't know
// the visitor's moment), the browser fills in the real time after hydration.
export function LocalTime({ timeZone }: { timeZone: string }) {
  const time = useSyncExternalStore(
    (onChange) => {
      const id = setInterval(onChange, 15_000)
      return () => clearInterval(id)
    },
    () => format(timeZone),
    () => '--:--',
  )
  return <time className='font-mono tabular-nums'>{time}</time>
}
