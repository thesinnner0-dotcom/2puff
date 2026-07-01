'use client'
import { X, Gift, Percent, Plus, ArrowRight } from 'lucide-react'

interface Props {
  tier: 'second' | 'gift'
  onClose: () => void    // proceed to checkout
  onAddMore: () => void  // go back to catalog
}

export default function UpsellModal({ tier, onClose, onAddMore }: Props) {
  const isSecond = tier === 'second'

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
      <div className="w-full max-w-md rounded-3xl overflow-hidden relative"
        style={{ background: '#111827', border: '1px solid rgba(124,58,237,0.3)' }}>

        <button onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-colors z-10">
          <X className="w-5 h-5" />
        </button>

        {/* Gradient header */}
        <div className="p-8 text-center" style={{
          background: isSecond
            ? 'linear-gradient(135deg, rgba(124,58,237,0.25), rgba(236,72,153,0.25))'
            : 'linear-gradient(135deg, rgba(245,158,11,0.25), rgba(236,72,153,0.25))'
        }}>
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4" style={{
            background: isSecond
              ? 'linear-gradient(135deg,#7C3AED,#EC4899)'
              : 'linear-gradient(135deg,#F59E0B,#F97316)'
          }}>
            {isSecond
              ? <Percent className="w-10 h-10 text-white" />
              : <Gift className="w-10 h-10 text-white" />}
          </div>
          <h2 className="text-2xl font-black text-white mb-2">
            {isSecond ? 'Зачекайте! 🎁' : 'Майже там! 🎉'}
          </h2>
          <p className="text-gray-200 leading-relaxed">
            {isSecond
              ? 'Додайте ще один товар і отримайте знижку 20% на нього!'
              : 'Додайте ще один товар — і четвертий буде у подарунок! 🎁'}
          </p>
        </div>

        {/* Actions */}
        <div className="p-6 flex flex-col gap-3">
          <button onClick={onAddMore}
            className="btn-primary w-full justify-center text-base py-3.5 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            {isSecond ? 'Обрати другий товар' : 'Додати ще товар'}
          </button>
          <button onClick={onClose}
            className="w-full py-3 rounded-xl text-sm font-semibold text-gray-400 border border-puff-border hover:border-gray-500 hover:text-white transition-all flex items-center justify-center gap-2">
            {isSecond ? 'Продовжити без знижки' : 'Оформити зараз'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}
