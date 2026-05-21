# Model / Member Account Protocol

Action Replay can feel like a crew without taking over anyone’s account.

This is the rule:

No model, photographer, friend, brand member, customer, or collaborator should give us their Instagram password.

## Why

Their accounts are personal identity surfaces.
Taking direct login creates risk:

- account lockout
- consent ambiguity
- private DM exposure
- accidental impersonation
- platform security flags
- damaged trust

The better version is stronger anyway:

they post from their own account, in their own voice, and Action Replay reacts around it.

That is social proof.

## Access Methods

Use these instead of login:

- Instagram collab post invite
- tagged post
- story mention
- repost permission
- shared Google Drive/Dropbox asset folder
- caption draft they can edit
- usage consent text
- paid/comped creator agreement
- DM screenshot export for analysis, if they choose to share
- insights screenshots after posting, if they choose to share

## Consent Text

Short version:

```text
Action Replay can repost this photo/video on @shopactionreplay, stories, email, and website archive pages for this drop cycle. Credit/tag: @{handle}. I can ask for removal anytime.
```

More formal:

```text
I give Action Replay permission to repost and archive the submitted media for organic social, email, website, and drop documentation connected to the current Action Replay release. Action Replay will credit my account when public-facing unless we agree otherwise. This does not grant password access, DM access, or control over my account. I can request removal of future uses.
```

## Model Packet

Send each model/member:

- 3 caption options
- 3 story options
- 1 no-caption option
- visual references
- tag format
- posting window
- what not to say
- link to product
- consent text

## Caption Direction

Do not make them sound like brand staff unless they are brand staff.

Good:

- `still accessible`
- `slot b worked`
- `this showed up last night`
- `001 transferred`
- `wearing this until the save corrupts`

Bad:

- `shop the new drop now`
- `use my code`
- `so excited to partner with`
- `limited edition streetwear brand`

## AI Role

AI can:

- draft packets
- vary captions to match each person
- summarize their audience fit
- convert their photo into repost/story options
- detect which posts created product interest

AI cannot:

- log into their account
- send DMs from their account
- post for them without delegated official access
- manufacture proof
- fake comments from them

## Owner Evidence Format

When someone posts wearing/holding Action Replay, log it like this:

```json
{
  "source_handle": "@example",
  "permission": "story repost approved",
  "artifact": "AR-001 fit pic, parking garage flash",
  "posted_at": "2026-05-21T21:14:00-04:00",
  "brand_action": "reposted to @shopactionreplay story",
  "caption_used": "001 transferred",
  "next_step": "ask for package close-up if they offer"
}
```

## Cultural Rule

The person is not a mannequin.
The person is evidence that the file escaped.
