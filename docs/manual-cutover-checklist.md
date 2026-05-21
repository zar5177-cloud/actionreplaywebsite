# Manual Cutover Checklist

Last verified: 2026-05-21

This file is the last-mile handoff for moving Action Replay from the broken
Netlify-hosted live domain to the verified Vercel production deployment.

## Current State

Good:

- Release PR merged to `main`:
  https://github.com/zar5177-cloud/actionreplaywebsite/pull/1
- Vercel project: https://vercel.com/zach-relichs-projects/actionreplaywebsite
- Vercel production deployment:
  https://actionreplaywebsite-d858j19xc-zach-relichs-projects.vercel.app
- Vercel production deployment passed storefront smoke tests from GitHub Actions.
- Temporary public storefront URL passed smoke tests without bypass:
  https://actionreplaywebsite.vercel.app/shop
- `shopactionreplay.com` and `www.shopactionreplay.com` are attached to Vercel.
- Vercel Authentication is set to protect generated deployment URLs but exclude
  custom domains, so the public domain should be accessible after DNS cutover.
- All required `SHOPIFY_*` env vars are present in Vercel Production and Preview.
- GitHub Actions can now deploy Vercel previews and manual production releases
  without Netlify Agent.
- Netlify repo deploys are intentionally disabled by `netlify.toml` so old
  previews cannot replace the storefront.
- Local `main` tracks `origin/main`; stale local initial branch is preserved as
  `codex/local-main-pre-release-backup`.

Blocked:

- GitHub sudo-mode code is required only to finish native Vercel Git Integration.
- IONOS DNS still points public traffic to Netlify.
- Netlify currently returns `503 Site not available` for `https://shopactionreplay.com/shop`.
- Do not spend more credits on Netlify Agent. The remaining fix is DNS.

## Step 1: Optional Finish Vercel Git Integration

GitHub sent a sudo-mode verification code to:

```text
z******@psu.edu
```

After receiving the code:

1. Return to the open GitHub authorization tab.
2. Enter the code.
3. Grant Vercel access to `zar5177-cloud/actionreplaywebsite`.
4. Go back to Vercel Git settings:
   https://vercel.com/zach-relichs-projects/actionreplaywebsite/settings/git
5. Connect `zar5177-cloud/actionreplaywebsite`.
6. Run:

```bash
npm run vercel:check
```

Expected result:

```text
"ready": true
```

This step is no longer required for release. GitHub Actions can deploy through
the Vercel CLI secrets already stored on the repo.

## Step 2: Change IONOS DNS

Open IONOS DNS settings for:

```text
shopactionreplay.com
```

Remove or replace these Netlify records:

```text
A      @      75.2.60.5
CNAME  www    shopactionreplay.netlify.app
```

Add these Vercel records:

```text
A      @      76.76.21.21
A      www    76.76.21.21
```

Do not change Shopify DNS for `store.shopactionreplay.com`.

## Step 3: Watch DNS

Run:

```bash
npm run domain:watch
```

Expected final result:

```text
"ready": true
```

## Step 4: Verify Live Site

Run:

```bash
npm run release:live
```

Then run the manual GitHub workflow:

```text
GitHub -> Actions -> Live domain guard -> Run workflow
```

Both must pass.

Expected current status before DNS changes:

```text
npm run domain:check
# fails because IONOS still points @ and www to Netlify
```

## Copy/Paste: IONOS Support

```text
Please update DNS for shopactionreplay.com.

Remove/replace these old Netlify records:
- A @ 75.2.60.5
- CNAME www shopactionreplay.netlify.app

Add these Vercel records:
- A @ 76.76.21.21
- A www 76.76.21.21

Do not change store.shopactionreplay.com.
Do not change MX/email records.
```

## Copy/Paste: Vercel Support

```text
Connect Vercel project actionreplaywebsite to GitHub repo zar5177-cloud/actionreplaywebsite.

The project is already configured:
- Install Command: npm ci
- Build Command: npm run build
- Node.js: 22.x
- Output Directory: Next.js default / empty
- SHOPIFY_* env vars are present in Production and Preview
- shopactionreplay.com and www.shopactionreplay.com are attached

If repo access fails, grant the Vercel GitHub app access to zar5177-cloud/actionreplaywebsite.

Do not create NEXT_PUBLIC_SHOPIFY_* variables.
Do not promote or replace the verified deployment unless smoke tests pass.
```
