import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

const FILE = path.join(process.cwd(), 'data', 'hidden.json')

export type HiddenList = string[]

export async function readHidden(): Promise<HiddenList> {
  try {
    const raw = await readFile(FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === 'string') : []
  } catch {
    return []
  }
}

async function writeHidden(list: HiddenList): Promise<void> {
  await mkdir(path.dirname(FILE), { recursive: true })
  await writeFile(FILE, JSON.stringify(list, null, 2), 'utf-8')
}

export async function hideProduct(productId: string): Promise<HiddenList> {
  const list = await readHidden()
  if (!list.includes(productId)) list.push(productId)
  await writeHidden(list)
  return list
}

export async function showProduct(productId: string): Promise<HiddenList> {
  const list = (await readHidden()).filter((id) => id !== productId)
  await writeHidden(list)
  return list
}
