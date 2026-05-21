# Action Replay Deployment Runbook

Last verified: 2026-05-21

## Do Not Publish

Do not publish any Netlify Agent preview that describes the site as a bare Next.js scaffold, minimal CRT terminal page, or only three Shopify env vars. That preview is not the production storefront.

Production source of truth:

- Live site: https://shopactionreplay.com/shop
- Temporary verified Vercel alias until DNS cutover:
  https://actionreplaywebsite.vercel.app/shop
- Merged release PR: https://github.com/zar5177-cloud/actionreplaywebsite/pull/1
- Shopify product handle: `enzyme-washed-t-shirt`
- Duplicate handle that must stay hidden: `action-replay-mewtwo-tee`
- Checkout path: app cart drawer -> `/api/shopify/cart` -> Shopify `checkoutUrl`

## Required Release Checks

Run this before pushing, merging, or promoting a preview:

```bash
npm run release:check
```

Run against current production:

```bash
npm run test:smoke:prod
```

Run against the temporary public Vercel alias:

```bash
npm run test:smoke:vercel
```

Run against a Vercel preview:

```bash
SMOKE_BASE_URL=https://YOUR-PREVIEW-URL npm run test:smoke
```

The release guard checks:

- lint
- Next.js production build
- no `NEXT_PUBLIC_SHOPIFY_*` usage in source
- no public Storefront token header in server source
- no direct client-built Shopify cart checkout URL
- Shopify Storefront API product visibility
- hidden duplicate product
- local browser smoke tests
- live cart API creates a Shopify checkout URL
- live tee + poster cart receives the Shopify 15% full-cart pair credit
- live Shopify checkout page opens with the tee, poster, $13.50 credit, and $76.50 total

## Required Environment Variables

Set these in Vercel Production, Vercel Preview, and GitHub Actions secrets.
Do not create public `NEXT_PUBLIC_SHOPIFY_*` copies.

GitHub Actions secrets were set for `zar5177-cloud/actionreplaywebsite` on
2026-05-21. If the repo is recreated or transferred, set them again.

```env
SHOPIFY_STORE_DOMAIN
SHOPIFY_ADMIN_API_VERSION
SHOPIFY_CLIENT_ID
SHOPIFY_CLIENT_SECRET
SHOPIFY_STOREFRONT_ACCESS_TOKEN
SHOPIFY_PRIVATE_STOREFRONT_ACCESS_TOKEN
SHOPIFY_GALAXY_TEE_VARIANT_BLACK_S
SHOPIFY_GALAXY_TEE_VARIANT_BLACK_M
SHOPIFY_GALAXY_TEE_VARIANT_BLACK_L
SHOPIFY_GALAXY_TEE_VARIANT_BLACK_XL
SHOPIFY_GALAXY_TEE_VARIANT_BLACK_XXL
SHOPIFY_GALAXY_TEE_VARIANT_WHITE_S
SHOPIFY_GALAXY_TEE_VARIANT_WHITE_M
SHOPIFY_GALAXY_TEE_VARIANT_WHITE_L
SHOPIFY_GALAXY_TEE_VARIANT_WHITE_XL
SHOPIFY_GALAXY_TEE_VARIANT_WHITE_XXL
SHOPIFY_PROMO_POSTER_VARIANT_24X36
SHOPIFY_TEE_POSTER_DISCOUNT_CODE
```

GitHub Actions also has these Vercel deployment secrets:

```env
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
VERCEL_AUTOMATION_BYPASS_SECRET
```

## Vercel Setup

Dashboard link:

https://vercel.com/zach-relichs-projects/actionreplaywebsite

Git integration settings:

https://vercel.com/zach-relichs-projects/actionreplaywebsite/settings/git

Deployment protection settings:

https://vercel.com/zach-relichs-projects/actionreplaywebsite/settings/deployment-protection

Import the GitHub repo:

```text
zar5177-cloud/actionreplaywebsite
```

Project settings:

```text
Framework Preset: Next.js
Build Command: npm run build
Install Command: npm ci
Output Directory: leave empty
Node.js Version: 22.x
Production Branch: main
```

Current Vercel state, verified 2026-05-21:

- Project settings are configured for Next.js, `npm ci`, `npm run build`, default output, Node 22.x.
- All required `SHOPIFY_*` variables are synced to Production. Existing
  Shopify product credentials are mirrored to Preview; if a branch preview must
  verify the pair discount, add `SHOPIFY_TEE_POSTER_DISCOUNT_CODE=REPLAY15` to
  that preview branch too.
- Deployment Protection has automation bypass entries.
- `shopactionreplay.com` and `www.shopactionreplay.com` are added to the Vercel project.
- Current Vercel production deployment is ready and smoke-tested:
  `https://actionreplaywebsite-11hb6oee7-zach-relichs-projects.vercel.app`
- Stable public Vercel alias is ready and smoke-tested:
  `https://actionreplaywebsite.vercel.app/shop`
- Release PR #1 is merged to `main`; the `main` Release guard passed.
- GitHub Actions can deploy Vercel previews and manual production releases
  through Vercel CLI secrets.
- Vercel Git Integration is connected. GitHub Actions Vercel CLI deploys remain
  the controlled release path for manual production pushes.
- Public DNS points to Vercel. Apex and `www` both resolve to `76.76.21.21`.
- Live checkout verification currently proves the one-click tee + poster
  `addPair` route, server-applied `REPLAY15`, Shopify checkout handoff, and
  $13.50 full-cart pair credit.

## GitHub Actions Vercel CLI Deploys

PR previews:

```text
Actions -> Vercel CLI preview
```

This deploys a Vercel preview with `npx vercel@latest`, smoke-tests it with
Playwright, and comments on the PR after the smoke test passes.

The workflow passes `SHOPIFY_*` from GitHub Actions secrets into `vercel build`.
Do not remove that env block. Vercel sensitive env vars are available at runtime
but are intentionally not recoverable through `vercel env pull`, so CI prebuilt
builds need the GitHub secret values at build time for static product pages.

Manual production:

```text
Actions -> Vercel production deploy -> Run workflow
confirmation: DEPLOY ACTION REPLAY
```

This only runs on `main`. It runs `npm run release:check`, deploys with
`vercel deploy --prebuilt --archive=tgz --prod`, then smoke-tests the resulting
Vercel production URL. It does not depend on Netlify Agent or the Vercel GitHub
App.

The archive flag is intentional. It compresses prebuilt output before upload,
reducing the number of upload calls and avoiding Vercel CLI upload rate limits.

Repeat the Vercel settings/env sync any time `.env.local` changes:

```bash
npm run vercel:sync-shopify-env
```

Check Vercel project readiness without mutating settings:

```bash
npm run vercel:check
```

Current expected result:

```text
ready: true
warnings:
- Vercel Authentication protects generated deployment URLs only; custom domains remain public after DNS cutover.
```

This means raw generated deployment URLs such as
`https://actionreplaywebsite-*.vercel.app` may show a Vercel login page without
the automation bypass header. That is acceptable. The public storefront is the
custom domain after DNS points to Vercel.

IONOS DNS cutover:

```text
Registrar: IONOS
Nameservers: ns1018.ui-dns.de, ns1051.ui-dns.com, ns1110.ui-dns.biz, ns1116.ui-dns.org

Replace the current Netlify records with:

A      @      76.76.21.21
A      www    76.76.21.21
```

Current bad records to remove/replace:

```text
A      @      75.2.60.5
CNAME  www    shopactionreplay.netlify.app
```

After DNS propagates:

```bash
dig +short shopactionreplay.com A
dig +short www.shopactionreplay.com A
npm run domain:check
npm run test:smoke:prod
```

Expected DNS answer:

```text
76.76.21.21
```

To keep checking until DNS flips:

```bash
npm run domain:watch
```

To wait for DNS and then run the complete go-live verifier automatically:

```bash
npm run go-live:watch
```

One-command go-live verification after DNS flips:

```bash
npm run go-live:check
```

The same live-domain gate can be run from GitHub Actions:

```text
Actions -> Live domain guard -> Run workflow
```

That workflow runs `npm run live-domain:check`, including live DNS, production
smoke tests, and the Shopify checkout handoff page check. It intentionally does
not require a Vercel API token, so scheduled monitoring does not go blind when a
deployment token expires. Use local `npm run go-live:check` when you also need
Vercel project-readiness validation.

The same workflow also runs automatically twice per hour and preserves the live
Shopify checkout screenshot artifact when the check runs.

Current post-cutover status, verified 2026-05-21:

```text
npm run domain:check
# passes: shopactionreplay.com and www.shopactionreplay.com resolve to 76.76.21.21
npm run go-live:check
# passes: production smoke tests and live Shopify checkout handoff are green
```

After the first preview deployment, test it:

```bash
SMOKE_BASE_URL=https://YOUR-VERCEL-PREVIEW-URL npm run test:smoke
```

If the Vercel URL shows `Login - Vercel`, Deployment Protection is enabled.
Either disable Vercel Authentication for this project or create a Protection
Bypass for Automation secret, then run:

```bash
VERCEL_AUTOMATION_BYPASS_SECRET=YOUR_BYPASS_SECRET SMOKE_BASE_URL=https://YOUR-VERCEL-PREVIEW-URL npm run test:smoke
```

Only move the domain after the preview passes.

Older CLI-created Vercel preview kept for audit history:

```text
https://actionreplaywebsite-2v9s4sa0y-zach-relichs-projects.vercel.app
https://actionreplaywebsite-zach-relichs-projects.vercel.app
```

Use the current production deployment listed above for go-live checks.

## Netlify Retirement Guard

Netlify is no longer an approved deploy target for Action Replay. The old
Netlify project may remain visible for audit/history, but it must not publish
preview agent output to production.

`netlify.toml` intentionally fails the build with a short message. This is a
guardrail, not a broken config. Production deploys now happen through:

```text
GitHub Actions -> Vercel production deploy
```

If someone asks for a Netlify publish, refuse the publish and send them to the
IONOS DNS cutover section instead.

## Shopify Verification Prompt

```text
Verify the Action Replay storefront product setup.

Do not touch product handle enzyme-washed-t-shirt.

Confirm:
1. product(handle: "enzyme-washed-t-shirt") is visible to the Storefront API.
2. It has exactly 10 available variants.
3. Colorways are Retro Black and White.
4. Sizes are S, M, L, XL, and 2XL.
5. Each variant GID matches the deployment env vars named SHOPIFY_GALAXY_TEE_VARIANT_BLACK_* and SHOPIFY_GALAXY_TEE_VARIANT_WHITE_*.
6. product(handle: "action-replay-mewtwo-tee") returns null from the Storefront API.
7. action-replay-mewtwo-tee is unpublished from Headless/Storefront and archived.
8. product(handle: "action-replay-2026-promo-poster") is visible to the Storefront API.
9. Its 24 x 36 variant matches SHOPIFY_PROMO_POSTER_VARIANT_24X36 and is available for sale.
10. A cart containing one Retro Black / S Galaxy tee and one 24 x 36 promo poster totals $76.50 from a $90.00 line subtotal, reflecting the Shopify 15% full-cart pair credit.

Return only pass/fail plus any mismatched variant IDs by env var name. Do not print token values.
```

## Retired Netlify Agent Prompt

```text
Do not use Netlify Agent for Action Replay. Do not publish this preview.

This repo already has a Vercel-backed production storefront. Do not replace it
with a minimal scaffold, one-page CRT demo, direct checkout URL, or public-token
Storefront implementation.

Preserve:
- cart drawer
- /api/shopify/cart route
- private Storefront token header: Shopify-Storefront-Private-Token
- product handle enzyme-washed-t-shirt
- hidden duplicate handle action-replay-mewtwo-tee
- env-based Galaxy Tee variant IDs
- no NEXT_PUBLIC_SHOPIFY_* variables

Before suggesting any deployment, run:
npm run release:check

Then run:
SMOKE_BASE_URL=<vercel-preview-url> npm run test:smoke

Only use the GitHub Actions -> Vercel production deploy workflow after both
pass. Never publish from Netlify.
```

## Vercel Agent Prompt

```text
Connect Vercel project actionreplaywebsite to GitHub repo zar5177-cloud/actionreplaywebsite.

Already configured:
- Install Command: npm ci
- Build Command: npm run build
- Output Directory: empty / Next.js default
- Node.js: 22.x
- SHOPIFY_* variables are present in Production, including
  SHOPIFY_TEE_POSTER_DISCOUNT_CODE=REPLAY15
- Protection Bypass for Automation exists

- Production branch: main

Do not create NEXT_PUBLIC_SHOPIFY_* variables.
Do not create SHOPIFY_API_VERSION or SHOPIFY_ADMIN_CLIENT_* variables.
Do not change the Shopify product handle enzyme-washed-t-shirt.

Connect the GitHub repository to the existing Vercel project. If Vercel says it lacks access, grant the Vercel GitHub app access to zar5177-cloud/actionreplaywebsite and retry.

After the preview deploy is ready, do not promote it. Return the preview URL so I can run:
SMOKE_BASE_URL=<preview-url> npm run test:smoke

If protection remains enabled, return the bypass secret instructions and run:
VERCEL_AUTOMATION_BYPASS_SECRET=<secret> SMOKE_BASE_URL=<preview-url> npm run test:smoke

Only promote after smoke tests pass.
```

## Go-Live Checklist

1. `npm run release:check` passes locally.
2. GitHub Actions `Release guard` passes on the PR or `main`.
3. `npm run vercel:check` passes. Native Vercel Git Integration is connected, but GitHub Actions Vercel CLI deploys remain the controlled release path.
4. Vercel production deployment smoke test passes with `SMOKE_BASE_URL` and the automation bypass header.
5. DNS at IONOS points `shopactionreplay.com` and `www.shopactionreplay.com` to `76.76.21.21`.
6. `npm run go-live:check` passes after DNS propagation.
7. `npm run test:smoke:prod` passes after DNS propagation if run separately.
8. GitHub Actions `Live domain guard` passes.
9. `/shop/action-replay-mewtwo-tee` redirects to `/shop/action-replay-galaxy-tee`.
10. `/api/shopify/cart` returns checkout host `store.shopactionreplay.com`.
11. Browser console has zero errors on `/shop` and Galaxy Tee page.
