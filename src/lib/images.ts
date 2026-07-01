import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

const FILE = path.join(process.cwd(), 'data', 'images.json')

export type ImageMap = Record<string, string>

export async function readImageMap(): Promise<ImageMap> {
  try {
    const raw = await readFile(FILE, 'utf-8')
    const parsed = JSON.parse(raw)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

async function writeImageMap(map: ImageMap): Promise<void> {
  await mkdir(path.dirname(FILE), { recursive: true })
  await writeFile(FILE, JSON.stringify(map, null, 2), 'utf-8')
}

export async function setImage(productId: string, imageUrl: string): Promise<ImageMap> {
  const map = await readImageMap()
  map[productId] = imageUrl
  await writeImageMap(map)
  return map
}

export async function removeImage(productId: string): Promise<ImageMap> {
  const map = await readImageMap()
  delete map[productId]
  await writeImageMap(map)
  return map
}
