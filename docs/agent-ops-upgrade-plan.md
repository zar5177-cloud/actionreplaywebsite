# Action Replay Agent Ops Upgrade Plan

Last researched: 2026-05-21

This is the operating plan for moving Action Replay away from expensive,
state-losing deployment agents and into a real storefront production system.

## Brutal Diagnosis

The site works because the repo now has specific checks, not because the agent
stack is good enough. The current weak points are:

- Netlify Agent is the wrong execution surface. It re-discovers state, burns
  credits, invents env names, and can produce deploy previews that are not the
  source of truth.
- Shopify Admin access is under-scoped for a full commerce operator. The current
  app can read/write products, inventory, orders, draft orders, and customers,
  but it cannot manage discounts or publications through Admin API yet.
- Shopify schema validation was not available inside this running Codex session.
  The official Shopify AI Toolkit/Dev MCP is now configured for future Codex
  sessions, but this session must be restarted before it becomes callable.
- The release system is good but not locked. GitHub `main` currently has no
  branch protection, so a bad direct push can bypass the release guard.
- The Vercel workflow was missing `SHOPIFY_TEE_POSTER_DISCOUNT_CODE` in the
  preview/production deploy job env blocks. Runtime Vercel env can still save
  the live site, but CI should not rely on that accident.
- The discount is correct for the live site path, but not yet a custom Shopify
  Function. A normal code discount can be used outside the intended tee + poster
  pair if someone knows the code and meets the rule. If strict pair-only discount
  logic matters, build a Shopify Discount Function.
- Secrets have been shown in chats/screenshots. Treat every Shopify client secret
  and Storefront token as exposed and rotate them before scaling traffic.

## Target Stack

- Source truth: GitHub repo `zar5177-cloud/actionreplaywebsite`
- Runtime: Vercel, Next.js SSR, Node 22
- Commerce truth: Shopify Admin + Storefront APIs, API version `2026-04`
- Implementation agent: local Codex or local Claude Code, never Netlify Agent
- Store/API specialist: Shopify AI Toolkit plus Dev MCP
- Release specialist: GitHub Actions + Vercel CLI
- Verification specialist: Playwright + live Shopify checkout checks
- Monitoring specialist: Vercel logs/analytics plus an uptime checker
- Brand/archive specialist: local agents constrained by `AGENTS.md`

## Required Agent Connections

### 1. Shopify Operator

Install Shopify AI Toolkit/Dev MCP for schema and docs validation.

Codex config:

```toml
[mcp_servers.shopify-dev-mcp]
command = "npx"
args = ["-y", "@shopify/dev-mcp@latest"]
```

Installed locally in `/Users/zrelich/.codex/config.toml` on 2026-05-21.
Restart Codex for the new MCP server to become callable in future sessions.

Claude Code:

```bash
claude mcp add --transport stdio shopify-dev-mcp -- npx -y @shopify/dev-mcp@latest
```

Use this agent for:

- validating Admin and Storefront GraphQL queries against `2026-04`
- checking mutations before code is written
- building a future Shopify Discount Function
- querying products, publications, variants, inventory, and discounts

### 2. Shopify Admin Permissions

Required scopes for the full operator:

```text
read_products
write_products
read_inventory
write_inventory
read_orders
write_orders
read_draft_orders
write_draft_orders
read_customers
read_discounts
write_discounts
read_publications
write_publications
```

Current audit command:

```bash
npm run shopify:scopes
```

As of this audit, missing scopes are:

```text
read_discounts
write_discounts
read_publications
write_publications
```

### 3. Release Operator

Keep Vercel deployment under GitHub Actions control:

```bash
npm run release:check
npm run go-live:check
```

Use Vercel CLI through `npx vercel@latest`, not a required global binary.
Production must stay manual with typed confirmation.

### 4. GitHub Protection

Branch protection is now enabled for `main`:

```text
Required status check: storefront-smoke
Require branches up to date: on
Block force pushes: on
Block deletions: on
Admin bypass: on for emergency launch week
Required human review: off until there is a real second reviewer
```

Do not require human review yet if the user is the only available maintainer.
That would improve process but could block emergency fixes.

### 5. Observability

Minimum:

- Vercel Runtime Logs
- Vercel Web Analytics
- Vercel Speed Insights
- scheduled GitHub `Live domain guard` in passive mode only, so monitoring does
  not create abandoned Shopify checkouts
- checkout screenshot artifact on manual full-check failures

Better:

- Sentry for Next.js server/client errors
- Better Stack or Checkly uptime checks for `/shop` and `/api/shopify/cart`
- alert route for failed Shopify cart creation
- Shopify webhooks for `orders/create`, `products/update`,
  `inventory_levels/update`, and `app/uninstalled`

### 6. Social / Archive Operator Room

The repo now has committed-safe operator templates under `ops/`:

- `ops/access/access-control-runbook.md`
- `ops/access/agent-operating-model.md`
- `ops/access/accounts.inventory.template.json`
- `ops/social/meta-instagram-onboarding.md`
- `ops/social/account-onboarding-matrix.md`
- `ops/social/asap-manual-setup.md`
- `ops/social/daily-command-center.md`
- `ops/social/model-member-access-protocol.md`
- `ops/social/operator-queue.example.json`
- `ops/social/operator-queue.schema.json`

These files are intentionally not credential stores. They define vault
references, human approval states, platform-safe drafting boundaries, and the
manual Meta/Instagram setup path.

## Implementation Phases

### Phase 0: Stop Waste

- Do not publish Netlify previews.
- Do not ask Netlify Agent to diagnose or build this repo.
- Keep Netlify config only as a retired-platform guard.

### Phase 1: Rotate And Re-Grant

Manual Shopify work:

1. Rotate the Shopify client secret.
2. Rotate Storefront public/private access tokens.
3. Add missing Admin scopes:
   `read_discounts`, `write_discounts`, `read_publications`,
   `write_publications`.
4. Reinstall or approve the updated app permissions.
5. Update Vercel Production, Vercel Preview, GitHub Actions secrets, and
   `.env.local`.
6. Run:

```bash
npm run shopify:scopes
npm run release:check
npm run go-live:check
```

### Phase 2: Lock The Release Path

- Add GitHub branch protection/ruleset for `main`.
- Require the `storefront-smoke` job before merge.
- Keep manual production deploy workflow.
- Keep scheduled live-domain guard.

### Phase 3: Shopify Schema Discipline

- Install Shopify Dev MCP.
- Add a repo rule: every new Shopify GraphQL query must be validated with MCP or
  generated from the `2026-04` schema before commit.
- Add generated GraphQL types later if Shopify query surface grows beyond the
  current cart/product boundary.

### Phase 4: Strict Pair Discount

Current live behavior is correct for Action Replay UI checkout:

```text
$38 tee + $28 poster = $66 subtotal
REPLAY15 = $9.90 discount at current tee + poster pricing
total = $56.10 before shipping/tax at current tee + poster pricing
```

For abuse-proof pair-only rules, replace the normal code discount with a
Shopify Discount Function:

- Function checks cart lines for one Galaxy Tee variant and one promo poster.
- Function applies 15% order discount only when both are present.
- Optional code gate: require `REPLAY15`.
- Keep existing Playwright/live checkout tests unchanged as acceptance tests.

### Phase 5: Real Ops Monitoring

- Add Sentry or equivalent error tracking.
- Add uptime checks from an external service.
- Add Shopify webhook receiver only after the secret rotation is complete.
- Store webhook verification and alert failures in a lightweight log/queue.

## Paste-Ready Shopify Prompt

```text
I need the Action Replay custom app updated for full headless storefront operations.

Store: store.shopactionreplay.com
Admin API version: 2026-04

Please rotate the app client secret and Storefront API tokens because credentials
were exposed in development chat/screenshots.

Then add or confirm these Admin API scopes:
- read_products
- write_products
- read_inventory
- write_inventory
- read_orders
- write_orders
- read_draft_orders
- write_draft_orders
- read_customers
- read_discounts
- write_discounts
- read_publications
- write_publications

After updating scopes, make sure the app is reinstalled or the new permissions
are approved so client-credentials Admin API tokens include the new scopes.

Also confirm the live products are:
- orbit-logo-washed-tee published to the headless/storefront channel
- action-replay-2026-promo-poster published to the headless/storefront channel
- action-replay-mewtwo-tee unpublished/archived/hidden from Storefront API

Do not create any NEXT_PUBLIC Shopify secrets.
```

## Paste-Ready Vercel Prompt

```text
For project actionreplaywebsite under zach-relichs-projects:

Do not rebuild from Netlify output. GitHub main is the source of truth:
https://github.com/zar5177-cloud/actionreplaywebsite

Confirm these settings:
- Framework: Next.js
- Install command: npm ci
- Build command: npm run build
- Output directory: default/empty
- Node.js: 22.x
- Production branch: main
- Domains: shopactionreplay.com and www.shopactionreplay.com

Set all SHOPIFY_* env vars in both Production and Preview, including:
- SHOPIFY_STORE_DOMAIN
- SHOPIFY_ADMIN_API_VERSION
- SHOPIFY_CLIENT_ID
- SHOPIFY_CLIENT_SECRET
- SHOPIFY_STOREFRONT_ACCESS_TOKEN
- SHOPIFY_PRIVATE_STOREFRONT_ACCESS_TOKEN
- all SHOPIFY_GALAXY_TEE_VARIANT_BLACK_* vars
- all SHOPIFY_GALAXY_TEE_VARIANT_WHITE_* vars
- SHOPIFY_PROMO_POSTER_VARIANT_24X36
- SHOPIFY_TEE_POSTER_DISCOUNT_CODE

Keep generated preview URLs protected, but keep custom production domains public.
Enable Protection Bypass for Automation for Playwright preview tests.

Do not auto-promote previews. Production deploy remains manual through GitHub
Actions after npm run release:check and npm run go-live:check pass.
```

## Paste-Ready GitHub Prompt

```text
For zar5177-cloud/actionreplaywebsite:

Add or confirm repository secrets for all SHOPIFY_* variables and:
- VERCEL_TOKEN
- VERCEL_ORG_ID
- VERCEL_PROJECT_ID
- VERCEL_AUTOMATION_BYPASS_SECRET

Enable a branch protection rule or ruleset for main:
- require status check: storefront-smoke
- require branch to be up to date before merge
- block force pushes
- block deletions
- allow admin bypass during launch week only

Do not require pull request review unless there is a real second reviewer
available, because that can block emergency launch fixes.
```

## Source Notes

- Shopify AI Toolkit and Dev MCP support Codex MCP configuration and schema/docs
  validation: https://shopify.dev/docs/apps/build/ai-toolkit
- Shopify access scopes can be checked with Admin API app installation/scope
  APIs, and apps should request only needed scopes:
  https://shopify.dev/docs/api/usage/access-scopes
- Shopify Discount Functions can apply discounts across product, order, and
  shipping classes:
  https://shopify.dev/docs/api/functions/latest/discount
- Vercel preview protection can be bypassed for automated tests with
  `x-vercel-protection-bypass`:
  https://vercel.com/docs/deployment-protection/methods-to-bypass-deployment-protection
- Vercel production promotion changes environment variable scope from preview
  to production:
  https://vercel.com/docs/deployments/promoting-a-deployment
- GitHub Actions secrets should be passed as env/input values and missing
  secrets resolve to empty strings:
  https://docs.github.com/actions/security-guides/encrypted-secrets
- GitHub protected branches can require status checks before merge:
  https://docs.github.com/articles/about-protected-branches
