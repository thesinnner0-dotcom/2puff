---
name: Admin product overrides & client/server boundary
description: How admin-editable product metadata is stored/merged, and the Next.js fs-in-client pitfall to avoid
---

# Product metadata overrides

CRM products are read-only at the source. Admin-editable metadata is layered on top via JSON files keyed by productId, merged in `crm.ts` `getCrmProducts()` (read in parallel, applied in `mapProduct`):
- `data/images.json` → `src/lib/images.ts`
- `data/overrides.json` ({productId:{description?,category?}}) → `src/lib/overrides.ts`
- `data/hidden.json` (string[] of productIds) → `src/lib/hidden.ts`

Allowed product categories are exactly three (disposable/refill/accessory) defined in `src/lib/categories.ts`.

**Hidden products:** `getCrmProducts(includeHidden=false)` filters out hidden products by default; `/api/products?includeHidden=1` returns them all (flagged `hidden:true`) — only the admin uses that param. The storefront catalog AND product-detail page both fetch `/api/products` with no param, so a hidden product is excluded everywhere it's listed/resolved. Any NEW storefront surface that lists products must use the default (no includeHidden) or it will leak hidden items.

## Critical: keep fs-only modules out of client components
**Rule:** any module that imports `fs/promises` (or other Node-only built-ins) must NOT be imported — even just for a constant or type — by a `'use client'` component, or Next.js webpack fails with `Module not found: Can't resolve 'fs/promises'`.

**Why:** `src/app/admin/page.tsx` is a client component. It needs the category list. Putting the category constants in the same file as the fs read/write (`overrides.ts`) and importing them client-side pulled `fs/promises` into the client bundle and broke the whole admin route.

**How to apply:** put client-safe constants/types/guards in a plain module with no Node imports (`categories.ts`), have the server fs module re-export them, and import the constants in client code from the client-safe module — never from the fs module.
