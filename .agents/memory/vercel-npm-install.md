---
name: Vercel "npm install exited with 1"
description: Diagnosing Vercel install failures that don't reproduce with local npm
---

Vercel's install can fail ("npm install exited with 1") on unmet **required peer dependencies** even when local `npm install`/`npm ci` exit 0, because local npm auto-resolves peers more leniently.

**Why:** A package can declare peers that aren't in `package.json` (e.g. `@uppy/react@5` requires `@uppy/webcam`, `@uppy/status-bar`, `@uppy/screen-capture`). Local npm 10 silently pulls them; stricter/other npm versions treat them as ERESOLVE and exit 1.

**How to apply:**
- Check a suspect package's peers: `npm view <pkg> peerDependencies --json`.
- Before adding the missing peers, confirm whether the package is even used: `rg -l "<pkg>" --glob '!node_modules' --glob '!.next'`. If unused, remove it instead of adding more deps.
- Remove dead deps with `npm uninstall ...` (this regenerates a consistent `package-lock.json` in one step) — don't hand-edit package.json and leave the lock stale.
- Other non-dependency causes to rule out: Vercel dashboard Node version pin can override `engines` (set it to 20.x/22.x for Next 16); committed `.next/` artifacts should never be in the repo.
