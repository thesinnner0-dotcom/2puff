'use client'
import { useState } from 'react'
import { useCart } from '@/lib/store'
import { TELEGRAM_USERNAME } from '@/lib/data'
import Navbar from '@/components/Navbar'
import OrderModal from '@/components/OrderModal'
import { Trash2, Plus, Minus, ShoppingBag, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'

export default function CartPage() {
  const { items, removeItem, updateQty, total } = useCart()
  const [showOrder, setShowOrder] = useState(false)

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

      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-black text-white mb-8">Кошик</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {items.map(({ product, quantity }) => {
              const isUrl = product.image.startsWith('http')
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
            <div className="border-t border-puff-border pt-4 mb-6">
              <div className="flex justify-between">
                <span className="font-semibold text-gray-400">Разом:</span>
                <span className="text-2xl font-black text-white">{total().toLocaleString('uk-UA')} ₴</span>
              </div>
              <p className="text-xs text-gray-600 mt-1">+ вартість доставки НП</p>
            </div>

            {/* PRIMARY: Order button → opens modal */}
            <button
              onClick={() => setShowOrder(true)}
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
