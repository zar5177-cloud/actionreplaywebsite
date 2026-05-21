# Action Replay Storefront + ARG Layer

Next.js + TypeScript + Tailwind site for the live Action Replay AR-001 storefront with an additive early-2000s cheat-code archive/ARG layer.

Production ecommerce stays live:

- `/shop` shows the live AR-001 Galaxy tee plus locked archive product files.
- `/shop/action-replay-galaxy-tee` is the only purchasable product page with real Shopify size/color variants.
- `/shop/ar-002-memory-card-tee` is a locked placeholder. No checkout is exposed.
- `/shop/ar-003-corrupted-promo-poster` is a hidden archive placeholder. No checkout is exposed.
- The cart drawer posts to `/api/shopify/cart` for AR-001 only and opens a Shopify checkout URL.
- `/shop/action-replay-mewtwo-tee` redirects to `/shop/action-replay-galaxy-tee`.

The ARG features are additive and do not replace checkout.

## Routes

- `/` - live product hero plus additive boot sequence, hidden code console, archive previews, and local signup
- `/shop` - recovered product access mirror for AR-001 plus locked product artifacts
- `/shop/[slug]` - product file pages; checkout only appears for AR-001
- `/archive` - recovered file grid with detail modal
- `/hidden-event` - secret event page with hidden clickable SHINY code pixel
- `/forum` - old-web archived thread
- `/corrupted-file` - gated page unlocked by `MEMORYCARD`
- `/manifesto` - gated brand manifesto unlocked by `DONTCHEAT`

## Main File Structure

```text
src/app/
  page.tsx
  shop/page.tsx
  shop/[slug]/page.tsx
  shop/action-replay-mewtwo-tee/page.tsx
  api/shopify/cart/route.ts
  archive/page.tsx
  hidden-event/page.tsx
  forum/page.tsx
  corrupted-file/page.tsx
  manifesto/page.tsx
  layout.tsx
  globals.css
  sitemap.ts
  robots.ts

src/components/
  site-shell.tsx
  cart-context.tsx
  product-card.tsx
  product-detail-actions.tsx
  shop-experience.tsx
  floating-drop-showcase.tsx
  hero-section.tsx
  live-shop-grid.tsx
  arg/archive-grid.tsx
  arg/boot-sequence.tsx
  arg/event-code-hunt.tsx
  arg/forum-thread.tsx
  arg/secret-code-console.tsx
  arg/system-log-list.tsx
  arg/unlock-alert-signup.tsx
  arg/unlocked-gate.tsx

src/data/config/
  archive-files.ts
  brand.ts
  cheat-codes.ts
  event.ts
  forum-posts.ts
  manifesto.ts

src/lib/
  brand-data.ts
  catalog.ts
  shopify.ts
  shopify-galaxy-tee.ts
```

## Edit Points

- Live product presentation and fallback variants: `src/lib/brand-data.ts`
- Shopify product fetching/mapping: `src/lib/catalog.ts` and `src/lib/shopify.ts`
- AR-001 Shopify variant IDs and direct cart mirror URLs: `src/lib/shopify-galaxy-tee.ts`
- Cart checkout route: `src/app/api/shopify/cart/route.ts`
- Archive cards: `src/data/config/archive-files.ts`
- Cheat codes and unlock destinations: `src/data/config/cheat-codes.ts`
- Forum thread copy: `src/data/config/forum-posts.ts`
- Hidden event text/logs/revealed code: `src/data/config/event.ts`
- Brand slogans, nav labels, boot lines: `src/data/config/brand.ts`
- Hidden manifesto copy: `src/data/config/manifesto.ts`
- Visual system: `src/app/globals.css`

## Local Setup

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Useful checks:

```bash
npm run lint
npm run build
```

## Unlock Codes

- `SHINY50` - shows `rare encounter successful. 50% event found.`
- `RUNIT` - shows `comment #RUNIT + #CHEATTHEGAME to activate entry.`
- `MEMORYCARD` - unlocks `/corrupted-file`
- `DONTCHEAT` - unlocks `/manifesto`

Unlocked codes and signup submissions are stored in `localStorage` only.

## Deployment

Deploy through the existing hosting project only after a manual review. This work should not be pushed to production automatically.

Vercel defaults:

1. Build command: `npm run build`
2. Install command: `npm ci`
3. Output directory: Vercel default for Next.js
4. Domain: production storefront domain

Netlify config is in `netlify.toml`:

1. Build command: `npm run build`
2. Publish directory: `.next`
3. Next.js adapter: `@netlify/plugin-nextjs`
4. Production deploys should remain manual until storefront checkout is reverified.

## Shopify Notes

Checkout is wired through the cart drawer and `/api/shopify/cart`. The API accepts AR-001 Galaxy tee size/color selections, verifies the Storefront variant when a token is present, creates a Shopify cart, and refuses every other product slug as a locked archive file.

Required server-only Shopify environment variables live in `.env.example` and
`docs/deployment-runbook.md`. Do not create `NEXT_PUBLIC_SHOPIFY_*` variables;
the storefront talks to Shopify through server components and API routes only.

Never expose Shopify Admin or Storefront tokens to client React. If AR-001
variants change, update the `SHOPIFY_GALAXY_TEE_VARIANT_BLACK_*` and
`SHOPIFY_GALAXY_TEE_VARIANT_WHITE_*` environment variables and keep the locked
file states in `src/lib/brand-data.ts` intact unless the archive mirror actually
opens.
