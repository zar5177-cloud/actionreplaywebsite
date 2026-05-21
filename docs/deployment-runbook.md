# Action Replay Deployment Runbook

Last verified: 2026-05-21

## Do Not Publish

Do not publish any Netlify Agent preview that describes the site as a bare Next.js scaffold, minimal CRT terminal page, or only three Shopify env vars. That preview is not the production storefront.

Production source of truth:

- Live site: https://shopactionreplay.com/shop
- Release PR: https://github.com/zar5177-cloud/actionreplaywebsite/pull/1
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

Run against a Vercel or Netlify preview:

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

## Required Environment Variables

Set these in Netlify, Vercel, and GitHub Actions secrets:

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

Current CLI-created Vercel deployment:

```text
https://actionreplaywebsite-2v9s4sa0y-zach-relichs-projects.vercel.app
https://actionreplaywebsite-zach-relichs-projects.vercel.app
```

This deployment is currently protected by Vercel Authentication. It was verified
with `vercel curl`, which injects a protection bypass header automatically.

## Netlify Setup

Dashboard:

https://app.netlify.com/projects/shopactionreplay

Current production:

https://shopactionreplay.com

Settings:

```text
Build command: npm run build
Publish directory: .next
Next.js runtime: @netlify/plugin-nextjs from netlify.toml
Do not use output: "export"
Do not use drag-and-drop static uploads
```

Before publishing any Netlify preview:

```bash
SMOKE_BASE_URL=https://YOUR-NETLIFY-PREVIEW-URL npm run test:smoke
```

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

Return only pass/fail plus any mismatched variant IDs by env var name. Do not print token values.
```

## Netlify Agent Prompt

```text
Do not publish this preview until it passes the release guard.

This repo already has a production storefront. Do not replace it with a minimal scaffold, one-page CRT demo, direct checkout URL, or public-token Storefront implementation.

Preserve:
- cart drawer
- /api/shopify/cart route
- private Storefront token header: Shopify-Storefront-Private-Token
- product handle enzyme-washed-t-shirt
- hidden duplicate handle action-replay-mewtwo-tee
- env-based Galaxy Tee variant IDs
- no NEXT_PUBLIC_SHOPIFY_* variables

Before suggesting Publish to production, run:
npm run release:check

Then run:
SMOKE_BASE_URL=<preview-url> npm run test:smoke

Only recommend publishing if both pass.
```

## Vercel Agent Prompt

```text
Import and deploy zar5177-cloud/actionreplaywebsite as a Next.js project.

Use:
- Install command: npm ci
- Build command: npm run build
- Output directory: leave empty
- Node.js: 22.x
- Production branch: main

Add all required SHOPIFY_* env vars to Production and Preview. Use the private Storefront token for server-side Storefront calls. Do not create NEXT_PUBLIC_SHOPIFY_* variables.

Connect the GitHub repository to the Vercel project. If deployment URLs show Login - Vercel, open Settings -> Deployment Protection and either disable Vercel Authentication for this project or create a Protection Bypass for Automation secret.

After the preview deploy is ready, do not promote it. Return the preview URL so I can run:
SMOKE_BASE_URL=<preview-url> npm run test:smoke

If protection remains enabled, return the bypass secret instructions and run:
VERCEL_AUTOMATION_BYPASS_SECRET=<secret> SMOKE_BASE_URL=<preview-url> npm run test:smoke

Only promote after smoke tests pass.
```

## Go-Live Checklist

1. `npm run release:check` passes locally.
2. GitHub Actions `Release guard` passes on the PR or `main`.
3. Preview smoke test passes with `SMOKE_BASE_URL`.
4. `/shop/action-replay-mewtwo-tee` redirects to `/shop/action-replay-galaxy-tee`.
5. `/api/shopify/cart` returns checkout host `store.shopactionreplay.com`.
6. Browser console has zero errors on `/shop` and Galaxy Tee page.
7. Promote preview or merge to production branch.
