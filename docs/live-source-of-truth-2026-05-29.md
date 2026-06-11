# Live Source Of Truth Lock - 2026-05-29

This file records the current production/source state before any migration or
publish. Do not assume the local Next/Vercel repo is what visitors are seeing.

## Current Public Production

- Public domain: `https://shopactionreplay.com`
- Current host surface: Cloudflare fronting the Lovable/TanStack build
- Current production deployment id:
  `f57f7f28f2c0bbb4c69e661bf853813ebdf2f59f1c335db300f25bfe44e4dcbd`
- Evidence: `curl -I https://shopactionreplay.com/catalog` returns
  `x-deployment-id` above and does not return Vercel headers.

## Separate Vercel Build

- `https://actionreplaywebsite.vercel.app/shop` is a separate Next.js/Vercel
  build.
- It is not currently the public `shopactionreplay.com` production surface.
- Do not edit only this repo and expect Lovable production to change.

## Protected Local Snapshots

Two non-destructive snapshots were created before changing production:

- Lovable editor/export source:
  `/private/tmp/actionreplay-source-of-truth-20260529-191718/lovable-live-source`
- Compressed Lovable source snapshot:
  `/private/tmp/actionreplay-source-of-truth-20260529-191718/lovable-live-source.snapshot.tgz`
- Lovable source snapshot SHA-256:
  `55c5812e3ee60351043a8f581cb8b7793fba4d742438767a61c33416c142e8e7`
- Local snapshot commit:
  `f5d86148c240ba0cfe009d417f92eaf6b96eb34f`
- Current public deployed HTML/assets:
  `/private/tmp/actionreplay-source-of-truth-20260529-191718/live-public-artifact`
- Compressed public artifact snapshot:
  `/private/tmp/actionreplay-source-of-truth-20260529-191718/live-public-artifact.snapshot.tgz`
- Public artifact snapshot SHA-256:
  `67dd58a4a4d73fa70adb72bf0a447ccb34cc21e25cf012be5ab7aa4fb7fcd8b9`

Raw env files were not copied into the source snapshot. A redacted
`.env.redacted` was included instead.

## Drift Found

- Public `/auth` already contains the monthly `@actionreplay.club` member code
  flow.
- Public `/catalog` still references the old fake catalog bundle:
  `catalog-CruPc57K.js`, `ar-mock-data-G4bnsqW3.js`, and `dev-02-QIaYEBAr.js`.
- The Lovable editor/export source contains the newer Shopify-backed catalog
  code in `src/routes/catalog.tsx`.

This means the latest catalog source exists in Lovable/editor state, but the
current public deployment has not picked it up yet.

## Safe Canonical Path

1. Keep Lovable as the temporary live source until the Shopify catalog publish is
   verified.
2. Do not mutate the Next/Vercel site as if it were production.
3. Lovable GitHub sync is now active. Use the connected GitHub repo below as the
   canonical editable source.
4. Move work to branches/PRs and stop making untracked browser-editor changes
   except for emergency production repairs.

## Lovable UI Check

- Project settings -> Git -> GitHub is connected.
- Connected repository: `zar5177-cloud/clean-streetwear-redo`
- Connected branch: `main`
- Clone URL: `https://github.com/zar5177-cloud/clean-streetwear-redo.git`
- Local working remote now uses the scoped SSH alias:
  `github-actionreplay-lovable:zar5177-cloud/clean-streetwear-redo.git`
- Lovable Cloud is enabled and shows the current live app data surface:
  11 tables, 2 views, 5 signups, and the existing Shopify connector enabled.

## Local Codex Setup

- Local GitHub CLI HTTPS auth remained unreliable after device-login approval:
  `gh auth status` showed a keyring token, but `gh api` and HTTPS Git returned
  authentication failures.
- The local clone was switched to SSH instead of storing a plaintext GitHub CLI
  token.
- Dedicated SSH key:
  `/Users/zrelich/.ssh/id_ed25519_actionreplay_lovable`
- Public key title in GitHub:
  `Action Replay Lovable local key 2026-05-30`
- SSH config alias:
  `github-actionreplay-lovable`
- Canonical local clone:
  `/Users/zrelich/Desktop/actionreplay-lovable-live`
- Local clone state after setup:
  `main...origin/main`, clean worktree
- Latest synced commit after clone:
  `4ee1b2c Code edited in Lovable Code Editor`
- SSH verification:
  `ssh -T github-actionreplay-lovable` authenticates as `zar5177-cloud`
- Git remote verification:
  `git fetch --dry-run origin` passed and `git push --dry-run origin main`
  returned `Everything up-to-date`

## Verification After Git Sync

Ran from `/Users/zrelich/Desktop/actionreplay-lovable-live`:

- `npm ci` passed; 504 packages installed, 0 audit vulnerabilities.
- `npm run build` passed.
- `npm run verify:access-assets` passed.
- `npm run verify:live` passed:
  - apex and `www` resolve to the Lovable IP through 1.1.1.1 and 8.8.8.8
  - Lovable edge serves the access gate
  - Shopify API calls are server-function wrapped
  - built client bundle does not contain the Shopify Storefront token
  - Shopify products query returns 1 visible product and not the hidden duplicate

Current known issue:

- `npm run lint` fails because the Lovable-generated/editor code has widespread
  Prettier drift. This is mechanical formatting noise, not a compile failure.
  Do not mass-format it casually on `main`; handle with a separate formatting PR
  if needed.

Security/cleanup note:

- `.env` is currently tracked in the Lovable GitHub repo. It contains public
  Supabase-style keys only by key name inspection, but tracked env files are
  still poor hygiene.
- `src/lib/shopify.functions.ts` contains a hardcoded fallback Storefront token.
  Live verification confirms it is absent from the built client bundle, but it
  should be moved fully to Lovable/GitHub secrets before this source chain is
  considered clean.
