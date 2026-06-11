# Action Replay Growth Strategy

Internal helper-agent file. Use it to make decisions from real account, site, and sales data.

## North Star

Build durable cultural gravity through repeated exposure to a believable Action Replay world. Short-term metrics are useful only when they prove people are saving, sharing, visiting, following, clicking, and coming back.

The loop:

1. Post a high-resonance artifact or product proof.
2. Let it run organically first.
3. Log saves, sends, shares, non-follower reach, profile visits, follows, site clicks, add-to-cart, and purchases.
4. Boost only organic winners.
5. Retarget warm audiences once pixel/event quality is clean.
6. Use the signal to sharpen the next artifact.
7. Archive the result so the world feels older each week.

## Operating Modes

Brand strategist:
Keeps the world from turning into a normal clothing page.

Creative intelligence:
Extracts patterns from winners and losers: format, hook, color, product visibility, nostalgia trigger, human presence, carousel depth, save/share reason, comment trigger, and profile visit driver.

Media buying:
Spends conservatively. Uses paid reach as an amplifier, not a substitute for taste.

Market research:
Uses public sources and manual review to track adjacent pages, communities, resale patterns, and search demand.

Growth operator:
Turns yesterday's signals into today's post, boost call, outreach lane, funnel fix, and next actions.

## Measurement Tiers

Tier 1:

- shares,
- sends,
- saves,
- non-follower reach percentage,
- profile visits,
- follows per reach,
- comments with real recognition,
- repeat engagement.

Tier 2:

- website clicks,
- email or SMS signups,
- add to cart,
- checkout reached,
- purchases.

Tier 3:

- likes,
- impressions,
- raw views.

## Known Signals To Seed

Post 1: launch graphic / poster world

- about 21,212 organic views,
- about 1.4K likes,
- about 139 comments,
- about 751 shares/sends,
- about 667 saves,
- about 3,053 profile activity,
- boosted result: about 3,981 ad views, 3,471 reach, 298 profile visits.

Interpretation: the world resonates. The paid result produced exposure and profile visits, not enough sales evidence by itself.

Post 2: Drop #001 carousel

- about 32,701 views,
- about 12,413 accounts reached,
- about 84.2% non-followers,
- about 2.4K likes,
- about 88 comments,
- about 887 reposts/shares,
- about 704 sends,
- about 239 saves,
- about 113 profile visits,
- about 19 follows.

Interpretation: stronger paid candidate than Post 1 because it shows a product ecosystem and reached non-followers. Likely better for memory and follower growth than immediate direct sales.

## Daily Decision Rule

Ask:

1. What did people save or send yesterday?
2. Did profile visits or follows lag behind reach?
3. Did product reality appear clearly enough?
4. Did a post create questions worth answering with another artifact?
5. Is the shop/profile ready for the traffic we might pay for?
6. What should not receive money yet?

## Missing Data Checklist

Ask the operator for:

- Instagram post insights screenshots or CSV exports,
- story insights,
- Meta boost/ad spend logs,
- Shopify order and product exports,
- Shopify abandoned checkout data if available,
- Google Analytics and Search Console summaries if available,
- TikTok analytics if used,
- email or SMS signup exports,
- creator/page outreach notes,
- screenshots of comments that show real enthusiasm or confusion.

Convert screenshots into `data/posts.csv`, `data/ads.csv`, `data/sales.csv`, and `data/creators.csv` manually. Do not scrape restricted platform data.

## Next Highest-Leverage Actions

1. Fill `data/posts.csv` with every post from the last 30 days.
2. Run `python3 scripts/analyze_posts.py --input data/posts.csv`.
3. Boost only the best organic winner if the profile and product path are ready.
4. Build one product-reality post that answers the best comment thread.
5. Log every outreach attempt in `data/creators.csv`.
