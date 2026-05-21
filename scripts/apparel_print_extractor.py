#!/usr/bin/env python3
"""Extract a flat apparel print graphic from a shirt mockup.

This pipeline is intentionally non-generative. It uses user masks, color and
texture analysis, alpha matting, optional local upscalers, and manual correction
layers. It never redraws or invents design content.
"""

from __future__ import annotations

import argparse
import json
import re
import shutil
import subprocess
import sys
import tempfile
from dataclasses import asdict, dataclass, replace
from datetime import datetime
from pathlib import Path
from typing import Any

import numpy as np
from PIL import Image, ImageDraw, ImageOps

try:
    import cv2
except Exception:  # pragma: no cover - handled with a friendly runtime error.
    cv2 = None  # type: ignore[assignment]


RGB = np.ndarray
Mask = np.ndarray


@dataclass
class RunConfig:
    input_path: str
    out_root: str
    run_id: str
    crop: tuple[int, int, int, int]
    crop_mode: str
    scale: int
    upscaler: str
    upscaler_used: str
    realesrgan_bin: str | None
    dnn_superres_model: str | None
    dnn_superres_name: str
    polygon_source: str
    manual_mask: str | None
    manual_mask_mode: str
    manual_keep: str | None
    manual_delete: str | None
    manual_soft_alpha: str | None
    feather_px: float
    trim_padding: int
    bit_depth: int
    texture_flatten: bool
    preserve_light_ink: bool
    remove_shirt_haze: bool
    recover_internal_light_art: bool
    internal_light_min_alpha: int
    internal_haze_refine: bool
    internal_art_confidence_threshold: float
    fabric_likeness_threshold: float
    internal_haze_alpha_cap: int
    light_art_alpha_floor: int
    strong_ink_dilate_px: int
    stroke_connect_radius: int
    auto_tune: bool
    rembg_helper: bool
    compare_against: str | None


def require_cv2() -> None:
    if cv2 is None:
        print(
            "Missing dependency: OpenCV is required.\n"
            "Install with:\n"
            "  python3 -m venv .venv-apparel-extractor\n"
            "  source .venv-apparel-extractor/bin/activate\n"
            "  python -m pip install -r scripts/apparel_print_extractor_requirements.txt",
            file=sys.stderr,
        )
        raise SystemExit(2)


def mkdir(path: Path) -> Path:
    path.mkdir(parents=True, exist_ok=True)
    return path


def slugify(value: str) -> str:
    value = Path(value).stem.lower()
    value = re.sub(r"[^a-z0-9]+", "-", value).strip("-")
    return value or "image"


def now_run_id(input_path: str) -> str:
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    return f"{slugify(input_path)}-{stamp}"


def load_oriented_rgb(path: Path) -> RGB:
    with Image.open(path) as im:
        im = ImageOps.exif_transpose(im)
        return np.asarray(im.convert("RGB"), dtype=np.uint8)


def save_rgb(path: Path, rgb: RGB) -> None:
    Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8), "RGB").save(path)


def save_gray(path: Path, mask: Mask) -> None:
    Image.fromarray(np.clip(mask, 0, 255).astype(np.uint8), "L").save(path)


def save_rgba_8(path: Path, rgba: np.ndarray) -> None:
    Image.fromarray(np.clip(rgba, 0, 255).astype(np.uint8), "RGBA").save(path)


def save_rgba_png(path: Path, rgba8: np.ndarray, bit_depth: int) -> int:
    rgba8 = np.clip(rgba8, 0, 255).astype(np.uint8)
    if bit_depth == 16 and cv2 is not None:
        rgba16 = rgba8.astype(np.uint16) * 257
        bgra16 = rgba16[..., [2, 1, 0, 3]]
        if cv2.imwrite(str(path), bgra16):
            return 16
    save_rgba_8(path, rgba8)
    return 8


def to_bgr(rgb: RGB) -> np.ndarray:
    return rgb[..., ::-1].copy()


def to_rgb(bgr: np.ndarray) -> RGB:
    return bgr[..., ::-1].copy()


def parse_crop(value: str | None, mode: str, width: int, height: int) -> tuple[int, int, int, int]:
    if not value:
        return (0, 0, width, height)
    nums = [float(x) for x in re.split(r"[,\s]+", value.strip()) if x]
    if len(nums) != 4:
        raise ValueError("--crop expects four numbers")
    x1, y1, a, b = nums
    if mode == "xywh":
        x2 = x1 + a
        y2 = y1 + b
    else:
        x2 = a
        y2 = b
    x1_i = max(0, min(width - 1, int(round(x1))))
    y1_i = max(0, min(height - 1, int(round(y1))))
    x2_i = max(x1_i + 1, min(width, int(round(x2))))
    y2_i = max(y1_i + 1, min(height, int(round(y2))))
    return (x1_i, y1_i, x2_i, y2_i)


def crop_rgb(rgb: RGB, box: tuple[int, int, int, int]) -> RGB:
    x1, y1, x2, y2 = box
    return rgb[y1:y2, x1:x2].copy()


def smoothstep(edge0: float, edge1: float, x: np.ndarray) -> np.ndarray:
    if edge1 <= edge0:
        return (x >= edge1).astype(np.float32)
    t = np.clip((x.astype(np.float32) - edge0) / (edge1 - edge0), 0.0, 1.0)
    return t * t * (3.0 - 2.0 * t)


def normalize01(x: np.ndarray, percentile: float = 99.0) -> np.ndarray:
    x = x.astype(np.float32)
    denom = float(np.percentile(x, percentile))
    if denom <= 1e-6:
        denom = float(x.max()) if x.max() > 0 else 1.0
    return np.clip(x / denom, 0.0, 1.0)


def run_command(args: list[str], cwd: Path | None = None) -> tuple[bool, str]:
    try:
        proc = subprocess.run(
            args,
            cwd=str(cwd) if cwd else None,
            check=False,
            text=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.STDOUT,
        )
    except Exception as exc:
        return False, str(exc)
    return proc.returncode == 0, proc.stdout.strip()


def upscale_with_realesrgan(rgb: RGB, scale: int, out_dir: Path, binary: str | None) -> tuple[RGB | None, str]:
    exe = binary or shutil.which("realesrgan-ncnn-vulkan") or shutil.which("realesrgan")
    if not exe:
        return None, "Real-ESRGAN CLI not found"
    with tempfile.TemporaryDirectory(prefix="apparel-realesrgan-") as tmp:
        tmp_path = Path(tmp)
        src = tmp_path / "input.png"
        dst = tmp_path / "output.png"
        save_rgb(src, rgb)
        args = [exe, "-i", str(src), "-o", str(dst), "-s", str(scale)]
        ok, output = run_command(args)
        if not ok or not dst.exists():
            return None, output or "Real-ESRGAN failed"
        out_dir.mkdir(parents=True, exist_ok=True)
        return load_oriented_rgb(dst), f"{Path(exe).name} scale {scale}"


def upscale_with_dnn_superres(
    rgb: RGB,
    scale: int,
    model_path: str | None,
    model_name: str,
) -> tuple[RGB | None, str]:
    if not model_path:
        return None, "No OpenCV dnn_superres model path supplied"
    if not hasattr(cv2, "dnn_superres"):
        return None, "OpenCV dnn_superres module is unavailable"
    model_file = Path(model_path)
    if not model_file.exists():
        return None, f"OpenCV superres model does not exist: {model_file}"
    try:
        sr = cv2.dnn_superres.DnnSuperResImpl_create()
        sr.readModel(str(model_file))
        sr.setModel(model_name, scale)
        up = sr.upsample(to_bgr(rgb))
        return to_rgb(up), f"OpenCV dnn_superres {model_name} x{scale}"
    except Exception as exc:
        return None, str(exc)


def upscale_lanczos(rgb: RGB, scale: int) -> RGB:
    if scale == 1:
        return rgb.copy()
    h, w = rgb.shape[:2]
    up = cv2.resize(rgb, (w * scale, h * scale), interpolation=cv2.INTER_LANCZOS4)
    return up.astype(np.uint8)


def upscale_image(
    rgb: RGB,
    scale: int,
    upscaler: str,
    debug_dir: Path,
    realesrgan_bin: str | None,
    dnn_superres_model: str | None,
    dnn_superres_name: str,
) -> tuple[RGB, str]:
    if scale == 1:
        return rgb.copy(), "none"
    if upscaler in {"auto", "realesrgan"}:
        up, msg = upscale_with_realesrgan(rgb, scale, debug_dir, realesrgan_bin)
        if up is not None:
            return up, msg
        if upscaler == "realesrgan":
            print(f"Warning: {msg}. Falling back to Lanczos.", file=sys.stderr)
    if upscaler in {"auto", "opencv-dnn"}:
        up, msg = upscale_with_dnn_superres(rgb, scale, dnn_superres_model, dnn_superres_name)
        if up is not None:
            return up, msg
        if upscaler == "opencv-dnn":
            print(f"Warning: {msg}. Falling back to Lanczos.", file=sys.stderr)
    return upscale_lanczos(rgb, scale), f"OpenCV Lanczos x{scale}"


def parse_points_string(value: str) -> list[tuple[float, float]]:
    parts = [p for p in re.split(r"[\s;]+", value.strip()) if p]
    points: list[tuple[float, float]] = []
    for part in parts:
        xy = [float(x) for x in part.split(",") if x]
        if len(xy) != 2:
            raise ValueError(f"Bad polygon point: {part}")
        points.append((xy[0], xy[1]))
    if len(points) < 3:
        raise ValueError("Polygon needs at least three points")
    return points


def load_polygon_json(path: Path) -> list[tuple[float, float]]:
    data = json.loads(path.read_text())
    if isinstance(data, dict):
        data = data.get("points", data.get("polygon"))
    if not isinstance(data, list):
        raise ValueError("Polygon JSON must be a list or an object with a points list")
    points: list[tuple[float, float]] = []
    for item in data:
        if not isinstance(item, (list, tuple)) or len(item) != 2:
            raise ValueError("Every polygon point must be [x, y]")
        points.append((float(item[0]), float(item[1])))
    if len(points) < 3:
        raise ValueError("Polygon needs at least three points")
    return points


def polygon_to_mask(size: tuple[int, int], points: list[tuple[float, float]]) -> Mask:
    width, height = size
    im = Image.new("L", (width, height), 0)
    ImageDraw.Draw(im).polygon(points, fill=255)
    return np.asarray(im, dtype=np.uint8)


def resize_mask(mask: Mask, size: tuple[int, int], nearest: bool = True) -> Mask:
    width, height = size
    interp = cv2.INTER_NEAREST if nearest else cv2.INTER_LINEAR
    resized = cv2.resize(mask.astype(np.uint8), (width, height), interpolation=interp)
    return np.clip(resized, 0, 255).astype(np.uint8)


def load_mask(path: Path, size: tuple[int, int], nearest: bool = True) -> Mask:
    with Image.open(path) as im:
        mask = np.asarray(im.convert("L"), dtype=np.uint8)
    if mask.shape[1] != size[0] or mask.shape[0] != size[1]:
        mask = resize_mask(mask, size, nearest=nearest)
    return mask


def draw_polygon_mask_interactive(rgb: RGB) -> Mask:
    require_cv2()
    max_display = 1400
    h, w = rgb.shape[:2]
    scale = min(1.0, max_display / max(w, h))
    display_size = (max(1, int(w * scale)), max(1, int(h * scale)))
    preview = cv2.resize(to_bgr(rgb), display_size, interpolation=cv2.INTER_AREA)
    points: list[tuple[int, int]] = []
    window = "Draw print-area polygon: left-click points, backspace undo, enter finish, q cancel"

    def render() -> np.ndarray:
        canvas = preview.copy()
        if points:
            for pt in points:
                cv2.circle(canvas, pt, 4, (0, 255, 0), -1)
            if len(points) > 1:
                cv2.polylines(canvas, [np.array(points, dtype=np.int32)], False, (0, 255, 0), 2)
        return canvas

    def on_mouse(event: int, x: int, y: int, _flags: int, _param: Any) -> None:
        if event == cv2.EVENT_LBUTTONDOWN:
            points.append((x, y))
            cv2.imshow(window, render())

    cv2.namedWindow(window, cv2.WINDOW_NORMAL)
    cv2.setMouseCallback(window, on_mouse)
    cv2.imshow(window, render())
    while True:
        key = cv2.waitKey(30) & 0xFF
        if key in {13, 10, 32}:  # enter or space
            break
        if key in {8, 127}:  # backspace
            if points:
                points.pop()
                cv2.imshow(window, render())
        if key in {ord("q"), 27}:
            cv2.destroyWindow(window)
            raise SystemExit("Mask drawing cancelled")
    cv2.destroyWindow(window)
    if len(points) < 3:
        raise SystemExit("Mask drawing needs at least three points")
    full_points = [(x / scale, y / scale) for x, y in points]
    return polygon_to_mask((w, h), full_points)


def mask_from_args(
    args: argparse.Namespace,
    rgb: RGB,
    scale: int,
    debug_dir: Path,
) -> tuple[Mask, str]:
    h, w = rgb.shape[:2]
    size = (w, h)
    if args.draw_mask:
        mask = draw_polygon_mask_interactive(rgb)
        return mask, "interactive polygon"
    if args.polygon_mask:
        mask = load_mask(Path(args.polygon_mask), size, nearest=True)
        return mask, str(args.polygon_mask)
    if args.polygon_json:
        points = load_polygon_json(Path(args.polygon_json))
        if args.polygon_space == "pre-upscale":
            points = [(x * scale, y * scale) for x, y in points]
        return polygon_to_mask(size, points), str(args.polygon_json)
    if args.polygon:
        points = parse_points_string(args.polygon)
        if args.polygon_space == "pre-upscale":
            points = [(x * scale, y * scale) for x, y in points]
        return polygon_to_mask(size, points), "inline polygon"

    full = np.full((h, w), 255, dtype=np.uint8)
    save_gray(debug_dir / "02_user_polygon_mask_full_crop_fallback.png", full)
    return full, "full crop fallback"


def estimate_base_color(rgb: RGB, polygon_mask: Mask) -> tuple[np.ndarray, dict[str, Any]]:
    bgr = to_bgr(rgb)
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB)
    h, w = rgb.shape[:2]
    border_px = max(6, int(min(h, w) * 0.06))
    border = np.zeros((h, w), dtype=bool)
    border[:border_px, :] = True
    border[-border_px:, :] = True
    border[:, :border_px] = True
    border[:, -border_px:] = True
    outside_poly = polygon_mask < 10
    whiteish = (hsv[..., 1] < 45) & (hsv[..., 2] > 145) & (lab[..., 0] > 145)
    candidates = (outside_poly | border) & whiteish
    if int(candidates.sum()) < max(250, (h * w) // 250):
        candidates = whiteish
    if int(candidates.sum()) < 100:
        candidates = border | outside_poly
    if int(candidates.sum()) < 100:
        candidates = np.ones((h, w), dtype=bool)
    pixels = rgb[candidates]
    base_rgb = np.median(pixels, axis=0).astype(np.float32)
    report = {
        "base_rgb": [round(float(x), 2) for x in base_rgb],
        "candidate_pixels": int(candidates.sum()),
        "candidate_fraction": round(float(candidates.mean()), 5),
    }
    return base_rgb, report


def fabric_seed_mask(rgb: RGB, base_rgb: np.ndarray, polygon_mask: Mask) -> Mask:
    bgr = to_bgr(rgb)
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
    base_lab = cv2.cvtColor(np.uint8([[base_rgb[::-1]]]), cv2.COLOR_BGR2LAB)[0, 0].astype(np.float32)
    delta = np.sqrt(
        ((lab[..., 0] - base_lab[0]) * 0.45) ** 2
        + ((lab[..., 1] - base_lab[1]) * 1.6) ** 2
        + ((lab[..., 2] - base_lab[2]) * 1.6) ** 2
    )
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 60, 140)
    fabric = (
        (delta < 13)
        & (hsv[..., 1] < 48)
        & (hsv[..., 2] > 120)
        & (edges < 1)
        & (polygon_mask > 0)
    )
    kernel = np.ones((3, 3), np.uint8)
    fabric = cv2.morphologyEx(fabric.astype(np.uint8) * 255, cv2.MORPH_OPEN, kernel)
    return fabric.astype(np.uint8)


def mild_denoise_fabric(rgb: RGB, fabric_mask: Mask) -> RGB:
    bgr = to_bgr(rgb)
    try:
        denoised = cv2.fastNlMeansDenoisingColored(bgr, None, 3, 3, 7, 21)
    except Exception:
        denoised = cv2.bilateralFilter(bgr, 5, 18, 18)
    mask = cv2.GaussianBlur((fabric_mask > 0).astype(np.float32), (0, 0), 1.2)
    mask = np.clip(mask[..., None] * 0.75, 0.0, 0.75)
    out = bgr.astype(np.float32) * (1.0 - mask) + denoised.astype(np.float32) * mask
    return to_rgb(out.astype(np.uint8))


def estimate_lighting(rgb: RGB, base_rgb: np.ndarray, polygon_mask: Mask, debug_dir: Path) -> tuple[RGB, RGB]:
    bgr = to_bgr(rgb)
    h, w = rgb.shape[:2]
    fabric = fabric_seed_mask(rgb, base_rgb, polygon_mask)
    inpaint_mask = ((polygon_mask > 0) & (fabric < 1)).astype(np.uint8) * 255
    try:
        filled = cv2.inpaint(bgr, inpaint_mask, 3, cv2.INPAINT_TELEA)
    except Exception:
        filled = bgr.copy()
    blur_radius = max(25, int(round(min(h, w) * 0.055)) | 1)
    if blur_radius % 2 == 0:
        blur_radius += 1
    lighting = cv2.GaussianBlur(filled, (blur_radius, blur_radius), 0)
    base_bgr = base_rgb[::-1].astype(np.float32)
    denom = np.maximum(lighting.astype(np.float32), 8.0)
    normalized = np.clip(bgr.astype(np.float32) / denom * base_bgr, 0, 255)
    save_rgb(debug_dir / "04_lighting_field.png", to_rgb(lighting))
    return to_rgb(normalized.astype(np.uint8)), to_rgb(lighting)


@dataclass
class AlphaMaps:
    alpha: np.ndarray
    alpha_before_internal_haze_refine: np.ndarray
    raw_alpha_score: np.ndarray
    protected_ink: np.ndarray
    shirt_residue: np.ndarray
    false_deletion_risk: np.ndarray
    print_silhouette: np.ndarray
    print_silhouette_core: np.ndarray
    print_silhouette_peripheral: np.ndarray
    silhouette_confidence: np.ndarray
    internal_holes_detected: np.ndarray
    internal_holes_recovered: np.ndarray
    internal_haze_refined_mask: np.ndarray
    recovered_art_kept: np.ndarray
    recovered_haze_removed: np.ndarray
    local_edge_score: np.ndarray
    local_contrast_score: np.ndarray
    saturation_score: np.ndarray
    lab_distance_from_fabric_score: np.ndarray
    connected_to_ink_score: np.ndarray
    stroke_likeness_score: np.ndarray
    fabric_likeness_score: np.ndarray
    final_artwork_confidence_score: np.ndarray
    protection_zone_bias: np.ndarray
    color_conf: np.ndarray
    sat_conf: np.ndarray
    dark_conf: np.ndarray
    local_conf: np.ndarray
    detail_conf: np.ndarray
    edge_conf: np.ndarray
    component_conf: np.ndarray
    distance_conf: np.ndarray
    near_base: np.ndarray
    residue_risk: np.ndarray
    color_presence: np.ndarray


def distance_confidence(seed: np.ndarray, radius_px: float) -> np.ndarray:
    seed = seed.astype(bool)
    if int(seed.sum()) == 0:
        return np.zeros(seed.shape, dtype=np.float32)
    inverse = (~seed).astype(np.uint8)
    dist = cv2.distanceTransform(inverse, cv2.DIST_L2, 3).astype(np.float32)
    radius = max(1.0, float(radius_px))
    return np.exp(-((dist / radius) ** 2)).astype(np.float32)


def ellipse_kernel(radius: int) -> np.ndarray:
    radius = max(1, int(radius))
    size = radius * 2 + 1
    return cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (size, size))


def fill_binary_holes(mask: np.ndarray) -> np.ndarray:
    mask_u8 = (mask > 0).astype(np.uint8) * 255
    h, w = mask_u8.shape[:2]
    padded = cv2.copyMakeBorder(mask_u8, 1, 1, 1, 1, cv2.BORDER_CONSTANT, value=0)
    flood = padded.copy()
    flood_mask = np.zeros((h + 4, w + 4), dtype=np.uint8)
    cv2.floodFill(flood, flood_mask, (0, 0), 255)
    holes = cv2.bitwise_not(flood)[1 : h + 1, 1 : w + 1]
    return ((mask_u8 > 0) | (holes > 0)).astype(np.uint8)


def remove_small_components(mask: np.ndarray, min_area: int) -> np.ndarray:
    mask_u8 = (mask > 0).astype(np.uint8)
    count, labels, stats, _ = cv2.connectedComponentsWithStats(mask_u8, connectivity=8)
    kept = np.zeros_like(mask_u8)
    for idx in range(1, count):
        if int(stats[idx, cv2.CC_STAT_AREA]) >= min_area:
            kept[labels == idx] = 1
    return kept


def component_confidence_map(
    candidate: np.ndarray,
    protected_seed: np.ndarray,
    color_presence: np.ndarray,
    edge_conf: np.ndarray,
    detail_conf: np.ndarray,
    local_conf: np.ndarray,
    near_base: np.ndarray,
) -> np.ndarray:
    candidate_u8 = candidate.astype(np.uint8)
    count, labels, stats, _ = cv2.connectedComponentsWithStats(candidate_u8, connectivity=8)
    if count <= 1:
        return np.zeros(candidate.shape, dtype=np.float32)

    areas = stats[:, cv2.CC_STAT_AREA].astype(np.float32)
    areas[0] = 1.0
    flat_labels = labels.ravel()

    def means(feature: np.ndarray) -> np.ndarray:
        sums = np.bincount(flat_labels, weights=feature.ravel().astype(np.float64), minlength=count)
        return (sums / np.maximum(areas, 1.0)).astype(np.float32)

    color_mean = means(color_presence)
    edge_mean = means(edge_conf)
    detail_mean = means(detail_conf)
    local_mean = means(local_conf)
    near_mean = means(near_base.astype(np.float32))
    seed_mean = means(protected_seed.astype(np.float32))

    score = np.maximum.reduce(
        [
            color_mean,
            edge_mean * 0.88,
            detail_mean * 0.90,
            local_mean * 0.70,
            seed_mean * 4.0,
        ]
    )
    small_detail = (areas < 260.0) & ((edge_mean > 0.22) | (detail_mean > 0.22) | (local_mean > 0.24))
    score[small_detail] = np.maximum(score[small_detail], 0.54)
    seed_backed = seed_mean > 0.008
    score[seed_backed] = np.maximum(score[seed_backed], 0.72)

    image_area = float(candidate.shape[0] * candidate.shape[1])
    broad_fabric = (areas > image_area * 0.075) & (near_mean > 0.68) & (color_mean < 0.24) & (detail_mean < 0.24)
    score[broad_fabric] = np.minimum(score[broad_fabric], 0.08)
    score[0] = 0.0
    return np.clip(score[labels], 0.0, 1.0).astype(np.float32)


def light_ink_protection_map(
    light_candidate: np.ndarray,
    seed: np.ndarray,
    edge_conf: np.ndarray,
    detail_conf: np.ndarray,
    local_conf: np.ndarray,
    distance_conf: np.ndarray,
    near_base: np.ndarray,
) -> np.ndarray:
    graph = light_candidate & (
        seed
        | (((edge_conf > 0.18) | (detail_conf > 0.16) | (local_conf > 0.20)) & (distance_conf > 0.035))
        | (((edge_conf > 0.34) | (detail_conf > 0.32)) & (distance_conf > 0.012))
    )
    count, labels, stats, _ = cv2.connectedComponentsWithStats(graph.astype(np.uint8), connectivity=8)
    if count <= 1:
        return np.zeros(light_candidate.shape, dtype=np.float32)

    areas = stats[:, cv2.CC_STAT_AREA].astype(np.float32)
    areas[0] = 1.0
    flat_labels = labels.ravel()

    def means(feature: np.ndarray) -> np.ndarray:
        sums = np.bincount(flat_labels, weights=feature.ravel().astype(np.float64), minlength=count)
        return (sums / np.maximum(areas, 1.0)).astype(np.float32)

    seed_mean = means(seed.astype(np.float32))
    edge_mean = means(edge_conf)
    detail_mean = means(detail_conf)
    local_mean = means(local_conf)
    dist_mean = means(distance_conf)
    near_mean = means(near_base.astype(np.float32))

    image_area = float(light_candidate.shape[0] * light_candidate.shape[1])
    area_frac = areas / max(1.0, image_area)
    keep = (
        (seed_mean > 0.006)
        | ((dist_mean > 0.05) & ((edge_mean > 0.17) | (detail_mean > 0.16) | (local_mean > 0.18)))
        | ((areas < 900.0) & ((edge_mean > 0.20) | (detail_mean > 0.20)))
    )
    broad_unstructured_fabric = (area_frac > 0.030) & (near_mean > 0.55) & (
        (seed_mean < 0.035) | (dist_mean < 0.10) | (detail_mean < 0.22)
    )
    keep &= ~broad_unstructured_fabric

    score = np.zeros(count, dtype=np.float32)
    score[keep] = np.maximum.reduce(
        [
            seed_mean[keep] * 5.0,
            edge_mean[keep] * 1.25,
            detail_mean[keep] * 1.15,
            local_mean[keep],
            dist_mean[keep],
        ]
    )
    score[0] = 0.0
    local_support = np.maximum.reduce(
        [
            seed.astype(np.float32),
            edge_conf * 0.95,
            detail_conf * 0.90,
            local_conf * 0.62,
            distance_conf * 0.12,
        ]
    )
    return np.clip(score[labels] * local_support, 0.0, 1.0).astype(np.float32)


def build_print_silhouette_model(
    raw_score: np.ndarray,
    protected_ink: np.ndarray,
    color_presence: np.ndarray,
    edge_conf: np.ndarray,
    detail_conf: np.ndarray,
    sat_conf: np.ndarray,
    dark_conf: np.ndarray,
    polygon_mask: Mask,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    h, w = raw_score.shape[:2]
    scale_hint = max(1.0, min(h, w) / 710.0)
    core_seed = (
        (polygon_mask > 0)
        & (
            (raw_score > 0.58)
            | (protected_ink > 0.34)
            | (sat_conf > 0.52)
            | (dark_conf > 0.48)
            | ((edge_conf > 0.48) & ((detail_conf > 0.22) | (color_presence > 0.22)))
            | ((detail_conf > 0.46) & (color_presence > 0.16))
        )
    )
    seed = (
        (polygon_mask > 0)
        & (
            core_seed
            | (raw_score > 0.46)
            | (protected_ink > 0.22)
            | (sat_conf > 0.38)
            | (dark_conf > 0.36)
            | ((edge_conf > 0.34) & ((detail_conf > 0.16) | (color_presence > 0.12)))
            | ((detail_conf > 0.34) & (color_presence > 0.12))
        )
    )
    seed = cv2.morphologyEx(seed.astype(np.uint8), cv2.MORPH_OPEN, ellipse_kernel(max(1, round(scale_hint * 1.2))))
    seed = remove_small_components(seed, min_area=max(8, int(12 * scale_hint * scale_hint)))
    core_seed = cv2.morphologyEx(core_seed.astype(np.uint8), cv2.MORPH_OPEN, ellipse_kernel(max(1, round(scale_hint * 0.8))))
    core_seed = remove_small_components(core_seed, min_area=max(8, int(10 * scale_hint * scale_hint)))

    dilate_r = max(4, min(22, int(round(5.5 * scale_hint))))
    close_r = max(8, min(40, int(round(11.0 * scale_hint))))
    bridge_r = max(5, min(32, int(round(8.0 * scale_hint))))
    core_dilate_r = max(3, min(16, int(round(4.0 * scale_hint))))
    core_close_r = max(5, min(26, int(round(7.0 * scale_hint))))

    silhouette = cv2.dilate(seed, ellipse_kernel(dilate_r), iterations=1)
    silhouette = cv2.morphologyEx(silhouette, cv2.MORPH_CLOSE, ellipse_kernel(close_r))
    silhouette = cv2.dilate(silhouette, ellipse_kernel(bridge_r), iterations=1)
    silhouette = cv2.morphologyEx(silhouette, cv2.MORPH_CLOSE, ellipse_kernel(close_r))
    silhouette = fill_binary_holes(silhouette)
    silhouette = remove_small_components(silhouette, min_area=max(48, int(80 * scale_hint * scale_hint)))

    core = cv2.dilate(core_seed, ellipse_kernel(core_dilate_r), iterations=1)
    core = cv2.morphologyEx(core, cv2.MORPH_CLOSE, ellipse_kernel(core_close_r))
    core = fill_binary_holes(core)
    core = remove_small_components(core, min_area=max(32, int(44 * scale_hint * scale_hint)))
    core = ((core > 0) & (silhouette > 0) & (polygon_mask > 0)).astype(np.uint8)
    silhouette = ((silhouette > 0) & (polygon_mask > 0)).astype(np.uint8)
    peripheral = ((silhouette > 0) & (core < 1)).astype(np.uint8)

    seed_conf = np.maximum.reduce([raw_score, protected_ink, color_presence, edge_conf * 0.75, detail_conf * 0.68])
    core_blur = cv2.GaussianBlur(core.astype(np.float32), (0, 0), max(1.0, 3.2 * scale_hint))
    peripheral_blur = cv2.GaussianBlur(peripheral.astype(np.float32), (0, 0), max(1.0, 4.5 * scale_hint))
    confidence = np.clip(seed_conf * 0.62 + core_blur * 0.42 + peripheral_blur * 0.10, 0.0, 1.0)
    confidence *= silhouette.astype(np.float32)
    return silhouette.astype(np.float32), core.astype(np.float32), peripheral.astype(np.float32), confidence.astype(np.float32)


def build_print_silhouette_mask(
    raw_score: np.ndarray,
    protected_ink: np.ndarray,
    color_presence: np.ndarray,
    edge_conf: np.ndarray,
    detail_conf: np.ndarray,
    sat_conf: np.ndarray,
    dark_conf: np.ndarray,
    polygon_mask: Mask,
) -> np.ndarray:
    silhouette, _core, _peripheral, _confidence = build_print_silhouette_model(
        raw_score,
        protected_ink,
        color_presence,
        edge_conf,
        detail_conf,
        sat_conf,
        dark_conf,
        polygon_mask,
    )
    return silhouette


def protection_zone_masks(shape: tuple[int, int], edge_conf: np.ndarray, protected_ink: np.ndarray, color_presence: np.ndarray) -> dict[str, np.ndarray]:
    h, w = shape
    yy, xx = np.indices((h, w))
    zones: dict[str, np.ndarray] = {}
    zones["title/logo chrome region"] = (
        (yy < int(h * 0.25))
        & (xx > int(w * 0.03))
        & (xx < int(w * 0.90))
        & ((edge_conf > 0.15) | (protected_ink > 0.10) | (color_presence > 0.10))
    )
    zones["character region"] = (
        (yy > int(h * 0.25))
        & (yy < int(h * 0.77))
        & (xx > int(w * 0.10))
        & (xx < int(w * 0.84))
        & ((edge_conf > 0.10) | (protected_ink > 0.08) | (color_presence > 0.10))
    )
    zones["eye/glove region"] = (
        zones["character region"]
        & (protected_ink > 0.08)
        & ((edge_conf > 0.16) | (color_presence > 0.12))
    )
    zones["barcode/text region"] = (
        (yy > int(h * 0.77))
        & (yy < int(h * 0.98))
        & (xx < int(w * 0.36))
        & ((edge_conf > 0.12) | (protected_ink > 0.08))
    )
    zones["right-side UI/flag/text column"] = (
        (xx > int(w * 0.70))
        & (yy > int(h * 0.12))
        & (yy < int(h * 0.88))
        & ((edge_conf > 0.12) | (protected_ink > 0.08) | (color_presence > 0.10))
    )
    zones["splash/water region"] = (
        (yy > int(h * 0.25))
        & (yy < int(h * 0.85))
        & ((edge_conf > 0.13) | (protected_ink > 0.08))
        & ((color_presence > 0.12) | (xx < int(w * 0.72)))
    )
    zones["bottom microtext region"] = (
        (yy > int(h * 0.84))
        & (xx > int(w * 0.20))
        & (xx < int(w * 0.88))
        & ((edge_conf > 0.10) | (protected_ink > 0.06))
    )
    return {name: mask.astype(np.uint8) for name, mask in zones.items()}


def protection_zone_bias_map(zones: dict[str, np.ndarray], shape: tuple[int, int]) -> np.ndarray:
    bias = np.zeros(shape, dtype=np.float32)
    weights = {
        "title/logo chrome region": 0.24,
        "character region": 0.16,
        "eye/glove region": 0.34,
        "barcode/text region": 0.38,
        "right-side UI/flag/text column": 0.30,
        "splash/water region": 0.24,
        "bottom microtext region": 0.36,
    }
    for name, mask in zones.items():
        if int(mask.sum()) == 0:
            continue
        soft = cv2.GaussianBlur(mask.astype(np.float32), (0, 0), 3.0)
        bias = np.maximum(bias, np.clip(soft, 0.0, 1.0) * weights.get(name, 0.18))
    return np.clip(bias, 0.0, 1.0)


def protection_zones_overlay(rgb: RGB, zones: dict[str, np.ndarray]) -> RGB:
    colors = [
        (0, 210, 255),
        (255, 60, 180),
        (255, 220, 0),
        (0, 255, 130),
        (255, 110, 0),
        (80, 160, 255),
        (210, 255, 80),
    ]
    overlay = Image.fromarray(rgb.astype(np.uint8), "RGB").convert("RGBA")
    draw = ImageDraw.Draw(overlay, "RGBA")
    for i, (name, mask) in enumerate(zones.items()):
        if int(mask.sum()) == 0:
            continue
        ys, xs = np.where(mask > 0)
        if len(xs) == 0:
            continue
        color = colors[i % len(colors)]
        x1, y1, x2, y2 = int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1
        draw.rectangle((x1, y1, x2, y2), outline=(*color, 230), width=max(2, min(rgb.shape[:2]) // 360))
        label = name.replace(" region", "")
        draw.rectangle((x1, max(0, y1 - 18), min(rgb.shape[1] - 1, x1 + 7 * len(label) + 8), y1), fill=(0, 0, 0, 150))
        draw.text((x1 + 4, max(0, y1 - 16)), label, fill=(*color, 255))
    return np.asarray(overlay.convert("RGB"), dtype=np.uint8)


def compute_structure_scores(
    edge_conf: np.ndarray,
    detail_conf: np.ndarray,
    local_conf: np.ndarray,
    sat_conf: np.ndarray,
    color_conf: np.ndarray,
    color_presence: np.ndarray,
    protected_ink: np.ndarray,
    distance_conf: np.ndarray,
    near_base: np.ndarray,
    shirt_residue: np.ndarray,
    print_silhouette_core: np.ndarray,
    print_silhouette_peripheral: np.ndarray,
    protection_zone_bias: np.ndarray,
    strong_ink_dilate_px: int,
    stroke_connect_radius: int,
) -> dict[str, np.ndarray]:
    local_edge_score = np.clip(edge_conf, 0.0, 1.0).astype(np.float32)
    local_contrast_score = np.maximum(local_conf, detail_conf).astype(np.float32)
    saturation_score = np.clip(sat_conf, 0.0, 1.0).astype(np.float32)
    lab_distance_from_fabric_score = np.clip(color_conf, 0.0, 1.0).astype(np.float32)

    strong_seed = (
        (protected_ink > 0.32)
        | (color_presence > 0.48)
        | ((local_edge_score > 0.44) & (local_contrast_score > 0.22))
    )
    strong_connected = distance_confidence(strong_seed, radius_px=max(1.0, float(strong_ink_dilate_px)))
    connected_to_ink_score = np.maximum(distance_conf, strong_connected).astype(np.float32)

    stroke_seed = (local_edge_score > 0.24) | ((detail_conf > 0.26) & (local_conf > 0.12)) | (protected_ink > 0.22)
    stroke_distance = distance_confidence(stroke_seed, radius_px=max(1.0, float(stroke_connect_radius)))
    stroke_likeness_score = np.clip(
        stroke_distance * 0.42
        + local_edge_score * 0.26
        + detail_conf * 0.18
        + protected_ink * 0.28
        + connected_to_ink_score * 0.16,
        0.0,
        1.0,
    ).astype(np.float32)

    structure = np.maximum.reduce(
        [
            local_edge_score,
            local_contrast_score,
            saturation_score * 0.55,
            lab_distance_from_fabric_score * 0.65,
            connected_to_ink_score * 0.72,
            stroke_likeness_score,
            protected_ink,
        ]
    )
    smooth_fabric = cv2.GaussianBlur(near_base.astype(np.float32), (0, 0), 4.0)
    low_structure = 1.0 - np.clip(structure, 0.0, 1.0)
    fabric_likeness_score = np.clip(
        near_base.astype(np.float32) * 0.32
        + smooth_fabric * 0.23
        + shirt_residue * 0.30
        + (1.0 - saturation_score) * 0.08
        + (1.0 - lab_distance_from_fabric_score) * 0.12,
        0.0,
        1.0,
    )
    fabric_likeness_score *= np.clip(0.55 + low_structure * 0.62, 0.0, 1.0)
    fabric_likeness_score *= np.clip(1.0 - protected_ink * 0.75 - connected_to_ink_score * 0.18, 0.0, 1.0)

    final_artwork_confidence_score = np.clip(
        local_edge_score * 0.18
        + local_contrast_score * 0.16
        + saturation_score * 0.08
        + lab_distance_from_fabric_score * 0.12
        + connected_to_ink_score * 0.20
        + stroke_likeness_score * 0.20
        + protected_ink * 0.30
        + print_silhouette_core * 0.10
        - print_silhouette_peripheral * 0.04
        + protection_zone_bias * 0.40
        - fabric_likeness_score * 0.18,
        0.0,
        1.0,
    )
    return {
        "local_edge_score": local_edge_score,
        "local_contrast_score": local_contrast_score,
        "saturation_score": saturation_score,
        "lab_distance_from_fabric_score": lab_distance_from_fabric_score,
        "connected_to_ink_score": connected_to_ink_score,
        "stroke_likeness_score": stroke_likeness_score,
        "fabric_likeness_score": fabric_likeness_score.astype(np.float32),
        "final_artwork_confidence_score": final_artwork_confidence_score.astype(np.float32),
    }


def refine_internal_haze_alpha(
    alpha: np.ndarray,
    recovered_internal: np.ndarray,
    print_silhouette: np.ndarray,
    print_silhouette_core: np.ndarray,
    print_silhouette_peripheral: np.ndarray,
    protected_ink: np.ndarray,
    scores: dict[str, np.ndarray],
    internal_art_confidence_threshold: float,
    fabric_likeness_threshold: float,
    internal_haze_alpha_cap: int,
    light_art_alpha_floor: int,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, np.ndarray, np.ndarray]:
    refined = np.clip(alpha.astype(np.float32), 0.0, 1.0).copy()
    recovered = recovered_internal > 0
    artwork_conf = scores["final_artwork_confidence_score"]
    fabric_like = scores["fabric_likeness_score"]
    edge_score = scores["local_edge_score"]
    contrast_score = scores["local_contrast_score"]
    connected_score = scores["connected_to_ink_score"]
    stroke_score = scores["stroke_likeness_score"]
    color_score = scores["lab_distance_from_fabric_score"]
    zone_bias = scores.get("protection_zone_bias", np.zeros_like(alpha))

    real_art = recovered & (
        (artwork_conf >= internal_art_confidence_threshold)
        | (protected_ink > 0.16)
        | (connected_score > 0.34)
        | (stroke_score > 0.28)
        | (edge_score > 0.28)
        | ((contrast_score > 0.26) & (connected_score > 0.16))
        | ((color_score > 0.26) & (stroke_score > 0.18))
        | ((zone_bias > 0.20) & ((edge_score > 0.16) | (stroke_score > 0.20) | (connected_score > 0.18) | (protected_ink > 0.08)))
    )
    core_haze = (
        recovered
        & (print_silhouette_core > 0.5)
        & (fabric_like > fabric_likeness_threshold + 0.12)
        & (artwork_conf < internal_art_confidence_threshold - 0.10)
        & (protected_ink < 0.10)
        & (connected_score < 0.22)
        & (stroke_score < 0.22)
        & (edge_score < 0.20)
        & ((zone_bias < 0.28) | ((edge_score < 0.10) & (stroke_score < 0.14) & (connected_score < 0.12)))
    )
    peripheral_haze = (
        recovered
        & (print_silhouette_peripheral > 0.5)
        & (fabric_like > fabric_likeness_threshold - 0.10)
        & (artwork_conf < internal_art_confidence_threshold + 0.08)
        & (protected_ink < 0.14)
        & (connected_score < 0.28)
        & (stroke_score < 0.26)
        & ((zone_bias < 0.34) | ((edge_score < 0.12) & (stroke_score < 0.16) & (connected_score < 0.14)))
    )
    outside_haze = (
        (print_silhouette < 0.5)
        & (fabric_like > fabric_likeness_threshold)
        & (artwork_conf < internal_art_confidence_threshold)
        & (alpha < 0.36)
    )
    haze = (core_haze | peripheral_haze | outside_haze) & ~real_art

    art_floor = np.clip(float(light_art_alpha_floor) / 255.0, 0.0, 1.0)
    haze_cap = np.clip(float(internal_haze_alpha_cap) / 255.0, 0.0, 1.0)
    floor_art = real_art & (
        (artwork_conf >= internal_art_confidence_threshold + 0.08)
        | (protected_ink > 0.20)
        | (connected_score > 0.45)
        | (stroke_score > 0.38)
        | (edge_score > 0.36)
    )
    if int(floor_art.sum()) > 0:
        refined[floor_art] = np.maximum(refined[floor_art], art_floor)
    if int(haze.sum()) > 0:
        refined[haze] = np.minimum(refined[haze], haze_cap)

    refined_mask = ((np.abs(refined - alpha) > 1.0 / 255.0) & recovered).astype(np.float32)
    return (
        np.clip(refined, 0.0, 1.0),
        refined_mask,
        real_art.astype(np.float32),
        haze.astype(np.float32),
        outside_haze.astype(np.float32),
    )


def recover_internal_light_art(
    alpha: np.ndarray,
    raw_score: np.ndarray,
    print_silhouette: np.ndarray,
    protected_ink: np.ndarray,
    shirt_residue: np.ndarray,
    edge_conf: np.ndarray,
    detail_conf: np.ndarray,
    local_conf: np.ndarray,
    color_presence: np.ndarray,
    near_base: np.ndarray,
    internal_light_min_alpha: int,
) -> tuple[np.ndarray, np.ndarray, np.ndarray, dict[str, Any]]:
    min_alpha = np.clip(float(internal_light_min_alpha) / 255.0, 0.0, 1.0)
    silhouette = print_silhouette > 0.5
    low_alpha = (alpha < min_alpha) & silhouette
    if int(low_alpha.sum()) == 0:
        empty = np.zeros_like(alpha, dtype=np.float32)
        return alpha, empty, empty, {"components_detected": 0, "components_recovered": 0}

    h, w = alpha.shape[:2]
    image_area = float(h * w)
    high_art = (
        (alpha > 0.58)
        | (protected_ink > 0.34)
        | ((raw_score > 0.62) & (color_presence > 0.28))
        | ((edge_conf > 0.55) & (detail_conf > 0.26))
    )
    structure = np.maximum.reduce([edge_conf, detail_conf, local_conf * 0.72, color_presence, protected_ink])
    possible_hole = low_alpha & (
        (structure > 0.055)
        | (protected_ink > 0.055)
        | (color_presence > 0.09)
        | (edge_conf > 0.10)
        | (detail_conf > 0.10)
    )
    if int(possible_hole.sum()) == 0:
        empty = np.zeros_like(alpha, dtype=np.float32)
        return alpha, empty, empty, {"components_detected": 0, "components_recovered": 0}

    broad_haze_pixel = (
        (shirt_residue > 0.68)
        & (edge_conf < 0.16)
        & (detail_conf < 0.16)
        & (local_conf < 0.18)
        & (protected_ink < 0.12)
        & (color_presence < 0.18)
    )

    high_u8 = high_art.astype(np.uint8)
    near_high_8 = cv2.dilate(high_u8, ellipse_kernel(8), iterations=1).astype(np.float32)
    near_high_16 = cv2.dilate(high_u8, ellipse_kernel(16), iterations=1).astype(np.float32)
    near_high_40 = cv2.dilate(high_u8, ellipse_kernel(40), iterations=1).astype(np.float32)
    high_density = np.maximum(
        cv2.blur(high_u8.astype(np.float32), (17, 17)),
        cv2.blur(high_u8.astype(np.float32), (41, 41)),
    )
    protected_density = cv2.GaussianBlur((protected_ink > 0.20).astype(np.float32), (0, 0), 8.0)

    count, labels, stats, _ = cv2.connectedComponentsWithStats(possible_hole.astype(np.uint8), connectivity=8)
    if count <= 1:
        empty = np.zeros_like(alpha, dtype=np.float32)
        return alpha, empty, empty, {"components_detected": 0, "components_recovered": 0}

    areas = stats[:, cv2.CC_STAT_AREA].astype(np.float32)
    areas[0] = 1.0
    flat_labels = labels.ravel()

    def means(feature: np.ndarray) -> np.ndarray:
        sums = np.bincount(flat_labels, weights=feature.ravel().astype(np.float64), minlength=count)
        return (sums / np.maximum(areas, 1.0)).astype(np.float32)

    def maxes(feature: np.ndarray) -> np.ndarray:
        out = np.zeros(count, dtype=np.float32)
        np.maximum.at(out, flat_labels, feature.ravel().astype(np.float32))
        return out

    near8_mean = means(near_high_8)
    near16_mean = means(near_high_16)
    near40_mean = means(near_high_40)
    high_density_mean = means(high_density)
    high_density_max = maxes(high_density)
    protected_density_mean = means(protected_density)
    structure_mean = means(structure)
    structure_max = maxes(structure)
    edge_max = maxes(edge_conf)
    detail_max = maxes(detail_conf)
    color_max = maxes(color_presence)
    haze_mean = means(broad_haze_pixel.astype(np.float32))

    detected_component = np.zeros(count, dtype=bool)
    recovered_component = np.zeros(count, dtype=bool)

    for idx in range(1, count):
        area = int(areas[idx])
        if area < 3:
            continue

        detected_component[idx] = True

        x = int(stats[idx, cv2.CC_STAT_LEFT])
        y = int(stats[idx, cv2.CC_STAT_TOP])
        cw = int(stats[idx, cv2.CC_STAT_WIDTH])
        ch = int(stats[idx, cv2.CC_STAT_HEIGHT])
        touches_image_edge = x <= 1 or y <= 1 or x + cw >= w - 1 or y + ch >= h - 1
        if touches_image_edge:
            continue

        broad_component = area > image_area * 0.035
        surround_score = max(
            float(near8_mean[idx]) * 0.55,
            float(near16_mean[idx]) * 0.75,
            float(near40_mean[idx]),
            float(high_density_mean[idx]) * 2.8,
            float(high_density_max[idx]) * 0.75,
            float(protected_density_mean[idx]) * 2.2,
        )
        low_detail_fabric = (
            float(haze_mean[idx]) > 0.62
            and float(structure_max[idx]) < 0.24
            and float(color_max[idx]) < 0.22
            and surround_score < 0.36
        )

        mostly_enclosed = surround_score >= 0.13 or float(protected_density_mean[idx]) >= 0.035
        has_recoverable_structure = (
            float(structure_max[idx]) >= 0.18
            or float(edge_max[idx]) >= 0.20
            or float(detail_max[idx]) >= 0.18
            or float(color_max[idx]) >= 0.20
            or float(protected_density_mean[idx]) >= 0.035
        )
        if low_detail_fabric:
            continue
        if broad_component and surround_score < 0.24 and float(structure_mean[idx]) < 0.20:
            continue
        if not (mostly_enclosed and has_recoverable_structure):
            continue

        recovered_component[idx] = True

    ambiguous_light_inside = (
        silhouette
        & near_base.astype(bool)
        & (alpha < min_alpha)
        & (shirt_residue < 0.72)
        & (structure > 0.08)
    )
    detected_labels = np.flatnonzero(detected_component)
    recovered_labels = np.flatnonzero(recovered_component)
    detected = np.isin(labels, detected_labels).astype(np.float32) if len(detected_labels) else np.zeros_like(alpha, dtype=np.float32)
    recovered = (
        np.isin(labels, recovered_labels).astype(np.float32) if len(recovered_labels) else np.zeros_like(alpha, dtype=np.float32)
    )
    detected[ambiguous_light_inside] = np.maximum(detected[ambiguous_light_inside], 0.72)
    recovered[ambiguous_light_inside] = np.maximum(recovered[ambiguous_light_inside], 0.72)

    recovered_bool = recovered > 0
    repaired = alpha.copy()
    if int(recovered_bool.sum()) > 0:
        recovery_floor = np.maximum(min_alpha, np.minimum(0.96, raw_score * 0.70 + protected_ink * 0.45 + structure * 0.34))
        repaired[recovered_bool] = np.maximum(repaired[recovered_bool], recovery_floor[recovered_bool])

    stats_out = {
        "components_detected": int(detected_component.sum()),
        "components_recovered": int(recovered_component.sum()),
        "pixels_detected": int((detected > 0).sum()),
        "pixels_recovered": int(recovered_bool.sum()),
    }
    return np.clip(repaired, 0.0, 1.0), detected, recovered, stats_out


def compute_alpha_maps(
    rgb: RGB,
    base_rgb: np.ndarray,
    polygon_mask: Mask,
    preserve_light_ink: bool = False,
    remove_shirt_haze: bool = False,
    recover_internal_light_art_mode: bool = False,
    internal_light_min_alpha: int = 120,
    internal_haze_refine: bool = False,
    internal_art_confidence_threshold: float = 0.42,
    fabric_likeness_threshold: float = 0.62,
    internal_haze_alpha_cap: int = 35,
    light_art_alpha_floor: int = 150,
    strong_ink_dilate_px: int = 18,
    stroke_connect_radius: int = 24,
) -> AlphaMaps:
    bgr = to_bgr(rgb)
    lab = cv2.cvtColor(bgr, cv2.COLOR_BGR2LAB).astype(np.float32)
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    base_lab = cv2.cvtColor(np.uint8([[base_rgb[::-1]]]), cv2.COLOR_BGR2LAB)[0, 0].astype(np.float32)
    delta = np.sqrt(
        ((lab[..., 0] - base_lab[0]) * 0.42) ** 2
        + ((lab[..., 1] - base_lab[1]) * 1.65) ** 2
        + ((lab[..., 2] - base_lab[2]) * 1.65) ** 2
    )
    sat = hsv[..., 1].astype(np.float32)
    value = hsv[..., 2].astype(np.float32)
    l_chan = lab[..., 0].astype(np.float32)
    in_poly = polygon_mask.astype(np.float32) / 255.0

    color_conf = smoothstep(6.0, 32.0, delta)
    sat_conf = smoothstep(14.0, 82.0, sat)
    dark_conf = smoothstep(5.0, 58.0, base_lab[0] - l_chan)
    bright_colored_conf = smoothstep(20.0, 70.0, np.abs(l_chan - base_lab[0])) * smoothstep(14.0, 55.0, sat)

    blur_small = cv2.GaussianBlur(gray, (0, 0), 1.0)
    blur_large = cv2.GaussianBlur(gray, (0, 0), 5.0)
    local_contrast = np.abs(blur_small.astype(np.float32) - blur_large.astype(np.float32))
    local_conf = smoothstep(3.0, 24.0, local_contrast)

    gray_f = gray.astype(np.float32)
    mean = cv2.blur(gray_f, (9, 9))
    mean_sq = cv2.blur(gray_f * gray_f, (9, 9))
    local_std = np.sqrt(np.maximum(mean_sq - mean * mean, 0.0))
    lap = np.abs(cv2.Laplacian(gray, cv2.CV_32F, ksize=3))
    lap = cv2.GaussianBlur(lap, (0, 0), 0.8)
    detail_conf = np.maximum(smoothstep(3.0, 18.0, local_std), smoothstep(5.0, 48.0, lap))

    sobel_x = cv2.Sobel(gray, cv2.CV_32F, 1, 0, ksize=3)
    sobel_y = cv2.Sobel(gray, cv2.CV_32F, 0, 1, ksize=3)
    sobel = cv2.magnitude(sobel_x, sobel_y)
    canny = cv2.Canny(gray, 60, 150).astype(np.float32) / 255.0
    edge_conf = np.maximum(smoothstep(12.0, 70.0, sobel), cv2.GaussianBlur(canny, (0, 0), 0.7))

    near_base = (
        (delta < 22)
        & (sat < 62)
        & (value > 125)
        & (np.abs(l_chan - base_lab[0]) < 46)
    )
    light_candidate = (
        (polygon_mask > 0)
        & (sat < 78)
        & (value > 112)
        & (np.abs(l_chan - base_lab[0]) < 72)
        & (delta < 42)
    )
    color_presence = np.maximum.reduce([color_conf, sat_conf * 0.8, dark_conf, bright_colored_conf])

    ink_core = (
        (polygon_mask > 0)
        & (
            ((color_conf > 0.42) & (~near_base | (sat > 58) | ((base_lab[0] - l_chan) > 18)))
            | (sat_conf > 0.46)
            | (dark_conf > 0.40)
            | ((edge_conf > 0.42) & (delta > 18))
        )
    )
    ink_core = cv2.morphologyEx(ink_core.astype(np.uint8), cv2.MORPH_OPEN, np.ones((2, 2), np.uint8)).astype(bool)
    ink_neighborhood = cv2.dilate(ink_core.astype(np.uint8), np.ones((9, 9), np.uint8), iterations=1).astype(bool)
    preliminary_dist = distance_confidence(ink_core, radius_px=18.0)

    light_seed = light_candidate & (
        ((edge_conf > 0.30) | (detail_conf > 0.28) | (local_conf > 0.34)) & (ink_neighborhood | (preliminary_dist > 0.04))
    )
    text_barcode_seed = (
        light_candidate
        & (edge_conf > 0.36)
        & (detail_conf > 0.18)
        & ((preliminary_dist > 0.02) | ((preliminary_dist > 0.008) & (local_conf > 0.38)))
    )
    light_component_protection = light_ink_protection_map(
        light_candidate=light_candidate,
        seed=light_seed | text_barcode_seed,
        edge_conf=edge_conf,
        detail_conf=detail_conf,
        local_conf=local_conf,
        distance_conf=preliminary_dist,
        near_base=near_base,
    )
    protected_ink = np.maximum(
        ink_core.astype(np.float32),
        np.maximum(light_component_protection, (light_seed | text_barcode_seed).astype(np.float32)),
    )
    protected_ink = cv2.GaussianBlur(protected_ink, (0, 0), 0.45)
    protected_ink = np.clip(protected_ink * in_poly, 0.0, 1.0)
    distance_conf = distance_confidence(protected_ink > 0.28, radius_px=14.0) * in_poly

    candidate = (
        (polygon_mask > 0)
        & (
            (color_presence > 0.12)
            | (edge_conf > 0.17)
            | (detail_conf > 0.17)
            | ((local_conf > 0.18) & (distance_conf > 0.025))
            | (protected_ink > 0.15)
        )
    )
    component_conf = component_confidence_map(
        candidate=candidate,
        protected_seed=protected_ink > 0.35,
        color_presence=color_presence,
        edge_conf=edge_conf,
        detail_conf=detail_conf,
        local_conf=local_conf,
        near_base=near_base,
    )

    weighted = (
        color_conf * 0.24
        + sat_conf * 0.09
        + dark_conf * 0.18
        + edge_conf * 0.15
        + detail_conf * 0.14
        + local_conf * 0.08
        + component_conf * 0.16
        + distance_conf * 0.12
    )
    raw_score = np.maximum.reduce(
        [
            weighted,
            color_presence * 0.92,
            dark_conf,
            sat_conf * 0.78,
            protected_ink * (0.82 if preserve_light_ink else 0.62),
        ]
    )

    if preserve_light_ink:
        light_boost = protected_ink * np.maximum.reduce([edge_conf, detail_conf, local_conf, distance_conf])
        raw_score = np.maximum(raw_score, protected_ink * 0.72 + light_boost * 0.24)

    edge_only_fabric = near_base & (protected_ink < 0.20) & (color_presence < 0.20) & (detail_conf < 0.20)
    raw_score[edge_only_fabric] *= 0.32
    raw_score = np.clip(raw_score * in_poly, 0.0, 1.0)

    structure_support = np.maximum.reduce([edge_conf, detail_conf, local_conf * 0.78, color_presence, distance_conf * 0.18])
    structured_protected = protected_ink * structure_support

    haze_score = (
        near_base.astype(np.float32)
        * (1.0 - np.clip(edge_conf, 0.0, 1.0)) ** 1.15
        * (1.0 - np.clip(detail_conf, 0.0, 1.0)) ** 1.10
        * (1.0 - np.clip(local_conf, 0.0, 1.0)) ** 0.70
        * (1.0 - np.clip(distance_conf, 0.0, 1.0) * 0.35) ** 0.55
        * (1.0 - np.clip(structured_protected, 0.0, 1.0)) ** 1.35
    )
    broad_haze = cv2.GaussianBlur(haze_score, (0, 0), 3.0)
    shirt_residue = np.maximum(smoothstep(0.34, 0.72, haze_score), smoothstep(0.16, 0.40, broad_haze) * 0.86)
    shirt_residue = np.clip(shirt_residue * in_poly * (1.0 - structured_protected * 0.85), 0.0, 1.0)

    alpha = raw_score.copy()
    if remove_shirt_haze:
        alpha *= 1.0 - shirt_residue * 0.88
        strong_haze = (shirt_residue > 0.62) & (structured_protected < 0.34) & (edge_conf < 0.20) & (detail_conf < 0.20)
        alpha[strong_haze] = np.minimum(alpha[strong_haze], 0.025)
        soft_haze = (shirt_residue > 0.38) & (structured_protected < 0.48) & (edge_conf < 0.28) & (detail_conf < 0.26)
        alpha[soft_haze] = np.minimum(alpha[soft_haze], 0.085)

    if preserve_light_ink:
        alpha = np.maximum(alpha, structured_protected * 0.70)

    repair_zone = (structured_protected > 0.38) & (alpha < 0.42)
    alpha[repair_zone] = np.maximum(alpha[repair_zone], structured_protected[repair_zone] * 0.62)
    closed = cv2.morphologyEx((alpha > 0.38).astype(np.uint8), cv2.MORPH_CLOSE, np.ones((3, 3), np.uint8))
    close_repair = (closed > 0) & (structured_protected > 0.25) & (alpha < 0.36)
    alpha[close_repair] = np.maximum(alpha[close_repair], 0.38)

    alpha = np.clip(alpha * in_poly, 0.0, 1.0)
    alpha = remove_low_evidence_specks(alpha, color_presence, local_conf, polygon_mask, protected_ink)
    print_silhouette, print_silhouette_core, print_silhouette_peripheral, silhouette_confidence = build_print_silhouette_model(
        raw_score=raw_score,
        protected_ink=protected_ink,
        color_presence=color_presence,
        edge_conf=edge_conf,
        detail_conf=detail_conf,
        sat_conf=sat_conf,
        dark_conf=dark_conf,
        polygon_mask=polygon_mask,
    )
    min_internal_alpha = np.clip(float(internal_light_min_alpha) / 255.0, 0.0, 1.0)
    internal_holes_detected = (
        (print_silhouette > 0.5)
        & (alpha < min_internal_alpha)
        & (
            (protected_ink > 0.08)
            | (edge_conf > 0.12)
            | (detail_conf > 0.12)
            | (local_conf > 0.16)
            | (color_presence > 0.12)
        )
    ).astype(np.float32)
    internal_holes_recovered = np.zeros_like(alpha, dtype=np.float32)
    if recover_internal_light_art_mode:
        alpha, internal_holes_detected, internal_holes_recovered, _hole_stats = recover_internal_light_art(
            alpha=alpha,
            raw_score=raw_score,
            print_silhouette=print_silhouette,
            protected_ink=protected_ink,
            shirt_residue=shirt_residue,
            edge_conf=edge_conf,
            detail_conf=detail_conf,
            local_conf=local_conf,
            color_presence=color_presence,
            near_base=near_base,
            internal_light_min_alpha=internal_light_min_alpha,
        )

    zones = protection_zone_masks(alpha.shape, edge_conf, protected_ink, color_presence)
    zone_bias = protection_zone_bias_map(zones, alpha.shape)
    scores = compute_structure_scores(
        edge_conf=edge_conf,
        detail_conf=detail_conf,
        local_conf=local_conf,
        sat_conf=sat_conf,
        color_conf=color_conf,
        color_presence=color_presence,
        protected_ink=protected_ink,
        distance_conf=distance_conf,
        near_base=near_base,
        shirt_residue=shirt_residue,
        print_silhouette_core=print_silhouette_core,
        print_silhouette_peripheral=print_silhouette_peripheral,
        protection_zone_bias=zone_bias,
        strong_ink_dilate_px=strong_ink_dilate_px,
        stroke_connect_radius=stroke_connect_radius,
    )
    scores["protection_zone_bias"] = zone_bias
    alpha_before_internal_haze_refine = alpha.copy()
    internal_haze_refined_mask = np.zeros_like(alpha, dtype=np.float32)
    recovered_art_kept = (internal_holes_recovered > 0).astype(np.float32)
    recovered_haze_removed = np.zeros_like(alpha, dtype=np.float32)
    if internal_haze_refine:
        alpha, internal_haze_refined_mask, recovered_art_kept, recovered_haze_removed, _outside_haze = refine_internal_haze_alpha(
            alpha=alpha,
            recovered_internal=internal_holes_recovered,
            print_silhouette=print_silhouette,
            print_silhouette_core=print_silhouette_core,
            print_silhouette_peripheral=print_silhouette_peripheral,
            protected_ink=protected_ink,
            scores=scores,
            internal_art_confidence_threshold=internal_art_confidence_threshold,
            fabric_likeness_threshold=fabric_likeness_threshold,
            internal_haze_alpha_cap=internal_haze_alpha_cap,
            light_art_alpha_floor=light_art_alpha_floor,
        )

    unrecovered_internal_holes = (internal_holes_detected > 0) & (internal_holes_recovered < 0.5)
    false_deletion_risk = (
        ((protected_ink > 0.42) & (alpha < 0.42))
        | (((edge_conf > 0.55) | (detail_conf > 0.55)) & (distance_conf > 0.22) & (alpha < 0.30))
        | unrecovered_internal_holes
    ).astype(np.float32) * in_poly
    residue_risk = (shirt_residue * alpha * (1.0 - protected_ink)).astype(np.float32)
    return AlphaMaps(
        alpha=alpha,
        alpha_before_internal_haze_refine=alpha_before_internal_haze_refine,
        raw_alpha_score=raw_score,
        protected_ink=protected_ink,
        shirt_residue=shirt_residue,
        false_deletion_risk=false_deletion_risk,
        print_silhouette=print_silhouette,
        print_silhouette_core=print_silhouette_core,
        print_silhouette_peripheral=print_silhouette_peripheral,
        silhouette_confidence=silhouette_confidence,
        internal_holes_detected=internal_holes_detected,
        internal_holes_recovered=internal_holes_recovered,
        internal_haze_refined_mask=internal_haze_refined_mask,
        recovered_art_kept=recovered_art_kept,
        recovered_haze_removed=recovered_haze_removed,
        local_edge_score=scores["local_edge_score"],
        local_contrast_score=scores["local_contrast_score"],
        saturation_score=scores["saturation_score"],
        lab_distance_from_fabric_score=scores["lab_distance_from_fabric_score"],
        connected_to_ink_score=scores["connected_to_ink_score"],
        stroke_likeness_score=scores["stroke_likeness_score"],
        fabric_likeness_score=scores["fabric_likeness_score"],
        final_artwork_confidence_score=scores["final_artwork_confidence_score"],
        protection_zone_bias=zone_bias,
        color_conf=color_conf,
        sat_conf=sat_conf,
        dark_conf=dark_conf,
        local_conf=local_conf,
        detail_conf=detail_conf,
        edge_conf=edge_conf,
        component_conf=component_conf,
        distance_conf=distance_conf,
        near_base=near_base.astype(np.float32),
        residue_risk=residue_risk,
        color_presence=color_presence,
    )


def remove_low_evidence_specks(
    alpha: np.ndarray,
    color_presence: np.ndarray,
    local_conf: np.ndarray,
    polygon_mask: Mask,
    protected_ink: np.ndarray | None = None,
) -> np.ndarray:
    hard = ((alpha > 0.16) & (polygon_mask > 0)).astype(np.uint8)
    count, labels, stats, _ = cv2.connectedComponentsWithStats(hard, connectivity=8)
    cleaned = alpha.copy()
    protected = protected_ink if protected_ink is not None else np.zeros_like(alpha)
    for idx in range(1, count):
        area = int(stats[idx, cv2.CC_STAT_AREA])
        if area > 22:
            continue
        comp = labels == idx
        if (
            float(protected[comp].mean()) < 0.16
            and float(color_presence[comp].mean()) < 0.20
            and float(local_conf[comp].mean()) < 0.22
        ):
            cleaned[comp] = 0.0
    return cleaned


def apply_texture_flatten(rgb: RGB, alpha: np.ndarray, maps: AlphaMaps, polygon_mask: Mask, debug_dir: Path) -> RGB:
    if not hasattr(cv2, "textureFlattening"):
        print("Warning: cv2.textureFlattening is unavailable in this OpenCV build.", file=sys.stderr)
        return rgb
    contam = (
        (polygon_mask > 0)
        & (alpha < 0.45)
        & (maps.near_base > 0.5)
        & (maps.edge_conf < 0.45)
    ).astype(np.uint8) * 255
    if int(contam.sum()) == 0:
        return rgb
    bgr = to_bgr(rgb)
    try:
        flat = cv2.textureFlattening(bgr, contam, low_threshold=25, high_threshold=45, kernel_size=3)
    except Exception as exc:
        print(f"Warning: textureFlattening failed: {exc}", file=sys.stderr)
        return rgb
    save_gray(debug_dir / "05_texture_flatten_mask.png", contam)
    save_rgb(debug_dir / "05_texture_flattened_input.png", to_rgb(flat))
    return to_rgb(flat)


def feather_alpha(alpha: np.ndarray, feather_px: float) -> np.ndarray:
    alpha = np.clip(alpha.astype(np.float32), 0.0, 1.0)
    if feather_px <= 0:
        return alpha
    sigma = max(0.1, float(feather_px))
    blurred = cv2.GaussianBlur(alpha, (0, 0), sigma)
    return np.clip(blurred, 0.0, 1.0)


def apply_manual_mask(alpha: np.ndarray, manual: Mask | None, mode: str) -> np.ndarray:
    if manual is None:
        return alpha
    m = np.clip(manual.astype(np.float32) / 255.0, 0.0, 1.0)
    if mode == "replace":
        return m
    if mode == "multiply":
        return alpha * m
    if mode == "max":
        return np.maximum(alpha, m)
    raise ValueError(f"Unknown manual mask mode: {mode}")


def apply_manual_corrections(
    alpha: np.ndarray,
    manual_keep: Mask | None,
    manual_delete: Mask | None,
    manual_soft_alpha: Mask | None,
) -> np.ndarray:
    corrected = np.clip(alpha.astype(np.float32), 0.0, 1.0).copy()
    if manual_keep is not None:
        keep = manual_keep.astype(np.float32) / 255.0
        corrected = np.maximum(corrected, keep)
    if manual_delete is not None:
        delete = manual_delete.astype(np.float32) / 255.0
        corrected = corrected * (1.0 - np.clip(delete, 0.0, 1.0))
    if manual_soft_alpha is not None:
        corrected = np.clip(manual_soft_alpha.astype(np.float32) / 255.0, 0.0, 1.0)
    return np.clip(corrected, 0.0, 1.0)


def clean_rgb_for_alpha(rgb: RGB, alpha: np.ndarray, base_rgb: np.ndarray) -> RGB:
    rgb_f = rgb.astype(np.float32)
    a = np.clip(alpha[..., None].astype(np.float32), 0.0, 1.0)
    base = base_rgb.reshape(1, 1, 3).astype(np.float32)
    denom = np.maximum(a, 0.035)
    decontam = np.clip((rgb_f - (1.0 - a) * base) / denom, 0, 255)
    # Preserve source pixels in confident ink, clean only fringe/soft matte areas.
    clean_weight = np.clip((0.92 - a) / 0.92, 0.0, 1.0) ** 0.55
    cleaned = rgb_f * (1.0 - clean_weight) + decontam * clean_weight
    return np.clip(cleaned, 0, 255).astype(np.uint8)


def halo_cleanup_rgb(rgb: RGB, alpha: np.ndarray, base_rgb: np.ndarray, maps: AlphaMaps) -> RGB:
    rgb_f = rgb.astype(np.float32)
    a = np.clip(alpha.astype(np.float32), 0.0, 1.0)
    base = base_rgb.reshape(1, 1, 3).astype(np.float32)
    base_dist = np.linalg.norm(rgb_f - base, axis=2)
    halo = (
        (a > 0.015)
        & (a < 0.62)
        & (base_dist < 42)
        & (maps.saturation_score < 0.30)
        & (maps.final_artwork_confidence_score < 0.36)
        & (maps.connected_to_ink_score < 0.32)
        & (maps.stroke_likeness_score < 0.32)
        & (maps.protected_ink < 0.16)
    )
    if int(halo.sum()) == 0:
        return rgb.copy()
    denom = np.maximum(a[..., None], 0.04)
    decontam = np.clip((rgb_f - (1.0 - a[..., None]) * base) / denom, 0, 255)
    weight = np.zeros_like(a, dtype=np.float32)
    weight[halo] = np.clip((0.62 - a[halo]) / 0.62, 0.0, 1.0) ** 0.65
    weight *= np.clip(1.0 - maps.final_artwork_confidence_score * 1.4, 0.0, 1.0)
    cleaned = rgb_f * (1.0 - weight[..., None]) + decontam * weight[..., None]
    return np.clip(cleaned, 0, 255).astype(np.uint8)


def rgba_from_alpha(rgb: RGB, alpha: np.ndarray, base_rgb: np.ndarray) -> np.ndarray:
    # Preserve source pixels. The extractor removes shirt contamination through
    # alpha only; it does not redraw, repaint, or color-correct the artwork.
    cleaned = rgb.astype(np.uint8)
    a8 = np.clip(alpha * 255.0, 0, 255).astype(np.uint8)
    return np.dstack([cleaned, a8])


def alpha_bbox(alpha: np.ndarray, threshold: int = 2) -> tuple[int, int, int, int] | None:
    ys, xs = np.where(alpha > threshold)
    if len(xs) == 0:
        return None
    return (int(xs.min()), int(ys.min()), int(xs.max()) + 1, int(ys.max()) + 1)


def trim_rgba(rgba: np.ndarray, padding: int) -> tuple[np.ndarray, tuple[int, int, int, int] | None]:
    bbox = alpha_bbox(rgba[..., 3], threshold=2)
    if bbox is None:
        return rgba, None
    x1, y1, x2, y2 = bbox
    h, w = rgba.shape[:2]
    x1 = max(0, x1 - padding)
    y1 = max(0, y1 - padding)
    x2 = min(w, x2 + padding)
    y2 = min(h, y2 + padding)
    return rgba[y1:y2, x1:x2].copy(), (x1, y1, x2, y2)


def composite_on_bg(rgba: np.ndarray, bg_rgb: tuple[int, int, int]) -> RGB:
    fg = rgba[..., :3].astype(np.float32)
    a = rgba[..., 3:4].astype(np.float32) / 255.0
    bg = np.array(bg_rgb, dtype=np.float32).reshape(1, 1, 3)
    out = fg * a + bg * (1.0 - a)
    return np.clip(out, 0, 255).astype(np.uint8)


def checkered_background(size: tuple[int, int], tile: int = 24) -> RGB:
    width, height = size
    yy, xx = np.indices((height, width))
    check = ((xx // tile + yy // tile) % 2).astype(np.uint8)
    bg = np.where(check[..., None] == 0, 218, 176).astype(np.uint8)
    return np.repeat(bg, 3, axis=2)


def composite_on_checkered(rgba: np.ndarray) -> RGB:
    h, w = rgba.shape[:2]
    bg = checkered_background((w, h)).astype(np.float32)
    fg = rgba[..., :3].astype(np.float32)
    a = rgba[..., 3:4].astype(np.float32) / 255.0
    return np.clip(fg * a + bg * (1.0 - a), 0, 255).astype(np.uint8)


def edge_error_preview(rgb: RGB, false_deletion: np.ndarray, residue: np.ndarray, recovered: np.ndarray) -> RGB:
    base = (rgb.astype(np.float32) * 0.42).astype(np.uint8)
    preview = base.astype(np.float32)
    false_mask = false_deletion.astype(bool)
    residue_mask = residue.astype(bool)
    recovered_mask = recovered.astype(bool)
    preview[false_mask] = preview[false_mask] * 0.20 + np.array([255, 42, 42], dtype=np.float32) * 0.80
    preview[residue_mask] = preview[residue_mask] * 0.20 + np.array([0, 225, 255], dtype=np.float32) * 0.80
    preview[recovered_mask] = preview[recovered_mask] * 0.10 + np.array([255, 215, 0], dtype=np.float32) * 0.90
    return np.clip(preview, 0, 255).astype(np.uint8)


def deleted_pixels_layer(rgb: RGB, alpha: np.ndarray, polygon_mask: Mask) -> np.ndarray:
    deleted_alpha = ((1.0 - alpha) * (polygon_mask.astype(np.float32) / 255.0) * 255.0).astype(np.uint8)
    return np.dstack([rgb, deleted_alpha])


def try_rembg_helper(rgb: RGB, debug_dir: Path) -> str | None:
    try:
        from rembg import remove  # type: ignore
    except Exception:
        return "rembg not installed"
    try:
        src = Image.fromarray(rgb, "RGB")
        out = remove(src)
        if out.mode != "RGBA":
            out = out.convert("RGBA")
        alpha = np.asarray(out)[..., 3]
        save_gray(debug_dir / "02_rembg_rough_alpha_helper.png", alpha)
        return "saved rembg rough helper mask"
    except Exception as exc:
        return f"rembg failed: {exc}"


def write_feature_maps(maps: AlphaMaps, debug_dir: Path) -> None:
    save_gray(debug_dir / "06_raw_alpha_score.png", (maps.raw_alpha_score * 255).astype(np.uint8))
    save_gray(debug_dir / "06_protected_ink_mask.png", (maps.protected_ink * 255).astype(np.uint8))
    save_gray(debug_dir / "06_shirt_residue_mask.png", (maps.shirt_residue * 255).astype(np.uint8))
    save_gray(debug_dir / "06_print_silhouette_mask.png", (maps.print_silhouette * 255).astype(np.uint8))
    save_gray(debug_dir / "06_print_silhouette_core.png", (maps.print_silhouette_core * 255).astype(np.uint8))
    save_gray(debug_dir / "06_print_silhouette_peripheral.png", (maps.print_silhouette_peripheral * 255).astype(np.uint8))
    save_gray(debug_dir / "06_silhouette_confidence.png", (maps.silhouette_confidence * 255).astype(np.uint8))
    save_gray(debug_dir / "06_internal_holes_detected.png", (maps.internal_holes_detected * 255).astype(np.uint8))
    save_gray(debug_dir / "06_internal_holes_recovered.png", (maps.internal_holes_recovered * 255).astype(np.uint8))
    save_gray(debug_dir / "06_internal_haze_refined_mask.png", (maps.internal_haze_refined_mask * 255).astype(np.uint8))
    save_gray(debug_dir / "06_recovered_art_kept.png", (maps.recovered_art_kept * 255).astype(np.uint8))
    save_gray(debug_dir / "06_recovered_haze_removed.png", (maps.recovered_haze_removed * 255).astype(np.uint8))
    save_gray(debug_dir / "06_false_deletion_risk.png", (maps.false_deletion_risk * 255).astype(np.uint8))
    save_gray(debug_dir / "06_structure_score.png", (maps.final_artwork_confidence_score * 255).astype(np.uint8))
    save_gray(debug_dir / "06_fabric_likeness_score.png", (maps.fabric_likeness_score * 255).astype(np.uint8))
    save_gray(debug_dir / "06_artwork_confidence_score.png", (maps.final_artwork_confidence_score * 255).astype(np.uint8))
    save_gray(debug_dir / "06_local_edge_score.png", (maps.local_edge_score * 255).astype(np.uint8))
    save_gray(debug_dir / "06_local_contrast_score.png", (maps.local_contrast_score * 255).astype(np.uint8))
    save_gray(debug_dir / "06_saturation_score.png", (maps.saturation_score * 255).astype(np.uint8))
    save_gray(debug_dir / "06_lab_distance_from_fabric_score.png", (maps.lab_distance_from_fabric_score * 255).astype(np.uint8))
    save_gray(debug_dir / "06_connected_to_ink_score.png", (maps.connected_to_ink_score * 255).astype(np.uint8))
    save_gray(debug_dir / "06_stroke_likeness_score.png", (maps.stroke_likeness_score * 255).astype(np.uint8))
    save_gray(debug_dir / "06_protection_zone_bias.png", (maps.protection_zone_bias * 255).astype(np.uint8))
    save_gray(debug_dir / "06_feature_color_confidence.png", (maps.color_conf * 255).astype(np.uint8))
    save_gray(debug_dir / "06_feature_saturation_confidence.png", (maps.sat_conf * 255).astype(np.uint8))
    save_gray(debug_dir / "06_feature_dark_confidence.png", (maps.dark_conf * 255).astype(np.uint8))
    save_gray(debug_dir / "06_feature_local_contrast.png", (maps.local_conf * 255).astype(np.uint8))
    save_gray(debug_dir / "06_feature_local_detail.png", (maps.detail_conf * 255).astype(np.uint8))
    save_gray(debug_dir / "06_feature_edge_strength.png", (maps.edge_conf * 255).astype(np.uint8))
    save_gray(debug_dir / "06_feature_component_confidence.png", (maps.component_conf * 255).astype(np.uint8))
    save_gray(debug_dir / "06_feature_distance_to_protected_ink.png", (maps.distance_conf * 255).astype(np.uint8))
    save_gray(debug_dir / "06_feature_near_base.png", (maps.near_base * 255).astype(np.uint8))
    save_gray(debug_dir / "06_feature_residue_risk.png", (maps.residue_risk * 255).astype(np.uint8))


def connected_zones(mask: np.ndarray, zone_type: str, min_area: int = 12, limit: int = 20) -> list[dict[str, Any]]:
    mask_u8 = mask.astype(np.uint8)
    count, labels, stats, _ = cv2.connectedComponentsWithStats(mask_u8, connectivity=8)
    zones: list[dict[str, Any]] = []
    for idx in range(1, count):
        area = int(stats[idx, cv2.CC_STAT_AREA])
        if area < min_area:
            continue
        zones.append(
            {
                "type": zone_type,
                "x": int(stats[idx, cv2.CC_STAT_LEFT]),
                "y": int(stats[idx, cv2.CC_STAT_TOP]),
                "w": int(stats[idx, cv2.CC_STAT_WIDTH]),
                "h": int(stats[idx, cv2.CC_STAT_HEIGHT]),
                "area": area,
            }
        )
    return sorted(zones, key=lambda z: int(z["area"]), reverse=True)[:limit]


def detect_problem_zones(
    rgba: np.ndarray,
    maps: AlphaMaps,
    base_rgb: np.ndarray,
) -> tuple[list[dict[str, Any]], list[dict[str, Any]], dict[str, Any]]:
    rgb = rgba[..., :3]
    alpha = rgba[..., 3].astype(np.float32) / 255.0
    bgr = to_bgr(rgb)
    hsv = cv2.cvtColor(bgr, cv2.COLOR_BGR2HSV)
    base_dist = np.linalg.norm(rgb.astype(np.float32) - base_rgb.reshape(1, 1, 3), axis=2)

    residue = (
        (alpha > 0.05)
        & (alpha < 0.92)
        & (hsv[..., 1] < 45)
        & (base_dist < 38)
        & (maps.edge_conf < 0.42)
        & (maps.detail_conf < 0.42)
        & (maps.protected_ink < 0.22)
    ).astype(np.uint8)
    residue = cv2.morphologyEx(residue, cv2.MORPH_OPEN, np.ones((3, 3), np.uint8))
    residue = np.maximum(residue, ((maps.shirt_residue > 0.58) & (alpha > 0.03)).astype(np.uint8))
    residue_zones = connected_zones(residue, "possible shirt residue", min_area=18, limit=20)

    false_deletion = ((maps.false_deletion_risk > 0.5) | ((maps.protected_ink > 0.48) & (alpha < 0.42))).astype(np.uint8)
    false_deletion = cv2.morphologyEx(false_deletion, cv2.MORPH_OPEN, np.ones((2, 2), np.uint8))
    false_deletion_zones = connected_zones(false_deletion, "possible false deletion of light ink", min_area=8, limit=20)

    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    edges = cv2.Canny(gray, 80, 170)
    small_detail = ((edges > 0) & ((maps.distance_conf > 0.05) | (maps.protected_ink > 0.12))).astype(np.uint8)
    count2, labels2, stats2, _ = cv2.connectedComponentsWithStats(small_detail, connectivity=8)
    text_like = 0
    preserved_text_like = 0
    for idx in range(1, count2):
        area = int(stats2[idx, cv2.CC_STAT_AREA])
        if area < 3 or area > 160:
            continue
        w = int(stats2[idx, cv2.CC_STAT_WIDTH])
        h = int(stats2[idx, cv2.CC_STAT_HEIGHT])
        if h == 0 or w == 0:
            continue
        aspect = max(w / h, h / w)
        if aspect > 18:
            continue
        text_like += 1
        comp = labels2 == idx
        mean_alpha = float(alpha[comp].mean())
        if mean_alpha >= 0.52:
            preserved_text_like += 1

    protected = maps.protected_ink > 0.35
    protected_count = int(protected.sum())
    light_ink_score = float(alpha[protected].mean()) if protected_count else 0.0
    recovered_holes = maps.internal_holes_recovered > 0.5
    detected_holes = maps.internal_holes_detected > 0.5
    recovered_count, _recovered_labels, recovered_stats, _ = cv2.connectedComponentsWithStats(
        recovered_holes.astype(np.uint8), connectivity=8
    )
    recovered_components = sum(
        1 for idx in range(1, recovered_count) if int(recovered_stats[idx, cv2.CC_STAT_AREA]) >= 3
    )
    avg_alpha_recovered = float(alpha[recovered_holes].mean() * 255.0) if int(recovered_holes.sum()) else 0.0
    exterior_residue = (
        residue.astype(bool)
        & (maps.print_silhouette < 0.5)
        & (maps.shirt_residue > 0.45)
        & (maps.protected_ink < 0.20)
    )
    internal_haze_candidate = (
        (maps.print_silhouette > 0.5)
        & (maps.shirt_residue > 0.45)
        & (maps.protected_ink < 0.22)
    )
    all_haze_candidate = (
        (maps.shirt_residue > 0.45)
        & (maps.protected_ink < 0.22)
    )
    exterior_haze_candidate = (
        (maps.print_silhouette < 0.5)
        & (maps.shirt_residue > 0.45)
        & (maps.protected_ink < 0.22)
    )
    alpha_before_refine = maps.alpha_before_internal_haze_refine
    all_haze_before = float(alpha_before_refine[all_haze_candidate].mean() * 255.0) if int(all_haze_candidate.sum()) else 0.0
    all_haze_after = float(alpha[all_haze_candidate].mean() * 255.0) if int(all_haze_candidate.sum()) else 0.0
    internal_haze_before = float(alpha_before_refine[internal_haze_candidate].mean() * 255.0) if int(internal_haze_candidate.sum()) else 0.0
    internal_haze_after = float(alpha[internal_haze_candidate].mean() * 255.0) if int(internal_haze_candidate.sum()) else 0.0
    exterior_haze_before = float(alpha_before_refine[exterior_haze_candidate].mean() * 255.0) if int(exterior_haze_candidate.sum()) else 0.0
    exterior_haze_after = float(alpha[exterior_haze_candidate].mean() * 255.0) if int(exterior_haze_candidate.sum()) else 0.0

    zones = protection_zone_masks(alpha.shape, maps.edge_conf, maps.protected_ink, maps.color_presence)

    def zone_score(name: str) -> float:
        zone = zones.get(name)
        if zone is None or int(zone.sum()) == 0:
            return 0.0
        focus = (zone > 0) & ((maps.protected_ink > 0.12) | (maps.edge_conf > 0.12) | (maps.color_presence > 0.10))
        if int(focus.sum()) == 0:
            focus = zone > 0
        return float(alpha[focus].mean())

    barcode_text_score = max(zone_score("barcode/text region"), zone_score("bottom microtext region"))
    chrome_score = zone_score("title/logo chrome region")
    eye_glove_score = zone_score("eye/glove region")
    visible = alpha > 0.02
    residue_risk_score = float(maps.residue_risk[visible].mean()) if int(visible.sum()) else 1.0
    false_deletion_risk_score = float(false_deletion.sum()) / float(max(1, protected_count))
    visible_count = int(visible.sum())
    semi_transparent = visible & (alpha < 0.98)
    semi_transparent_pct = float(semi_transparent.sum()) / float(max(1, visible_count)) * 100.0
    tiny_detail_score = float(preserved_text_like) / float(max(1, text_like))
    if false_deletion_risk_score > 0.035 or tiny_detail_score < 0.78:
        readiness = "source too ambiguous"
    elif residue_risk_score > 0.085 or internal_haze_after > 12.0 or false_deletion_risk_score > 0.014:
        readiness = "needs manual mask cleanup"
    elif residue_risk_score < 0.040 and false_deletion_risk_score < 0.006 and tiny_detail_score > 0.93:
        readiness = "near production extraction"
    else:
        readiness = "mockup usable"

    metrics = {
        "residue_pixels": int(residue.sum()),
        "residue_fraction_of_alpha": round(float(residue.sum() / max(1, (alpha > 0.02).sum())), 6),
        "false_deletion_risk_pixels": int(false_deletion.sum()),
        "false_deletion_risk_fraction_of_protected": round(float(false_deletion.sum() / max(1, protected_count)), 6),
        "internal_hole_detected_pixels": int(detected_holes.sum()),
        "internal_hole_recovered_pixels": int(recovered_holes.sum()),
        "internal_hole_components_recovered": int(recovered_components),
        "average_alpha_inside_recovered_holes_0_255": round(avg_alpha_recovered, 3),
        "exterior_shirt_haze_candidate_pixels": int(exterior_residue.sum()),
        "recovered_artwork_pixels_kept": int((maps.recovered_art_kept > 0.5).sum()),
        "recovered_haze_pixels_removed": int((maps.recovered_haze_removed > 0.5).sum()),
        "shirt_haze_candidate_alpha_before_refinement_0_255": round(all_haze_before, 3),
        "shirt_haze_candidate_alpha_after_refinement_0_255": round(all_haze_after, 3),
        "internal_haze_alpha_before_refinement_0_255": round(internal_haze_before, 3),
        "internal_haze_alpha_after_refinement_0_255": round(internal_haze_after, 3),
        "exterior_haze_alpha_before_refinement_0_255": round(exterior_haze_before, 3),
        "exterior_haze_alpha_after_refinement_0_255": round(exterior_haze_after, 3),
        "protected_ink_pixels": protected_count,
        "light_ink_preservation_score": round(light_ink_score, 4),
        "tiny_detail_components": int(text_like),
        "preserved_tiny_detail_components": int(preserved_text_like),
        "tiny_detail_preservation_score": round(tiny_detail_score, 4),
        "barcode_text_preservation_score": round(barcode_text_score, 4),
        "chrome_highlight_preservation_score": round(chrome_score, 4),
        "eye_glove_preservation_score": round(eye_glove_score, 4),
        "semi_transparent_pixel_percent_of_visible": round(semi_transparent_pct, 3),
        "residue_risk_score": round(residue_risk_score, 5),
        "false_deletion_risk_score": round(false_deletion_risk_score, 5),
        "production_readiness_rating": readiness,
    }
    return false_deletion_zones, residue_zones, metrics


def mask_confidence(alpha: np.ndarray, maps: AlphaMaps) -> dict[str, Any]:
    visible = alpha > 0.02
    if int(visible.sum()) == 0:
        return {"score": 0.0, "uncertain_fraction": 1.0, "visible_pixels": 0}
    uncertain = visible & (alpha > 0.18) & (alpha < 0.72) & (maps.residue_risk > 0.08)
    score = 1.0 - float(uncertain.sum()) / float(visible.sum())
    return {
        "score": round(max(0.0, min(1.0, score)), 4),
        "uncertain_fraction": round(float(uncertain.sum()) / float(visible.sum()), 5),
        "visible_pixels": int(visible.sum()),
    }


def verify_alpha_with_imagemagick(path: Path) -> dict[str, str]:
    result: dict[str, str] = {}
    try:
        with Image.open(path) as im:
            result["pillow_mode"] = im.mode
            result["pillow_has_alpha"] = str("A" in im.getbands())
    except Exception as exc:
        result["pillow_error"] = str(exc)
    magick = shutil.which("magick")
    if magick:
        ok, output = run_command(
            [
                magick,
                "identify",
                "-format",
                "channels=%[channels] channel_depth=%[bit-depth] png_ihdr_bit_depth=%[png:IHDR.bit-depth-orig]",
                str(path),
            ]
        )
        result["imagemagick"] = output if ok else f"failed: {output}"
    return result


def write_report(
    report_path: Path,
    json_path: Path,
    config: RunConfig,
    original_size: tuple[int, int],
    crop_size: tuple[int, int],
    output_size: tuple[int, int],
    base_report: dict[str, Any],
    confidence: dict[str, Any],
    false_deletion_zones: list[dict[str, Any]],
    residue_zones: list[dict[str, Any]],
    qc_metrics: dict[str, Any],
    trim_box: tuple[int, int, int, int] | None,
    alpha_verify: dict[str, str],
    warnings: list[str],
) -> None:
    real_upscaling_unavailable = "Lanczos" in config.upscaler_used and config.scale > 1
    payload = {
        "config": asdict(config),
        "original_resolution": {"width": original_size[0], "height": original_size[1]},
        "crop_resolution": {"width": crop_size[0], "height": crop_size[1]},
        "output_resolution": {"width": output_size[0], "height": output_size[1]},
        "crop_used_xyxy": list(config.crop),
        "trim_box_xyxy": list(trim_box) if trim_box else None,
        "base_color": base_report,
        "mask_confidence": confidence,
        "false_deletion_risk_areas": false_deletion_zones,
        "residue_risk_areas": residue_zones,
        "qc_metrics": qc_metrics,
        "alpha_verification": alpha_verify,
        "real_upscaling_unavailable": real_upscaling_unavailable,
        "warnings": warnings,
        "limitation": "This is a non-generative extraction. Missing or blurred source pixels cannot be perfectly recovered.",
    }
    json_path.write_text(json.dumps(payload, indent=2))
    lines = [
        "# Apparel Print Extraction Report",
        "",
        "This run used extraction, masking, alpha cleanup, and optional local upscaling only. It did not redraw, rewrite, or generate artwork.",
        "",
        f"- Original resolution: {original_size[0]} x {original_size[1]}",
        f"- Crop used (xyxy): {config.crop}",
        f"- Crop resolution before upscale: {crop_size[0]} x {crop_size[1]}",
        f"- Output resolution: {output_size[0]} x {output_size[1]}",
        f"- Upscaler used: {config.upscaler_used}",
        f"- Preserve light ink: {config.preserve_light_ink}",
        f"- Remove shirt haze: {config.remove_shirt_haze}",
        f"- Recover internal light art: {config.recover_internal_light_art}",
        f"- Internal light minimum alpha: {config.internal_light_min_alpha} / 255",
        f"- Internal haze refinement: {config.internal_haze_refine}",
        f"- Internal artwork confidence threshold: {config.internal_art_confidence_threshold}",
        f"- Fabric-likeness threshold: {config.fabric_likeness_threshold}",
        f"- Internal haze alpha cap: {config.internal_haze_alpha_cap} / 255",
        f"- Light art alpha floor: {config.light_art_alpha_floor} / 255",
        f"- Estimated shirt base RGB: {base_report.get('base_rgb')}",
        f"- Mask confidence score: {confidence.get('score')} (uncertain fraction {confidence.get('uncertain_fraction')})",
        f"- Trim box in full-size extraction: {trim_box}",
        f"- Alpha verification: {alpha_verify}",
        f"- Real upscaling unavailable: {real_upscaling_unavailable}",
        "",
        "## Quality Control",
        "",
        f"- Possible shirt residue pixels: {qc_metrics.get('residue_pixels')}",
        f"- Residue fraction of visible alpha: {qc_metrics.get('residue_fraction_of_alpha')}",
        f"- False-deletion risk pixels: {qc_metrics.get('false_deletion_risk_pixels')}",
        f"- False-deletion risk fraction of protected ink: {qc_metrics.get('false_deletion_risk_fraction_of_protected')}",
        f"- Internal hole detected pixels: {qc_metrics.get('internal_hole_detected_pixels')}",
        f"- Internal hole recovered pixels: {qc_metrics.get('internal_hole_recovered_pixels')}",
        f"- Internal hole components recovered: {qc_metrics.get('internal_hole_components_recovered')}",
        f"- Average alpha inside recovered holes: {qc_metrics.get('average_alpha_inside_recovered_holes_0_255')} / 255",
        f"- Recovered artwork pixels kept: {qc_metrics.get('recovered_artwork_pixels_kept')}",
        f"- Recovered haze pixels removed: {qc_metrics.get('recovered_haze_pixels_removed')}",
        f"- Shirt-haze candidate alpha before refinement: {qc_metrics.get('shirt_haze_candidate_alpha_before_refinement_0_255')} / 255",
        f"- Shirt-haze candidate alpha after refinement: {qc_metrics.get('shirt_haze_candidate_alpha_after_refinement_0_255')} / 255",
        f"- Internal haze alpha before refinement: {qc_metrics.get('internal_haze_alpha_before_refinement_0_255')} / 255",
        f"- Internal haze alpha after refinement: {qc_metrics.get('internal_haze_alpha_after_refinement_0_255')} / 255",
        f"- Exterior haze alpha before refinement: {qc_metrics.get('exterior_haze_alpha_before_refinement_0_255')} / 255",
        f"- Exterior haze alpha after refinement: {qc_metrics.get('exterior_haze_alpha_after_refinement_0_255')} / 255",
        f"- Exterior shirt-haze candidate pixels: {qc_metrics.get('exterior_shirt_haze_candidate_pixels')}",
        f"- Light-ink preservation score: {qc_metrics.get('light_ink_preservation_score')}",
        f"- Tiny detail components: {qc_metrics.get('tiny_detail_components')}",
        f"- Preserved tiny detail components: {qc_metrics.get('preserved_tiny_detail_components')}",
        f"- Tiny-detail preservation score: {qc_metrics.get('tiny_detail_preservation_score')}",
        f"- Barcode/text preservation score: {qc_metrics.get('barcode_text_preservation_score')}",
        f"- Chrome highlight preservation score: {qc_metrics.get('chrome_highlight_preservation_score')}",
        f"- Eye/glove preservation score: {qc_metrics.get('eye_glove_preservation_score')}",
        f"- Semi-transparent pixels: {qc_metrics.get('semi_transparent_pixel_percent_of_visible')}% of visible pixels",
        f"- Residue risk score: {qc_metrics.get('residue_risk_score')}",
        f"- False deletion risk score: {qc_metrics.get('false_deletion_risk_score')}",
        f"- Final production readiness rating: {qc_metrics.get('production_readiness_rating')}",
        "",
        "## Warnings",
        "",
    ]
    if warnings:
        lines.extend([f"- {warning}" for warning in warnings])
    else:
        lines.append("- No major warnings detected. Inspect previews before production use.")
    lines.extend(["", "## False-Deletion Risk Areas", ""])
    if false_deletion_zones:
        for zone in false_deletion_zones:
            lines.append(
                f"- {zone['type']}: x={zone['x']} y={zone['y']} w={zone['w']} h={zone['h']} area={zone['area']}"
            )
    else:
        lines.append("- No large protected-ink false-deletion zones detected.")
    lines.extend(["", "## Residue Risk Areas", ""])
    if residue_zones:
        for zone in residue_zones:
            lines.append(
                f"- {zone['type']}: x={zone['x']} y={zone['y']} w={zone['w']} h={zone['h']} area={zone['area']}"
            )
    else:
        lines.append("- No large low-saturation near-white residue zones detected.")
    lines.extend(
        [
            "",
            "## Manual Correction",
            "",
            "Paint `layers/manual_keep_mask.png` white where artwork must be restored.",
            "Paint `layers/manual_delete_mask.png` white where shirt residue must be removed.",
            "Edit `layers/manual_soft_alpha.png` as a grayscale full-alpha override when precise hand matting is needed.",
            "Rerun with `--manual-keep`, `--manual-delete`, and/or `--manual-soft-alpha`.",
            "",
            "## Limitation",
            "",
            "The tool cannot perfectly recover details that are missing, blurred, overexposed, or hidden by garment wrinkles in the source mockup.",
        ]
    )
    report_path.write_text("\n".join(lines) + "\n")


def resolve_compare_artifact(path: Path) -> Path:
    if path.is_dir():
        full = path / "extracted_artwork_fullsize.png"
        trimmed = path / "extracted_artwork.png"
        if full.exists():
            return full
        if trimmed.exists():
            return trimmed
    return path


def load_rgba_image(path: Path) -> np.ndarray:
    with Image.open(path) as im:
        return np.asarray(im.convert("RGBA"), dtype=np.uint8)


def resize_rgba(rgba: np.ndarray, size: tuple[int, int]) -> np.ndarray:
    width, height = size
    resized = cv2.resize(rgba, (width, height), interpolation=cv2.INTER_LINEAR)
    return np.clip(resized, 0, 255).astype(np.uint8)


def alpha_delta_preview(prev_alpha: np.ndarray, curr_alpha: np.ndarray) -> RGB:
    delta = curr_alpha.astype(np.float32) - prev_alpha.astype(np.float32)
    preview = np.full((*delta.shape, 3), 34, dtype=np.float32)
    gain = np.clip(delta / 160.0, 0.0, 1.0)
    loss = np.clip(-delta / 160.0, 0.0, 1.0)
    preview[..., 1] += gain * 210.0
    preview[..., 0] += loss * 235.0
    preview[..., 2] += loss * 80.0
    neutral = np.abs(delta) < 6
    preview[neutral] = np.array([82, 82, 82], dtype=np.float32)
    return np.clip(preview, 0, 255).astype(np.uint8)


def write_comparison_report(
    previous_path: Path,
    run_dir: Path,
    current_rgba: np.ndarray,
    maps: AlphaMaps,
    base_rgb: np.ndarray,
    current_qc: dict[str, Any],
) -> None:
    artifact = resolve_compare_artifact(previous_path)
    if not artifact.exists():
        (run_dir / "comparison_report.md").write_text(f"# Comparison Report\n\nPrevious output not found: `{artifact}`\n")
        return

    previous_rgba = load_rgba_image(artifact)
    previous_shape = previous_rgba.shape[:2]
    if previous_rgba.shape[:2] != current_rgba.shape[:2]:
        previous_rgba = resize_rgba(previous_rgba, (current_rgba.shape[1], current_rgba.shape[0]))

    prev_alpha = previous_rgba[..., 3].astype(np.float32)
    curr_alpha = current_rgba[..., 3].astype(np.float32)
    protected = maps.protected_ink > 0.35
    residue_candidate = (maps.shirt_residue > 0.45) & (maps.protected_ink < 0.22)
    internal_residue_candidate = residue_candidate & (maps.print_silhouette > 0.5)
    exterior_residue_candidate = residue_candidate & (maps.print_silhouette < 0.5)
    recovered_holes = maps.internal_holes_recovered > 0.5
    recovered_count, _labels, recovered_stats, _ = cv2.connectedComponentsWithStats(
        recovered_holes.astype(np.uint8), connectivity=8
    )
    recovered_components = sum(
        1 for idx in range(1, recovered_count) if int(recovered_stats[idx, cv2.CC_STAT_AREA]) >= 3
    )
    visible = curr_alpha > 5
    semi = visible & (curr_alpha < 250)

    protected_prev = float(prev_alpha[protected].mean()) if int(protected.sum()) else 0.0
    protected_curr = float(curr_alpha[protected].mean()) if int(protected.sum()) else 0.0
    residue_prev = float(prev_alpha[residue_candidate].mean()) if int(residue_candidate.sum()) else 0.0
    residue_curr = float(curr_alpha[residue_candidate].mean()) if int(residue_candidate.sum()) else 0.0
    internal_residue_prev = (
        float(prev_alpha[internal_residue_candidate].mean()) if int(internal_residue_candidate.sum()) else 0.0
    )
    internal_residue_curr = (
        float(curr_alpha[internal_residue_candidate].mean()) if int(internal_residue_candidate.sum()) else 0.0
    )
    exterior_residue_prev = (
        float(prev_alpha[exterior_residue_candidate].mean()) if int(exterior_residue_candidate.sum()) else 0.0
    )
    exterior_residue_curr = (
        float(curr_alpha[exterior_residue_candidate].mean()) if int(exterior_residue_candidate.sum()) else 0.0
    )
    recovered_prev_alpha = float(prev_alpha[recovered_holes].mean()) if int(recovered_holes.sum()) else 0.0
    recovered_curr_alpha = float(curr_alpha[recovered_holes].mean()) if int(recovered_holes.sum()) else 0.0
    visible_prev = int((prev_alpha > 5).sum())
    visible_curr = int((curr_alpha > 5).sum())
    alpha_mean_prev = float(prev_alpha.mean())
    alpha_mean_curr = float(curr_alpha.mean())
    semi_pct = float(semi.sum()) / float(max(1, visible.sum())) * 100.0

    save_rgb(run_dir / "comparison_alpha_delta.png", alpha_delta_preview(prev_alpha, curr_alpha))

    prev_report = {}
    prev_report_path = artifact.parent / "report.json"
    if prev_report_path.exists():
        try:
            prev_report = json.loads(prev_report_path.read_text())
        except Exception:
            prev_report = {}
    prev_qc = prev_report.get("qc_metrics", {}) if isinstance(prev_report, dict) else {}

    improved: list[str] = []
    worsened: list[str] = []
    manual: list[str] = []

    if current_rgba.shape[0] * current_rgba.shape[1] > previous_shape[0] * previous_shape[1]:
        improved.append("Output canvas is higher resolution than the previous comparison artifact.")
    if protected_curr > protected_prev + 4.0:
        improved.append(
            f"Protected light/chrome/white ink retained more alpha on average ({protected_curr:.1f} vs {protected_prev:.1f})."
        )
    else:
        worsened.append(
            f"Protected light-ink alpha did not materially improve ({protected_curr:.1f} vs {protected_prev:.1f})."
        )
    if residue_curr < residue_prev - 4.0:
        improved.append(f"Candidate shirt-haze regions carry less alpha ({residue_curr:.1f} vs {residue_prev:.1f}).")
    else:
        worsened.append(f"Candidate shirt-haze regions were not reduced enough ({residue_curr:.1f} vs {residue_prev:.1f}).")
    if internal_residue_curr < internal_residue_prev - 1.0:
        improved.append(
            f"Internal shirt-haze candidate alpha decreased ({internal_residue_curr:.1f} vs {internal_residue_prev:.1f})."
        )
    else:
        worsened.append(
            f"Internal shirt-haze candidate alpha did not decrease enough ({internal_residue_curr:.1f} vs {internal_residue_prev:.1f})."
        )
    if exterior_residue_curr <= exterior_residue_prev + 2.0:
        improved.append(
            f"Exterior shirt-haze alpha did not increase materially ({exterior_residue_curr:.1f} vs {exterior_residue_prev:.1f})."
        )
    else:
        worsened.append(
            f"Exterior shirt-haze alpha increased ({exterior_residue_curr:.1f} vs {exterior_residue_prev:.1f})."
        )
    if int(recovered_holes.sum()) > 0:
        improved.append(
            f"Recovered internal light-art holes now average {recovered_curr_alpha:.1f} alpha vs {recovered_prev_alpha:.1f} before."
        )

    prev_tiny_score = prev_qc.get("tiny_detail_preservation_score")
    curr_tiny_score = current_qc.get("tiny_detail_preservation_score")
    if isinstance(prev_tiny_score, (int, float)) and isinstance(curr_tiny_score, (int, float)):
        if curr_tiny_score >= prev_tiny_score:
            improved.append(f"Tiny-detail preservation score improved or held ({curr_tiny_score} vs {prev_tiny_score}).")
        else:
            worsened.append(f"Tiny-detail preservation score decreased ({curr_tiny_score} vs {prev_tiny_score}).")
    preservation_improved = protected_curr > protected_prev + 2.0
    if isinstance(prev_tiny_score, (int, float)) and isinstance(curr_tiny_score, (int, float)):
        preservation_improved = preservation_improved and curr_tiny_score >= prev_tiny_score
    if int(recovered_holes.sum()) > 0:
        preservation_improved = preservation_improved and recovered_curr_alpha > recovered_prev_alpha + 8.0

    if current_qc.get("residue_pixels", 0) > 0:
        manual.append("Use `manual_delete_mask.png` on cyan edge-error zones and broad gray haze patches that remain.")
    if current_qc.get("false_deletion_risk_pixels", 0) > 0:
        manual.append("Use `manual_keep_mask.png` on red edge-error zones where eyes, gloves, chrome, splash, barcode, or text are still clipped.")
    manual.append("Use `manual_soft_alpha.png` only for final hand-matted transitions after keep/delete masks are no longer enough.")

    lines = [
        "# Extraction Comparison Report",
        "",
        f"- Previous artifact: `{artifact}`",
        f"- Current artifact: `{run_dir / 'extracted_artwork_fullsize.png'}`",
        f"- Previous visible pixels: {visible_prev}",
        f"- Current visible pixels: {visible_curr}",
        f"- Previous mean alpha: {alpha_mean_prev:.3f}",
        f"- Current mean alpha: {alpha_mean_curr:.3f}",
        f"- Protected light-ink mean alpha: {protected_curr:.3f} current vs {protected_prev:.3f} previous",
        f"- Internal holes recovered: {recovered_components} components / {int(recovered_holes.sum())} pixels",
        f"- Average alpha inside recovered holes: {recovered_curr_alpha:.3f} current vs {recovered_prev_alpha:.3f} previous",
        f"- Shirt-haze candidate mean alpha: {residue_curr:.3f} current vs {residue_prev:.3f} previous",
        f"- Internal shirt-haze candidate mean alpha: {internal_residue_curr:.3f} current vs {internal_residue_prev:.3f} previous",
        f"- Exterior shirt-haze candidate mean alpha: {exterior_residue_curr:.3f} current vs {exterior_residue_prev:.3f} previous",
        f"- Protected light-ink stayed near previous: {protected_curr >= protected_prev - 3.0}",
        f"- Recovered holes mostly preserved: {recovered_curr_alpha >= max(120.0, recovered_prev_alpha - 12.0)}",
        f"- Exterior haze stayed near zero: {exterior_residue_curr <= 2.0}",
        f"- Eyes/gloves/chrome/splash/text preservation proxy improved: {preservation_improved}",
        f"- Current semi-transparent pixels: {semi_pct:.3f}% of visible pixels",
        "",
        "## What Improved",
        "",
    ]
    lines.extend([f"- {item}" for item in improved] or ["- No clear metric-level improvement was detected."])
    lines.extend(["", "## What Got Worse Or Remains Risky", ""])
    lines.extend([f"- {item}" for item in worsened] or ["- No clear regression was detected by the numeric checks."])
    lines.extend(["", "## Manual Correction Still Required", ""])
    lines.extend([f"- {item}" for item in manual])
    lines.extend(
        [
            "",
            "## Notes",
            "",
            "`comparison_alpha_delta.png` shows alpha gained in green and alpha lost in red. It is diagnostic only; it is not a generative reconstruction.",
        ]
    )
    (run_dir / "comparison_report.md").write_text("\n".join(lines) + "\n")


def map_scores_dict(maps: AlphaMaps) -> dict[str, np.ndarray]:
    return {
        "local_edge_score": maps.local_edge_score,
        "local_contrast_score": maps.local_contrast_score,
        "saturation_score": maps.saturation_score,
        "lab_distance_from_fabric_score": maps.lab_distance_from_fabric_score,
        "connected_to_ink_score": maps.connected_to_ink_score,
        "stroke_likeness_score": maps.stroke_likeness_score,
        "fabric_likeness_score": maps.fabric_likeness_score,
        "final_artwork_confidence_score": maps.final_artwork_confidence_score,
        "protection_zone_bias": maps.protection_zone_bias,
    }


def compose_alpha_for_export(
    alpha: np.ndarray,
    feather_px: float,
    manual_mask: Mask | None,
    manual_mask_mode: str,
    manual_keep: Mask | None,
    manual_delete: Mask | None,
    manual_soft_alpha: Mask | None,
) -> np.ndarray:
    out = feather_alpha(alpha, feather_px)
    out = apply_manual_mask(out, manual_mask, manual_mask_mode)
    out = apply_manual_corrections(out, manual_keep, manual_delete, manual_soft_alpha)
    return np.clip(out, 0.0, 1.0)


def make_variant_maps(
    maps: AlphaMaps,
    internal_art_confidence_threshold: float,
    fabric_likeness_threshold: float,
    internal_haze_alpha_cap: int,
    light_art_alpha_floor: int,
) -> AlphaMaps:
    scores = map_scores_dict(maps)
    alpha, refined_mask, kept, removed, _outside = refine_internal_haze_alpha(
        alpha=maps.alpha_before_internal_haze_refine,
        recovered_internal=maps.internal_holes_recovered,
        print_silhouette=maps.print_silhouette,
        print_silhouette_core=maps.print_silhouette_core,
        print_silhouette_peripheral=maps.print_silhouette_peripheral,
        protected_ink=maps.protected_ink,
        scores=scores,
        internal_art_confidence_threshold=internal_art_confidence_threshold,
        fabric_likeness_threshold=fabric_likeness_threshold,
        internal_haze_alpha_cap=internal_haze_alpha_cap,
        light_art_alpha_floor=light_art_alpha_floor,
    )
    unrecovered_internal_holes = (maps.internal_holes_detected > 0) & (maps.internal_holes_recovered < 0.5)
    false_deletion_risk = (
        ((maps.protected_ink > 0.42) & (alpha < 0.42))
        | (((maps.edge_conf > 0.55) | (maps.detail_conf > 0.55)) & (maps.distance_conf > 0.22) & (alpha < 0.30))
        | unrecovered_internal_holes
    ).astype(np.float32)
    residue_risk = (maps.shirt_residue * alpha * (1.0 - maps.protected_ink)).astype(np.float32)
    return replace(
        maps,
        alpha=alpha,
        false_deletion_risk=false_deletion_risk,
        residue_risk=residue_risk,
        internal_haze_refined_mask=refined_mask,
        recovered_art_kept=kept,
        recovered_haze_removed=removed,
    )


def write_variant_report(path: Path, name: str, params: dict[str, Any], qc_metrics: dict[str, Any], alpha_verify: dict[str, str]) -> None:
    lines = [
        f"# Auto-Tune Variant: {name}",
        "",
        "This variant reuses the same non-generative analysis maps and changes only alpha refinement parameters.",
        "",
        "## Parameters",
        "",
    ]
    for key, value in params.items():
        lines.append(f"- {key}: {value}")
    lines.extend(
        [
            "",
            "## Quality Control",
            "",
            f"- Internal haze alpha after refinement: {qc_metrics.get('internal_haze_alpha_after_refinement_0_255')} / 255",
            f"- Overall shirt-haze candidate alpha after refinement: {qc_metrics.get('shirt_haze_candidate_alpha_after_refinement_0_255')} / 255",
            f"- Protected light-ink score: {qc_metrics.get('light_ink_preservation_score')}",
            f"- Tiny-detail score: {qc_metrics.get('tiny_detail_preservation_score')}",
            f"- Barcode/text score: {qc_metrics.get('barcode_text_preservation_score')}",
            f"- Chrome score: {qc_metrics.get('chrome_highlight_preservation_score')}",
            f"- Eye/glove score: {qc_metrics.get('eye_glove_preservation_score')}",
            f"- Residue risk score: {qc_metrics.get('residue_risk_score')}",
            f"- False deletion risk score: {qc_metrics.get('false_deletion_risk_score')}",
            f"- Recovered artwork pixels kept: {qc_metrics.get('recovered_artwork_pixels_kept')}",
            f"- Recovered haze pixels removed: {qc_metrics.get('recovered_haze_pixels_removed')}",
            f"- Production readiness: {qc_metrics.get('production_readiness_rating')}",
            f"- Alpha verification: {alpha_verify}",
        ]
    )
    path.write_text("\n".join(lines) + "\n")


def export_variant_outputs(
    variant_dir: Path,
    name: str,
    params: dict[str, Any],
    upscaled: RGB,
    base_rgb: np.ndarray,
    polygon_mask: Mask,
    maps: AlphaMaps,
    bit_depth: int,
    trim_padding: int,
    feather_px: float,
    manual_mask: Mask | None,
    manual_mask_mode: str,
    manual_keep: Mask | None,
    manual_delete: Mask | None,
    manual_soft_alpha: Mask | None,
) -> dict[str, Any]:
    mkdir(variant_dir)
    alpha = compose_alpha_for_export(
        maps.alpha,
        feather_px,
        manual_mask,
        manual_mask_mode,
        manual_keep,
        manual_delete,
        manual_soft_alpha,
    )
    save_gray(variant_dir / "final_alpha_mask.png", (alpha * 255).astype(np.uint8))
    cleaned = halo_cleanup_rgb(upscaled, alpha, base_rgb, maps)
    rgba_full = rgba_from_alpha(cleaned, alpha, base_rgb)
    save_rgba_png(variant_dir / "extracted_artwork_fullsize.png", rgba_full, bit_depth)
    rgba_trimmed, _trim_box = trim_rgba(rgba_full, trim_padding)
    save_rgba_png(variant_dir / "extracted_artwork.png", rgba_trimmed, bit_depth)
    save_rgb(variant_dir / "checkered_preview.png", composite_on_checkered(rgba_trimmed))
    save_rgb(variant_dir / "black_bg_preview.png", composite_on_bg(rgba_trimmed, (0, 0, 0)))
    save_rgb(variant_dir / "white_bg_preview.png", composite_on_bg(rgba_trimmed, (255, 255, 255)))
    save_rgb(variant_dir / "gray_bg_preview.png", composite_on_bg(rgba_trimmed, (128, 128, 128)))
    save_rgb(variant_dir / "red_bg_preview.png", composite_on_bg(rgba_trimmed, (220, 0, 36)))
    alpha_verify = verify_alpha_with_imagemagick(variant_dir / "extracted_artwork.png")
    _false_zones, _residue_zones, qc_metrics = detect_problem_zones(rgba_full, maps, base_rgb)
    write_variant_report(variant_dir / "report.md", name, params, qc_metrics, alpha_verify)
    return {
        "name": name,
        "dir": str(variant_dir),
        "params": params,
        "qc": qc_metrics,
        "alpha_verify": alpha_verify,
    }


def create_contact_sheet(variant_results: list[dict[str, Any]], path: Path) -> None:
    thumbs: list[Image.Image] = []
    cell_w, cell_h = 360, 520
    for result in variant_results:
        preview = Path(result["dir"]) / "checkered_preview.png"
        with Image.open(preview) as im:
            thumb = ImageOps.contain(im.convert("RGB"), (cell_w, cell_h - 46))
        cell = Image.new("RGB", (cell_w, cell_h), (24, 24, 24))
        cell.paste(thumb, ((cell_w - thumb.width) // 2, 34))
        draw = ImageDraw.Draw(cell)
        draw.text((10, 10), str(result["name"]), fill=(255, 255, 255))
        score = result["qc"].get("production_readiness_rating", "")
        draw.text((10, cell_h - 22), str(score), fill=(180, 220, 255))
        thumbs.append(cell)
    if not thumbs:
        return
    sheet = Image.new("RGB", (cell_w * len(thumbs), cell_h), (16, 16, 16))
    for idx, thumb in enumerate(thumbs):
        sheet.paste(thumb, (idx * cell_w, 0))
    sheet.save(path)


def write_auto_tune_summary(run_dir: Path, variant_results: list[dict[str, Any]]) -> None:
    def haze_metric(result: dict[str, Any]) -> float:
        return float(result["qc"].get("internal_haze_alpha_after_refinement_0_255", 999.0)) + float(result["qc"].get("residue_risk_score", 1.0)) * 80.0

    def false_metric(result: dict[str, Any]) -> float:
        return float(result["qc"].get("false_deletion_risk_score", 1.0))

    def text_chrome_metric(result: dict[str, Any]) -> float:
        qc = result["qc"]
        return (
            float(qc.get("barcode_text_preservation_score", 0.0))
            + float(qc.get("chrome_highlight_preservation_score", 0.0))
            + float(qc.get("light_ink_preservation_score", 0.0))
        )

    def balanced_metric(result: dict[str, Any]) -> float:
        qc = result["qc"]
        return (
            float(qc.get("light_ink_preservation_score", 0.0)) * 1.5
            + float(qc.get("tiny_detail_preservation_score", 0.0)) * 1.2
            + float(qc.get("barcode_text_preservation_score", 0.0))
            + float(qc.get("chrome_highlight_preservation_score", 0.0))
            + float(qc.get("eye_glove_preservation_score", 0.0))
            - float(qc.get("residue_risk_score", 1.0)) * 4.0
            - float(qc.get("false_deletion_risk_score", 1.0)) * 5.0
            - float(qc.get("internal_haze_alpha_after_refinement_0_255", 255.0)) / 180.0
        )

    least_haze = min(variant_results, key=haze_metric) if variant_results else None
    least_false = min(variant_results, key=false_metric) if variant_results else None
    best_text_chrome = max(variant_results, key=text_chrome_metric) if variant_results else None
    best_balanced = max(variant_results, key=balanced_metric) if variant_results else None
    lines = ["# Auto-Tune Summary", ""]
    if best_balanced:
        lines.append(f"- Best overall balanced result: `{best_balanced['name']}`")
    if least_haze:
        lines.append(f"- Least haze: `{least_haze['name']}`")
    if least_false:
        lines.append(f"- Least false deletion risk: `{least_false['name']}`")
    if best_text_chrome:
        lines.append(f"- Best text/chrome preservation: `{best_text_chrome['name']}`")
    lines.extend(["", "## Variant Scores", ""])
    for result in variant_results:
        qc = result["qc"]
        lines.append(
            f"- `{result['name']}`: internal haze alpha={qc.get('internal_haze_alpha_after_refinement_0_255')} / 255, "
            f"overall haze alpha={qc.get('shirt_haze_candidate_alpha_after_refinement_0_255')} / 255, "
            f"protected light={qc.get('light_ink_preservation_score')}, "
            f"text={qc.get('barcode_text_preservation_score')}, chrome={qc.get('chrome_highlight_preservation_score')}, "
            f"residue risk={qc.get('residue_risk_score')}, false deletion risk={qc.get('false_deletion_risk_score')}, "
            f"readiness={qc.get('production_readiness_rating')}"
        )
    lines.extend(
        [
            "",
            "## Production Pick",
            "",
            f"Use `{best_balanced['name'] if best_balanced else 'balanced'}` first for production cleanup. Inspect red/yellow/cyan diagnostics and then paint manual keep/delete masks only where needed.",
        ]
    )
    (run_dir / "auto_tune_summary.md").write_text("\n".join(lines) + "\n")


def run_auto_tune(
    run_dir: Path,
    upscaled: RGB,
    base_rgb: np.ndarray,
    polygon_mask: Mask,
    maps: AlphaMaps,
    args: argparse.Namespace,
    manual_mask: Mask | None,
    manual_keep: Mask | None,
    manual_delete: Mask | None,
    manual_soft_alpha: Mask | None,
) -> list[dict[str, Any]]:
    variants = [
        (
            "A_conservative_keep",
            {
                "internal_art_confidence_threshold": max(0.20, args.internal_art_confidence_threshold - 0.08),
                "fabric_likeness_threshold": min(0.90, args.fabric_likeness_threshold + 0.14),
                "internal_haze_alpha_cap": max(args.internal_haze_alpha_cap, 45),
                "light_art_alpha_floor": max(args.light_art_alpha_floor, 165),
            },
        ),
        (
            "B_balanced",
            {
                "internal_art_confidence_threshold": args.internal_art_confidence_threshold,
                "fabric_likeness_threshold": args.fabric_likeness_threshold,
                "internal_haze_alpha_cap": args.internal_haze_alpha_cap,
                "light_art_alpha_floor": args.light_art_alpha_floor,
            },
        ),
        (
            "C_aggressive_haze_removal",
            {
                "internal_art_confidence_threshold": min(0.72, args.internal_art_confidence_threshold + 0.08),
                "fabric_likeness_threshold": max(0.42, args.fabric_likeness_threshold - 0.08),
                "internal_haze_alpha_cap": min(args.internal_haze_alpha_cap, 18),
                "light_art_alpha_floor": max(130, args.light_art_alpha_floor - 10),
            },
        ),
        (
            "D_text_chrome_preservation",
            {
                "internal_art_confidence_threshold": max(0.22, args.internal_art_confidence_threshold - 0.10),
                "fabric_likeness_threshold": min(0.86, args.fabric_likeness_threshold + 0.06),
                "internal_haze_alpha_cap": max(args.internal_haze_alpha_cap, 32),
                "light_art_alpha_floor": max(args.light_art_alpha_floor, 175),
            },
        ),
        (
            "E_cleanest_alpha",
            {
                "internal_art_confidence_threshold": min(0.80, args.internal_art_confidence_threshold + 0.14),
                "fabric_likeness_threshold": max(0.38, args.fabric_likeness_threshold - 0.12),
                "internal_haze_alpha_cap": min(args.internal_haze_alpha_cap, 12),
                "light_art_alpha_floor": max(120, args.light_art_alpha_floor - 20),
            },
        ),
    ]
    auto_dir = mkdir(run_dir / "auto_tune")
    results: list[dict[str, Any]] = []
    for name, params in variants:
        variant_maps = make_variant_maps(maps, **params)
        result = export_variant_outputs(
            variant_dir=auto_dir / name,
            name=name,
            params=params,
            upscaled=upscaled,
            base_rgb=base_rgb,
            polygon_mask=polygon_mask,
            maps=variant_maps,
            bit_depth=args.bit_depth,
            trim_padding=args.trim_padding,
            feather_px=args.feather,
            manual_mask=manual_mask,
            manual_mask_mode=args.manual_mask_mode,
            manual_keep=manual_keep,
            manual_delete=manual_delete,
            manual_soft_alpha=manual_soft_alpha,
        )
        results.append(result)
    create_contact_sheet(results, run_dir / "contact_sheet.png")
    write_auto_tune_summary(run_dir, results)
    if results:
        def pick_score(result: dict[str, Any]) -> float:
            qc = result["qc"]
            return (
                float(qc.get("light_ink_preservation_score", 0.0)) * 1.5
                + float(qc.get("tiny_detail_preservation_score", 0.0)) * 1.2
                + float(qc.get("barcode_text_preservation_score", 0.0))
                + float(qc.get("chrome_highlight_preservation_score", 0.0))
                + float(qc.get("eye_glove_preservation_score", 0.0))
                - float(qc.get("residue_risk_score", 1.0)) * 4.0
                - float(qc.get("false_deletion_risk_score", 1.0)) * 5.0
                - float(qc.get("internal_haze_alpha_after_refinement_0_255", 255.0)) / 180.0
            )

        best = max(results, key=pick_score)
        best_dir = Path(best["dir"])
        for src_name, dst_name in [
            ("extracted_artwork.png", "best_auto_tune_extracted_artwork.png"),
            ("extracted_artwork_fullsize.png", "best_auto_tune_extracted_artwork_fullsize.png"),
            ("final_alpha_mask.png", "best_auto_tune_alpha_mask.png"),
            ("checkered_preview.png", "best_auto_tune_checkered_preview.png"),
        ]:
            src = best_dir / src_name
            if src.exists():
                shutil.copy2(src, run_dir / dst_name)
    return results


def process(args: argparse.Namespace) -> None:
    require_cv2()
    input_path = Path(args.input).expanduser().resolve()
    if not input_path.exists():
        raise SystemExit(f"Input does not exist: {input_path}")

    run_id = args.run_id or now_run_id(str(input_path))
    out_root = mkdir(Path(args.out).expanduser().resolve())
    run_dir = mkdir(out_root / run_id)
    debug_dir = mkdir(Path(args.debug_out).expanduser().resolve() / run_id)
    layers_dir = mkdir(run_dir / "layers")

    original = load_oriented_rgb(input_path)
    original_h, original_w = original.shape[:2]
    save_rgb(debug_dir / "00_input_oriented.png", original)

    crop_box = parse_crop(args.crop, args.crop_mode, original_w, original_h)
    crop = crop_rgb(original, crop_box)
    crop_h, crop_w = crop.shape[:2]
    save_rgb(run_dir / "crop_preview.png", crop)
    save_rgb(layers_dir / "original_crop.png", crop)
    save_rgb(debug_dir / "01_original_crop.png", crop)

    upscaled, upscaler_used = upscale_image(
        crop,
        args.scale,
        args.upscaler,
        debug_dir,
        args.realesrgan_bin,
        args.dnn_superres_model,
        args.dnn_superres_name,
    )
    save_rgb(debug_dir / "01_upscaled_input.png", upscaled)

    polygon_mask, polygon_source = mask_from_args(args, upscaled, args.scale, debug_dir)
    save_gray(debug_dir / "02_user_polygon_mask.png", polygon_mask)
    save_gray(layers_dir / "print_area_polygon_mask.png", polygon_mask)

    rembg_note = None
    if args.rembg_helper:
        rembg_note = try_rembg_helper(upscaled, debug_dir)

    base_rgb, base_report = estimate_base_color(upscaled, polygon_mask)
    fabric_mask = fabric_seed_mask(upscaled, base_rgb, polygon_mask)
    save_gray(debug_dir / "03_fabric_seed_mask.png", fabric_mask)
    denoised = mild_denoise_fabric(upscaled, fabric_mask)
    save_rgb(debug_dir / "03_fabric_only_mild_denoise.png", denoised)

    normalized, lighting = estimate_lighting(denoised, base_rgb, polygon_mask, debug_dir)
    save_rgb(debug_dir / "04_lighting_normalized_for_analysis.png", normalized)
    save_rgb(run_dir / "estimated_fabric_base.png", lighting)
    save_rgb(run_dir / "normalized_crop.png", normalized)

    analysis_rgb = normalized
    maps = compute_alpha_maps(
        analysis_rgb,
        base_rgb,
        polygon_mask,
        preserve_light_ink=args.preserve_light_ink,
        remove_shirt_haze=args.remove_shirt_haze,
        recover_internal_light_art_mode=args.recover_internal_light_art,
        internal_light_min_alpha=args.internal_light_min_alpha,
        internal_haze_refine=args.internal_haze_refine,
        internal_art_confidence_threshold=args.internal_art_confidence_threshold,
        fabric_likeness_threshold=args.fabric_likeness_threshold,
        internal_haze_alpha_cap=args.internal_haze_alpha_cap,
        light_art_alpha_floor=args.light_art_alpha_floor,
        strong_ink_dilate_px=args.strong_ink_dilate_px,
        stroke_connect_radius=args.stroke_connect_radius,
    )
    if args.texture_flatten:
        analysis_rgb = apply_texture_flatten(analysis_rgb, maps.alpha, maps, polygon_mask, debug_dir)
        maps = compute_alpha_maps(
            analysis_rgb,
            base_rgb,
            polygon_mask,
            preserve_light_ink=args.preserve_light_ink,
            remove_shirt_haze=args.remove_shirt_haze,
            recover_internal_light_art_mode=args.recover_internal_light_art,
            internal_light_min_alpha=args.internal_light_min_alpha,
            internal_haze_refine=args.internal_haze_refine,
            internal_art_confidence_threshold=args.internal_art_confidence_threshold,
            fabric_likeness_threshold=args.fabric_likeness_threshold,
            internal_haze_alpha_cap=args.internal_haze_alpha_cap,
            light_art_alpha_floor=args.light_art_alpha_floor,
            strong_ink_dilate_px=args.strong_ink_dilate_px,
            stroke_connect_radius=args.stroke_connect_radius,
        )
    write_feature_maps(maps, debug_dir)

    save_gray(run_dir / "raw_alpha_score.png", (maps.raw_alpha_score * 255).astype(np.uint8))
    save_gray(run_dir / "protected_ink_mask.png", (maps.protected_ink * 255).astype(np.uint8))
    save_gray(run_dir / "shirt_residue_mask.png", (maps.shirt_residue * 255).astype(np.uint8))
    save_gray(run_dir / "print_silhouette_mask.png", (maps.print_silhouette * 255).astype(np.uint8))
    save_gray(run_dir / "print_silhouette_core.png", (maps.print_silhouette_core * 255).astype(np.uint8))
    save_gray(run_dir / "print_silhouette_peripheral.png", (maps.print_silhouette_peripheral * 255).astype(np.uint8))
    save_gray(run_dir / "silhouette_confidence.png", (maps.silhouette_confidence * 255).astype(np.uint8))
    save_gray(run_dir / "internal_holes_detected.png", (maps.internal_holes_detected * 255).astype(np.uint8))
    save_gray(run_dir / "internal_holes_recovered.png", (maps.internal_holes_recovered * 255).astype(np.uint8))
    save_gray(run_dir / "internal_haze_refined_mask.png", (maps.internal_haze_refined_mask * 255).astype(np.uint8))
    save_gray(run_dir / "recovered_art_kept.png", (maps.recovered_art_kept * 255).astype(np.uint8))
    save_gray(run_dir / "recovered_haze_removed.png", (maps.recovered_haze_removed * 255).astype(np.uint8))
    save_gray(run_dir / "false_deletion_risk.png", (maps.false_deletion_risk * 255).astype(np.uint8))
    save_gray(run_dir / "structure_score.png", (maps.final_artwork_confidence_score * 255).astype(np.uint8))
    save_gray(run_dir / "fabric_likeness_score.png", (maps.fabric_likeness_score * 255).astype(np.uint8))
    save_gray(run_dir / "artwork_confidence_score.png", (maps.final_artwork_confidence_score * 255).astype(np.uint8))
    save_gray(run_dir / "local_edge_score.png", (maps.local_edge_score * 255).astype(np.uint8))
    save_gray(run_dir / "local_contrast_score.png", (maps.local_contrast_score * 255).astype(np.uint8))
    save_gray(run_dir / "saturation_score.png", (maps.saturation_score * 255).astype(np.uint8))
    save_gray(run_dir / "lab_distance_from_fabric_score.png", (maps.lab_distance_from_fabric_score * 255).astype(np.uint8))
    save_gray(run_dir / "connected_to_ink_score.png", (maps.connected_to_ink_score * 255).astype(np.uint8))
    save_gray(run_dir / "stroke_likeness_score.png", (maps.stroke_likeness_score * 255).astype(np.uint8))
    zones = protection_zone_masks(maps.alpha.shape, maps.edge_conf, maps.protected_ink, maps.color_presence)
    save_rgb(run_dir / "protection_zones_overlay.png", protection_zones_overlay(upscaled, zones))
    save_rgb(debug_dir / "06_protection_zones_overlay.png", protection_zones_overlay(upscaled, zones))

    alpha = feather_alpha(maps.alpha, args.feather)
    manual_mask: Mask | None = None
    if args.manual_mask:
        manual_mask = load_mask(Path(args.manual_mask).expanduser().resolve(), (upscaled.shape[1], upscaled.shape[0]), nearest=False)
        save_gray(debug_dir / "07_manual_mask_loaded.png", manual_mask)
    alpha = apply_manual_mask(alpha, manual_mask, args.manual_mask_mode)

    manual_keep = None
    manual_delete = None
    manual_soft_alpha = None
    if args.manual_keep:
        manual_keep = load_mask(Path(args.manual_keep).expanduser().resolve(), (upscaled.shape[1], upscaled.shape[0]), nearest=False)
        save_gray(debug_dir / "07_manual_keep_loaded.png", manual_keep)
    if args.manual_delete:
        manual_delete = load_mask(Path(args.manual_delete).expanduser().resolve(), (upscaled.shape[1], upscaled.shape[0]), nearest=False)
        save_gray(debug_dir / "07_manual_delete_loaded.png", manual_delete)
    if args.manual_soft_alpha:
        manual_soft_alpha = load_mask(Path(args.manual_soft_alpha).expanduser().resolve(), (upscaled.shape[1], upscaled.shape[0]), nearest=False)
        save_gray(debug_dir / "07_manual_soft_alpha_loaded.png", manual_soft_alpha)
    alpha = apply_manual_corrections(alpha, manual_keep, manual_delete, manual_soft_alpha)
    alpha = np.clip(alpha, 0.0, 1.0)
    alpha8 = np.clip(alpha * 255.0, 0, 255).astype(np.uint8)
    save_gray(run_dir / "alpha_mask.png", alpha8)
    save_gray(run_dir / "final_alpha_mask.png", alpha8)
    save_gray(run_dir / "alpha_only_preview.png", alpha8)
    save_gray(layers_dir / "mask.png", alpha8)
    save_gray(layers_dir / "manual_mask_to_edit.png", alpha8)
    blank_manual = np.zeros_like(alpha8)
    save_gray(layers_dir / "manual_keep_mask.png", manual_keep if manual_keep is not None else blank_manual)
    save_gray(layers_dir / "manual_delete_mask.png", manual_delete if manual_delete is not None else blank_manual)
    save_gray(layers_dir / "manual_soft_alpha.png", manual_soft_alpha if manual_soft_alpha is not None else alpha8)
    save_gray(debug_dir / "07_final_alpha_mask.png", alpha8)

    save_rgb(run_dir / "halo_cleanup_before.png", upscaled)
    cleaned_upscaled = halo_cleanup_rgb(upscaled, alpha, base_rgb, maps)
    save_rgb(run_dir / "halo_cleanup_after.png", cleaned_upscaled)
    save_rgb(debug_dir / "07_halo_cleanup_after.png", cleaned_upscaled)

    rgba_full = rgba_from_alpha(cleaned_upscaled, alpha, base_rgb)
    save_rgba_png(run_dir / "extracted_artwork_fullsize.png", rgba_full, args.bit_depth)
    save_rgba_png(run_dir / "final_rgba_untrimmed.png", rgba_full, args.bit_depth)
    save_rgba_png(layers_dir / "extracted_art.png", rgba_full, args.bit_depth)
    save_rgba_png(layers_dir / "final_rgba.png", rgba_full, args.bit_depth)
    save_rgb(layers_dir / "normalized_crop.png", normalized)
    save_rgb(layers_dir / "estimated_fabric_base.png", lighting)
    save_rgb(layers_dir / "final_artwork_rgb.png", cleaned_upscaled)
    save_gray(layers_dir / "final_alpha_mask.png", alpha8)
    save_gray(layers_dir / "protected_ink_mask.png", (maps.protected_ink * 255).astype(np.uint8))
    save_gray(layers_dir / "recovered_internal_art.png", (maps.recovered_art_kept * 255).astype(np.uint8))
    save_gray(layers_dir / "removed_internal_haze.png", (maps.recovered_haze_removed * 255).astype(np.uint8))
    save_rgba_8(layers_dir / "deleted_shirt_pixels.png", deleted_pixels_layer(upscaled, alpha, polygon_mask))
    save_rgb(layers_dir / "preview_background.png", checkered_background((upscaled.shape[1], upscaled.shape[0])))

    rgba_trimmed, trim_box = trim_rgba(rgba_full, args.trim_padding)
    actual_bit_depth = save_rgba_png(run_dir / "extracted_artwork.png", rgba_trimmed, args.bit_depth)
    save_rgba_png(run_dir / "final_rgba_trimmed.png", rgba_trimmed, args.bit_depth)

    save_rgb(run_dir / "checkered_preview.png", composite_on_checkered(rgba_trimmed))
    save_rgb(run_dir / "black_bg_preview.png", composite_on_bg(rgba_trimmed, (0, 0, 0)))
    save_rgb(run_dir / "white_bg_preview.png", composite_on_bg(rgba_trimmed, (255, 255, 255)))
    save_rgb(run_dir / "gray_bg_preview.png", composite_on_bg(rgba_trimmed, (128, 128, 128)))
    save_rgb(run_dir / "red_bg_preview.png", composite_on_bg(rgba_trimmed, (220, 0, 36)))
    save_rgb(debug_dir / "08_preview_on_black_fullsize.png", composite_on_bg(rgba_full, (0, 0, 0)))
    save_rgb(debug_dir / "08_preview_on_white_fullsize.png", composite_on_bg(rgba_full, (255, 255, 255)))
    save_rgb(debug_dir / "08_preview_on_gray_fullsize.png", composite_on_bg(rgba_full, (128, 128, 128)))
    save_rgb(debug_dir / "08_preview_on_red_fullsize.png", composite_on_bg(rgba_full, (220, 0, 36)))

    alpha_verify = verify_alpha_with_imagemagick(run_dir / "extracted_artwork.png")
    false_deletion_zones, residue_zones, qc_metrics = detect_problem_zones(rgba_full, maps, base_rgb)
    confidence = mask_confidence(alpha, maps)
    false_mask = ((maps.false_deletion_risk > 0.5) | ((maps.protected_ink > 0.48) & (alpha < 0.42))).astype(np.uint8)
    residue_mask = ((maps.shirt_residue > 0.58) & (alpha > 0.03) & (maps.protected_ink < 0.22)).astype(np.uint8)
    recovered_mask = (maps.internal_holes_recovered > 0.5).astype(np.uint8)
    error_preview = edge_error_preview(upscaled, false_mask, residue_mask, recovered_mask)
    save_rgb(run_dir / "edge_error_preview.png", error_preview)
    save_rgb(debug_dir / "08_edge_error_preview.png", error_preview)

    warnings: list[str] = []
    if "A" not in alpha_verify.get("pillow_mode", "") and alpha_verify.get("pillow_has_alpha") != "True":
        warnings.append("Alpha verification did not confirm an alpha channel.")
    if qc_metrics["residue_fraction_of_alpha"] > 0.018:
        warnings.append("Possible low-saturation shirt residue remains inside the artwork boundary.")
    if qc_metrics["tiny_detail_preservation_score"] < 0.86:
        warnings.append("Tiny text, barcode, or hairline details may be degraded or under-matted.")
    if qc_metrics["false_deletion_risk_fraction_of_protected"] > 0.015:
        warnings.append("Protected light ink still has possible false-deletion zones.")
    if confidence["score"] < 0.86:
        warnings.append("Mask confidence is moderate or low. Inspect alpha_mask.png and previews.")
    if "Lanczos" in upscaler_used and args.scale > 1:
        warnings.append("Real super-resolution was not available; Lanczos interpolation was used for upscaling.")
    if rembg_note:
        warnings.append(f"rembg helper note: {rembg_note}")

    config = RunConfig(
        input_path=str(input_path),
        out_root=str(out_root),
        run_id=run_id,
        crop=crop_box,
        crop_mode=args.crop_mode,
        scale=args.scale,
        upscaler=args.upscaler,
        upscaler_used=f"{upscaler_used}; saved PNG bit depth {actual_bit_depth}",
        realesrgan_bin=args.realesrgan_bin,
        dnn_superres_model=args.dnn_superres_model,
        dnn_superres_name=args.dnn_superres_name,
        polygon_source=polygon_source,
        manual_mask=str(args.manual_mask) if args.manual_mask else None,
        manual_mask_mode=args.manual_mask_mode,
        manual_keep=str(args.manual_keep) if args.manual_keep else None,
        manual_delete=str(args.manual_delete) if args.manual_delete else None,
        manual_soft_alpha=str(args.manual_soft_alpha) if args.manual_soft_alpha else None,
        feather_px=args.feather,
        trim_padding=args.trim_padding,
        bit_depth=args.bit_depth,
        texture_flatten=args.texture_flatten,
        preserve_light_ink=args.preserve_light_ink,
        remove_shirt_haze=args.remove_shirt_haze,
        recover_internal_light_art=args.recover_internal_light_art,
        internal_light_min_alpha=args.internal_light_min_alpha,
        internal_haze_refine=args.internal_haze_refine,
        internal_art_confidence_threshold=args.internal_art_confidence_threshold,
        fabric_likeness_threshold=args.fabric_likeness_threshold,
        internal_haze_alpha_cap=args.internal_haze_alpha_cap,
        light_art_alpha_floor=args.light_art_alpha_floor,
        strong_ink_dilate_px=args.strong_ink_dilate_px,
        stroke_connect_radius=args.stroke_connect_radius,
        auto_tune=args.auto_tune,
        rembg_helper=args.rembg_helper,
        compare_against=str(args.compare_against) if args.compare_against else None,
    )
    write_report(
        run_dir / "report.md",
        run_dir / "report.json",
        config,
        original_size=(original_w, original_h),
        crop_size=(crop_w, crop_h),
        output_size=(int(rgba_trimmed.shape[1]), int(rgba_trimmed.shape[0])),
        base_report=base_report,
        confidence=confidence,
        false_deletion_zones=false_deletion_zones,
        residue_zones=residue_zones,
        qc_metrics=qc_metrics,
        trim_box=trim_box,
        alpha_verify=alpha_verify,
        warnings=warnings,
    )

    if args.compare_against:
        write_comparison_report(Path(args.compare_against).expanduser().resolve(), run_dir, rgba_full, maps, base_rgb, qc_metrics)

    auto_tune_results: list[dict[str, Any]] = []
    if args.auto_tune:
        auto_tune_results = run_auto_tune(
            run_dir=run_dir,
            upscaled=upscaled,
            base_rgb=base_rgb,
            polygon_mask=polygon_mask,
            maps=maps,
            args=args,
            manual_mask=manual_mask,
            manual_keep=manual_keep,
            manual_delete=manual_delete,
            manual_soft_alpha=manual_soft_alpha,
        )
        if args.compare_against and auto_tune_results:
            def balanced_pick_score(result: dict[str, Any]) -> float:
                qc = result["qc"]
                return (
                    float(qc.get("light_ink_preservation_score", 0.0)) * 1.5
                    + float(qc.get("tiny_detail_preservation_score", 0.0)) * 1.2
                    + float(qc.get("barcode_text_preservation_score", 0.0))
                    + float(qc.get("chrome_highlight_preservation_score", 0.0))
                    + float(qc.get("eye_glove_preservation_score", 0.0))
                    - float(qc.get("residue_risk_score", 1.0)) * 4.0
                    - float(qc.get("false_deletion_risk_score", 1.0)) * 5.0
                    - float(qc.get("internal_haze_alpha_after_refinement_0_255", 255.0)) / 180.0
                )

            best = max(auto_tune_results, key=balanced_pick_score)
            with (run_dir / "comparison_report.md").open("a") as handle:
                handle.write(
                    "\n## Auto-Tune Production Pick\n\n"
                    f"- Best auto-tune variant for real production use: `{best['name']}`\n"
                    f"- Best variant overall shirt-haze candidate alpha: {best['qc'].get('shirt_haze_candidate_alpha_after_refinement_0_255')} / 255\n"
                    f"- Best variant internal shirt-haze candidate alpha: {best['qc'].get('internal_haze_alpha_after_refinement_0_255')} / 255\n"
                    f"- Best variant protected light-ink score: {best['qc'].get('light_ink_preservation_score')}\n"
                    "- See `auto_tune_summary.md` and `contact_sheet.png` for the full ranking.\n"
                )

    print(f"Run complete: {run_dir}")
    print(f"Debug intermediates: {debug_dir}")
    print(f"Final PNG: {run_dir / 'extracted_artwork.png'}")
    if warnings:
        print("Warnings:")
        for warning in warnings:
            print(f"  - {warning}")


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        description="Extract a flat transparent apparel print graphic from a shirt mockup without generative AI.",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )
    parser.add_argument("input", help="Input shirt mockup image path.")
    parser.add_argument("--out", default="outputs/apparel-print-extractor", help="Run output root.")
    parser.add_argument("--debug-out", default="outputs/debug", help="Debug intermediate root.")
    parser.add_argument("--run-id", default=None, help="Optional run id folder name.")
    parser.add_argument("--crop", default=None, help="Rough print crop. Default is full image.")
    parser.add_argument("--crop-mode", choices=["xywh", "xyxy"], default="xywh", help="Interpretation for --crop.")
    parser.add_argument("--scale", type=int, choices=[1, 2, 4], default=4, help="Upscale factor before extraction.")
    parser.add_argument(
        "--upscaler",
        choices=["auto", "realesrgan", "opencv-dnn", "lanczos"],
        default="auto",
        help="Upscaler preference. Auto tries Real-ESRGAN, OpenCV dnn_superres, then Lanczos.",
    )
    parser.add_argument("--realesrgan-bin", default=None, help="Path to realesrgan-ncnn-vulkan or compatible CLI.")
    parser.add_argument("--dnn-superres-model", default=None, help="Path to OpenCV dnn_superres model file.")
    parser.add_argument("--dnn-superres-name", default="edsr", help="OpenCV dnn_superres model name, e.g. edsr/fsrcnn/espcn/lapsrn.")
    parser.add_argument("--polygon", default=None, help='Inline print-area polygon: "x,y x,y x,y".')
    parser.add_argument("--polygon-json", default=None, help="JSON file with polygon points.")
    parser.add_argument("--polygon-mask", default=None, help="Grayscale mask image for the rough full print area.")
    parser.add_argument(
        "--polygon-space",
        choices=["pre-upscale", "upscaled"],
        default="pre-upscale",
        help="Coordinate space for --polygon and --polygon-json.",
    )
    parser.add_argument("--draw-mask", action="store_true", help="Open an interactive OpenCV polygon mask drawer.")
    parser.add_argument("--manual-mask", default=None, help="User-painted final alpha mask for rerun compositing.")
    parser.add_argument(
        "--manual-mask-mode",
        choices=["replace", "multiply", "max"],
        default="replace",
        help="How to combine --manual-mask with the generated alpha.",
    )
    parser.add_argument("--manual-keep", default=None, help="White-painted mask restoring artwork. Applied after automatic alpha.")
    parser.add_argument("--manual-delete", default=None, help="White-painted mask deleting shirt residue. Overrides manual keep.")
    parser.add_argument("--manual-soft-alpha", default=None, help="Grayscale alpha override. Overrides automatic, keep, and delete masks.")
    parser.add_argument("--feather", "--feather-px", dest="feather", type=float, default=0.9, help="Final alpha feather in pixels.")
    parser.add_argument("--trim-padding", type=int, default=20, help="Transparent trim padding in final pixels.")
    parser.add_argument("--bit-depth", type=int, choices=[8, 16], default=16, help="Transparent PNG bit depth if supported.")
    parser.add_argument(
        "--texture-flatten",
        action="store_true",
        help="Run OpenCV textureFlattening only in low-alpha shirt-contaminated zones.",
    )
    parser.add_argument(
        "--preserve-light-ink",
        action="store_true",
        help="Conservative mode: protect structured white/gray ink such as eyes, gloves, chrome, splashes, text, barcode, and UI linework.",
    )
    parser.add_argument(
        "--remove-shirt-haze",
        action="store_true",
        help="Aggressively suppress low-detail low-saturation fabric haze without removing protected ink.",
    )
    parser.add_argument(
        "--recover-internal-light-art",
        action="store_true",
        help="Recover structured low-alpha holes inside the print silhouette, preserving light artwork inside characters, type, chrome, splashes, sky, and UI marks.",
    )
    parser.add_argument(
        "--internal-light-min-alpha",
        type=int,
        default=120,
        help="Minimum alpha floor for ambiguous structured light artwork inside the print silhouette.",
    )
    parser.add_argument(
        "--internal-haze-refine",
        action="store_true",
        help="Run a structure-aware pass after internal light recovery to suppress recovered smooth fabric haze.",
    )
    parser.add_argument("--internal-art-confidence-threshold", type=float, default=0.42, help="Artwork-confidence threshold for keeping recovered internal light pixels.")
    parser.add_argument("--fabric-likeness-threshold", type=float, default=0.62, help="Fabric-likeness threshold for suppressing recovered internal haze.")
    parser.add_argument("--internal-haze-alpha-cap", type=int, default=35, help="Maximum alpha for recovered pixels classified as internal shirt haze.")
    parser.add_argument("--light-art-alpha-floor", type=int, default=150, help="Minimum alpha for recovered pixels classified as real light artwork.")
    parser.add_argument("--strong-ink-dilate-px", type=int, default=18, help="Radius used for connected-to-ink structure scoring.")
    parser.add_argument("--stroke-connect-radius", type=int, default=24, help="Radius used for stroke/linework connectivity scoring.")
    parser.add_argument(
        "--auto-tune",
        action="store_true",
        help="Export conservative, balanced, aggressive, text/chrome, and clean-alpha variants plus a ranked summary/contact sheet.",
    )
    parser.add_argument(
        "--rembg-helper",
        action="store_true",
        help="Optionally save a rembg rough helper alpha if rembg is installed. This is not used as the final matte.",
    )
    parser.add_argument("--compare-against", default=None, help="Previous run directory or PNG to compare against and write comparison_report.md.")
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()
    process(args)


if __name__ == "__main__":
    main()
