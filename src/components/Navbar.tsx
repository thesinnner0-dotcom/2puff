'use client'
import Link from 'next/link'
import { ShoppingCart, Menu, X, MessageCircle } from 'lucide-react'
import { useCart } from '@/lib/store'
import { TELEGRAM_USERNAME } from '@/lib/data'
import { useState } from 'react'

export default function Navbar() {
  const count = useCart(s => s.count())
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 border-b border-puff-border"
      style={{ background: 'rgba(10,10,15,0.95)', backdropFilter: 'blur(12px)' }}>
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 flex-shrink-0">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-lg"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>
            2
          </div>
          <span className="font-black text-xl tracking-tight">
            <span className="grad-text">PUFF</span>
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-semibold text-gray-400">
          <Link href="/" className="hover:text-white transition-colors">Каталог</Link>
          <Link href="/#about" className="hover:text-white transition-colors">Про нас</Link>
          <Link href="/#contacts" className="hover:text-white transition-colors">Контакти</Link>
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-2 ml-auto">
          {/* Telegram — always visible */}
          <a
            href={`https://t.me/${TELEGRAM_USERNAME}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-white transition-all hover:opacity-90"
            style={{ background: '#229ED9' }}
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Telegram
          </a>

          {/* Cart */}
          <Link href="/cart" className="relative p-2 hover:bg-white/5 rounded-xl transition-colors">
            <ShoppingCart className="w-6 h-6 text-gray-300" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-black text-white flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>
                {count > 9 ? '9+' : count}
              </span>
            )}
          </Link>

          {/* Mobile menu toggle */}
          <button className="md:hidden p-2 hover:bg-white/5 rounded-xl" onClick={() => setOpen(!open)}>
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-puff-border px-4 py-4 flex flex-col gap-4"
          style={{ background: '#0A0A0F' }}>
          <Link href="/" onClick={() => setOpen(false)} className="text-sm font-semibold text-gray-400 hover:text-white">Каталог</Link>
          <Link href="/#about" onClick={() => setOpen(false)} className="text-sm font-semibold text-gray-400 hover:text-white">Про нас</Link>
          <Link href="/#contacts" onClick={() => setOpen(false)} className="text-sm font-semibold text-gray-400 hover:text-white">Контакти</Link>
          <a href={`https://t.me/${TELEGRAM_USERNAME}`} target="_blank" rel="noopener noreferrer"
            className="btn-tg justify-center text-sm py-2.5">
            <MessageCircle className="w-4 h-4" /> Telegram
          </a>
        </div>
      )}
    </header>
  )
}
