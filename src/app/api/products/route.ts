import { NextRequest, NextResponse } from 'next/server'
import { getCrmProducts } from '@/lib/crm'

export const dynamic = 'force-dynamic'

// GET — products from the CRM. ?includeHidden=1 returns hidden products too
// (for the admin panel); by default hidden products are excluded (catalog).
export async function GET(req: NextRequest) {
  try {
    const includeHidden = req.nextUrl.searchParams.get('includeHidden') === '1'
    const products = await getCrmProducts(includeHidden)
    return NextResponse.json(products)
  } catch (error) {
    console.error('Failed to load CRM products:', error)
    return NextResponse.json(
      { error: 'Не вдалося завантажити товари' },
      { status: 502 },
    )
  }
}
