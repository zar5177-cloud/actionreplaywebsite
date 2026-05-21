# Account Onboarding Matrix

Use this to decide how each account enters the operating system.

| Account Type | Examples | Access Method | AI Can Do | AI Cannot Do |
|---|---|---|---|---|
| Main brand | `shopactionreplay` | Meta Business Suite + password-manager vault + official API later | draft, triage, analyze, queue, summarize | login with raw password, auto-post without approval, fake engagement |
| Brand side account | `replay_recovered`, `unlock_log_txt`, `memorycard_err` | brand-owned login in vault + Meta Business Suite where possible | draft artifact posts, prepare story logs, track voice | pretend to be unrelated if asked, coordinate fake comments |
| Model/member | Sofia, fit pic friends, collaborators | no login; collab post, tag, repost permission, shared assets | draft packets, caption options, repost versions | sign in, read private DMs, post for them without official delegated access |
| Customer | AR-001 buyers | no login; repost permission only | summarize proof, draft repost caption | fake proof, pressure for content, expose private info |
| Press/archive page | moodboard pages, design accounts | no login; manual outreach only | draft short pitch, track replies | mass DM, scrape contacts, impersonate |
| Email list | Action Replay owned list | email service API or export | draft campaigns, segment by consent, summarize clicks | email without opt-in, use scraped contacts |

## Brand-Owned Account Setup Fields

For every brand-owned account, fill these in the password manager:

- handle
- platform
- login email
- generated password
- 2FA seed
- backup codes
- recovery email
- recovery phone
- date created
- owner
- linked Meta Business portfolio
- linked Facebook Page
- notes

Then update:

- [accounts.inventory.template.json](/Users/zrelich/Desktop/actionreplaywebsite/ops/access/accounts.inventory.template.json)
- `.env.local` with asset IDs only after official API setup

## Model / Member Setup Fields

For every model/member/collaborator:

- handle
- real name, if needed locally only
- permission status
- preferred credit
- allowed use
- not allowed use
- last post date
- assets delivered
- captions approved
- repost status

Store private contact details only in ignored files or CRM/password manager, not git.

## Fastest Safe Workflow For Today

1. Create or confirm `shopactionreplay` in Meta Business Suite.
2. Move all brand-owned account credentials into 1Password/Bitwarden.
3. Fill `accounts.inventory.template.json` with vault refs.
4. Ask models/members for repost permission, not login.
5. Export/screenshot current Instagram comments and insights.
6. Put screenshots in an ignored folder.
7. Agent creates today’s operator queue.
8. Human approves and posts manually.

This gets us operating today while avoiding account security debt.
