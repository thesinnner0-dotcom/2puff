'use client'
import { useState, useEffect, useMemo } from 'react'
import { CATEGORIES, Product } from '@/lib/data'
import ProductCard from './ProductCard'
import { Search, Loader2 } from 'lucide-react'

export default function Catalog() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [cat, setCat] = useState('all')
  const [q, setQ] = useState('')

  useEffect(() => {
    fetch('/api/products')
      .then(r => r.json())
      .then(data => { setProducts(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => {
    let list = products
    if (cat !== 'all') list = list.filter(p => p.category === cat)
    if (q.trim()) {
      const query = q.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query)
      )
    }
    return list
  }, [products, cat, q])

  return (
    <div>
      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
        <input className="input pl-11" placeholder="Пошук товарів..."
          value={q} onChange={e => setQ(e.target.value)} />
      </div>

      {/* Categories */}
      <div className="flex flex-wrap gap-2 mb-8">
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCat(c.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              cat === c.id ? 'text-white' : 'text-gray-500 border border-puff-border hover:border-puff-purple hover:text-white'
            }`}
            style={cat === c.id ? { background: 'linear-gradient(135deg,#7C3AED,#EC4899)' } : {}}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex items-center justify-center py-24 gap-3 text-gray-500">
          <Loader2 className="w-6 h-6 animate-spin text-puff-purple" />
          <span>Завантаження товарів...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-24 text-gray-600">
          <p className="text-5xl mb-4">🔍</p>
          <p className="font-bold text-lg">Нічого не знайдено</p>
          <p className="text-sm mt-1">Спробуйте інший запит</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(p => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
