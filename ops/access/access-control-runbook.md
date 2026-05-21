# Action Replay Access Control Runbook

This is for the live ecosystem around Action Replay: Instagram, email, social accounts, commerce tools, and future AI operators.

Do not put passwords in this repo.
Do not paste passwords into agent chat.
Do not store session cookies in files.

## The Correct Setup

Use a shared password manager vault:

- 1Password: `Action Replay / Access`
- or Bitwarden: `Action Replay / Access`

Each account gets one vault item:

- login email
- password
- TOTP seed
- backup codes
- recovery email
- recovery phone
- account creation date
- current owner
- last verified date

The committed file [accounts.inventory.template.json](/Users/zrelich/Desktop/actionreplaywebsite/ops/access/accounts.inventory.template.json) stores only references to those vault items.

## Why This Exists

The ecosystem should feel like a real group of obsessive operators, but the infrastructure cannot behave like a hacked-together password folder.

The goal is:

- many voices
- many surfaces
- one controlled access layer
- no plaintext credentials
- no platform-risk automation
- no one-person lockout risk

## Account Creation Protocol

Create accounts manually in Instagram or the official app/site.

For each account:

1. Create a dedicated email alias or mailbox.
2. Generate a unique random password in the password manager.
3. Enable 2FA immediately.
4. Save backup codes in the same vault item.
5. Add the handle to `accounts.inventory.template.json`.
6. Mark the status as `existing`.
7. Add the account to the daily operator queue only after the profile is fully set up.

Do not create accounts with browser automation. Do not bulk-create accounts. Do not reuse phone numbers aggressively.

## Automation Boundary

Allowed:

- draft captions
- draft replies
- rank comments by reply value
- produce story queues
- format reposts
- summarize analytics
- generate content prompts from raw photos
- prepare outreach lists manually reviewed by a human
- maintain lore/residue memory
- generate daily operating logs

Not allowed:

- fake engagement
- auto-liking
- auto-following
- follow/unfollow loops
- auto-commenting
- mass DMs
- scraping private data
- impersonating customers
- pretending fictional accounts are independent real publications when asked
- posting without human approval

## Approval Gates

Nothing external should happen without one of these states:

- `drafted`
- `approved`
- `posted_by_human`
- `rejected`
- `needs_rewrite`

Future agents can write drafts into an ops queue, but they should not perform the platform action unless you explicitly authorize that exact action.

## Minimum Account Records

Every account should track:

- handle
- platform
- role
- public behavior
- real owner
- vault item ref
- 2FA status
- recovery method
- last login verified
- automation level
- blocked automation
- risk notes

## Emergency Recovery

If an account is locked:

1. Stop all automation for that account.
2. Do not keep retrying login.
3. Use password manager recovery data.
4. Verify email and phone access.
5. Record the incident in a local, ignored file:
   `ops/access/incidents.local.json`
6. Rotate password after recovery.
7. Regenerate backup codes.

## Operator Principle

AI can replace a lot of labor here:

- planning
- drafting
- sorting
- remembering
- sequencing
- analyzing
- formatting

AI should not replace accountability.

The system can feel like several cool people running the company.
The security model should still behave like one serious owner protecting the company.
