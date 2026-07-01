'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  maxR: number
  life: number
  speed: number
  hue: number
  side: 'left' | 'right'
}

function newParticle(w: number, h: number): Particle {
  const side = Math.random() < 0.5 ? 'left' : 'right'
  const x = side === 'left'
    ? Math.random() * w * 0.28
    : w - Math.random() * w * 0.28
  return {
    x,
    y: h + 10,
    vx: (side === 'left' ? 1 : -1) * (Math.random() * 0.25 + 0.05),
    vy: -(Math.random() * 0.4 + 0.15),
    r: Math.random() * 12 + 8,
    maxR: Math.random() * 90 + 60,
    life: 0,
    speed: Math.random() * 0.0018 + 0.0008,
    hue: Math.random() < 0.4 ? 270 : 0,
    side,
  }
}

export default function SmokeCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const particles: Particle[] = []
    let raf = 0
    let frame = 0

    const resize = () => {
      const rect = canvas.parentElement?.getBoundingClientRect()
      canvas.width  = rect?.width  ?? window.innerWidth
      canvas.height = rect?.height ?? 500
    }
    resize()
    window.addEventListener('resize', resize)

    for (let i = 0; i < 22; i++) {
      const p = newParticle(canvas.width, canvas.height)
      p.life = Math.random()
      p.y = canvas.height - (canvas.height + 10) * p.life
      p.r = p.r + (p.maxR - p.r) * p.life
      particles.push(p)
    }

    const loop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      if (frame % 18 === 0) {
        particles.push(newParticle(canvas.width, canvas.height))
        if (Math.random() < 0.5) particles.push(newParticle(canvas.width, canvas.height))
      }

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life += p.speed
        if (p.life >= 1) { particles.splice(i, 1); continue }

        p.x += p.vx
        p.y += p.vy
        p.vx += (p.side === 'left' ? -0.003 : 0.003)
        p.r = p.r + (p.maxR - p.r) * 0.008

        const alpha = life2alpha(p.life)
        if (alpha <= 0) continue

        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r)
        if (p.hue === 0) {
          grad.addColorStop(0,   `rgba(240,238,248,${alpha * 0.9})`)
          grad.addColorStop(0.5, `rgba(220,218,235,${alpha * 0.45})`)
          grad.addColorStop(1,   `rgba(200,198,220,0)`)
        } else {
          grad.addColorStop(0,   `rgba(210,190,255,${alpha * 0.7})`)
          grad.addColorStop(0.5, `rgba(180,150,240,${alpha * 0.3})`)
          grad.addColorStop(1,   `rgba(150,110,220,0)`)
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      raf = requestAnimationFrame(loop)
    }

    loop()
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 1,
      }}
      aria-hidden="true"
    />
  )
}

function life2alpha(t: number): number {
  if (t < 0.15) return (t / 0.15) * 0.11
  if (t < 0.45) return 0.11
  return 0.11 * (1 - (t - 0.45) / 0.55)
}
