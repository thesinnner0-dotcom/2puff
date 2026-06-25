'use client'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem, Product, DEMO_PRODUCTS } from './data'

// ── Cart Store ────────────────────────────────────────────
interface CartStore {
  items: CartItem[]
  addItem: (product: Product) => void
  removeItem: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clearCart: () => void
  total: () => number
  count: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const existing = get().items.find(i => i.product.id === product.id)
        if (existing) {
          set({ items: get().items.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + 1 } : i) })
        } else {
          set({ items: [...get().items, { product, quantity: 1 }] })
        }
      },
      removeItem: (id) => set({ items: get().items.filter(i => i.product.id !== id) }),
      updateQty: (id, qty) => {
        if (qty <= 0) { get().removeItem(id); return }
        set({ items: get().items.map(i => i.product.id === id ? { ...i, quantity: qty } : i) })
      },
      clearCart: () => set({ items: [] }),
      total: () => get().items.reduce((s, i) => s + i.product.price * i.quantity, 0),
      count: () => get().items.reduce((s, i) => s + i.quantity, 0),
    }),
    { name: '2puff-cart' }
  )
)

// ── Products Store (localStorage — замінити на БД) ───────
interface ProductStore {
  products: Product[]
  addProduct: (p: Product) => void
  updateProduct: (p: Product) => void
  deleteProduct: (id: string) => void
}

export const useProducts = create<ProductStore>()(
  persist(
    (set, get) => ({
      products: DEMO_PRODUCTS,
      addProduct: (p) => set({ products: [p, ...get().products] }),
      updateProduct: (p) => set({ products: get().products.map(x => x.id === p.id ? p : x) }),
      deleteProduct: (id) => set({ products: get().products.filter(x => x.id !== id) }),
    }),
    { name: '2puff-products' }
  )
)
