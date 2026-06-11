#!/usr/bin/env python3
"""Generate the internal 30-day Action Replay content calendar."""

from __future__ import annotations

import argparse
import csv
from pathlib import Path


CALENDAR = [
    (1, "FILE_006 recovered folder carousel with one product edge", "Story poll: restore error / keep error", "Artifact Drops", "Saves", "Reply to theory comments without explaining the whole file"),
    (2, "Test print flash photo with no clean reveal", "Wrong blue ink crop", "Product Reality", "Sends", "Show the tag or sleeve detail next"),
    (3, "Fake forum fragment about a blue pixel rumor", "Point to hidden event without hint", "Lore / System", "Profile visits", "Save best comments as future proof"),
    (4, "Packaging sticker test with SLOT B label", "Inventory slot note", "Product Reality", "Saves", "Ask no direct question"),
    (5, "Magazine-scan style product ad issue 00", "Crop marks and bad export edge", "Artifact Drops", "Shares", "Pitch one archive page manually"),
    (6, "Product desk photo with normal human mess", "Filename clue in story", "Product Reality", "Profile visits", "Show one more real object"),
    (7, "Week 1 archive index recap", "Which file feels wrong story", "Lore / System", "Saves", "Sunday metric review"),
    (8, "Hidden event image with one tiny clickable clue", "No hints countdown screenshot", "Lore / System", "Unlocks", "Reply only to people who found it"),
    (9, "Fake dev note code rejected twice", "Build note story", "Lore / System", "Comments", "Let discovery breathe"),
    (10, "Old website screenshot carousel with broken footer code", "Footer close crop", "Artifact Drops", "Profile visits", "Send people to site only when asked"),
    (11, "GameFAQs-style thread fragment", "Poll: post code / gatekeep", "Cultural Signals", "Comments", "Save community theories"),
    (12, "Rejected ad proof with red markup", "Layer panel from damaged export", "Artifact Drops", "Saves", "Manual pitch to design pages"),
    (13, "Product clue in CRT reflection", "Flash photo no caption", "Motion", "Sends", "Track repeat comments"),
    (14, "Week 2 unlock log recap", "Quiet archive story", "Lore / System", "Unlocks", "Review unlock-to-signup rate"),
    (15, "First run postmortem with one mistake admitted", "Packing ledger crop", "Social Proof", "Profile visits", "Reply to missed-drop comments plainly"),
    (16, "SLOT B release teaser", "Waitlist as event flag", "Product Reality", "Follows", "DM 1-3 fitting collector pages"),
    (17, "Fit/proof photo with sleeve close-up", "Print alignment note", "Product Reality", "Site clicks", "Answer size/product questions clearly"),
    (18, "Packaging carousel with partially visible QR", "Secret page generated log", "Lore / System", "Unlocks", "Track QR scans if available"),
    (19, "Fake import listing for product artifact", "Translation detail", "Artifact Drops", "Saves", "Pitch one international moodboard page"),
    (20, "Product page screenshot cropped like an old shop", "localStorage flag story", "Product Reality", "Website clicks", "Reply with link only when asked"),
    (21, "Boxes counted and quantity plain", "qty posted when boxes counted", "Product Reality", "Add to cart", "Finalize paid test decision"),
    (22, "Drop window as system screen", "Password page teaser", "Lore / System", "Profile visits", "No cold DMs during window"),
    (23, "Hidden code clue carousel", "One false-lead correction", "Artifact Drops", "Saves", "Do not spoon-feed the answer"),
    (24, "Early access flag and product page live", "Countdown bug", "Product Reality", "Site clicks", "Track hourly during live window"),
    (25, "Second restored run opens", "True stock count only if known", "Product Reality", "Purchases", "Support first and lore second"),
    (26, "Shipping prep proof", "Redacted label story", "Social Proof", "Saves", "Capture FAQ questions"),
    (27, "Community discoveries carousel", "Repost external pages", "Social Proof", "Shares", "Thank partners privately"),
    (28, "Drop aftermath what changed and what did not", "Defect note", "Social Proof", "Profile visits", "Prepare weekly postmortem"),
    (29, "Archive entry for second run", "Next slug cropped", "Artifact Drops", "Saves", "DM 1-3 pages with recap"),
    (30, "Month recap as recovered index", "continue screen", "Lore / System", "Follows", "Build next sprint from top saved lane"),
]


def write_csv(path: Path) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    with path.open("w", newline="", encoding="utf-8") as handle:
        writer = csv.writer(handle)
        writer.writerow(["day", "primary_post", "secondary_story", "pillar", "metric_to_watch", "follow_up"])
        writer.writerows(CALENDAR)


def markdown() -> str:
    lines = [
        "# 30-Day Action Replay Content Calendar",
        "",
        "Internal helper-agent file. Not a publishing command.",
        "",
        "| Day | Primary Post | Secondary / Story | Pillar | Metric To Watch | Follow-Up |",
        "| --- | --- | --- | --- | --- | --- |",
    ]
    for row in CALENDAR:
        lines.append("| {} | {} | {} | {} | {} | {} |".format(*[str(part).replace("|", "/") for part in row]))
    return "\n".join(lines) + "\n"


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--csv", default="data/content_calendar.csv", type=Path)
    parser.add_argument("--markdown", default="docs/content_calendar_30_days.md", type=Path)
    parser.add_argument("--write", action="store_true")
    args = parser.parse_args()

    output = markdown()
    if args.write:
        write_csv(args.csv)
        args.markdown.parent.mkdir(parents=True, exist_ok=True)
        args.markdown.write_text(output, encoding="utf-8")
    print(output)


if __name__ == "__main__":
    main()
