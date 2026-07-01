import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'
import type { OverrideCategory } from './categories'

export {
  OVERRIDE_CATEGORIES,
  CATEGORY_VALUES,
  isOverrideCategory,
  type OverrideCategory,
} from './categories'

const FILE = path.join(process.cwd(), 'data', 'overrides.json')

export interface Override {
  description?: string
  category?: OverrideCategory
}

export type OverrideMap = Record<string, Override>

export async function readOverrideMap(): Promise<OverrideMap> {
  try {
    const raw = await readFile(FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

async function writeOverrideMap(map: OverrideMap): Promise<void> {
  await mkdir(path.dirname(FILE), { recursive: true })
  await writeFile(FILE, JSON.stringify(map, null, 2), 'utf-8')
}

export async function setOverride(productId: string, override: Override): Promise<OverrideMap> {
  const map = await readOverrideMap()
  const next: Override = { ...map[productId] }

  if (override.description !== undefined) {
    const desc = override.description.trim()
    if (desc) next.description = desc
    else delete next.description
  }
  if (override.category !== undefined) {
    next.category = override.category
  }

  if (next.description === undefined && next.category === undefined) {
    delete map[productId]
  } else {
    map[productId] = next
  }
  await writeOverrideMap(map)
  return map
}

export async function removeOverride(productId: string): Promise<OverrideMap> {
  const map = await readOverrideMap()
  delete map[productId]
  await writeOverrideMap(map)
  return map
}
