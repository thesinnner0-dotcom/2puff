'use client'
import { useState, useEffect, useRef } from 'react'
import { Product } from '@/lib/data'
import { X, Check, Package, Upload, Loader2, Search, ImageIcon, Trash2, Lock, LogOut, Eye, EyeOff } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { OVERRIDE_CATEGORIES, type OverrideCategory } from '@/lib/categories'

const AUTH_KEY = '2puff-admin-auth'

function isImageUrl(v: string) {
  return v.startsWith('/') || v.startsWith('http')
}

function PasswordGate({ onUnlock }: { onUnlock: () => void }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || loading) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Невірний пароль')
      }
      localStorage.setItem(AUTH_KEY, '1')
      onUnlock()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка входу')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: '#0A0A0F' }}>
      <form onSubmit={submit} className="card p-8 max-w-sm w-full">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
          style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>
          <Lock className="w-6 h-6 text-white" />
        </div>
        <h1 className="text-xl font-black text-white text-center mb-1">2PUFF Admin</h1>
        <p className="text-sm text-gray-500 text-center mb-6">Введіть пароль для доступу</p>

        <input
          type="password"
          autoFocus
          autoComplete="current-password"
          className={`input mb-3 ${error ? 'border-red-500' : ''}`}
          placeholder="Пароль"
          value={password}
          onChange={e => { setPassword(e.target.value); setError('') }}
        />
        {error && <p className="text-xs text-red-400 mb-3 text-center">{error}</p>}

        <button type="submit" disabled={loading || !password}
          className="btn-primary w-full justify-center flex items-center gap-2 disabled:opacity-50">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Lock className="w-4 h-4" />}
          Увійти
        </button>

        <Link href="/" className="block text-center text-sm text-gray-500 hover:text-white transition-colors mt-5">
          ← До магазину
        </Link>
      </form>
    </div>
  )
}

function ImageRow({ product, onSaved }: { product: Product; onSaved: () => void }) {
  const current = isImageUrl(product.image) ? product.image : ''
  const [url, setUrl] = useState(current)
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  // ── Overrides (description + category) ──
  const initialCategory = product.category as OverrideCategory
  const [description, setDescription] = useState(product.description || '')
  const [category, setCategory] = useState<OverrideCategory>(initialCategory)
  const [savingOverride, setSavingOverride] = useState(false)
  const [overrideError, setOverrideError] = useState('')

  // ── Visibility (hide/show) ──
  const [togglingHidden, setTogglingHidden] = useState(false)
  const hidden = !!product.hidden

  const handleToggleHidden = async () => {
    setTogglingHidden(true)
    try {
      const res = await fetch('/api/hidden', {
        method: hidden ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Помилка')
      }
      onSaved()
    } catch (err) {
      setOverrideError(err instanceof Error ? err.message : 'Не вдалося змінити видимість')
    } finally {
      setTogglingHidden(false)
    }
  }

  const overrideDirty =
    description.trim() !== (product.description || '').trim() || category !== initialCategory

  const handleSaveOverride = async () => {
    setSavingOverride(true)
    setOverrideError('')
    try {
      const res = await fetch('/api/overrides', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, description, category }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Помилка збереження')
      onSaved()
    } catch (err) {
      setOverrideError(err instanceof Error ? err.message : 'Не вдалося зберегти')
    } finally {
      setSavingOverride(false)
    }
  }

  const dirty = url.trim() !== current

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Помилка завантаження')
      setUrl(data.url)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка завантаження фото')
    } finally {
      setUploading(false)
      if (fileRef.current) fileRef.current.value = ''
    }
  }

  const handleSave = async () => {
    setSaving(true)
    setError('')
    try {
      const res = await fetch('/api/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id, imageUrl: url.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Помилка збереження')
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не вдалося зберегти')
    } finally {
      setSaving(false)
    }
  }

  const handleRemove = async () => {
    setRemoving(true)
    setError('')
    try {
      const res = await fetch('/api/images', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Помилка видалення')
      }
      setUrl('')
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не вдалося видалити')
    } finally {
      setRemoving(false)
    }
  }

  const previewIsUrl = isImageUrl(url)

  return (
    <div className="card p-4 flex flex-col gap-4">
      {/* ── Image row ── */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Preview */}
        <div className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center relative overflow-hidden border border-puff-border"
          style={{ background: 'linear-gradient(135deg,#1a0533,#0d1b2a)' }}>
          {uploading
            ? <Loader2 className="w-6 h-6 text-puff-purple animate-spin" />
            : previewIsUrl
            ? <Image src={url} alt={product.name} fill className="object-cover" />
            : <span className="text-3xl">💨</span>
          }
        </div>

        {/* Info + controls */}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-puff-purple uppercase tracking-wide">{product.brand}</p>
          <div className="flex items-center gap-2">
            <p className={`font-bold truncate ${hidden ? 'text-gray-500' : 'text-white'}`}>{product.name}</p>
            {hidden && (
              <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 flex-shrink-0 flex items-center gap-1">
                <EyeOff className="w-3 h-3" /> Приховано
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <input
              className="input text-sm flex-1"
              placeholder="Вставте посилання на зображення (https://...)"
              value={url}
              onChange={e => { setUrl(e.target.value); setError('') }}
            />
            <input ref={fileRef} type="file" accept="image/*" onChange={handleUpload} className="hidden" />
            <button
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="btn-ghost text-sm py-2.5 px-3 flex items-center gap-2 whitespace-nowrap"
              title="Завантажити фото"
            >
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Фото</span>
            </button>
          </div>
          {error && <p className="text-xs text-red-400 mt-1.5">{error}</p>}
        </div>

        {/* Image actions */}
        <div className="flex gap-2 flex-shrink-0">
          <button
            onClick={handleSave}
            disabled={saving || uploading || !dirty || !url.trim()}
            className="btn-primary text-sm py-2.5 px-4 flex items-center gap-2 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Зберегти
          </button>
          {current && (
            <button
              onClick={handleRemove}
              disabled={removing}
              className="p-2.5 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"
              title="Прибрати зображення"
            >
              {removing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
            </button>
          )}
        </div>
      </div>

      {/* ── Description + category ── */}
      <div className="border-t border-puff-border pt-4 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1">
            <label className="text-xs text-gray-500 mb-1 block">Опис товару</label>
            <textarea
              className="input text-sm w-full min-h-[72px] resize-y"
              placeholder="Опис товару..."
              value={description}
              onChange={e => { setDescription(e.target.value); setOverrideError('') }}
            />
          </div>
          <div className="sm:w-52 flex-shrink-0">
            <label className="text-xs text-gray-500 mb-1 block">Категорія</label>
            <select
              className="input text-sm w-full"
              value={category}
              onChange={e => { setCategory(e.target.value as OverrideCategory); setOverrideError('') }}
            >
              {OVERRIDE_CATEGORIES.map(c => (
                <option key={c.value} value={c.value}>{c.label}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={handleSaveOverride}
            disabled={savingOverride || !overrideDirty}
            className="btn-primary text-sm py-2.5 px-4 flex items-center gap-2 disabled:opacity-50"
          >
            {savingOverride ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
            Зберегти опис і категорію
          </button>
          <button
            onClick={handleToggleHidden}
            disabled={togglingHidden}
            className={`text-sm py-2.5 px-4 rounded-xl flex items-center gap-2 transition-colors disabled:opacity-50 ${
              hidden
                ? 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25'
                : 'bg-amber-500/15 text-amber-400 hover:bg-amber-500/25'
            }`}
            title={hidden ? 'Показати у каталозі' : 'Приховати з каталогу'}
          >
            {togglingHidden
              ? <Loader2 className="w-4 h-4 animate-spin" />
              : hidden ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
            {hidden ? 'Показати у каталозі' : 'Приховати з каталогу'}
          </button>
          {overrideError && <p className="text-xs text-red-400">{overrideError}</p>}
        </div>
      </div>
    </div>
  )
}

export default function AdminPage() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    setAuthed(localStorage.getItem(AUTH_KEY) === '1')
  }, [])

  const logout = () => {
    localStorage.removeItem(AUTH_KEY)
    setAuthed(false)
  }

  const load = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/products?includeHidden=1')
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Помилка завантаження')
      setProducts(Array.isArray(data) ? data : [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Не вдалося завантажити товари')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { if (authed) load() }, [authed])

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.brand.toLowerCase().includes(search.toLowerCase())
  )

  const withImage = products.filter(p => isImageUrl(p.image)).length
  const hiddenCount = products.filter(p => p.hidden).length
  const stats = {
    total: products.length,
    withImage,
    hidden: hiddenCount,
  }

  if (authed === null) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0A0A0F' }}>
        <Loader2 className="w-8 h-8 text-puff-purple animate-spin" />
      </div>
    )
  }

  if (!authed) {
    return <PasswordGate onUnlock={() => setAuthed(true)} />
  }

  return (
    <div className="min-h-screen" style={{ background: '#0A0A0F' }}>
      {/* Header */}
      <header className="border-b border-puff-border px-6 py-4 flex items-center justify-between sticky top-0 z-40"
        style={{ background: '#111827' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center font-black text-white text-lg"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#EC4899)' }}>2</div>
          <div>
            <h1 className="font-black text-white">2PUFF Admin</h1>
            <p className="text-xs text-gray-500">Товари: фото, опис, категорія</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">← До магазину</Link>
          <button onClick={logout}
            className="text-sm text-gray-500 hover:text-red-400 transition-colors flex items-center gap-1.5">
            <LogOut className="w-4 h-4" /> Вийти
          </button>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="mb-6 rounded-xl p-4 text-sm text-gray-400"
          style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
          <p className="flex items-center gap-2 font-bold text-white mb-1">
            <ImageIcon className="w-4 h-4 text-puff-purple" /> Керування товарами
          </p>
          Товари завантажуються з CRM. Тут ви можете додати зображення, опис та категорію
          для кожного товару. Ці дані зберігаються окремо й відображаються у каталозі.
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: 'Всього товарів', value: stats.total, color: 'grad-text' },
            { label: 'Із зображенням', value: stats.withImage, color: 'text-emerald-400' },
            { label: 'Приховано', value: stats.hidden, color: 'text-amber-400' },
          ].map(({ label, value, color }) => (
            <div key={label} className="card p-5">
              <p className="text-xs text-gray-500 mb-1">{label}</p>
              <p className={`text-3xl font-black ${color}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 mb-6">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
          <input className="input pl-10" placeholder="Пошук за назвою або брендом..."
            value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* List */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-8 h-8 text-puff-purple animate-spin mx-auto mb-3" />
            <p className="text-gray-500">Завантаження...</p>
          </div>
        ) : error ? (
          <div className="text-center py-20 text-red-400">
            <X className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="font-bold">{error}</p>
            <button onClick={load} className="btn-ghost mt-4">Спробувати ще раз</button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <Package className="w-12 h-12 mx-auto mb-4 opacity-30" />
            <p className="font-bold">Товарів немає</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {filtered.map(p => (
              <ImageRow key={p.id} product={p} onSaved={load} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
