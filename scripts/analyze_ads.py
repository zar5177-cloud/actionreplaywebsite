#!/usr/bin/env python3
"""Summarize Action Replay paid test rows from a manual CSV export."""

from __future__ import annotations

import argparse
import csv
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


def rate(numerator: float, denominator: float) -> float:
    if denominator <= 0:
        return 0.0
    return numerator / denominator


def read_rows(path: Path) -> list[dict[str, str]]:
    with path.open(newline="", encoding="utf-8") as handle:
        return list(csv.DictReader(handle))


def score_row(row: dict[str, str]) -> dict[str, Any]:
    spend = number(row.get("total_spend_usd"))
    reach = number(row.get("reach"))
    visits = number(row.get("profile_visits"))
    follows = number(row.get("follows"))
    clicks = number(row.get("website_clicks"))
    add_to_cart = number(row.get("add_to_cart"))
    purchases = number(row.get("purchases"))

    result = {
        "campaign_id": row.get("campaign_id", ""),
        "creative_title": row.get("creative_title", ""),
        "objective": row.get("objective", ""),
        "status": row.get("status", ""),
        "spend": spend,
        "reach": reach,
        "profile_visits": visits,
        "follows": follows,
        "website_clicks": clicks,
        "add_to_cart": add_to_cart,
        "purchases": purchases,
        "profile_visits_per_reach": rate(visits, reach),
        "follows_per_reach": rate(follows, reach),
        "site_clicks_per_reach": rate(clicks, reach),
        "cost_per_profile_visit": rate(spend, visits),
        "cost_per_follow": rate(spend, follows),
        "cost_per_purchase": rate(spend, purchases),
        "notes": row.get("notes", ""),
    }
    result["warmth_score"] = (
        result["profile_visits_per_reach"] * 3.0
        + result["follows_per_reach"] * 3.0
        + result["site_clicks_per_reach"] * 2.0
        + rate(add_to_cart + purchases, reach) * 4.0
    )
    return result


def markdown_table(rows: list[dict[str, Any]]) -> str:
    headers = [
        "Campaign",
        "Objective",
        "Spend",
        "Reach",
        "Profile visits/reach",
        "Follows/reach",
        "Site clicks/reach",
        "Warmth score",
    ]
    lines = [
        "| " + " | ".join(headers) + " |",
        "| " + " | ".join(["---"] * len(headers)) + " |",
    ]
    for row in rows:
        lines.append(
            "| {campaign} | {objective} | ${spend:.2f} | {reach:.0f} | {visits:.4f} | {follows:.4f} | {clicks:.4f} | {score:.4f} |".format(
                campaign=f"{row['campaign_id']} - {row['creative_title']}".replace("|", "/"),
                objective=str(row["objective"]).replace("|", "/"),
                spend=row["spend"],
                reach=row["reach"],
                visits=row["profile_visits_per_reach"],
                follows=row["follows_per_reach"],
                clicks=row["site_clicks_per_reach"],
                score=row["warmth_score"],
            )
        )
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", default="data/ads.csv", type=Path)
    parser.add_argument("--output", type=Path)
    args = parser.parse_args()

    rows = [score_row(row) for row in read_rows(args.input)]
    rows = [row for row in rows if row["reach"] > 0 or row["spend"] > 0]
    rows.sort(key=lambda row: row["warmth_score"], reverse=True)

    output = "# Action Replay Paid Test Summary\n\n" + markdown_table(rows) + "\n"
    output += "\nRead profile visits, follows, site clicks, and commerce events before raw views.\n"

    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(output, encoding="utf-8")
    print(output)


if __name__ == "__main__":
    main()
