import type { Metadata } from 'next'
import './globals.css'
import SmokeCanvas from '@/components/SmokeCanvas'

export const metadata: Metadata = {
  title: '2PUFF — Вейп магазин в Україні',
  description: 'Найкращі вейпи, pod-системи та рідини. Доставка по Україні.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body style={{ position: 'relative' }}>
        <SmokeCanvas />
        <div style={{ position: 'relative', zIndex: 1 }}>
          {children}
        </div>
      </body>
    </html>
  )
}
