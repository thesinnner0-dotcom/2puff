---
name: Cart promo / upsell rules (2PUFF)
description: How the cart discount + upsell-popup logic is intended to behave
---

# Cart promo rules
`computePromo` in `src/lib/data.ts` is the single source of truth for discounts. Both the cart summary, OrderModal display, and the Telegram order message must use it (never recompute totals independently).

- **20% off the 2nd product**: applies when cart has >= 2 units.
- **4th product free**: applies when cart has >= 4 units (buy 3 get 1 free).

**Why cheapest-unit based:** discounts/gift are applied to the *cheapest* unit(s), not the literal positional 2nd/4th item. This is the standard fair retail interpretation and protects shop margin. Customer-facing labels say "2-й товар"/"4-й товар у подарунок" (conventional marketing copy) even though arithmetic targets the cheapest unit.

**Checkout gating** (`src/app/cart/page.tsx` handleCheckout): count===1 → UpsellModal tier 'second'; count 2 or 3 → tier 'gift'; count>=4 → straight to OrderModal. The popup is the gate — user can proceed ("continue") or go add more ("/#catalog").
