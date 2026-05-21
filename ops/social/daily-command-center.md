# Daily Social Command Center

This is the working loop for the live Action Replay ecosystem.

It replaces a messy group chat, a creative director, a social manager, a customer support assistant, a copywriter, and an archivist.

It does not replace the human final click.

## Inputs

Drop these into the operator context:

- screenshots of comments
- screenshots of DMs
- Instagram insights screenshots
- customer/order proof
- raw fit photos
- product photos
- story replies
- website analytics
- Shopify order/export summaries
- model/member posts

## Morning Pass

Goal: find the signal.

Agent should produce:

- 5 comments worth replying to
- 5 comments to ignore
- product questions needing real answers
- potential reposts
- proof worth archiving
- weird audience theories worth preserving
- one post idea for 12PM
- one story idea for 3PM
- one late-night proof/residue idea

## Midday Pass

Goal: publish the strongest public evidence.

Agent prepares:

- caption draft
- alt caption variants
- story sequence
- replies to first comments
- side account notes
- risk notes

Human approves and posts.

## Evening Pass

Goal: turn activity into culture.

Agent prepares:

- story reposts
- reply drafts
- customer proof log
- tomorrow’s queue
- one soft outreach message
- one email draft if needed

Human approves and sends/posts.

## Comment Triage Labels

- `product-question`
- `lore-theory`
- `fit-pic-signal`
- `customer-proof`
- `high-intent`
- `ignore`
- `risky`
- `reply-short`
- `reply-weird`
- `save-for-caption`

## Reply Rules

Good replies:

- short
- specific
- slightly human
- not salesy
- not too clever
- useful when product question appears

Bad replies:

- “shop now”
- “link in bio”
- fake hype
- repeated phrase
- pretending a side account is a stranger
- explaining all the lore

## Action States

Every public action goes through:

1. `drafted`
2. `needs_review`
3. `approved`
4. `posted_by_human` or `sent_by_human`
5. `logged`

Until official API access is approved and tested, agents do not publish.

## Daily Output File

Use ignored local files for live work:

`ops/social/live-queues/YYYY-MM-DD.local.json`

Use the committed example/schema as the shape.

Never commit live DMs, private customer data, phone numbers, emails, passwords, tokens, or model contact details.

## Infection Mode Priority

Rank actions by this order:

1. real human proof
2. product questions
3. customer/order evidence
4. repostable weirdness
5. archive continuity
6. pure graphics

The current problem is not visual identity.
The current problem is participation.
