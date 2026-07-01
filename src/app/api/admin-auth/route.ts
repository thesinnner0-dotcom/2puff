import { NextRequest, NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  if (bufA.length !== bufB.length) return false
  return timingSafeEqual(bufA, bufB)
}

export async function POST(req: NextRequest) {
  try {
    const expected = process.env.ADMIN_PASSWORD
    if (!expected) {
      return NextResponse.json({ error: 'Пароль адміністратора не налаштовано' }, { status: 500 })
    }

    const body = await req.json()
    const password = String(body.password ?? '')

    if (!password || !safeEqual(password, expected)) {
      return NextResponse.json({ error: 'Невірний пароль' }, { status: 401 })
    }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Помилка авторизації' }, { status: 400 })
  }
}
