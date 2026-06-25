import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'data', 'products.json')

function readProducts() {
  try {
    const raw = fs.readFileSync(DB_PATH, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return []
  }
}

function writeProducts(products: unknown[]) {
  fs.writeFileSync(DB_PATH, JSON.stringify(products, null, 2), 'utf-8')
}

// GET — all products
export async function GET() {
  const products = readProducts()
  return NextResponse.json(products)
}

// POST — add new product
export async function POST(req: NextRequest) {
  const product = await req.json()
  const products = readProducts()
  const newProduct = { ...product, id: 'p' + Date.now() }
  products.unshift(newProduct)
  writeProducts(products)
  return NextResponse.json(newProduct)
}

// PUT — update product
export async function PUT(req: NextRequest) {
  const product = await req.json()
  const products = readProducts()
  const idx = products.findIndex((p: { id: string }) => p.id === product.id)
  if (idx === -1) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  products[idx] = product
  writeProducts(products)
  return NextResponse.json(product)
}

// DELETE — delete product
export async function DELETE(req: NextRequest) {
  const { id } = await req.json()
  const products = readProducts()
  const filtered = products.filter((p: { id: string }) => p.id !== id)
  writeProducts(filtered)
  return NextResponse.json({ success: true })
}
