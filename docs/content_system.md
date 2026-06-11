# Content System

Internal helper-agent file. Use for post planning and brief generation.

## Weekly Minimum

- 2 carousels.
- 2 reels.
- Daily stories when possible.
- 1 product reality post.
- 1 lore/archive post.
- 1 community proof post.

Do not make every post a sales post.

## Core Cadence

1. Build world.
2. Show product.
3. Show people reacting.
4. Show product again.
5. Reveal one system detail.
6. Offer drop link or waitlist.
7. Archive the aftermath.

## Pillars

Artifact Drops:
Fake catalog scans, item screens, barcode sheets, menus, box fragments, product cards. Must contain one reason to zoom.

Product Reality:
Flat lays, worn shots, tags, fabric, packaging, shipping, inventory, behind-the-scenes. Must prove the object exists.

Lore / System:
Replay Club, unlock codes, hidden tiers, archive statuses, file indexes, patch notes. Must imply history without explaining all of it.

Cultural Signals:
Gaming nostalgia, handheld retail memory, import-shop residue, old internet references. Must avoid empty moodboard nostalgia.

Social Proof:
Customer reposts, comments, orders, packaging, creator reactions, real-world wear. Must not invent proof.

Motion:
Short clips that feel like a forbidden menu, old commercial break, corrupted export, or import trailer. Must still show something real when selling.

## Creative Brief Format

Title:

Objective:

Format:

Hook:

Slides or shots:

Caption:

CTA:

Why this fits Action Replay:

Expected strongest metric:

Boost eligibility:

Risk:

Next follow-up post:

## Posting Rules

- One unresolved detail per post.
- Product has to appear often enough that new viewers understand the account is connected to real objects.
- Archive posts can be strange. Customer support, checkout, and stock language must be plain.
- Do not require comment spam, tagging friends, or mass DMs for unlocks.
- If a post performs because of confusion, answer it with a clearer follow-up rather than boosting the confusion.

## 30-Day Calendar

The generated 30-day calendar lives in:

- `docs/content_calendar_30_days.md`
- `data/content_calendar.csv`

Refresh it with:

```bash
python3 scripts/generate_content_calendar.py --write
```
