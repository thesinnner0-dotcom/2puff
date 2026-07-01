'use client'

import { useEffect, useRef } from 'react'

// ── Multi-octave sine path — creates graceful loops and curls ──
function spineX(dist: number, t: number, amp: number, phase: number): number {
  // dist = pixels above source (0 = source, large = top)
  const grow = Math.min(1, dist * 0.0035)       // no sway at source
  return (
    Math.sin(dist * 0.0052 + t * 0.18 + phase) * 120 * amp +
    Math.sin(dist * 0.0130 + t * 0.33 + phase + 1.10) * 55 * amp +
    Math.sin(dist * 0.0270 + t * 0.55 + phase + 2.65) * 22 * amp +
    Math.sin(dist * 0.0550 + t * 0.88 + phase + 0.75) *  9 * amp
  ) * grow
}

// Ribbon "face" oscillation — simulates 3-D twist (wide=face-on, narrow=edge-on)
function ribbonFace(dist: number, t: number, phase: number): number {
  return 0.2 + 0.8 * Math.abs(Math.sin(dist * 0.022 + t * 0.28 + phase))
}

function fadeAlpha(progress: number): number {
  if (progress < 0.04)  return progress / 0.04
  if (progress < 0.30)  return 1.0
  return Math.max(0, 1 - (progress - 0.30) / 0.70)
}

function baseWidth(progress: number): number {
  if (progress < 0.07) return 1 + progress * 200
  if (progress < 0.50) return 15 + progress * 18
  return Math.max(3, 24 - (progress - 0.50) * 32)
}

// ── Strands: centre spine + offset siblings ──
const STRANDS = [
  { dx:   0, phase: 0.00, amp: 1.00, peak: 0.18 },
  { dx: -16, phase: 0.90, amp: 0.90, peak: 0.13 },
  { dx: +16, phase: 1.80, amp: 0.90, peak: 0.13 },
  { dx: -34, phase: 2.70, amp: 0.75, peak: 0.09 },
  { dx: +34, phase: 3.60, amp: 0.75, peak: 0.09 },
  { dx:  -8, phase: 4.50, amp: 0.60, peak: 0.07 },
  { dx:  +8, phase: 5.40, amp: 0.60, peak: 0.07 },
]

// Per-strand render passes: [width multiplier, alpha multiplier]
const PASSES: [number, number][] = [
  [3.80, 0.25],   // soft outer haze
  [1.50, 0.55],   // ribbon body
  [0.40, 1.00],   // bright defined edge
]

const STEPS = 95

export default function SmokeCanvas() {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })!
    if (!ctx) return

    let t = 0, raf = 0, W = 0, H = 0

    const resize = () => {
      W = canvas.width  = window.innerWidth
      H = canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function drawStrand(dx: number, phase: number, amp: number, peak: number) {
      const srcX = W * 0.50

      // Build spine points bottom → top
      const pts: { x: number; y: number; progress: number; dist: number }[] = []
      for (let i = 0; i <= STEPS; i++) {
        const progress = i / STEPS
        const dist     = i * (H / STEPS)        // distance above source in px
        const y        = H + 10 - dist
        if (y < -10) break
        pts.push({
          x: srcX + dx + spineX(dist, t, amp, phase),
          y,
          progress,
          dist,
        })
      }
      if (pts.length < 2) return

      for (const [wMult, aMult] of PASSES) {
        for (let i = 1; i < pts.length; i++) {
          const p0   = pts[i - 1], p1 = pts[i]
          const prog = (p0.progress + p1.progress) * 0.5
          const dist = (p0.dist + p1.dist) * 0.5
          const fa   = fadeAlpha(prog)
          const face = ribbonFace(dist, t, phase)   // ribbon twist factor
          const alpha = fa * peak * aMult * face
          if (alpha < 0.001) continue

          const lw = baseWidth(prog) * wMult * face

          ctx.beginPath()
          ctx.moveTo(p0.x, p0.y)
          ctx.lineTo(p1.x, p1.y)
          ctx.strokeStyle = `rgba(120,128,145,${alpha})`
          ctx.lineWidth   = lw
          ctx.lineCap     = 'round'
          ctx.lineJoin    = 'round'
          ctx.stroke()
        }
      }
    }

    const loop = () => {
      t += 0.025
      ctx.clearRect(0, 0, W, H)
      ctx.globalCompositeOperation = 'source-over'
      for (const s of STRANDS) drawStrand(s.dx, s.phase, s.amp, s.peak)
      raf = requestAnimationFrame(loop)
    }

    loop()
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <canvas
      ref={ref}
      style={{
        position: 'fixed',
        top: 0, left: 0,
        width: '100%', height: '100%',
        pointerEvents: 'none',
        zIndex: 20,
        mixBlendMode: 'screen',
      }}
      aria-hidden="true"
    />
  )
}
