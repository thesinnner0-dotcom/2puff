'use client'
import { Product } from '@/lib/data'
import { useCart } from '@/lib/store'
import { ShoppingCart, Check } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'

export default function ProductCard({ product }: { product: Product }) {
  const addItem = useCart(s => s.addItem)
  const [added, setAdded] = useState(false)

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!product.inStock) return
    addItem(product)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  const isUrl = product.image.startsWith('/') || product.image.startsWith('http')

  return (
    <Link href={`/product/${product.id}`} className="card group flex flex-col overflow-hidden hover:border-puff-purple transition-all duration-300 hover:-translate-y-0.5">
      {/* Image */}
      <div className="relative h-44 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1a0533, #0d1b2a)' }}>
        {isUrl ? (
          <Image src={product.image} alt={product.name} fill sizes="(max-width: 768px) 50vw, 20vw" className="object-cover" />
        ) : (
          <span className="text-6xl select-none">{product.image}</span>
        )}
        {product.badge && (
          <span className={`absolute top-3 left-3 badge-${product.badge}`}>
            {product.badge === 'hot' ? '🔥 Хіт' : product.badge === 'new' ? '✨ Новинка' : '🏷️ Акція'}
          </span>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-400">Немає в наявності</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <p className="text-xs font-black uppercase tracking-widest text-puff-purple">{product.brand}</p>
        <h3 className="font-bold text-sm text-white leading-snug group-hover:text-puff-purple-light transition-colors line-clamp-2">
          {product.name}
        </h3>

        {/* Specs */}
        <div className="flex flex-wrap gap-1.5 mt-auto pt-2">
          {product.puffs && <span className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full">{product.puffs.toLocaleString()} затяжок</span>}
          {product.nicotine && <span className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full">{product.nicotine} нікотин</span>}
          {product.volume && <span className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded-full">{product.volume}</span>}
        </div>

        {/* Price + cart */}
        <div className="flex items-center justify-between mt-3">
          <div>
            <span className="text-lg font-black text-white">{product.price} ₴</span>
            {product.oldPrice && <span className="text-sm text-gray-600 line-through ml-2">{product.oldPrice} ₴</span>}
          </div>
          <button
            onClick={handleAdd}
            disabled={!product.inStock}
            className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 active:scale-90 ${
              added ? 'bg-emerald-500' :
              product.inStock ? 'hover:opacity-90' : 'bg-white/5 cursor-not-allowed'
            }`}
            style={product.inStock && !added ? { background: 'linear-gradient(135deg,#7C3AED,#EC4899)' } : {}}
          >
            {added ? <Check className="w-4 h-4 text-white" /> : <ShoppingCart className="w-4 h-4 text-white" />}
          </button>
        </div>
      </div>
    </Link>
  )
}
