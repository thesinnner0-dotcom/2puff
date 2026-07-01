import { NextRequest, NextResponse } from 'next/server'
import { readImageMap, setImage, removeImage } from '@/lib/images'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET — full {productId: imageUrl} mapping
export async function GET() {
  const map = await readImageMap()
  return NextResponse.json(map)
}

// POST — set an image for a product: { productId, imageUrl }
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const productId = String(body.productId ?? '').trim()
    const imageUrl = String(body.imageUrl ?? '').trim()

    if (!productId) {
      return NextResponse.json({ error: 'Не вказано товар' }, { status: 400 })
    }
    // Only https URLs or local /uploads paths render via next/image
    if (!imageUrl.startsWith('https://') && !imageUrl.startsWith('/')) {
      return NextResponse.json(
        { error: 'Посилання має починатися з https:// (або бути завантаженим файлом)' },
        { status: 400 },
      )
    }

    const map = await setImage(productId, imageUrl)
    return NextResponse.json({ ok: true, images: map })
  } catch (error) {
    console.error('Failed to set image:', error)
    return NextResponse.json({ error: 'Не вдалося зберегти зображення' }, { status: 500 })
  }
}

// DELETE — remove an image mapping: { productId }
export async function DELETE(req: NextRequest) {
  try {
    const body = await req.json()
    const productId = String(body.productId ?? '').trim()
    if (!productId) {
      return NextResponse.json({ error: 'Не вказано товар' }, { status: 400 })
    }
    const map = await removeImage(productId)
    return NextResponse.json({ ok: true, images: map })
  } catch (error) {
    console.error('Failed to remove image:', error)
    return NextResponse.json({ error: 'Не вдалося видалити зображення' }, { status: 500 })
  }
}
