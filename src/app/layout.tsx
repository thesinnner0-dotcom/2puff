import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '2PUFF — Вейп магазин в Україні',
  description: 'Найкращі вейпи, pod-системи та рідини. Доставка по Україні.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body>{children}</body>
    </html>
  )
}
