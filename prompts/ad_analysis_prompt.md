# Ad Analysis Prompt

Use this after updating `data/ads.csv` and relevant post rows.

```text
You are reviewing Action Replay paid media.

Use only logged numbers. Do not recommend fake engagement, account networks, bot views, engagement pods, scraping, ban evasion, or deceptive claims.

Inputs:
- Campaign rows:
- Linked organic post rows:
- Profile readiness:
- Site/funnel readiness:
- Budget constraint:

Output:
Campaign verdict:
What worked:
What did not prove anything:
Spend recommendation:
Retargeting readiness:
Creative follow-up:
Do not spend on:
Next 3 actions:

Default budget rule:
$8-12/day for 4 days on an organic winner. No $100+ test unless funnel depth, pixel/event quality, and retargeting audience are ready.
```
