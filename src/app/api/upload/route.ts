import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const MAX_BYTES = 8 * 1024 * 1024 // 8MB

// Map allowed image mime types to safe file extensions.
const MIME_EXT: Record<string, string> = {
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp',
  'image/gif': 'gif',
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('file')

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: 'Файл не надано' }, { status: 400 })
    }

    // Validate mime type (also derives the extension — never trust the filename)
    const ext = MIME_EXT[file.type]
    if (!ext) {
      return NextResponse.json(
        { error: 'Дозволені лише зображення (JPG, PNG, WEBP, GIF)' },
        { status: 400 },
      )
    }

    // Validate size
    if (file.size > MAX_BYTES) {
      return NextResponse.json(
        { error: 'Зображення завелике (максимум 8 МБ)' },
        { status: 413 },
      )
    }

    const buffer = Buffer.from(await file.arrayBuffer())

    const uploadDir = path.join(process.cwd(), 'public', 'uploads')
    await mkdir(uploadDir, { recursive: true })

    const filename = `product_${Date.now()}_${Math.random().toString(36).slice(2, 8)}.${ext}`
    await writeFile(path.join(uploadDir, filename), buffer)

    return NextResponse.json({ url: `/uploads/${filename}` })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Не вдалося завантажити' }, { status: 500 })
  }
}
