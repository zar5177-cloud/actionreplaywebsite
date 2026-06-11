# Action Replay Manual Dashboard

This folder documents the internal manual dashboard. No live analytics integration is assumed.

## Current Inputs

- `data/posts.csv`
- `data/ads.csv`
- `data/sales.csv`
- `data/creators.csv`
- `data/competitors.csv`
- `data/experiments.csv`

## Commands

Rank posts:

```bash
python3 scripts/analyze_posts.py --input data/posts.csv
```

Rank ads:

```bash
python3 scripts/analyze_ads.py --input data/ads.csv
```

Generate daily report:

```bash
python3 scripts/generate_daily_report.py --date 2026-06-06 --write
```

Generate content calendar:

```bash
python3 scripts/generate_content_calendar.py --write
```

## Manual Review

Every Sunday, answer:

- Which post got saved?
- Which post got sent?
- Which post drove profile visits?
- Which product proof created site clicks?
- Which paid test only bought noise?
- Which comment sounded like someone recognized the world?
- Which post felt too clean?

Do not let the dashboard turn the brand into a normal report. The numbers decide what deserves another strange file, not what deserves corporate polish.
