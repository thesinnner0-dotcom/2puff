'use client'
import { useState } from 'react'
import { useCart } from '@/lib/store'
import { computePromo } from '@/lib/data'
import { X, User, Phone, MapPin, Banknote, CreditCard, Bitcoin, Send, CheckCircle } from 'lucide-react'

interface Props {
  onClose: () => void
}

type Payment = 'cod' | 'card' | 'crypto'

export default function OrderModal({ onClose }: Props) {
  const { items, clearCart } = useCart()
  const promo = computePromo(items)
  const [form, setForm] = useState({ name: '', phone: '', city: '', address: '', note: '' })
  const [payment, setPayment] = useState<Payment>('cod')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = "Введіть ім'я"
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 10) e.phone = 'Введіть коректний номер'
    if (!form.city.trim()) e.city = 'Введіть місто'
    if (!form.address.trim()) e.address = 'Введіть відділення або адресу'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleOrder = async () => {
    if (!validate() || submitting) return
    setSubmitError('')
    setSubmitting(true)

    const payload = {
      clientName: form.name.trim(),
      phone: form.phone.trim(),
      address: `${form.city.trim()}, ${form.address.trim()}`,
      note: form.note.trim() || undefined,
      paymentMethod: payment,
      items: items.map(({ product, quantity }) => ({
        productId: product.id,
        quantity,
      })),
    }

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Помилка оформлення')
      }
      setSent(true)
      clearCart()
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : 'Не вдалося оформити замовлення')
    } finally {
      setSubmitting(false)
    }
  }

  const set = (k: string, v: string) => {
    setForm(f => ({ ...f, [k]: v }))
    setErrors(e => ({ ...e, [k]: '' }))
  }

  // Success screen
  if (sent) return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="card p-8 max-w-sm w-full text-center" style={{ background: '#111827' }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(16,185,129,0.15)' }}>
          <CheckCircle className="w-8 h-8 text-emerald-400" />
        </div>
        <h2 className="text-xl font-black text-white mb-2">Замовлення прийнято!</h2>
        <p className="text-gray-400 text-sm mb-6">Ми отримали ваше замовлення і зв'яжемося з вами найближчим часом 🎉</p>
        <button onClick={onClose} className="btn-primary w-full">Закрити</button>
      </div>
    </div>
  )

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full sm:max-w-lg rounded-t-3xl sm:rounded-2xl overflow-hidden" style={{ background: '#111827', maxHeight: '95vh', overflowY: 'auto' }}>

        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-puff-border sticky top-0" style={{ background: '#111827' }}>
          <div>
            <h2 className="text-lg font-black text-white">Оформлення замовлення</h2>
            <p className="text-xs text-gray-500 mt-0.5">{items.length} товар(ів) · {promo.total.toLocaleString('uk-UA')} ₴</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Order summary */}
          <div className="rounded-xl p-4" style={{ background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.2)' }}>
            <p className="text-xs font-black text-puff-purple uppercase tracking-widest mb-3">Ваше замовлення</p>
            <div className="flex flex-col gap-2">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-sm">
                  <span className="text-gray-400 truncate mr-2">{product.name} ×{quantity}</span>
                  <span className="text-white font-bold flex-shrink-0">{(product.price * quantity).toLocaleString('uk-UA')} ₴</span>
                </div>
              ))}
            </div>
            {(promo.secondOff > 0 || promo.giftValue > 0) && (
              <div className="flex flex-col gap-1 mt-3 pt-3 border-t border-white/10">
                {promo.secondOff > 0 && (
                  <div className="flex justify-between text-sm font-semibold text-puff-purple">
                    <span>🏷 Знижка 20% (2-й товар)</span>
                    <span>−{promo.secondOff.toLocaleString('uk-UA')} ₴</span>
                  </div>
                )}
                {promo.giftValue > 0 && (
                  <div className="flex justify-between text-sm font-semibold text-amber-400">
                    <span>🎁 4-й товар у подарунок</span>
                    <span>−{promo.giftValue.toLocaleString('uk-UA')} ₴</span>
                  </div>
                )}
              </div>
            )}
            <div className="border-t border-white/10 mt-3 pt-3 flex justify-between">
              <span className="font-bold text-gray-300">Разом:</span>
              <span className="font-black text-white text-lg">{promo.total.toLocaleString('uk-UA')} ₴</span>
            </div>
          </div>

          {/* Contact details */}
          <div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">Контактні дані</p>
            <div className="flex flex-col gap-3">
              <div>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    className={`input pl-10 ${errors.name ? 'border-red-500' : ''}`}
                    placeholder="Ім'я та прізвище"
                    value={form.name}
                    onChange={e => set('name', e.target.value)}
                  />
                </div>
                {errors.name && <p className="text-xs text-red-400 mt-1 ml-1">{errors.name}</p>}
              </div>

              <div>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    className={`input pl-10 ${errors.phone ? 'border-red-500' : ''}`}
                    placeholder="+38 (067) 000-00-00"
                    type="tel"
                    value={form.phone}
                    onChange={e => set('phone', e.target.value)}
                  />
                </div>
                {errors.phone && <p className="text-xs text-red-400 mt-1 ml-1">{errors.phone}</p>}
              </div>
            </div>
          </div>

          {/* Delivery */}
          <div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">📦 Доставка (Нова Пошта)</p>
            <div className="flex flex-col gap-3">
              <div>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-600" />
                  <input
                    className={`input pl-10 ${errors.city ? 'border-red-500' : ''}`}
                    placeholder="Місто"
                    value={form.city}
                    onChange={e => set('city', e.target.value)}
                  />
                </div>
                {errors.city && <p className="text-xs text-red-400 mt-1 ml-1">{errors.city}</p>}
              </div>

              <div>
                <input
                  className={`input ${errors.address ? 'border-red-500' : ''}`}
                  placeholder="Відділення №5 або вул. Хрещатик, 1"
                  value={form.address}
                  onChange={e => set('address', e.target.value)}
                />
                {errors.address && <p className="text-xs text-red-400 mt-1 ml-1">{errors.address}</p>}
              </div>
            </div>
          </div>

          {/* Note */}
          <div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">📝 Коментар (необов'язково)</p>
            <textarea
              className="input min-h-[72px] resize-none"
              placeholder="Побажання до замовлення..."
              value={form.note}
              onChange={e => set('note', e.target.value)}
            />
          </div>

          {/* Payment */}
          <div>
            <p className="text-xs font-black text-gray-500 uppercase tracking-widest mb-3">💳 Спосіб оплати</p>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setPayment('cod')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${payment === 'cod' ? 'border-puff-purple' : 'border-puff-border hover:border-gray-600'}`}
                style={payment === 'cod' ? { background: 'rgba(124,58,237,0.1)' } : {}}
              >
                <Banknote className={`w-5 h-5 mb-2 ${payment === 'cod' ? 'text-puff-purple' : 'text-gray-500'}`} />
                <p className={`font-bold text-sm ${payment === 'cod' ? 'text-white' : 'text-gray-400'}`}>Накладений</p>
                <p className="text-xs text-gray-600 mt-0.5">При отриманні</p>
              </button>
              <button
                onClick={() => setPayment('card')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${payment === 'card' ? 'border-puff-purple' : 'border-puff-border hover:border-gray-600'}`}
                style={payment === 'card' ? { background: 'rgba(124,58,237,0.1)' } : {}}
              >
                <CreditCard className={`w-5 h-5 mb-2 ${payment === 'card' ? 'text-puff-purple' : 'text-gray-500'}`} />
                <p className={`font-bold text-sm ${payment === 'card' ? 'text-white' : 'text-gray-400'}`}>Картою</p>
                <p className="text-xs text-gray-600 mt-0.5">Переказ</p>
              </button>
              <button
                onClick={() => setPayment('crypto')}
                className={`p-4 rounded-xl border-2 text-left transition-all ${payment === 'crypto' ? 'border-puff-purple' : 'border-puff-border hover:border-gray-600'}`}
                style={payment === 'crypto' ? { background: 'rgba(124,58,237,0.1)' } : {}}
              >
                <Bitcoin className={`w-5 h-5 mb-2 ${payment === 'crypto' ? 'text-puff-purple' : 'text-gray-500'}`} />
                <p className={`font-bold text-sm ${payment === 'crypto' ? 'text-white' : 'text-gray-400'}`}>Крипто</p>
                <p className="text-xs text-gray-600 mt-0.5">USDT</p>
              </button>
            </div>
          </div>

          {submitError && (
            <p className="text-sm text-center text-red-400 bg-red-500/10 border border-red-500/20 rounded-xl py-3 px-4">
              {submitError}
            </p>
          )}

          {/* Submit */}
          <button onClick={handleOrder} disabled={submitting} className="btn-primary w-full justify-center text-base py-4 gap-3 disabled:opacity-60">
            <Send className="w-5 h-5" />
            {submitting ? 'Оформлення...' : 'Підтвердити замовлення'}
          </button>

          <p className="text-xs text-center text-gray-600">
            Менеджер зв'яжеться з вами для підтвердження замовлення.
          </p>
        </div>
      </div>
    </div>
  )
}
