# Meta / Instagram Onboarding

This is the fast path for giving AI operators access to run the Action Replay ecosystem without sharing passwords or logging into personal accounts directly.

## Non-Negotiable Access Rule

Do not share raw Instagram passwords with agents.
Do not ask models, friends, brand members, or collaborators for their personal login.
Do not save login sessions, cookies, or backup codes in the repo.

Use one of these access methods instead:

1. Meta Business Suite asset access for brand-owned professional accounts.
2. Instagram shared access where available.
3. Official Instagram API OAuth / Meta developer app access.
4. Creator collaboration mechanics for models and members.
5. Manual exports/screenshots when API access is not available yet.

## Source Notes

Meta’s own Help Center describes shared Instagram business account access through Page roles, Business Manager, and ad account roles. It also notes that connecting a Facebook Page to an Instagram professional account requires Page access and a professional account. Meta also documents Page inbox handling for Instagram comments and DMs once the Page and Instagram account are connected.

Reference links:

- https://www.facebook.com/help/218638451837962
- https://www.facebook.com/help/570895513091465
- https://www.facebook.com/help/1148909221857370/
- https://www.facebook.com/help/www/772447486244207
- https://developers.facebook.com/docs/instagram-platform/

## Account Classes

### Brand-Owned Accounts

Examples:

- `shopactionreplay`
- `replay_recovered`
- `override_monthly`
- `slotb_testers`
- `memorycard_err`
- `unlock_log_txt`
- `bbs_mirror_2007`

Access method:

- Store credentials in `Action Replay / Access` password-manager vault.
- Convert account to professional where needed.
- Connect each account to the correct Meta Business portfolio.
- Connect each account to a Facebook Page if Meta requires it for management/API workflows.
- Enable 2FA.
- Save backup codes in the password manager.
- Record only vault references in `ops/access/accounts.inventory.template.json`.

AI role:

- draft
- triage
- schedule proposals
- analytics summaries
- reply suggestions

Human role:

- approve
- post
- send
- login
- verify suspicious actions

### Model / Brand Member Accounts

Examples:

- models wearing AR-001
- friends posting fit pics
- collaborators with their own taste/world
- photographers
- stylists

Access method:

- no password request
- no direct login
- no account takeover
- use collab posts
- use tagged posts
- use creator approval
- use shared folders for assets
- use usage consent forms
- use repost permission

AI role:

- draft captions they can approve
- make repost versions for main account
- summarize their post performance if they share screenshots
- generate story reply options
- turn their proof into archive-language reposts

Human/model role:

- post from their own account
- approve caption
- approve tag/collab invite
- approve repost usage

## ASAP Setup Checklist

### Step 1: Create The Business Spine

- Confirm Meta Business portfolio owner.
- Confirm recovery email and phone.
- Confirm main Facebook Page.
- Confirm `shopactionreplay` is a professional Instagram account.
- Connect `shopactionreplay` to the Page.
- Add 2FA to every admin account.

### Step 2: Add Brand-Owned IG Accounts

For each brand-owned account:

- create account manually
- add to password manager
- enable 2FA
- add recovery email/phone
- convert to professional only if useful
- connect to Meta Business Suite
- record handle and vault refs in account inventory
- do one manual login test
- do one manual publish test

### Step 3: Add AI Ops Surfaces

- Create a Meta developer app.
- Add Instagram product.
- Add required Instagram permissions during App Review when ready.
- Configure webhook verify token.
- Store app ID/secret in `.env.local`, not git.
- Add IG user IDs to `.env.local`.

### Step 4: Add Models / Members

Do not ask for logins.

Instead send:

- usage consent
- collab post request
- caption draft
- preferred tag format
- allowed repost windows
- takedown rule

### Step 5: Start Command Center

Daily operator flow:

- ingest screenshots/exports
- rank comments and DMs
- draft replies
- draft posts/stories
- create approval queue
- human approves
- human posts or official API posts after app approval
- log outcomes

## What Agents Can Do Today

Agents can immediately:

- analyze screenshots of Instagram analytics
- turn comments into reply drafts
- create story sequences
- maintain daily queue files
- prepare captions
- prepare model/collab outreach
- summarize customer proof
- make email/social calendars
- keep track of the ecosystem’s voices

Agents cannot safely:

- take personal passwords
- log into model accounts
- create accounts in bulk
- automate likes/follows/comments/DMs
- impersonate people
- publish without approval

## The Practical Shortcut

For the next few days, run a semi-manual bridge:

1. You export or screenshot comments, DMs, insights, customer tags.
2. Agent triages and drafts.
3. You approve.
4. You publish manually from Instagram/Business Suite.
5. Agent records what happened and updates tomorrow’s queue.

That gets the ecosystem moving now while the official API access matures.
