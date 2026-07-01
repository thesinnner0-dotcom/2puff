import { NextRequest, NextResponse } from 'next/server'
import { createCrmOrder, CrmOrderPayload } from '@/lib/crm'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()

    const clientName = String(body.clientName ?? '').trim()
    const phone = String(body.phone ?? '').trim()
    const address = String(body.address ?? '').trim()
    const note = body.note ? String(body.note) : undefined
    const paymentMethod = body.paymentMethod as CrmOrderPayload['paymentMethod']
    const items = Array.isArray(body.items) ? body.items : []

    if (!clientName || !phone || !address) {
      return NextResponse.json({ error: "Заповніть ім'я, телефон та адресу" }, { status: 400 })
    }
    if (!['cod', 'card', 'crypto'].includes(paymentMethod)) {
      return NextResponse.json({ error: 'Невірний спосіб оплати' }, { status: 400 })
    }
    if (items.length === 0) {
      return NextResponse.json({ error: 'Кошик порожній' }, { status: 400 })
    }

    const normalizedItems = items.map((i: { productId?: unknown; quantity?: unknown }) => ({
      productId: String(i.productId ?? '').trim(),
      quantity: Math.floor(Number(i.quantity)),
    }))
    if (normalizedItems.some((i: { productId: string; quantity: number }) => !i.productId || !Number.isFinite(i.quantity) || i.quantity < 1)) {
      return NextResponse.json({ error: 'Невірні позиції замовлення' }, { status: 400 })
    }

    const payload: CrmOrderPayload = {
      clientName,
      phone,
      address,
      note,
      paymentMethod,
      items: normalizedItems,
    }

    const result = await createCrmOrder(payload)
    return NextResponse.json({ ok: true, result })
  } catch (error) {
    console.error('Failed to create CRM order:', error)
    return NextResponse.json({ error: 'Не вдалося оформити замовлення' }, { status: 502 })
  }
}
