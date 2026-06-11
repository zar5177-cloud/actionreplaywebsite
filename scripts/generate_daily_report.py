#!/usr/bin/env python3
"""Generate an internal Action Replay daily growth report from manual CSV data."""

from __future__ import annotations

import argparse
import csv
from datetime import date
from pathlib import Path
from typing import Any


def number(value: Any) -> float:
    if value is None:
        return 0.0
    text = str(value).strip().replace(",", "").replace("$", "")
    if not text:
        return 0.0
    try:
        return float(text)
    except ValueError:
        return 0.0


def read_csv(path: Path) -> list[dict[str, str]]:
    if not path.exists():
        return []
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def post_share_signal(row: dict[str, str]) -> float:
    return number(row.get("shares")) + number(row.get("sends")) + number(row.get("shares_sends_combined"))


def post_denominator(row: dict[str, str]) -> float:
    return number(row.get("reach")) or number(row.get("views"))


def best_post(rows: list[dict[str, str]]) -> dict[str, str] | None:
    candidates = [row for row in rows if post_denominator(row) > 0]
    if not candidates:
        return None

    def score(row: dict[str, str]) -> float:
        denom = post_denominator(row)
        return (
            (number(row.get("saves")) / denom) * 3.0
            + (post_share_signal(row) / denom) * 3.0
            + (number(row.get("profile_visits")) / denom) * 2.0
            + (number(row.get("follows")) / denom) * 2.0
            + (number(row.get("non_follower_reach_pct")) / 100.0)
        )

    return max(candidates, key=score)


def best_paid(rows: list[dict[str, str]]) -> dict[str, str] | None:
    candidates = [row for row in rows if number(row.get("reach")) > 0 or number(row.get("total_spend_usd")) > 0]
    if not candidates:
        return None

    def score(row: dict[str, str]) -> float:
        reach = number(row.get("reach"))
        if reach <= 0:
            return 0.0
        return (
            (number(row.get("profile_visits")) / reach) * 3.0
            + (number(row.get("follows")) / reach) * 3.0
            + (number(row.get("website_clicks")) / reach) * 2.0
        )

    return max(candidates, key=score)


def report_text(report_date: str, posts_path: Path, ads_path: Path, sales_path: Path, experiments_path: Path) -> str:
    posts = read_csv(posts_path)
    ads = read_csv(ads_path)
    sales = read_csv(sales_path)
    experiments = read_csv(experiments_path)

    top_post = best_post(posts)
    top_ad = best_paid(ads)
    purchase_count = sum(number(row.get("purchases")) for row in posts) + sum(number(row.get("purchases")) for row in ads)
    sales_rows = [row for row in sales if row.get("order_id") and row.get("order_id") != "TEMPLATE"]
    planned_experiments = [row for row in experiments if row.get("status", "").strip().lower() in {"planned", "active"}]

    if top_post:
        yesterday_signal = (
            f"Top logged signal is `{top_post.get('title', top_post.get('post_id', 'unknown'))}`. "
            f"Saves: {number(top_post.get('saves')):.0f}. Share/send signal: {post_share_signal(top_post):.0f}. "
            f"Profile visits: {number(top_post.get('profile_visits')):.0f}."
        )
        content_opportunity = "Build the next post from that same lane, but add one clearer product-reality detail."
    else:
        yesterday_signal = "No usable post rows yet. Operator needs Instagram export rows or screenshot-entered metrics."
        content_opportunity = "Post product reality first: tag, fabric, package, stock count, or human desk proof."

    if top_ad:
        paid_opportunity = (
            f"Best logged paid row is `{top_ad.get('campaign_id')}` with "
            f"{number(top_ad.get('profile_visits')):.0f} profile visits on {number(top_ad.get('reach')):.0f} reach."
        )
    else:
        paid_opportunity = "No paid row is strong enough to evaluate yet. Keep spend parked until organic rows are complete."

    should_boost = "Do not boost today unless profile/link/shop readiness is confirmed and the top organic row is still the best post after fresh data entry."
    if top_post and number(top_post.get("reach")) > 0 and number(top_post.get("non_follower_reach_pct")) >= 75 and post_share_signal(top_post) / post_denominator(top_post) >= 0.05:
        should_boost = "Boost eligible: test $8-12/day for 4 days, profile visits or engagement, only after confirming profile/link/shop readiness."

    lines = [
        f"# Action Replay Daily Report - {report_date}",
        "",
        "## 1. Yesterday's Signal",
        "",
        yesterday_signal,
        "",
        "## 2. Best Content Opportunity Today",
        "",
        content_opportunity,
        "",
        "## 3. Best Paid Opportunity Today",
        "",
        paid_opportunity,
        "",
        "## 4. Boost Or Not",
        "",
        should_boost,
        "",
        "## 5. Creator/Page Outreach Target Category",
        "",
        "One gaming nostalgia or physical-media archive page. Send one specific artifact/proof only after manual review.",
        "",
        "## 6. Site/Funnel Improvement",
        "",
        "Check that the bio link, product path, and live item language are plain enough for a viewer who just arrived from a strange post.",
        "",
        "## 7. Wild But Safe Experiment",
        "",
        "Turn the strongest comment into a tiny archive correction note, then post the correction without explaining who was right.",
        "",
        "## 8. Exact Next Actions",
        "",
        "- Enter missing Instagram screenshots into `data/posts.csv`.",
        "- Run `python3 scripts/analyze_posts.py --input data/posts.csv`.",
        "- Choose one product-reality follow-up from the top saved/shared lane.",
        "- Log 1-3 manually reviewed outreach targets in `data/creators.csv`.",
        "- Keep spend at $0 until the boost gate is satisfied.",
        "",
        "## Data Notes",
        "",
        f"- Sales rows logged: {len(sales_rows)}.",
        f"- Purchases visible in post/ad rows: {purchase_count:.0f}.",
        f"- Planned or active experiments: {len(planned_experiments)}.",
        "- This report uses manual CSV data only.",
    ]
    return "\n".join(lines) + "\n"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--date", default=date.today().isoformat())
    parser.add_argument("--posts", default="data/posts.csv", type=Path)
    parser.add_argument("--ads", default="data/ads.csv", type=Path)
    parser.add_argument("--sales", default="data/sales.csv", type=Path)
    parser.add_argument("--experiments", default="data/experiments.csv", type=Path)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()

    output = report_text(args.date, args.posts, args.ads, args.sales, args.experiments)

    if args.write:
        output_path = args.output or Path("reports/daily") / f"{args.date}.md"
        output_path.parent.mkdir(parents=True, exist_ok=True)
        output_path.write_text(output, encoding="utf-8")
    elif args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(output, encoding="utf-8")

    print(output)


if __name__ == "__main__":
    main()
