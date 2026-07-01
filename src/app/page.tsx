import Navbar from '@/components/Navbar'
import Catalog from '@/components/Catalog'
import { Truck, Shield, Zap, MessageCircle } from 'lucide-react'

export default function Home() {
  return (
    <main>
      <Navbar />

      {/* Catalog */}
      <section id="catalog" className="py-14 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-black text-white mb-8">Наші товари</h2>
          <Catalog />
        </div>
      </section>

      {/* Hero */}
      <section className="relative overflow-hidden py-24 px-4">
        {/* Glow bg */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: 'radial-gradient(circle, #7C3AED, #EC4899)' }} />

        <div className="max-w-6xl mx-auto relative" style={{ zIndex: 2 }}>
          <div className="max-w-2xl">
            <p className="text-puff-purple font-black text-xs uppercase tracking-[4px] mb-4">
              ⚡ Перевірений магазин · Працюємо по всій Україні
            </p>
            <h1 className="text-5xl md:text-6xl font-black leading-[1.05] tracking-tight mb-5">
              Тотальний<br />
              <span className="grad-text">розпродаж</span>
            </h1>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Найкращий вибір одноразових вейпів, pod-систем та рідин.<br />
              Замовлення через Telegram — швидко та зручно.
            </p>
            <div className="flex flex-wrap gap-3">
              <a href="#catalog" className="btn-primary text-base">
                Переглянути каталог
              </a>
              <a
                href="https://t.me/your_username"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-tg text-base"
              >
                ✈️ Написати в Telegram
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits strip */}
      <section className="border-y border-puff-border py-5 px-4" style={{ background: '#111827' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, text: 'Нова Пошта 1–2 дні' },
            { icon: Shield, text: 'Тільки оригінали' },
            { icon: MessageCircle, text: 'Замовлення в Telegram' },
            { icon: Zap, text: 'Відповідь за 15 хв' },
          ].map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(124,58,237,0.15)' }}>
                <Icon className="w-4 h-4 text-puff-purple" />
              </div>
              <p className="text-sm font-semibold text-gray-300">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Telegram CTA */}
      <section className="px-4 pb-14">
        <div className="max-w-6xl mx-auto">
          <div className="rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 border border-blue-900/40" style={{ background: 'linear-gradient(135deg, #0a1628, #0d2137)' }}>
            <div className="text-5xl">✈️</div>
            <div className="flex-1 text-center md:text-left">
              <h3 className="text-xl font-black text-white mb-1">Як зробити замовлення?</h3>
              <p className="text-blue-300 text-sm leading-relaxed">
                Додайте товари в кошик → натисніть "Замовити через Telegram" →<br />
                ми отримаємо ваше замовлення і зв'яжемося протягом 15 хвилин.
              </p>
            </div>
            <a
              href="https://t.me/your_username"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-tg whitespace-nowrap"
            >
              ✈️ Написати נам
            </a>
          </div>
        </div>
      </section>

      {/* About */}
      <section id="about" className="py-16 px-4 border-t border-puff-border">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-puff-purple font-black text-xs uppercase tracking-[4px] mb-3">Про магазин</p>
          <h2 className="text-3xl font-black text-white mb-4">Ми з 2022 року</h2>
          <p className="text-gray-400 max-w-xl mx-auto leading-relaxed mb-10">
            2PUFF — магазин перевірених вейп-продуктів в Україні. Тільки оригінальні товари від провідних брендів. Швидка доставка Новою Поштою.
          </p>
          <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto">
            {[['2000+', 'клієнтів'], ['300+', 'товарів'], ['4.9★', 'рейтинг']].map(([n, l]) => (
              <div key={l} className="card p-4">
                <p className="text-xl font-black grad-text">{n}</p>
                <p className="text-xs text-gray-500 mt-1">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contacts */}
      <section id="contacts" className="py-16 px-4 border-t border-puff-border">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-2xl font-black text-white mb-8">Контакти</h2>
          <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
            {[
              { e: '✈️', t: 'Telegram', v: '@your_username' },
              { e: '📞', t: 'Телефон', v: '+38 (067) 000-00-00' },
              { e: '⏰', t: 'Графік', v: 'Пн–Нд 9:00–21:00' },
            ].map(({ e, t, v }) => (
              <div key={t} className="card p-5 text-center">
                <div className="text-3xl mb-2">{e}</div>
                <p className="text-xs text-gray-500 mb-1">{t}</p>
                <p className="font-bold text-white text-sm">{v}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-puff-border py-6 px-4">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-600">
          <span className="font-black text-white">2<span className="grad-text">PUFF</span></span>
          <span>© 2024 2PUFF. Всі права захищені.</span>
          <span>Тільки для повנolітніх 18+</span>
        </div>
      </footer>
    </main>
  )
}
