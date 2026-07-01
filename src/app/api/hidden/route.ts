import { NextRequest, NextResponse } from 'next/server'
import { readHidden, hideProduct, showProduct } from '@/lib/hidden'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET — list of hidden product ids
export async function GET() {
  const list = await readHidden()
  return NextResponse.json(list)
}

// POST — hide a product: { productId }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const productId = String(body.productId ?? '').trim()
    if (!productId) {
      return NextResponse.json({ error: 'Не вказано товар' }, { status: 400 })
    }
    const list = await hideProduct(productId)
    return NextResponse.json({ ok: true, hidden: list })
  } catch (error) {
    console.error('Failed to hide product:', error)
    return NextResponse.json({ error: 'Не вдалося приховати товар' }, { status: 500 })
  }
}

// DELETE — unhide a product: { productId }
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const productId = String(body.productId ?? '').trim()
    if (!productId) {
      return NextResponse.json({ error: 'Не вказано товар' }, { status: 400 })
    }
    const list = await showProduct(productId)
    return NextResponse.json({ ok: true, hidden: list })
  } catch (error) {
    console.error('Failed to show product:', error)
    return NextResponse.json({ error: 'Не вдалося відновити товар' }, { status: 500 })
  }
}
