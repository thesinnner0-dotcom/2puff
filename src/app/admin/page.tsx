'use client'
import { useState, useEffect, useRef } from 'react'
import { Product, CATEGORIES } from '@/lib/data'
import { Plus, Pencil, Trash2, X, Check, Package, Upload, Loader2, Search } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const EMPTY: Omit<Product, 'id'> = {
  name: '', brand: '', price: 0, description: '',
  category: 'disposable', inStock: true, image: '💨',
}

function ProductForm({
  initial,
  onSave,
  onClose,
  title,
}: {
  initial: Omit<Product, 'id'>
  onSave: (p: Omit<Product, 'id'>) => Promise<void>
  onClose: () => void
  title: string
}) {
  const [form, setForm] = useState(initial)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const fileRef = useRef<HTMLInputElement>(null)

  const set = (k: string, v: unknown) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  const handleImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const { url } = await res.json()
      set('image', url)
    } catch {
      alert('Помилка завантаження фото')
    } finally {
      setUploading(false)
    }
  }

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = "Введіть назву"
    if (!form.brand.trim()) e.brand = "Введіть бренд"
    if (!form.price || form.price <= 0) e.price = "Введіть ціну"
    if (!form.description.trim()) e.description = "Введіть опис"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSave = async () => {
    if (!validate()) return
    setSaving(true)
    await onSave(form)
    setSaving(false)
  }

  const isUrl = form.image.startsWith('/')  || form.image.startsWith('http')

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full sm:max-w-2xl rounded-t-3xl sm:rounded-2xl overflow-hidden"
        style={{ background: '#111827', maxHeight: '95vh', overflowY: 'auto' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-puff-border sticky top-0"
          style={{ background: '#111827', zIndex: 10 }}>
          <h2 className="text-lg font-black text-white">{title}</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">

          {/* Image upload */}
          <div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">📷 Фото товару</p>
            <div className="flex items-center gap-4">
              {/* Preview */}
              <div className="w-24 h-24 rounded-2xl flex-shrink-0 flex items-center justify-center relative overflow-hidden border border-puff-border"
                style={{ background: 'linear-gradient(135deg,#1a0533,#0d1b2a)' }}>
                {uploading
                  ? <Loader2 className="w-6 h-6 text-puff-purple animate-spin" />
                  : isUrl
                  ? <Image src={form.image} alt="" fill className="object-cover" />
                  : <span className="text-5xl">{form.image}</span>
                }
              </div>

              <div className="flex-1 flex flex-col gap-2">
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} className="hidden" />
                <button
                  onClick={() => fileRef.current?.click()}
                  disabled={uploading}
                  className="btn-ghost text-sm py-2.5 flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  {uploading ? 'Завантаження...' : 'Завантажити фото'}
                </button>
                <p className="text-xs text-gray-600 text-center">або введіть Emoji</p>
                <input
                  className="input text-center text-2xl"
                  placeholder="🍉"
                  value={isUrl ? '' : form.image}
                  onChange={e => set('image', e.target.value || '💨')}
                />
              </div>
            </div>
          </div>

          {/* Main fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Назва товару *</label>
              <input className={`input ${errors.name ? 'border-red-500' : ''}`}
                placeholder="BC5000 Watermelon Ice"
                value={form.name} onChange={e => set('name', e.target.value)} />
              {errors.name && <p className="text-xs text-red-400 mt-1">{errors.name}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Бренд *</label>
              <input className={`input ${errors.brand ? 'border-red-500' : ''}`}
                placeholder="ELFBAR"
                value={form.brand} onChange={e => set('brand', e.target.value)} />
              {errors.brand && <p className="text-xs text-red-400 mt-1">{errors.brand}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Ціна (₴) *</label>
              <input className={`input ${errors.price ? 'border-red-500' : ''}`}
                type="number" placeholder="599"
                value={form.price || ''} onChange={e => set('price', Number(e.target.value))} />
              {errors.price && <p className="text-xs text-red-400 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Стара ціна (₴)</label>
              <input className="input" type="number" placeholder="749"
                value={form.oldPrice || ''} onChange={e => set('oldPrice', Number(e.target.value) || undefined)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Категорія</label>
              <select className="input" value={form.category}
                onChange={e => set('category', e.target.value)}>
                {CATEGORIES.filter(c => c.id !== 'all').map(c => (
                  <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Бейдж</label>
              <select className="input" value={form.badge || ''}
                onChange={e => set('badge', e.target.value || undefined)}>
                <option value="">Без бейджа</option>
                <option value="hot">🔥 Хіт</option>
                <option value="new">✨ Новинка</option>
                <option value="sale">🏷️ Акція</option>
              </select>
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Нікотин</label>
              <input className="input" placeholder="5%"
                value={form.nicotine || ''} onChange={e => set('nicotine', e.target.value || undefined)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">К-сть затяжок</label>
              <input className="input" type="number" placeholder="5000"
                value={form.puffs || ''} onChange={e => set('puffs', Number(e.target.value) || undefined)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Смак</label>
              <input className="input" placeholder="Кавун + Лід"
                value={form.flavor || ''} onChange={e => set('flavor', e.target.value || undefined)} />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1.5">Об&apos;єм</label>
              <input className="input" placeholder="30мл"
                value={form.volume || ''} onChange={e => set('volume', e.target.value || undefined)} />
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Опис *</label>
            <textarea className={`input resize-none h-24 ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Опис товару..."
              value={form.description} onChange={e => set('description', e.target.value)} />
            {errors.description && <p className="text-xs text-red-400 mt-1">{errors.description}</p>}
          </div>

          {/* In stock toggle */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-400 font-semibold">В наявності:</span>
            <button
              onClick={() => set('inStock', !form.inStock)}
              className="w-12 h-6 rounded-full transition-all relative"
              style={{ background: form.inStock ? '#10b981' : '#374151' }}
            >
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all ${form.inStock ? 'left-6' : 'left-0.5'}`} />
            </button>
            <span className={`text-sm font-bold ${form.inStock ? 'text-emerald-400' : 'text-gray-500'}`}>
              {form.inStock ? '✓ Є в наявності' : '✗ Немає'}
            </span>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button onClick={handleSave} disabled={saving}
              className="btn-primary flex-1 flex items-center justify-center gap-2">
              {saving
                ? <><Loader2 className="w-4 h-4 animate-spin" /> Збереження...</>
                : <><Check className="w-4 h-4" /> Зберегти</>
              }
            </button>
            <button onClick={onClose} className="btn-ghost px-6">Скасувати</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const res = await fetch('/api/products')
    const data = await res.json()
    setProducts(data)
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleAdd = async (form: Omit<Product, 'id'>) => {
    await fetch('/api/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    await load()
    setAdding(false)
  }

  const handleEdit = async (form: Omit<Product, 'id'>) => {
    if (!editing) return
    await fetch('/api/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...form, id: editing.id }) })
    await load()
    setEditing(null)
  }

  const handleDelete = async (id: string) => {
    setDeleting(id)
    await fetch('/api/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) })
    await load()
    setDeleting(null)
  }

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  )

  const stats = {
    total: products.length,
    inStock: products.filter(p => p.inStock).length,
    outOfStock: products.filter(p => !p.inStock).length,
  }

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0F' }}>
      {/* Popups */}
      {adding && (
        <ProductForm title="➕ Новий товар" initial={EMPTY}
          onSave={handleAdd} onClose={() => setAdding(false)} />
      )}
      {editing && (
        <ProductForm title="✏️ Редагувати товар" initial={editing}
          onSave={handleEdit} onClose={() => setEditing(null)} />
      )}

      {/* Header */}
      <header className="border-b border-puff-border px-6 py-4 flex items-center justify-between sticky top-0 z-40"
        style={{ background: '#111827' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-lg"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>2</div>
          <div>
            <h1 className="font-black text-white">2PUFF Admin</h1>
            <p className="text-xs text-gray-500">Керування каталогом</p>
          </div>
        </div>
        <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">← До магазину</Link>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Всього товарів', value: stats.total, color: 'grad-text' },
            { label: 'В наявності', value: stats.inStock, color: 'text-emerald-400' },
            { label: 'Немає', value: stats.outOfStock, color: 'text-red-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-5">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className={`text-3xl font-black ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Toolbar */}
        <div className="flex gap-3 mb-6">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
            <input className="input pl-10" placeholder="Пошук за назвою або брендом..."
              value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button onClick={() => setAdding(true)} className="btn-primary flex items-center gap-2 whitespace-nowrap">
            <Plus className="w-4 h-4" /> Додати товар
          </button>
        </div>

        {/* Products list */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 text-puff-purple animate-spin mx-auto mb-3" />
            <p className="text-gray-500">Завантаження...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-bold">Товарів немає</p>
            <p className="text-sm mt-1">Натисніть &quot;Додати товар&quot; щоб почати</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(p => {
              const isUrl = p.image.startsWith('/') || p.image.startsWith('http')
              return (
                <div key={p.id} className="card p-4 flex items-center gap-4 hover:border-gray-700 transition-colors">
                  {/* Image */}
                  <div className="w-14 h-14 rounded-xl flex-shrink-0 flex items-center justify-center relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg,#1a0533,#0d1b2a)' }}>
                    {isUrl
                      ? <Image src={p.image} alt={p.name} fill className="object-cover" />
                      : <span className="text-2xl">{p.image}</span>
                    }
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-black text-puff-purple uppercase tracking-wide">{p.brand}</p>
                    <p className="font-bold text-white truncate">{p.name}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <p className="text-xs text-gray-500 capitalize">{p.category}</p>
                      {p.badge && (
                        <span className={`badge-${p.badge} text-[10px]`}>
                          {p.badge === 'hot' ? '🔥 Хіт' : p.badge === 'new' ? '✨ Новинка' : '🏷️ Акція'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-right flex-shrink-0">
                    <p className="font-black text-white">{p.price} ₴</p>
                    {p.oldPrice && <p className="text-xs text-gray-600 line-through">{p.oldPrice} ₴</p>}
                  </div>

                  {/* Stock */}
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                    p.inStock ? 'bg-emerald-500/15 text-emerald-400' : 'bg-red-500/15 text-red-400'
                  }`}>
                    {p.inStock ? '✓ Є' : '✗ Немає'}
                  </span>

                  {/* Actions */}
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => setEditing(p)}
                      className="p-2.5 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors"
                      title="Редагувати">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                      className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
                      title="Видалити">
                      {deleting === p.id
                        ? <Loader2 className="w-4 h-4 animate-spin" />
                        : <Trash2 className="w-4 h-4" />
                      }
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
