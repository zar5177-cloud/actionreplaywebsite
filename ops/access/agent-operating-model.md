# AI Operator Model

This is the target shape for the Action Replay ecosystem outside the website.

It is not a bot farm.
It is not fake engagement.
It is not a growth-hack machine.

It is a controlled operator room where AI handles the repetitive labor and you approve the moves that touch the public world.

## Operating Layers

### 1. Memory

The system remembers:

- account roles
- recurring phrases
- old warnings
- product states
- comment patterns
- customer proof
- unanswered questions
- posts that moved product
- posts that only got admiration
- motifs that should recur quietly

Output: daily brief, weekly memory drift report, reusable copy fragments.

### 2. Drafting

The system drafts:

- captions
- story frames
- replies
- repost captions
- email subject lines
- micro-community outreach
- archive notes
- owner-proof prompts

Output: queue items marked `drafted`.

### 3. Triage

The system sorts:

- comments worth replying to
- DMs needing a human
- potential customer proof
- repost opportunities
- risky comments to ignore
- product questions
- collaboration signals

Output: priority list, not automatic replies.

### 4. Publishing

Default state: human publishes.

Future state, only through official APIs and explicit approval:

- schedule approved posts
- schedule approved emails
- log approved reposts

Never publish surprise output from an agent.

### 5. Metrics

The system tracks:

- follows
- unfollows
- profile visits
- comments
- saves
- shares
- website clicks
- checkout clicks
- cart opens
- email signups
- order proof
- customer tags
- fit pics

The important metric is not just sales.
It is movement from admiration to participation.

## Human Approval Format

Every outward action should be summarized like this:

```json
{
  "account": "shopactionreplay",
  "platform": "instagram",
  "action_type": "post",
  "status": "drafted",
  "asset_ref": "local/path/or/drive/ref",
  "caption": "001 still accessible",
  "risk": "low",
  "reason": "real product proof, humanizes drop",
  "requires_human": true
}
```

## Ecosystem Roles

Main account:
real product, human proof, owner evidence, drop state.

Archive accounts:
context, mystery, texture, recurring residue, indirect amplification.

Email:
slower, more direct, less performative. Should feel like a maintenance notice.

Website:
canonical artifact and checkout mirror.

Operator:
the back room. Drafts, records, remembers.

## Current Phase

Infection mode.

The priority is making the brand feel physically real and socially inhabited:

- imperfect fit pics
- packaging proof
- reposted customer evidence
- casual story logs
- comments that feel like people found something
- daily signs that the archive is being maintained

Do not overbuild new surfaces until the living proof layer is working.
