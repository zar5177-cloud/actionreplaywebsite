#!/usr/bin/env python3
"""Rank Action Replay post rows from a manual CSV export."""

from __future__ import annotations

import argparse
import csv
from pathlib import Path
from typing import Any


RATE_FIELDS = (
    "saves_per_reach",
    "share_signal_per_reach",
    "profile_visits_per_reach",
    "follows_per_reach",
)


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
    reach = number(row.get("reach"))
    views = number(row.get("views"))
    denominator = reach or views
    shares = number(row.get("shares"))
    sends = number(row.get("sends"))
    combined = number(row.get("shares_sends_combined"))
    share_signal = shares + sends + combined

    metrics = {
        "post_id": row.get("post_id", ""),
        "title": row.get("title", ""),
        "format": row.get("format", ""),
        "pillar": row.get("pillar", ""),
        "denominator": denominator,
        "saves_per_reach": rate(number(row.get("saves")), denominator),
        "share_signal_per_reach": rate(share_signal, denominator),
        "profile_visits_per_reach": rate(number(row.get("profile_visits")), denominator),
        "follows_per_reach": rate(number(row.get("follows")), denominator),
        "non_follower_reach_pct": number(row.get("non_follower_reach_pct")),
        "notes": row.get("notes", ""),
    }

    metrics["growth_score"] = (
        metrics["saves_per_reach"] * 3.0
        + metrics["share_signal_per_reach"] * 3.0
        + metrics["profile_visits_per_reach"] * 2.0
        + metrics["follows_per_reach"] * 2.0
        + rate(metrics["non_follower_reach_pct"], 100.0)
    )
    return metrics


def markdown_table(rows: list[dict[str, Any]], limit: int) -> str:
    headers = [
        "Rank",
        "Post",
        "Format",
        "Saves/reach",
        "Share signal/reach",
        "Profile visits/reach",
        "Follows/reach",
        "Non-follower %",
        "Score",
    ]
    lines = [
        "| " + " | ".join(headers) + " |",
        "| " + " | ".join(["---"] * len(headers)) + " |",
    ]
    for index, row in enumerate(rows[:limit], start=1):
        lines.append(
            "| {rank} | {post} | {format} | {saves:.4f} | {shares:.4f} | {visits:.4f} | {follows:.4f} | {non_followers:.1f} | {score:.4f} |".format(
                rank=index,
                post=f"{row['post_id']} - {row['title']}".replace("|", "/"),
                format=str(row["format"]).replace("|", "/"),
                saves=row["saves_per_reach"],
                shares=row["share_signal_per_reach"],
                visits=row["profile_visits_per_reach"],
                follows=row["follows_per_reach"],
                non_followers=row["non_follower_reach_pct"],
                score=row["growth_score"],
            )
        )
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--input", default="data/posts.csv", type=Path)
    parser.add_argument("--output", type=Path)
    parser.add_argument("--limit", type=int, default=10)
    args = parser.parse_args()

    rows = [score_row(row) for row in read_rows(args.input)]
    rows = [row for row in rows if row["denominator"] > 0]
    rows.sort(key=lambda row: row["growth_score"], reverse=True)

    output = "# Action Replay Post Ranking\n\n" + markdown_table(rows, args.limit) + "\n"
    output += "\nScoring weights saves and share/sends highest, then profile visits, follows, and non-follower reach.\n"

    if args.output:
        args.output.parent.mkdir(parents=True, exist_ok=True)
        args.output.write_text(output, encoding="utf-8")
    print(output)


if __name__ == "__main__":
    main()
