import type { Product } from './data'
import { readImageMap, type ImageMap } from './images'
import { readOverrideMap, type OverrideMap } from './overrides'
import { readHidden, type HiddenList } from './hidden'

const BASE_URL = process.env.CRM_BASE_URL || 'https://crm-dna.xyz'

function authHeaders(): Record<string, string> {
  const token = process.env.CRM_TOKEN
  if (!token) throw new Error('CRM_TOKEN is not configured')
  return { Authorization: `Bearer ${token}` }
}

// ── Products ──────────────────────────────────────────────
interface CrmProduct {
  id: string
  name: string
  type?: string
  characteristic?: number
  unit?: string
  priceUAH: number
  priceUSDT?: number
  stock?: number
}

function mapProduct(
  p: CrmProduct,
  images: ImageMap,
  overrides: OverrideMap,
  hidden: HiddenList,
): Product {
  const override = overrides[p.id] ?? {}
  return {
    id: p.id,
    name: p.name,
    brand: 'PUFF',
    price: p.priceUAH,
    description: override.description ?? '',
    category: override.category ?? 'disposable',
    volume: p.characteristic && p.unit ? `${p.characteristic} ${p.unit}` : undefined,
    inStock: (p.stock ?? 0) > 0,
    image: images[p.id] || '💨',
    hidden: hidden.includes(p.id),
  }
}

// includeHidden=true returns every product (with a `hidden` flag) — used by the
// admin panel. The default (false) excludes hidden products from the catalog.
export async function getCrmProducts(includeHidden = false): Promise<Product[]> {
  const [res, images, overrides, hidden] = await Promise.all([
    fetch(`${BASE_URL}/api/integrations/products`, {
      headers: authHeaders(),
      cache: 'no-store',
    }),
    readImageMap(),
    readOverrideMap(),
    readHidden(),
  ])
  if (!res.ok) {
    throw new Error(`CRM products request failed: ${res.status}`)
  }
  const data = await res.json()
  const products: CrmProduct[] = data?.products ?? []
  const mapped = products.map((p) => mapProduct(p, images, overrides, hidden))
  return includeHidden ? mapped : mapped.filter((p) => !p.hidden)
}

// ── Orders ────────────────────────────────────────────────
export interface CrmOrderPayload {
  clientName: string
  phone: string
  address: string
  note?: string
  paymentMethod: 'cod' | 'card' | 'crypto'
  items: { productId: string; quantity: number }[]
}

export async function createCrmOrder(payload: CrmOrderPayload) {
  const res = await fetch(`${BASE_URL}/api/integrations/orders`, {
    method: 'POST',
    headers: { ...authHeaders(), 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    throw new Error(`CRM order request failed: ${res.status} ${JSON.stringify(data)}`)
  }
  return data
}
