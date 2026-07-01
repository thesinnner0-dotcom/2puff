---
name: CRM is the product/order source of truth
description: Catalog and orders flow through crm-dna.xyz; admin is image-mapping only
---

The product catalog and order placement are driven by the external CRM (crm-dna.xyz),
not by local `data/products.json`.

- `src/lib/crm.ts` is the only place the CRM Bearer token (`process.env.CRM_TOKEN`) is
  used; it must stay server-side (imported only by `/api/products` and `/api/orders`).
- `GET /api/products` proxies CRM products. CRM gives no images, so each product's image
  is looked up in a local map (`data/images.json`, `{productId: imageUrl}`) and falls back
  to an emoji; brand is hardcoded "PUFF".
- Checkout posts to `/api/orders`, which forwards to the CRM with paymentMethod cod/card/crypto.
  Orders carry no images.

**Why:** User chose the CRM as the single source of truth for inventory and orders,
but the CRM has no image support, so images are managed locally and merged in.
**How to apply:** Do NOT reintroduce local-JSON product CRUD for the storefront. The admin
panel (`/admin`) is retained ONLY for mapping images to CRM products (upload or paste an
https URL). Product data itself is managed in the CRM.

**Open risk (not yet addressed):** `/admin` and `/api/images` (and `/api/upload`) are
unauthenticated — pre-existing, applies to the whole admin. Add an auth guard before
publishing publicly.
