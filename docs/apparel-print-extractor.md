# Apparel Print Extractor

Local, non-generative extraction tool for pulling a flat apparel print graphic out of a shirt mockup.

The tool preserves source pixels wherever possible. It builds a soft alpha matte from color distance, saturation, contrast, edges, and a user print-area mask. It also exports debug images and manual correction layers so the result can be painted and rerun.

## Install

```bash
python3 -m venv .venv-apparel-extractor
source .venv-apparel-extractor/bin/activate
python -m pip install -r scripts/apparel_print_extractor_requirements.txt
```

ImageMagick is optional but recommended for alpha verification. This machine already has `magick` at `/opt/homebrew/bin/magick`.

Super-resolution is optional. If no real local upscaler is available, the tool falls back to OpenCV Lanczos and records that in `report.md`.

Real-ESRGAN option:

```bash
brew install realesrgan-ncnn-vulkan
python scripts/apparel_print_extractor.py input.png \
  --scale 4 \
  --upscaler realesrgan \
  --realesrgan-bin /opt/homebrew/bin/realesrgan-ncnn-vulkan
```

OpenCV DNN super-resolution option:

```bash
python -m pip install opencv-contrib-python
python scripts/apparel_print_extractor.py input.png \
  --scale 4 \
  --upscaler opencv-dnn \
  --dnn-superres-model /path/to/EDSR_x4.pb \
  --dnn-superres-name edsr
```

## Basic Run

```bash
python scripts/apparel_print_extractor.py "/path/to/shirt.png" \
  --crop 210,285,710,1010 \
  --scale 4 \
  --texture-flatten \
  --preserve-light-ink \
  --remove-shirt-haze \
  --recover-internal-light-art \
  --internal-haze-refine \
  --internal-light-min-alpha 140 \
  --light-art-alpha-floor 155 \
  --internal-haze-alpha-cap 25 \
  --internal-art-confidence-threshold 0.42 \
  --fabric-likeness-threshold 0.62 \
  --strong-ink-dilate-px 18 \
  --stroke-connect-radius 24 \
  --feather-px 0.35 \
  --auto-tune \
  --out outputs/apparel-print-extractor
```

`--crop` is `x,y,width,height` in the original image after EXIF orientation correction.

## Mask Workflow

Create a first pass with a rough crop:

```bash
python scripts/apparel_print_extractor.py input.png --crop 215,285,690,980 --scale 4
```

Then edit any of these correction masks:

- `outputs/.../layers/manual_keep_mask.png`: paint white where artwork must be restored.
- `outputs/.../layers/manual_delete_mask.png`: paint white where shirt residue must be removed.
- `outputs/.../layers/manual_soft_alpha.png`: optional grayscale final alpha override.
- Save as a new PNG, then rerun:

```bash
python scripts/apparel_print_extractor.py input.png \
  --crop 215,285,690,980 \
  --scale 4 \
  --preserve-light-ink \
  --remove-shirt-haze \
  --manual-keep outputs/.../layers/manual_keep_mask.edited.png \
  --manual-delete outputs/.../layers/manual_delete_mask.edited.png
```

Manual precedence is: automatic alpha, then `manual_keep`, then `manual_delete`, then `manual_soft_alpha` if supplied. Soft alpha overrides both keep and delete.

You can also provide a rough print-area polygon:

```bash
python scripts/apparel_print_extractor.py input.png \
  --crop 215,285,690,980 \
  --polygon "20,20 680,20 680,950 20,950"
```

Or use an interactive polygon drawer:

```bash
python scripts/apparel_print_extractor.py input.png --draw-mask
```

## Outputs

Each run writes:

- `extracted_artwork.png`
- `extracted_artwork_fullsize.png`
- `final_rgba_untrimmed.png`
- `final_rgba_trimmed.png`
- `alpha_mask.png`
- `final_alpha_mask.png`
- `raw_alpha_score.png`
- `protected_ink_mask.png`
- `shirt_residue_mask.png`
- `print_silhouette_mask.png`
- `print_silhouette_core.png`
- `print_silhouette_peripheral.png`
- `silhouette_confidence.png`
- `internal_holes_detected.png`
- `internal_holes_recovered.png`
- `internal_haze_refined_mask.png`
- `recovered_art_kept.png`
- `recovered_haze_removed.png`
- `false_deletion_risk.png`
- `structure_score.png`
- `fabric_likeness_score.png`
- `artwork_confidence_score.png`
- `local_edge_score.png`
- `local_contrast_score.png`
- `saturation_score.png`
- `lab_distance_from_fabric_score.png`
- `connected_to_ink_score.png`
- `stroke_likeness_score.png`
- `protection_zones_overlay.png`
- `halo_cleanup_before.png`
- `halo_cleanup_after.png`
- `crop_preview.png`
- `checkered_preview.png`
- `black_bg_preview.png`
- `white_bg_preview.png`
- `gray_bg_preview.png`
- `red_bg_preview.png`
- `alpha_only_preview.png`
- `edge_error_preview.png`
- `estimated_fabric_base.png`
- `normalized_crop.png`
- `report.md`
- `report.json`
- `comparison_report.md` when `--compare-against` is used
- `auto_tune_summary.md` and `contact_sheet.png` when `--auto-tune` is used
- `best_auto_tune_extracted_artwork.png` when `--auto-tune` is used
- `best_auto_tune_extracted_artwork_fullsize.png` when `--auto-tune` is used
- `best_auto_tune_alpha_mask.png` when `--auto-tune` is used
- `layers/original_crop.png`
- `layers/normalized_crop.png`
- `layers/estimated_fabric_base.png`
- `layers/extracted_art.png`
- `layers/mask.png`
- `layers/final_artwork_rgb.png`
- `layers/final_alpha_mask.png`
- `layers/final_rgba.png`
- `layers/protected_ink_mask.png`
- `layers/recovered_internal_art.png`
- `layers/removed_internal_haze.png`
- `layers/deleted_shirt_pixels.png`
- `layers/preview_background.png`
- `layers/manual_mask_to_edit.png`
- `layers/manual_keep_mask.png`
- `layers/manual_delete_mask.png`
- `layers/manual_soft_alpha.png`
- `outputs/debug/<run-id>/...` intermediate pipeline images

## Matte Modes

`--preserve-light-ink` protects structured white/gray artwork using edge strength, local detail, component confidence, and distance to colored/dark ink. It is designed for eyes, gloves, chrome highlights, water splashes, white UI marks, barcode/text, and outline effects.

`--remove-shirt-haze` suppresses low-saturation, low-detail, weak-edge fabric residue after the raw alpha score is built. It is intentionally separate from light-ink protection so it can remove broad shirt haze without using a single white threshold.

`--recover-internal-light-art` builds a broad print silhouette from confident colored/dark ink, chrome/text/barcode edges, and the user mask. Inside that silhouette, structured ambiguous white/gray pixels are treated as likely artwork instead of shirt. The `--internal-light-min-alpha` value sets the alpha floor for these recovered internal regions.

`--internal-haze-refine` runs after internal light recovery. It scores recovered light pixels by local edges, contrast, saturation, LAB distance from the estimated fabric base, connection to strong ink, stroke likeness, fabric likeness, and heuristic protection zones. Pixels with high artwork confidence get an alpha floor from `--light-art-alpha-floor`; pixels with high fabric likeness and low artwork confidence are capped by `--internal-haze-alpha-cap`.

Useful refinement knobs:

- `--internal-art-confidence-threshold`: confidence needed to protect recovered light art.
- `--fabric-likeness-threshold`: confidence needed to classify recovered light pixels as fabric haze.
- `--strong-ink-dilate-px`: connection distance around confident colored/dark ink.
- `--stroke-connect-radius`: radius for line, text, barcode, splash, and chrome connectivity.

`--auto-tune` renders five variants:

- `A_conservative_keep`: most protective of white/gray artwork.
- `B_balanced`: requested production defaults.
- `C_aggressive_haze_removal`: stronger internal haze suppression.
- `D_text_chrome_preservation`: favors text, barcode, chrome, and UI linework.
- `E_cleanest_alpha`: lowest-haze production candidate.

Each variant writes its own previews and report under `auto_tune/`. The best overall variant is also copied to `best_auto_tune_*` files in the run root.

`edge_error_preview.png` uses cyan for likely remaining shirt residue, red for likely false deletion or artwork holes, and yellow for internal light artwork recovered by `--recover-internal-light-art`.

## Notes

This is an extraction and reconstruction pipeline, not an AI redraw. It cannot recover details that are not present in the source pixels, and it will report likely problem zones when the source mockup contains shirt texture, low-contrast white ink, or degraded tiny text.
