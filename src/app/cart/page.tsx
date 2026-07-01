'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/lib/store'
import { TELEGRAM_USERNAME, computePromo } from '@/lib/data'
import Navbar from '@/components/Navbar'
import OrderModal from '@/components/OrderModal'
import UpsellModal from '@/components/UpsellModal'
import { Trash2, Plus, Minus, ShoppingBag, MessageCircle, Gift, Percent } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { items, removeItem, updateQty, count } = useCart()
  const [showOrder, setShowOrder] = useState(false)
  const [upsell, setUpsell] = useState<null | 'second' | 'gift'>(null)
  const router = useRouter()

  const promo = computePromo(items)

  // Gate checkout behind the upsell popups
  const handleCheckout = () => {
    const c = count()
    if (c === 1) { setUpsell('second'); return }
    if (c === 2 || c === 3) { setUpsell('gift'); return }
    setShowOrder(true)
  }

  if (items.length === 0) return (
    <main>
      <Navbar />
      <div className="max-w-lg mx-auto px-4 py-24 text-center">
        <div className="text-7xl mb-6">🛒</div>
        <h1 className="text-2xl font-black text-white mb-3">Кошик порожній</h1>
        <p className="text-gray-500 mb-8">Додайте товари з каталогу</p>
        <Link href="/" className="btn-primary inline-flex items-center gap-2">
          <ShoppingBag className="w-5 h-5" /> До каталогу
        </Link>
      </div>
    </main>
  )

  return (
    <main>
      <Navbar />
      {showOrder && <OrderModal onClose={() => setShowOrder(false)} />}
      {upsell && (
        <UpsellModal
          tier={upsell}
          onClose={() => { setUpsell(null); setShowOrder(true) }}
          onAddMore={() => { setUpsell(null); router.push('/#catalog') }}
        />
      )}

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-white mb-8">Кошик</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {items.map(({ product, quantity }) => {
              const isUrl = product.image.startsWith('/') || product.image.startsWith('http')
              return (
                <div key={product.id} className="card p-4 flex items-center gap-4">
                  <div className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg,#1a0533,#0d1b2a)' }}>
                    {isUrl
                      ? <Image src={product.image} alt={product.name} fill className="object-cover" />
                      : <span className="text-3xl">{product.image}</span>
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-puff-purple uppercase tracking-wide">{product.brand}</p>
                    <p className="font-bold text-white text-sm truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.price} ₴ / шт</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => updateQty(product.id, quantity - 1)}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center font-black text-white">{quantity}</span>
                    <button onClick={() => updateQty(product.id, quantity + 1)}
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center transition-colors">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="font-black text-white w-24 text-right">{(product.price * quantity).toLocaleString('uk-UA')} ₴</p>
                  <button onClick={() => removeItem(product.id)}
                    className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )
            })}
          </div>

          {/* Summary */}
          <div className="card p-6 h-fit sticky top-24">
            <h2 className="font-black text-white text-lg mb-4">Ваше замовлення</h2>
            <div className="flex flex-col gap-2 mb-4">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm text-gray-500">
                  <span className="truncate mr-2">{product.name} ×{quantity}</span>
                  <span className="flex-shrink-0">{(product.price * quantity).toLocaleString('uk-UA')} ₴</span>
                </div>
              ))}
            </div>
            <div className="border-t border-puff-border pt-4 mb-3 flex flex-col gap-2">
              <div className="flex justify-between text-sm text-gray-400">
                <span>Сума:</span>
                <span>{promo.subtotal.toLocaleString('uk-UA')} ₴</span>
              </div>
              {promo.secondOff > 0 && (
                <div className="flex justify-between text-sm font-semibold text-puff-purple">
                  <span className="flex items-center gap-1"><Percent className="w-3.5 h-3.5" /> Знижка 20% (2-й товар):</span>
                  <span>−{promo.secondOff.toLocaleString('uk-UA')} ₴</span>
                </div>
              )}
              {promo.giftValue > 0 && (
                <div className="flex justify-between text-sm font-semibold text-amber-400">
                  <span className="flex items-center gap-1"><Gift className="w-3.5 h-3.5" /> 4-й товар у подарунок:</span>
                  <span>−{promo.giftValue.toLocaleString('uk-UA')} ₴</span>
                </div>
              )}
            </div>
            <div className="border-t border-puff-border pt-4 mb-4">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-400">Разом:</span>
                <span className="text-2xl font-black text-white">{promo.total.toLocaleString('uk-UA')} ₴</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">+ вартість доставки НП</p>
            </div>

            {/* Progress hint toward next reward */}
            {promo.units === 1 && (
              <div className="rounded-xl p-3 mb-3 text-xs font-semibold text-center text-puff-purple"
                style={{ background: 'rgba(124,58,237,0.1)', border: '1px solid rgba(124,58,237,0.25)' }}>
                💡 Додайте ще 1 товар і отримайте знижку 20%!
              </div>
            )}
            {(promo.units === 2 || promo.units === 3) && (
              <div className="rounded-xl p-3 mb-3 text-xs font-semibold text-center text-amber-400"
                style={{ background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.25)' }}>
                🎁 Ще {4 - promo.units} товар(и) — і 4-й у подарунок!
              </div>
            )}

            {/* PRIMARY: Order button → upsell gate → modal */}
            <button
              onClick={handleCheckout}
              className="btn-tg w-full justify-center text-base py-3.5 mb-3"
            >
              ✈️ Оформити замовлення
            </button>

            {/* SECONDARY: Direct Telegram link */}
            <a
              href={`https://t.me/${TELEGRAM_USERNAME}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold text-gray-400 border border-puff-border hover:border-gray-500 hover:text-white transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              Написати нам напряму
            </a>

            <Link href="/" className="block text-center text-sm text-gray-600 hover:text-gray-400 mt-3 transition-colors">
              ← Продовжити покупки
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
