'use client'

import { useEffect, useRef } from 'react'

// Dot grid behind the hero. Near the cursor the dots swell, drift outward and take the
// accent colour, as if the grid bulged under a lens. Drawn on a canvas; the animation loop
// runs only while something is moving, and stays static on touch screens and for
// visitors who prefer reduced motion.

const GAP = 26 // px between dots
const BASE_RADIUS = 1.1
const LENS_RADIUS = 170 // px reach of the bulge
const LENS_GROW = 3.4 // extra radius at the centre of the bulge
const LENS_PUSH = 14 // px a dot is pushed outward at the centre
const FOLLOW = 0.16 // how quickly the lens catches up with the pointer (0..1 per frame)

const smoothstep = (t: number) => t * t * (3 - 2 * t)

export function DotGrid({ className = '' }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!canvas || !ctx) return

    const interactive =
      window.matchMedia('(hover: hover) and (pointer: fine)').matches &&
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches

    let width = 0
    let height = 0
    let colors = { dot: '#888', accent: '#a78bfa' }
    // Lens state: where it is, where the pointer is, and how strong it is (0..1).
    const lens = { x: 0, y: 0, tx: 0, ty: 0, strength: 0, target: 0 }
    let frame = 0

    const readColors = () => {
      const style = getComputedStyle(document.documentElement)
      colors = {
        dot: style.getPropertyValue('--muted').trim() || colors.dot,
        accent: style.getPropertyValue('--signal').trim() || colors.accent,
      }
    }

    const draw = () => {
      ctx.clearRect(0, 0, width, height)
      const offsetX = (width % GAP) / 2
      const offsetY = (height % GAP) / 2
      const active = lens.strength > 0.001

      for (let y = offsetY; y < height; y += GAP) {
        for (let x = offsetX; x < width; x += GAP) {
          let px = x
          let py = y
          let r = BASE_RADIUS
          let glow = 0

          if (active) {
            const dx = x - lens.x
            const dy = y - lens.y
            const dist = Math.hypot(dx, dy)
            if (dist < LENS_RADIUS) {
              const e = smoothstep(1 - dist / LENS_RADIUS) * lens.strength
              r += e * LENS_GROW
              glow = e
              if (dist > 0.01) {
                px += (dx / dist) * e * LENS_PUSH
                py += (dy / dist) * e * LENS_PUSH
              }
            }
          }

          ctx.beginPath()
          ctx.arc(px, py, r, 0, Math.PI * 2)
          if (glow > 0.05) {
            ctx.globalAlpha = 0.35 + glow * 0.65
            ctx.fillStyle = colors.accent
          } else {
            ctx.globalAlpha = 0.38
            ctx.fillStyle = colors.dot
          }
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    const tick = () => {
      lens.x += (lens.tx - lens.x) * FOLLOW
      lens.y += (lens.ty - lens.y) * FOLLOW
      lens.strength += (lens.target - lens.strength) * FOLLOW
      draw()
      const settled =
        Math.abs(lens.tx - lens.x) < 0.3 &&
        Math.abs(lens.ty - lens.y) < 0.3 &&
        Math.abs(lens.target - lens.strength) < 0.002
      frame = settled ? 0 : requestAnimationFrame(tick)
    }
    const wake = () => {
      if (!frame) frame = requestAnimationFrame(tick)
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = rect.width
      height = rect.height
      canvas.width = Math.round(width * dpr)
      canvas.height = Math.round(height * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      draw()
    }

    const onPointerMove = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect()
      const x = event.clientX - rect.left
      const y = event.clientY - rect.top
      const inside = x >= 0 && y >= 0 && x <= rect.width && y <= rect.height
      if (inside && lens.strength < 0.01) {
        // Appear where the pointer is instead of sliding in from the last spot.
        lens.x = x
        lens.y = y
      }
      lens.tx = x
      lens.ty = y
      lens.target = inside ? 1 : 0
      wake()
    }
    const onPointerLeave = () => {
      lens.target = 0
      wake()
    }

    readColors()
    resize()

    const resizeObserver = new ResizeObserver(resize)
    resizeObserver.observe(canvas)

    // Re-colour when the theme toggle flips data-theme on <html>.
    const themeObserver = new MutationObserver(() => {
      readColors()
      draw()
    })
    themeObserver.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    if (interactive) {
      window.addEventListener('pointermove', onPointerMove, { passive: true })
      document.documentElement.addEventListener('pointerleave', onPointerLeave)
    }

    return () => {
      cancelAnimationFrame(frame)
      resizeObserver.disconnect()
      themeObserver.disconnect()
      window.removeEventListener('pointermove', onPointerMove)
      document.documentElement.removeEventListener('pointerleave', onPointerLeave)
    }
  }, [])

  return <canvas ref={canvasRef} aria-hidden='true' className={className} />
}
