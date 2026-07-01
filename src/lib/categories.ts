export const OVERRIDE_CATEGORIES = [
  { value: 'disposable', label: 'Одноразові' },
  { value: 'refill', label: 'Заправка' },
  { value: 'accessory', label: 'Аксесуари' },
] as const

export type OverrideCategory = (typeof OVERRIDE_CATEGORIES)[number]['value']

export const CATEGORY_VALUES: OverrideCategory[] = OVERRIDE_CATEGORIES.map((c) => c.value)

export function isOverrideCategory(v: unknown): v is OverrideCategory {
  return typeof v === 'string' && (CATEGORY_VALUES as string[]).includes(v)
}
