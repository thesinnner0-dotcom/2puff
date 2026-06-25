'use client'
import { useProducts, useCart } from '@/lib/store'
import Navbar from '@/components/Navbar'
import { ArrowLeft, ShoppingCart, Check } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { buildTelegramUrl } from '@/lib/data'

export default function ProductPage({ params }: { params: { id: string } }) {
  const products = useProducts(s => s.products)
  const product = products.find(p => p.id === params.id)
  const { addItem, items } = useCart()
  const [added, setAdded] = useState(false)

  if (!product) return (
    <main>
      <Navbar />
      <div className="text-center py-24 text-gray-500">
        <p className="text-4xl mb-4">😢</p>
        <p className="font-bold">Товар не знайдено</p>
        <Link href="/" className="text-puff-purple mt-4 inline-block hover:underline">← Назад</Link>
      </div>
    </main>
  )

  const handleAdd = () => {
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const isUrl = product.image.startsWith('http')
  const cartWithThis = [...items, { product, quantity: 1 }]
  const tgUrl = buildTelegramUrl(cartWithThis)

  return (
    <main>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Назад до каталогу
        </Link>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Image */}
          <div className="card flex items-center justify-center min-h-[320px] relative overflow-hidden" style={{ background: 'linear-gradient(135deg,#1a0533,#0d1b2a)' }}>
            {isUrl
              ? <Image src={product.image} alt={product.name} fill className="object-contain p-8" />
              : <span className="text-[100px] select-none">{product.image}</span>
            }
            {product.badge && (
              <span className={`absolute top-4 left-4 badge-${product.badge}`}>
                {product.badge === 'hot' ? '🔥 Хіт' : product.badge === 'new' ? '✨ Новинка' : '🏷️ Акція'}
              </span>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-puff-purple font-black text-xs uppercase tracking-widest">{product.brand}</p>
              <h1 className="text-3xl font-black text-white mt-1">{product.name}</h1>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="text-4xl font-black text-white">{product.price} ₴</span>
              {product.oldPrice && <span className="text-xl text-gray-600 line-through">{product.oldPrice} ₴</span>}
            </div>

            <p className="text-gray-400 leading-relaxed">{product.description}</p>

            {/* Specs */}
            <div className="card p-4 grid grid-cols-2 gap-3">
              {product.puffs && <div><p className="text-xs text-gray-600">Затяжок</p><p className="font-bold text-white">{product.puffs.toLocaleString()}</p></div>}
              {product.nicotine && <div><p className="text-xs text-gray-600">Нікотин</p><p className="font-bold text-white">{product.nicotine}</p></div>}
              {product.flavor && <div><p className="text-xs text-gray-600">Смак</p><p className="font-bold text-white">{product.flavor}</p></div>}
              {product.volume && <div><p className="text-xs text-gray-600">Об'єм</p><p className="font-bold text-white">{product.volume}</p></div>}
              <div>
                <p className="text-xs text-gray-600">Наявність</p>
                <p className={`font-bold ${product.inStock ? 'text-emerald-400' : 'text-red-400'}`}>
                  {product.inStock ? '✓ В наявності' : '✗ Немає'}
                </p>
              </div>
            </div>

            {/* CTA */}
            {product.inStock ? (
              <div className="flex flex-col gap-3">
                <button onClick={handleAdd} className={`btn-primary flex items-center justify-center gap-2 ${added ? '!bg-emerald-500' : ''}`}
                  style={added ? { background: '#10b981', boxShadow: 'none' } : {}}>
                  {added ? <><Check className="w-5 h-5" /> Додано!</> : <><ShoppingCart className="w-5 h-5" /> Додати в кошик</>}
                </button>
                <a href={tgUrl} target="_blank" rel="noopener noreferrer" className="btn-tg justify-center">
                  ✈️ Замовити цей товар в Telegram
                </a>
              </div>
            ) : (
              <div className="card p-4 text-center text-gray-500 font-semibold">
                Товар тимчасово відсутній
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
