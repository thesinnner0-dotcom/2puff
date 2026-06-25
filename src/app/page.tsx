import Navbar from '@/components/Navbar'
import Catalog from '@/components/Catalog'
import SmokeBackground from '@/components/SmokeBackground'
import { Truck, Shield, MessageCircle, Zap } from 'lucide-react'

export default function Home() {
  return (
    <main>
      <Navbar />

      {/* HERO */}
      <section className="relative overflow-hidden min-h-[94vh] flex items-center px-4"
        style={{ background: 'linear-gradient(160deg, #08000f 0%, #0d0118 40%, #06101a 100%)' }}>

        {/* Smoke canvas — behind everything */}
        <SmokeBackground />

        {/* Subtle purple glow center */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
          <div className="absolute" style={{
            width: 700, height: 500,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -60%)',
            background: 'radial-gradient(ellipse, rgba(100,30,180,0.18) 0%, transparent 70%)',
            filter: 'blur(40px)',
          }} />
          {/* Grid */}
          <div className="absolute inset-0" style={{
            backgroundImage: 'linear-gradient(rgba(140,80,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(140,80,255,0.04) 1px, transparent 1px)',
            backgroundSize: '80px 80px',
          }} />
        </div>

        {/* Content — always on top */}
        <div className="max-w-6xl mx-auto w-full relative py-24" style={{ zIndex: 10 }}>
          <div className="max-w-2xl">

            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 fade-in-up"
              style={{
                background: 'rgba(124,58,237,0.12)',
                border: '1px solid rgba(124,58,237,0.3)',
                color: '#A855F7',
                fontSize: 11,
                fontWeight: 900,
                letterSpacing: '3px',
                textTransform: 'uppercase',
                animationDelay: '0s',
              }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#A855F7' }} />
              Офіційний магазин · Тільки Україна
            </div>

            {/* H1 */}
            <h1 className="font-black leading-none tracking-tight mb-6 fade-in-up"
              style={{ animationDelay: '0.12s' }}>
              <span className="block text-white" style={{ fontSize: 'clamp(50px, 7.5vw, 90px)' }}>
                Твій вейп —
              </span>
              <span className="block" style={{
                fontSize: 'clamp(50px, 7.5vw, 90px)',
                background: 'linear-gradient(135deg, #c084fc 0%, #e879f9 40%, #f43f5e 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}>
                твій стиль.
              </span>
            </h1>

            {/* Sub */}
            <p className="text-xl leading-relaxed mb-10 fade-in-up"
              style={{ color: '#9ca3af', animationDelay: '0.22s' }}>
              Найкращий вибір одноразових вейпів та pod-систем.<br />
              <span style={{ color: '#c084fc' }}>Замовлення через Telegram</span> — відповідь за 15 хв.
            </p>

            {/* Buttons */}
            <div className="flex flex-wrap gap-4 fade-in-up" style={{ animationDelay: '0.32s' }}>
              <a href="#catalog"
                className="relative px-8 py-4 rounded-2xl font-black text-white text-lg transition-all duration-300 hover:scale-105"
                style={{
                  background: 'linear-gradient(135deg, #7C3AED, #EC4899)',
                  boxShadow: '0 4px 32px rgba(124,58,237,0.45)',
                }}>
                Переглянути каталог →
              </a>
              <a href="https://t.me/your_username" target="_blank" rel="noopener noreferrer"
                className="px-8 py-4 rounded-2xl font-black text-white text-lg transition-all duration-300 hover:scale-105 border"
                style={{
                  borderColor: 'rgba(255,255,255,0.12)',
                  background: 'rgba(255,255,255,0.04)',
                  backdropFilter: 'blur(12px)',
                }}>
                ✈️ Написати нам
              </a>
            </div>

            {/* Stats */}
            <div className="flex gap-10 mt-14 fade-in-up" style={{ animationDelay: '0.42s' }}>
              {[['2000+', 'клієнтів'], ['300+', 'товарів'], ['15 хв', 'відповідь']].map(([n, l]) => (
                <div key={l}>
                  <p className="text-2xl font-black" style={{
                    background: 'linear-gradient(135deg, #c084fc, #f472b6)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                  }}>{n}</p>
                  <p className="text-xs mt-0.5" style={{ color: '#6b7280' }}>{l}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Floating cards — right side */}
          <div className="absolute right-0 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-3 fade-in-right"
            style={{ animationDelay: '0.5s' }}>
            {[
              { emoji: '🍉', name: 'ELFBAR BC5000', price: '599 ₴', glow: 'rgba(239,68,68,0.2)' },
              { emoji: '🥭', name: 'LOST MARY BM5000', price: '649 ₴', glow: 'rgba(251,146,60,0.2)' },
              { emoji: '⚡', name: 'GEEK VAPE Aegis', price: '2499 ₴', glow: 'rgba(234,179,8,0.2)' },
            ].map((p, i) => (
              <div key={p.name}
                className="flex items-center gap-3 px-5 py-3.5 rounded-2xl border backdrop-blur-md"
                style={{
                  background: `rgba(15,10,25,0.7)`,
                  borderColor: 'rgba(255,255,255,0.07)',
                  transform: `translateX(${i % 2 === 0 ? '0px' : '24px'})`,
                  boxShadow: `0 8px 32px ${p.glow}`,
                }}>
                <span className="text-4xl">{p.emoji}</span>
                <div>
                  <p className="text-white font-bold text-sm">{p.name}</p>
                  <p className="font-black text-sm" style={{ color: '#c084fc' }}>{p.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom fade to catalog */}
        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" style={{ zIndex: 5,
          background: 'linear-gradient(to bottom, transparent, #0A0A0F)' }} />
      </section>

      {/* BENEFITS */}
      <section className="border-y border-puff-border py-5 px-4" style={{ background: '#0d0d14' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, text: 'Нова Пошта 1–2 дні' },
            { icon: Shield, text: 'Тільки оригінали' },
            { icon: MessageCircle, text: 'Замовлення в Telegram' },
            { icon: Zap, text: 'Відповідь за 15 хв' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(124,58,237,0.15)' }}>
                <Icon className="w-4 h-4 text-puff-purple" />
              </div>
              <p className="text-sm font-semibold text-gray-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATALOG */}
      <section id="catalog" className="py-12 px-4" style={{ background: '#0A0A0F' }}>
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <p className="text-xs font-black uppercase tracking-[3px] mb-2" style={{ color: '#A855F7' }}>
              Весь асортимент
            </p>
            <h2 className="text-3xl font-black text-white">Каталог товарів</h2>
          </div>
          <Catalog />
        </div>
      </section>

      {/* TG CTA */}
      <section className="px-4 pb-16" style={{ background: '#0A0A0F' }}>
        <div className="max-w-6xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl p-10 text-center border"
            style={{
              background: 'linear-gradient(135deg, #0d0218 0%, #1a0533 50%, #0d1b2a 100%)',
              borderColor: 'rgba(124,58,237,0.25)',
            }}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-80 h-48 blur-3xl pointer-events-none"
              style={{ background: 'radial-gradient(circle, rgba(124,58,237,0.25), transparent)' }} />
            <div className="relative z-10">
              <div className="text-5xl mb-4">✈️</div>
              <h3 className="text-2xl font-black text-white mb-3">Як замовити?</h3>
              <p className="mb-8 max-w-md mx-auto" style={{ color: '#9ca3af' }}>
                Додай товари → оформи замовлення → отримай підтвердження в Telegram за 15 хвилин.
              </p>
              <a href="https://t.me/your_username" target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-black text-white text-lg transition-all hover:scale-105"
                style={{ background: '#229ED9', boxShadow: '0 4px 24px rgba(34,158,217,0.35)' }}>
                ✈️ Написати нам в Telegram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-puff-border py-6 px-4" style={{ background: '#0A0A0F' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-sm" style={{ color: '#4b5563' }}>
          <span className="font-black text-white text-lg">2<span style={{
            background: 'linear-gradient(135deg,#A855F7,#EC4899)',
            WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent'
          }}>PUFF</span></span>
          <span>© 2024 2PUFF. Всі права захищені.</span>
          <span>Тільки для повнолітніх 18+</span>
        </div>
      </footer>

      <style jsx global>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(28px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in-right {
          from { opacity: 0; transform: translateX(36px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .fade-in-up {
          opacity: 0;
          animation: fade-in-up 0.75s cubic-bezier(0.22,1,0.36,1) forwards;
        }
        .fade-in-right {
          opacity: 0;
          animation: fade-in-right 0.75s cubic-bezier(0.22,1,0.36,1) forwards;
        }
      `}</style>
    </main>
  )
}
