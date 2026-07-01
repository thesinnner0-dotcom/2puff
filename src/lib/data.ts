export interface Product {
  id: string
  name: string
  brand: string
  price: number
  oldPrice?: number
  description: string
  category: 'disposable' | 'pod' | 'mod' | 'liquid' | 'accessory' | 'refill'
  nicotine?: string
  puffs?: number
  volume?: string
  flavor?: string
  inStock: boolean
  image: string       // URL або emoji
  badge?: 'hot' | 'new' | 'sale'
  hidden?: boolean    // приховано з каталогу (керується в адмінці)
}

export interface CartItem {
  product: Product
  quantity: number
}

// ── Promo / upsell logic ──────────────────────────────────
// Rule 1: 20% off the 2nd product (when 2+ units in cart)
// Rule 2: buy 3 → 4th product free (when 4+ units in cart)
export interface PromoResult {
  subtotal: number
  secondOff: number   // 20% discount value on the 2nd product
  giftValue: number   // value of the free 4th product
  discount: number
  total: number
  units: number
}

export function computePromo(items: CartItem[]): PromoResult {
  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0)

  // expand into individual units, cheapest first
  const unitPrices: number[] = []
  items.forEach(i => {
    for (let k = 0; k < i.quantity; k++) unitPrices.push(i.product.price)
  })
  unitPrices.sort((a, b) => a - b)
  const units = unitPrices.length

  let giftValue = 0
  let secondOff = 0

  if (units >= 4) {
    giftValue = unitPrices[0]                      // cheapest unit is free
  }
  if (units >= 2) {
    const idx = units >= 4 ? 1 : 0                 // discount next cheapest after any gift
    secondOff = Math.round(unitPrices[idx] * 0.2)  // 20% off the 2nd product
  }

  const discount = giftValue + secondOff
  const total = Math.max(0, subtotal - discount)
  return { subtotal, secondOff, giftValue, discount, total, units }
}

// ── Telegram ──────────────────────────────────────────────
export const TELEGRAM_USERNAME = 'your_username' // ← змінити на свій

export function buildTelegramUrl(items: CartItem[]): string {
  const lines = items.map(
    ({ product, quantity }) =>
      `• ${product.brand} ${product.name} × ${quantity} = ${product.price * quantity} ₴`
  )
  const total = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const text = encodeURIComponent(
    `🛒 Замовлення 2PUFF\n\n${lines.join('\n')}\n\n💰 Разом: ${total} ₴\n\n` +
    `Ваше ім'я:\nТелефон:\nМісто + відділення НП:`
  )
  return `https://t.me/${TELEGRAM_USERNAME}?text=${text}`
}

// ── Categories ────────────────────────────────────────────
export const CATEGORIES = [
  { id: 'all',       label: 'Всі товари',   emoji: '🛍️' },
  { id: 'disposable',label: 'Одноразові',   emoji: '💨' },
  { id: 'pod',       label: 'Pod-системи',  emoji: '⚡' },
  { id: 'mod',       label: 'Моди',         emoji: '🔥' },
  { id: 'liquid',    label: 'Рідини',       emoji: '🧪' },
  { id: 'accessory', label: 'Аксесуари',    emoji: '🔩' },
]

// ── Demo products (замінити на свої через Admin) ──────────
export const DEMO_PRODUCTS: Product[] = [
  {
    id: 'demo1',
    name: 'BC5000 Watermelon Ice',
    brand: 'ELFBAR',
    price: 599,
    oldPrice: 749,
    description: 'Одноразовий вейп з 5000 затяжками. Смак кавуна з льодом.',
    category: 'disposable',
    nicotine: '5%',
    puffs: 5000,
    flavor: 'Кавун + Лід',
    inStock: true,
    image: '🍉',
    badge: 'hot',
  },
  {
    id: 'demo2',
    name: 'BM5000 Mango Peach',
    brand: 'LOST MARY',
    price: 649,
    description: 'Тропічний смак манго та персика. 5000 затяжок.',
    category: 'disposable',
    nicotine: '5%',
    puffs: 5000,
    flavor: 'Манго + Персик',
    inStock: true,
    image: '🥭',
    badge: 'new',
  },
  {
    id: 'demo3',
    name: 'XROS 3',
    brand: 'VAPORESSO',
    price: 1199,
    oldPrice: 1399,
    description: 'Елегантна pod-система з автозатяжкою. 1000mAh.',
    category: 'pod',
    inStock: true,
    image: '✨',
    badge: 'sale',
  },
  {
    id: 'demo4',
    name: 'Aegis X 200W',
    brand: 'GEEK VAPE',
    price: 2499,
    description: 'Захищений мод IP67. До 200W потужності.',
    category: 'mod',
    inStock: true,
    image: '⚡',
    badge: 'new',
  },
  {
    id: 'demo5',
    name: 'Mango Ice Salt 30мл',
    brand: 'ICED',
    price: 249,
    description: 'Salt-рідина манго+лід. 25мг нікотину.',
    category: 'liquid',
    nicotine: '25мг',
    volume: '30мл',
    inStock: true,
    image: '🧊',
  },
  {
    id: 'demo6',
    name: 'Drag X Plus 100W',
    brand: 'VOOPOO',
    price: 1899,
    description: 'Pod-мод GENE.TT. 100W, Type-C зарядка.',
    category: 'mod',
    inStock: true,
    image: '🔥',
  },
]
