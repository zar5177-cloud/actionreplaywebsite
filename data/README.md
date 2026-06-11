# Data Folder

Manual data only. Use exports, screenshots, and operator notes converted into CSV rows.

Do not scrape restricted Instagram, TikTok, Shopify, or Google data. If API access is unavailable, enter the numbers by hand and keep the screenshot/source note.

Useful commands:

```bash
python3 scripts/analyze_posts.py --input data/posts.csv
python3 scripts/analyze_ads.py --input data/ads.csv
python3 scripts/generate_daily_report.py --date 2026-06-06 --write
python3 scripts/generate_content_calendar.py --write
```
