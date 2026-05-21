# Action Replay Ad Video Asset Hub

Last updated: May 10, 2026

This hub tracks the AI image references for the Action Replay ad video. Source frames live in:

`/Users/zrelich/Desktop/actionreplaywebsite/public/assets/generated/ad-video/source-frames/`

The typed project library is:

`/Users/zrelich/Desktop/actionreplaywebsite/src/lib/ad-video-assets.ts`

Every frame is also registered in:

`/Users/zrelich/Desktop/actionreplaywebsite/src/lib/assets-manifest.ts`

Quick scan contact sheet:

`/Users/zrelich/Desktop/actionreplaywebsite/public/assets/generated/ad-video/ad-video-source-contact-sheet.jpg`

## Core Read

The strongest campaign spine is:

1. A hidden PS2-era memory-card file named `final_mix.mov`.
2. The file boots an Action Replay interface on a CRT.
3. The interface unlocks a rain-soaked Tokyo-Seoul street world.
4. The world expands into storefronts covered in Action Replay posters.
5. The ad ends on a rooftop or store exterior with the brand feeling like an underground signal.

Best primary frames for Higgsfield first-pass video:

| Use | Asset ID | File |
| --- | --- | --- |
| Cold open close-up | `ad-video-01-memory-card-closeup` | `01-ps2-memory-card-final-mix-closeup.png` |
| Human story beat | `ad-video-03-skater-selects-final-mix` | `03-skater-selects-final-mix-tv.png` |
| File metadata insert | `ad-video-05-browser-file-details` | `05-ps2-browser-final-mix-file-details.png` |
| Strong boot menu | `ad-video-11-action-replay-menu-window` | `11-action-replay-main-menu-window.png` |
| UI transition | `ad-video-16-translucent-memory-card-overlay` | `16-translucent-memory-card-overlay-room.png` |
| Hardware macro | `ad-video-19-blue-gamecube-cartridge` | `19-blue-gamecube-action-replay-cartridge.png` |
| City hero | `ad-video-24-tokyo-seoul-ramp-skyline-car` | `24-tokyo-seoul-ramp-skyline-car.png` |
| Retail hero | `ad-video-29-c-combo-store-window` | `29-c-combo-store-action-replay-window.png` |
| Clean end card | `ad-video-30-rainy-rooftop-helipad` | `30-rainy-rooftop-helipad-city.png` |

## Collections

### Cold Open Memory Card

Use these for the "lost file discovered" sequence:

- `ad-video-01-memory-card-closeup`
- `ad-video-03-skater-selects-final-mix`
- `ad-video-05-browser-file-details`
- `ad-video-12-hidden-archive-user-side`
- `ad-video-16-translucent-memory-card-overlay`

Suggested Higgsfield feel: slow handheld push-ins, CRT bloom, scanline roll, blue UI breathing, tiny room-light flicker.

### Boot Menu

Use these for the Action Replay software activation:

- `ad-video-04-action-replay-menu-crt`
- `ad-video-06-action-replay-bedroom-wide`
- `ad-video-11-action-replay-menu-window`
- `ad-video-17-action-replay-bed-wide`

Suggested Higgsfield feel: locked CRT shots, menu cursor flicks, glowing blue UI smoke, lava lamp movement, subtle bed/room parallax.

### Hardware Macros

Use these for tactile object inserts:

- `ad-video-15-final-mix-dvd-memory-card`
- `ad-video-19-blue-gamecube-cartridge`
- `ad-video-21-action-replay-ds-cartridge-macro`
- `ad-video-23-action-replay-ds-product-macro`

Suggested Higgsfield feel: macro orbit, dust, scratches, refracted blue plastic, rack focus from label to edge.

### Tokyo-Seoul World

Use these after the boot/menu moment:

- `ad-video-20-tokyo-seoul-quick-save-car`
- `ad-video-24-tokyo-seoul-ramp-skyline-car`
- `ad-video-26-tokyo-seoul-rain-crosswalk`
- `ad-video-28-seoul-tokyo-namco-skyline-car`

Suggested Higgsfield feel: wet street reflections, slow car orbit, train moving overhead, HUD elements blinking without adding new readable brands.

### Retail Takeover

Use these for the brand-world storefront reveal:

- `ad-video-25-convenience-store-posters`
- `ad-video-27-action-replay-konbini-exterior`
- `ad-video-29-c-combo-store-window`

Suggested Higgsfield feel: sidewalk tracking, fluorescent flicker, rain, posters glowing behind glass, vending machine hum.

### Clean Establishing

Use these for title card, intro, or ending:

- `ad-video-22-project-x-rooftop-city`
- `ad-video-30-rainy-rooftop-helipad`

Suggested Higgsfield feel: slow crane/pan, rolling clouds, red beacon lights, puddle ripples, large negative space for typography.

## Suggested 30-45 Second Cut

1. `ad-video-30-rainy-rooftop-helipad`: 2s establishing storm city.
2. `ad-video-01-memory-card-closeup`: 3s push into `final_mix.mov`.
3. `ad-video-03-skater-selects-final-mix`: 3s over-the-shoulder selection.
4. `ad-video-05-browser-file-details`: 2s metadata/file icon insert.
5. `ad-video-19-blue-gamecube-cartridge`: 3s hardware macro.
6. `ad-video-11-action-replay-menu-window`: 4s boot menu reveal.
7. `ad-video-16-translucent-memory-card-overlay`: 3s UI projection/glitch transition.
8. `ad-video-20-tokyo-seoul-quick-save-car`: 4s street world unlock.
9. `ad-video-24-tokyo-seoul-ramp-skyline-car`: 5s hero car/train shot.
10. `ad-video-29-c-combo-store-window`: 5s storefront reveal.
11. `ad-video-27-action-replay-konbini-exterior`: 4s street-wide store takeover.
12. `ad-video-30-rainy-rooftop-helipad`: 3s end-card frame.

## Duplicate Sources

These are exact duplicate image files and are preserved only for provenance:

- `ad-video-09-memory-card-sony-skull-alt` duplicates `ad-video-07-memory-card-sony-skull`
- `ad-video-10-action-replay-bedroom-wide-alt` duplicates `ad-video-06-action-replay-bedroom-wide`

Use the canonical versions unless a future workflow needs to trace the original desktop drop order.

## Rights And Brand-Safety Notes

These images are strong references, but many include recognizable third-party marks and product language: Sony, PlayStation, PS2, Datel, GameCube, DS, Coca-Cola, Kirin, Namco-like signage, Nissan-like car cues, skate/media posters, and toy/character silhouettes.

For commercial launch, rebuild the final frames as original Action Replay universe assets. Preserve the composition function, mood, lighting, UI role, and product silhouette, but replace protected logos, characters, and exact product labels.

## Reusable Higgsfield Prompt Base

Use this base when generating video from any frame:

```text
cinematic Y2K cyber-streetwear ad, rain-soaked blue and red lighting, CRT scanlines, handheld camcorder texture, subtle parallax, practical room light, underground game archive mood, Action Replay brand world, slow deliberate camera movement, realistic reflections, physical dust and scratches
```

Use this negative prompt:

```text
new third-party logos, readable real brand names, warped hands, unreadable UI labels, modern smartphones, glossy generic sci-fi, clean showroom lighting, random extra characters, plastic toy motion, excessive camera spin, deformed cars, melting text
```

## Rejection Tags

Every rejected video generation must be logged with `REJECT`, one or more failure tags from:

`/Users/zrelich/Desktop/actionreplaywebsite/action-replay-higgsfield/prompts/AR_FinalMix_FailureTags.md`

The same log entry must include a one-sentence diagnosis and at least one issue category: `motion`, `lighting`, `continuity`, `anatomy`, `environment`, `camera`, `pacing`, or `texture`.

Platform/moderation failures use `FT-21` through `FT-23` and issue category `platform`.

## Higgsfield IP Sanitization

Before any Higgsfield generation, use the sanitization layer at:

`/Users/zrelich/Desktop/actionreplaywebsite/action-replay-higgsfield/prompts/AR_FinalMix_IPSanitization.md`

The runnable prompt should preserve behavioral authenticity while avoiding literal protected platform/company/character names.
