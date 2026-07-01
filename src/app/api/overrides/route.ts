import { NextRequest, NextResponse } from 'next/server'
import {
  readOverrideMap,
  setOverride,
  removeOverride,
  isOverrideCategory,
  type Override,
} from '@/lib/overrides'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET — full {productId: {description, category}} mapping
export async function GET() {
  const map = await readOverrideMap()
  return NextResponse.json(map)
}

// POST — set overrides for a product: { productId, description?, category? }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const productId = String(body.productId ?? '').trim()

    if (!productId) {
      return NextResponse.json({ error: 'Не вказано товар' }, { status: 400 })
    }

    const override: Override = {}

    if (body.description !== undefined) {
      override.description = String(body.description ?? '')
    }
    if (body.category !== undefined) {
      if (!isOverrideCategory(body.category)) {
        return NextResponse.json({ error: 'Невірна категорія' }, { status: 400 })
      }
      override.category = body.category
    }

    if (override.description === undefined && override.category === undefined) {
      return NextResponse.json({ error: 'Немає даних для збереження' }, { status: 400 })
    }

    const map = await setOverride(productId, override)
    return NextResponse.json({ ok: true, overrides: map })
  } catch (error) {
    console.error('Failed to set override:', error)
    return NextResponse.json({ error: 'Не вдалося зберегти зміни' }, { status: 500 })
  }
}

// DELETE — remove all overrides for a product: { productId }
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const productId = String(body.productId ?? '').trim()
    if (!productId) {
      return NextResponse.json({ error: 'Не вказано товар' }, { status: 400 })
    }
    const map = await removeOverride(productId)
    return NextResponse.json({ ok: true, overrides: map })
  } catch (error) {
    console.error('Failed to remove override:', error)
    return NextResponse.json({ error: 'Не вдалося видалити зміни' }, { status: 500 })
  }
}
