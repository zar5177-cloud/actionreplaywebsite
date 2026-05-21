# Optimized Agent Workflow

Last researched: 2026-05-21

## Decision

Stop using Netlify Agent for implementation work.

Use this stack instead:

- GitHub is the source of truth.
- Local Codex or local Claude Code does code changes.
- GitHub Actions runs release gates.
- Vercel Git Integration creates previews for PRs.
- Manual approval promotes to production.
- Netlify is not allowed to publish agent previews for this project.

The rule is simple: agents edit branches, CI judges branches, Vercel deploys
branches, and a human promotes production.

## Why Netlify Agent Keeps Failing Here

The Netlify agent is operating in an ephemeral deploy workspace, not in the
local project state or necessarily the PR branch. That is why it claimed
`docs/deployment-runbook.md` did not exist even though it exists in PR #1.

It also burns credits while doing expensive discovery that the repo already
solved:

- re-searching the web
- recreating files that already exist
- guessing environment variable names
- generating a preview that should not be production
- losing state when the credit limit hits

For this project, Netlify Agent is now classified as a high-waste tool.

## Best Workflow

### 1. Planning And Research

Use Codex or Claude Code locally.

Allowed outputs:

- a plan in `docs/`
- issue comments
- a scoped implementation prompt
- no deployment platform mutations

Required command before planning from repo state:

```bash
git status -sb
git branch --show-current
gh pr view 1 --json url,headRefName,statusCheckRollup
```

### 2. Implementation

Use a branch, never a deploy agent workspace.

```bash
git switch codex/shopify-storefront-release
npm ci
npm run release:check
```

Agent rules:

- Read `AGENTS.md`, `CLAUDE.md`, and `docs/deployment-runbook.md` first.
- Do not create `NEXT_PUBLIC_SHOPIFY_*`.
- Do not use `SHOPIFY_API_VERSION`.
- Do not use single uncolored Galaxy variant env vars.
- Do not touch Shopify product handles unless explicitly asked.
- Do not auto-promote production.

### 3. Verification

Local required check:

```bash
npm run release:check
```

Production smoke:

```bash
npm run test:smoke:prod
```

Preview smoke:

```bash
SMOKE_BASE_URL=<preview-url> npm run test:smoke
```

Protected Vercel preview smoke:

```bash
VERCEL_AUTOMATION_BYPASS_SECRET=<secret> SMOKE_BASE_URL=<preview-url> npm run test:smoke
```

### 4. Deployment

Use Vercel Git Integration after PR #1 is connected.

Vercel should create:

- Preview deployments for PR branches.
- Production deployments only after merge to `main`.

Do not use GitHub Actions to auto-promote a preview. The action may deploy and
test a preview, but production promotion stays manual until the user approves
the exact URL.

## Tool Choice

### Recommended

Use local Claude Code with Opus only for hard reasoning, architecture changes,
and final review. Use Sonnet for routine implementation. Use Codex for repo
execution, shell work, verification, and handoff.

This keeps model spend tied to useful work instead of platform-agent retries.

### Acceptable

Use Vercel Agent only for Vercel-specific setup or incident investigation after
Git Integration is connected. It should not rewrite app architecture.

### Avoid

Do not use Netlify Agent for:

- code implementation
- repo diagnosis
- Shopify env setup
- production publish recommendations
- repeated preview rebuilding

Netlify can host if configured from Git, but Netlify Agent is no longer part of
the build workflow.

## Claude Code Setup

Use project memory instead of giant prompts every time.

Create or maintain:

- `CLAUDE.md`
- `AGENTS.md`
- `docs/deployment-runbook.md`
- `docs/optimized-agent-workflow.md`

Claude Code should be launched from:

```bash
cd /Users/zrelich/Desktop/actionreplaywebsite
claude
```

At session start, run:

```text
/memory
```

Then confirm the project files are visible.

For expensive sessions, use:

```text
/cost
```

Use subagents only for bounded side tasks:

- `researcher`: no writes, returns concise source-backed findings
- `verifier`: no writes, runs tests and browser checks
- `implementer`: edits only explicitly named files

Do not let subagents run broad "fix everything" tasks.

## Exact Prompt For Claude Code

```text
You are working in /Users/zrelich/Desktop/actionreplaywebsite.

Read these first:
- AGENTS.md
- CLAUDE.md
- docs/deployment-runbook.md
- docs/optimized-agent-workflow.md

Current source of truth:
- GitHub PR #1: https://github.com/zar5177-cloud/actionreplaywebsite/pull/1
- Branch: codex/shopify-storefront-release
- Product handle: enzyme-washed-t-shirt
- Hidden duplicate handle: action-replay-mewtwo-tee

Rules:
- Do not use Netlify Agent output as source of truth.
- Do not publish Netlify previews.
- Do not create NEXT_PUBLIC_SHOPIFY_* variables.
- Do not use SHOPIFY_API_VERSION.
- Do not use SHOPIFY_ADMIN_CLIENT_ID or SHOPIFY_ADMIN_CLIENT_SECRET.
- Do not use SHOPIFY_GALAXY_TEE_VARIANT_S/M/L/XL/XXL.
- Use the color-specific Galaxy Tee env vars documented in docs/deployment-runbook.md.
- Use Shopify-Storefront-Private-Token for server-side Storefront API calls.
- Do not auto-promote production.

Before changing files, run:
git status -sb
git branch --show-current
npm run release:check

If you make changes:
- keep the change scoped
- run npm run release:check again
- summarize changed files and test results
```

## Exact Prompt For Vercel Support Or Agent

```text
Connect Vercel project actionreplaywebsite to GitHub repo zar5177-cloud/actionreplaywebsite.

Use:
- Install Command: npm ci
- Build Command: npm run build
- Output Directory: leave empty
- Node.js: 22.x
- Production Branch: main

Use PR #1 as the release branch:
https://github.com/zar5177-cloud/actionreplaywebsite/pull/1

Mirror all existing SHOPIFY_* Production env vars into Preview.

Do not create:
- NEXT_PUBLIC_SHOPIFY_*
- SHOPIFY_API_VERSION
- SHOPIFY_ADMIN_CLIENT_ID
- SHOPIFY_ADMIN_CLIENT_SECRET
- SHOPIFY_GALAXY_TEE_VARIANT_S
- SHOPIFY_GALAXY_TEE_VARIANT_M
- SHOPIFY_GALAXY_TEE_VARIANT_L
- SHOPIFY_GALAXY_TEE_VARIANT_XL
- SHOPIFY_GALAXY_TEE_VARIANT_XXL

Enable Protection Bypass for Automation or disable Vercel Authentication for preview testing.

Return the preview URL. Do not promote to production. Manual approval happens only after:
SMOKE_BASE_URL=<preview-url> npm run test:smoke
passes.
```

## Exact Prompt To Stop Netlify Agent Drift

```text
Stop. Do not publish this Netlify deploy preview.

Netlify Agent is not the source of truth for this project. It is seeing a stale
or temporary workspace and has repeatedly recreated files that already exist in
GitHub PR #1.

Use only:
https://github.com/zar5177-cloud/actionreplaywebsite/pull/1

Do not continue implementation inside Netlify Agent.
Do not recommend Publish to production.
Do not change Shopify env names.
Do not auto-promote.

Return only a confirmation that no Netlify preview will be published.
```

## Manual Links

- PR #1: https://github.com/zar5177-cloud/actionreplaywebsite/pull/1
- GitHub Actions secrets: https://github.com/zar5177-cloud/actionreplaywebsite/settings/secrets/actions
- Vercel project: https://vercel.com/zach-relichs-projects/actionreplaywebsite
- Vercel Git settings: https://vercel.com/zach-relichs-projects/actionreplaywebsite/settings/git
- Vercel environment variables: https://vercel.com/zach-relichs-projects/actionreplaywebsite/settings/environment-variables
- Vercel deployment protection: https://vercel.com/zach-relichs-projects/actionreplaywebsite/settings/deployment-protection
- Netlify project: https://app.netlify.com/projects/shopactionreplay

## Next 48 Hours

1. Stop using Netlify Agent for this site.
2. Open PR #1 and keep it as the release artifact.
3. Connect Vercel Git Integration to `zar5177-cloud/actionreplaywebsite`.
4. Mirror Production env vars to Preview in Vercel.
5. Configure Vercel protection bypass.
6. Let Vercel generate a PR preview.
7. Run `SMOKE_BASE_URL=<preview-url> npm run test:smoke`.
8. Inspect `/shop` and the Galaxy Tee product page manually.
9. Merge PR #1.
10. Promote or let `main` deploy.
11. Move the live domain only after production smoke passes.

## Budget Rule

Spend money on deterministic infrastructure and good local agents, not on
hosted deploy agents retrying stale work.

Acceptable spend:

- Vercel Pro for production deployment, env scopes, previews, and protection.
- Claude Code with Opus for hard planning/review.
- A senior human engineer for a fixed review sprint if needed.

Avoid:

- repeated Netlify Agent runs
- agent-generated deploy previews not tied to GitHub PRs
- auto-promotion workflows
- multiple agents editing the same files from different workspaces
