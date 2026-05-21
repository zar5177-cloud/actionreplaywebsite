import type { AdVideoAsset, AdVideoPriority, AdVideoSceneFamily } from "./ad-video-assets";

type LateAssetInput = {
  imageNumber: number;
  sourceImage: number;
  slug: string;
  originalPath: string;
  sha256: string;
  assetCategory: AdVideoAsset["assetCategory"];
  sceneFamily: AdVideoSceneFamily;
  priority: AdVideoPriority;
  summary: string;
};

const sourceRoot = "/assets/generated/ad-video/source-frames";
const rightsStatus = "original replacement required before commercial launch" as const;
const sharedNegativePrompt =
  "Avoid new logos, legible third-party brand names, warped hands, unreadable UI labels, modern smartphones, glossy generic sci-fi, clean showroom lighting, and random extra characters.";

const frame = (filename: string) => `${sourceRoot}/${filename}`;
const padFrame = (imageNumber: number) => String(imageNumber).padStart(2, "0");

const rightsNotesByFamily: Partial<Record<AdVideoSceneFamily, string>> = {
  "psychic-creature-retail":
    "Contains Pokemon/GameCube/import magazine/game-shop references. Use only for composition, lighting, and retail mood; final commercial frames need original creature art and fictionalized packaging unless licensed.",
  "psychic-creature-game-room":
    "Contains Pokemon/GameCube/Smash-style references and legacy console UI. Treat as reference-only and rebuild with original Action Replay universe characters and cleared hardware marks.",
  "skater-mall-replay":
    "Contains Ness/EarthBound-like character, mall/store signage, and skate-game HUD cues. Replace with an original striped-cap courier and cleared interface graphics before launch.",
  "skater-rooftop-code":
    "Contains Ness/EarthBound-like character, handheld/console marks, and handwritten cheat-code layouts. Use as code-sheet and rooftop mood reference with original character and cleared marks.",
  "psychic-creature-billboard":
    "Contains Pokemon/GameCube/Datel-era billboard references. Use for rainy cyber-billboard scale and lighting only; final billboard creative needs original characters and cleared brand lockups.",
  "action-replay-print-ad":
    "Contains Action Replay/Datel-era ad layout and third-party platform references. Use as legacy print-ad direction while rebuilding with cleared brand assets.",
  "ds-hardware-product":
    "Contains Nintendo DS and Action Replay DS hardware/mark references. Use as macro product reference only; final commercial use needs cleared product rights or fictionalized hardware.",
  "skater-gamecube-hardware":
    "Contains GameCube, Pokemon, PS2, and Action Replay sticker/hardware references. Treat as product-mod mood reference until hardware and character marks are cleared or replaced.",
  "shop-human-retail":
    "Contains generated human likeness, third-party game boxes, and shop/platform marks. Use as retail-world reference only with final rights clearance and fictionalized packaging.",
};

const rightsNotesFor = (sceneFamily: AdVideoSceneFamily) =>
  rightsNotesByFamily[sceneFamily] ??
  "Contains third-party game, platform, character, or venue references. Treat as reference-only until final brand-safe art is rebuilt or rights are cleared.";

const usageFor = (asset: LateAssetInput) => {
  if (asset.sceneFamily === "ds-hardware-product") {
    return "Macro hardware reference for DS-era Action Replay insert, cartridge, and handheld handling shots.";
  }

  if (asset.sceneFamily === "action-replay-print-ad") {
    return "Legacy print-ad and poster reference for the clean AR Max skate-commercial visual language.";
  }

  if (asset.sceneFamily === "psychic-creature-billboard") {
    return "Rainy city billboard reference for the oversized cheat-system reveal sequence.";
  }

  if (asset.sceneFamily === "arcade-interior") {
    return "Arcade-world reference for neon cabinet environments, crowd density, and brand takeover moments.";
  }

  return "Expanded ad-video reference for Action Replay retail, code-sheet, creature, and Y2K game-culture scenes.";
};

const motionPromptFor = (asset: LateAssetInput) => {
  if (asset.sceneFamily === "skater-mall-replay") {
    return "Use fisheye handheld replay movement, CRT scanlines, subtle HUD jitter, and glossy mall-floor reflections while the skater rolls through frame.";
  }

  if (asset.sceneFamily === "skater-rooftop-code") {
    return "Slow push over the notebook and handheld, spray cans catching neon rim light, city signs blinking, pen strokes and paper shadows moving slightly.";
  }

  if (asset.sceneFamily === "psychic-creature-retail") {
    return "Slow handheld drift through the import shop, fluorescent tubes flicker, glossy magazine pages flex, CRTs glow in the background.";
  }

  if (asset.sceneFamily === "psychic-creature-game-room") {
    return "Low blue CRT light pulses across the room, controller cable shifts, screen scanlines roll, and the creature remains locked into the match.";
  }

  if (asset.sceneFamily === "psychic-creature-billboard") {
    return "Rain falls through the neon city air, billboard LEDs shimmer, puddles ripple, and the creature silhouette watches the giant Action Replay signal.";
  }

  if (asset.sceneFamily === "action-replay-print-ad") {
    return "Animate like a glossy early-2000s ad plate: gentle parallax on the rider, orbital graphics sliding, faint scanline texture, and crisp logo glints.";
  }

  if (asset.sceneFamily === "ds-hardware-product") {
    return "Macro insert motion with red-blue arcade reflections, cartridge sliding cleanly, handheld LEDs flickering, and background screens blooming softly.";
  }

  if (asset.sceneFamily === "arcade-interior") {
    return "Handheld pan through blue-magenta arcade light, cabinet screens flicker, players shift subtly, and Action Replay stickers catch specular highlights.";
  }

  return "Slow cinematic push with Y2K scanline texture, practical neon flicker, and small prop movement while preserving the original composition.";
};

const lateFrame = (asset: LateAssetInput): AdVideoAsset => {
  const frameNumber = padFrame(asset.imageNumber);
  const filename = `${frameNumber}-${asset.slug}.png`;

  return {
    id: `ad-video-${frameNumber}-${asset.slug}`,
    imageNumber: asset.imageNumber,
    filename,
    src: frame(filename),
    originalPath: asset.originalPath,
    sourceReference: `Late batch Image #${asset.sourceImage}, user-supplied AI reference, May 10 2026`,
    sha256: asset.sha256,
    width: 1448,
    height: 1086,
    assetCategory: asset.assetCategory,
    sceneFamily: asset.sceneFamily,
    priority: asset.priority,
    usage: usageFor(asset),
    promptSummary: `${asset.summary}.`,
    alt: asset.summary,
    visualRead: `${asset.summary}. Strong reference for ${asset.sceneFamily.replaceAll("-", " ")} composition.`,
    motionPrompt: motionPromptFor(asset),
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: rightsNotesFor(asset.sceneFamily),
  };
};

// Prompt Image #13, 10_17_25 PM, was an exact duplicate of Image #9 and is intentionally not imported.
const lateFrames: LateAssetInput[] = [
  { imageNumber: 82, sourceImage: 1, slug: "psychic-creature-import-shop-magazine", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 10_12_38 PM.png", sha256: "471da43ee18fd6826015b85e3c1f3e12f6cf8ab8c8edb1a98b9146f7cc75e94f", assetCategory: "drop-card", sceneFamily: "psychic-creature-retail", priority: "primary", summary: "Psychic creature reads an import-magazine spread at a retro game shop counter" },
  { imageNumber: 83, sourceImage: 2, slug: "psychic-creature-game-store-zelda-magazine", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 10_12_51 PM.png", sha256: "f32cb5959942f063e6e154a63a9f1c4103fc19387fdf8d7d041b886e5697dbbf", assetCategory: "drop-card", sceneFamily: "psychic-creature-retail", priority: "support", summary: "Psychic creature studies a GameCube magazine in a tight import-store aisle" },
  { imageNumber: 84, sourceImage: 3, slug: "psychic-creature-bedroom-gamecube-play", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 10_24_51 PM.png", sha256: "a76d29643c9c800fbba240017c1d04b8a341a6c74c6022715d6a64229caf5329", assetCategory: "drop-card", sceneFamily: "psychic-creature-game-room", priority: "primary", summary: "Hoodied psychic creature plays a CRT GameCube fighter in a midnight bedroom" },
  { imageNumber: 85, sourceImage: 4, slug: "psychic-creature-night-bedroom-match", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 10_30_45 PM.png", sha256: "7bc86da44c64fcca515fe0f5c8d3ca328895a2072b4d2451052907ceed68596a", assetCategory: "drop-card", sceneFamily: "psychic-creature-game-room", priority: "support", summary: "Wide bedroom match setup with discs, cables, CRT glow, and GameCube hardware" },
  { imageNumber: 86, sourceImage: 5, slug: "psychic-creature-import-games-counter", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 10_16_42 PM.png", sha256: "be180ce1d7d1e7f3432dafdbcf322ba53a11fe81ec0a42c3bd79ca01f5dc5365", assetCategory: "shop-banner", sceneFamily: "psychic-creature-retail", priority: "primary", summary: "Psychic creature reads Action Replay magazine under import-games neon" },
  { imageNumber: 87, sourceImage: 6, slug: "psychic-creature-nintendo-power-store-counter", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 10_16_49 PM.png", sha256: "a69c2dc449ecdcada742149a084fe63a8a500bb6aad4f7db67663bb26716adb8", assetCategory: "drop-card", sceneFamily: "psychic-creature-retail", priority: "support", summary: "Creature reads Nintendo Power at a glass counter with open magazines and controller" },
  { imageNumber: 88, sourceImage: 7, slug: "skater-fourside-mall-vhs-preview", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_10_17 PM.png", sha256: "3b8cda6a1264b1b134b31c3b9f3834b6d1522c7519c2c1f1d037d6025c73caf5", assetCategory: "drop-card", sceneFamily: "skater-mall-replay", priority: "primary", summary: "Fisheye VHS mall skate frame with Action Replay camera overlay" },
  { imageNumber: 89, sourceImage: 8, slug: "skater-fourside-mall-replay-trick", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_11_32 PM.png", sha256: "6874ba18c5e4b68722f4ff93c5c2a57f5edfeac9e32f06b8608949faa555b037", assetCategory: "drop-card", sceneFamily: "skater-mall-replay", priority: "support", summary: "Replay trick HUD frame of a striped-cap skater inside a blue-lit mall" },
  { imageNumber: 90, sourceImage: 9, slug: "psychic-creature-magazine-rack-action-replay", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 10_17_00 PM.png", sha256: "f34d61ebff4bcc220ba5a30df6a4dfcfc09f3d70d7479788aecaf6493639fe2e", assetCategory: "drop-card", sceneFamily: "psychic-creature-retail", priority: "support", summary: "Creature reads Action Replay magazine beside dense magazine racks and CRT skate footage" },
  { imageNumber: 91, sourceImage: 10, slug: "psychic-creature-dark-gamecube-bedroom", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 10_24_11 PM.png", sha256: "bb881a16d01034ac1ea0462431e35e076a9019c8f507fbdb686d1f9e630a85fb", assetCategory: "drop-card", sceneFamily: "psychic-creature-game-room", priority: "support", summary: "Dark blue bedroom gaming shot with hoodied creature, CRT menu, and GameCube console" },
  { imageNumber: 92, sourceImage: 11, slug: "psychic-creature-bedroom-smash-crt", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 10_31_40 PM.png", sha256: "1c06f83761355afa223496f33dc66c367b86ba23dce2dbd0999c88f241126941", assetCategory: "drop-card", sceneFamily: "psychic-creature-game-room", priority: "support", summary: "Creature plays a bright arena match on CRT in a poster-filled bedroom" },
  { imageNumber: 93, sourceImage: 12, slug: "psychic-creature-import-games-nintendo-power-close", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 10_20_38 PM.png", sha256: "221a445311d1978d644f4957e194ecb4a3806e318ecc3dbad54f0b8626f39097", assetCategory: "drop-card", sceneFamily: "psychic-creature-retail", priority: "support", summary: "Creature closeup reading Nintendo Power in an import games corner with neon signage" },
  { imageNumber: 94, sourceImage: 14, slug: "skater-mall-fisheye-camera-mode", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_09_52 PM.png", sha256: "aa28bc713e4e5c1084fa2803ac94aae47d43764b5a70d1f0912852ab15d27b2d", assetCategory: "drop-card", sceneFamily: "skater-mall-replay", priority: "support", summary: "Camera-mode fisheye mall replay with blue GameCube storefront signs" },
  { imageNumber: 95, sourceImage: 15, slug: "skater-rooftop-drawing-ness-sign", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_02_05 PM.png", sha256: "498867dbeb7e8fdc9fa95110691df2db76e931ad2d73f9d68326cc5011f3424f", assetCategory: "drop-card", sceneFamily: "skater-rooftop-code", priority: "primary", summary: "Striped-cap skater sketches at night beside spray cans, handheld, and neon skyline" },
  { imageNumber: 96, sourceImage: 16, slug: "skater-rooftop-action-replay-suit-your-game", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_03_57 PM.png", sha256: "320d34ff8eff5dc6855a0520139e5471c3b137882d034aeeeb58ff7a3d26278d", assetCategory: "hero-poster", sceneFamily: "skater-rooftop-code", priority: "primary", summary: "Rooftop poster frame with Action Replay lockup and skater writing in a notebook" },
  { imageNumber: 97, sourceImage: 17, slug: "skater-gamecube-sticker-workbench", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_15_09 PM.png", sha256: "cbf40e577c36a06a9d11bef281123f2a283570a998c0ad57ce7e10dafe10f0c5", assetCategory: "product-mockup", sceneFamily: "skater-gamecube-hardware", priority: "primary", summary: "Skater applies a sticker to a purple GameCube on a cluttered workbench" },
  { imageNumber: 98, sourceImage: 18, slug: "skater-rooftop-earthbound-drawing", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_03_38 PM.png", sha256: "b620f8c2f043ae4663ff1b4eaffa9d2731ac8b515bb66c20e5d357a014d05820", assetCategory: "drop-card", sceneFamily: "skater-rooftop-code", priority: "support", summary: "Rooftop drawing beat with EarthBound handheld glow, spray cans, and skyline signage" },
  { imageNumber: 99, sourceImage: 19, slug: "psychic-gamecube-campaign-bedroom", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 10_37_29 PM.png", sha256: "964ad143f780bc4b984ad3a9bb8254633c002a0fad373748d752418c9997b14f", assetCategory: "hero-poster", sceneFamily: "psychic-creature-game-room", priority: "primary", summary: "Magazine-ad style GameCube bedroom frame with creature, CRT title screen, and Japanese copy" },
  { imageNumber: 100, sourceImage: 20, slug: "psychic-fzero-action-replay-magazine", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 10_21_23 PM.png", sha256: "d3672a4f4433206e52ce5f6ae807dfa20ba7437154fc5207d140b102a22e2d00", assetCategory: "drop-card", sceneFamily: "psychic-creature-retail", priority: "support", summary: "Creature reads Action Replay magazine in PS2/GameCube import racks beside a CRT kiosk" },
  { imageNumber: 101, sourceImage: 21, slug: "skater-rooftop-cheats-notebook", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_03_29 PM.png", sha256: "763c848d7a6d826dd3c96b2ad48e151f89aae71aca0ac7540987ecc81aa7fc84", assetCategory: "drop-card", sceneFamily: "skater-rooftop-code", priority: "primary", summary: "Rooftop cheat menu overlay with skater reading a stickered notebook" },
  { imageNumber: 102, sourceImage: 22, slug: "skater-mall-trick-meter-replay", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_11_08 PM.png", sha256: "e838b8741de7d1da7ab6a814350723f2bd08d81b301d195067aee8f5b36488f0", assetCategory: "drop-card", sceneFamily: "skater-mall-replay", priority: "support", summary: "Trick-meter replay HUD with skater rolling through a shuttered mall corridor" },
  { imageNumber: 103, sourceImage: 23, slug: "psychic-gamecube-magazine-shelf", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 10_21_32 PM.png", sha256: "435f568afd15bb8f6cdf4b979f478bada28487c44a408faec7353ca83f038ea1", assetCategory: "drop-card", sceneFamily: "psychic-creature-retail", priority: "support", summary: "Creature reads a GameCube magazine beside import shelves, skate decks, and warm shop lighting" },
  { imageNumber: 104, sourceImage: 24, slug: "skater-rooftop-sketch-blue-ds", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_04_23 PM.png", sha256: "234c837f6e75cb5106437c1becaf9dcf91b97304abad3b648ba32db77c6bc6cb", assetCategory: "drop-card", sceneFamily: "skater-rooftop-code", priority: "support", summary: "Blue rooftop sketching scene with open handheld menu, graffiti wall, and spray cans" },
  { imageNumber: 105, sourceImage: 25, slug: "skater-rooftop-sound-mode-ds", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_05_21 PM.png", sha256: "659d11723567bb5099717afb29f7c99acb838632e5b71bfc6de3564faf24b5ef", assetCategory: "drop-card", sceneFamily: "skater-rooftop-code", priority: "support", summary: "Wide rooftop sketch scene with blue DS menu, skateboard, spray cans, and city bokeh" },
  { imageNumber: 106, sourceImage: 26, slug: "skater-bedroom-gamecube-sticker", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_16_36 PM.png", sha256: "93404bc1467aa37a0e0252a2bf05adef05a2a1f5fae5aa639c9e0f4b40694b4e", assetCategory: "product-mockup", sceneFamily: "skater-gamecube-hardware", priority: "support", summary: "Bedroom desk shot of skater drawing stickers onto a purple GameCube shell" },
  { imageNumber: 107, sourceImage: 27, slug: "skater-code-notebook-closeup", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_08_21 PM.png", sha256: "e5a667edb2290dc3ca30ba75a1537de21ffe98a5078216c0b80a970104201250", assetCategory: "drop-card", sceneFamily: "skater-rooftop-code", priority: "primary", summary: "Close notebook shot with Action Replay logo, cheat codes, controller inputs, and TV code list" },
  { imageNumber: 108, sourceImage: 28, slug: "skater-rooftop-sunset-notebook", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_04_57 PM.png", sha256: "e263e40232be69d548766c6b2cad2eb763953eeadd93fe039dae169d70e347c2", assetCategory: "drop-card", sceneFamily: "skater-rooftop-code", priority: "support", summary: "Purple-sunset rooftop notebook scene with handheld menu and stickered surface" },
  { imageNumber: 109, sourceImage: 29, slug: "skater-action-replay-codes-notebook", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_07_50 PM.png", sha256: "faed06f01a39cc32568d6cec9b4b47fb29df5f71a4d9c7c8ae2ebf9dd085976d", assetCategory: "drop-card", sceneFamily: "skater-rooftop-code", priority: "support", summary: "Desk closeup of skater writing Action Replay codes beside PS2 media and CRT menu" },
  { imageNumber: 110, sourceImage: 30, slug: "visor-courier-code-notebook-gamecube", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_06_44 PM.png", sha256: "f6b3d6f510a09a59eb3e1a9162786b36dfa433d72b49c3e21a2e901bc8e16d0d", assetCategory: "drop-card", sceneFamily: "skater-rooftop-code", priority: "support", summary: "Over-shoulder notebook page with GameCube Action Replay sketches and controller icons" },
  { imageNumber: 111, sourceImage: 31, slug: "skater-ar-max-white-promo", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_18_53 PM.png", sha256: "759bbd0c542c086ce68173824984b0ac7eb60c521b5b7137a0590b2264c3cb5c", assetCategory: "hero-poster", sceneFamily: "action-replay-print-ad", priority: "primary", summary: "Clean white AR skate promo with helmeted rider and blue orbital graphics" },
  { imageNumber: 112, sourceImage: 32, slug: "skater-action-replay-max-codebook", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_06_14 PM.png", sha256: "f61483d9cc3f7e3cf40ec76ddb9e47d00ffdad9e6b4c5918e12d2436e9b311d4", assetCategory: "drop-card", sceneFamily: "skater-rooftop-code", priority: "support", summary: "Overhead Action Replay Max codebook page with creature sketch and PS2/GameCube media" },
  { imageNumber: 113, sourceImage: 33, slug: "skater-mall-normal-replay-fisheye", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_11_01 PM.png", sha256: "7065ef96ea850a353901dcc6ddd122071340223fc5c65105731d02d4a1cf9754", assetCategory: "drop-card", sceneFamily: "skater-mall-replay", priority: "support", summary: "Normal replay fisheye mall frame with skater crouching low on board" },
  { imageNumber: 114, sourceImage: 34, slug: "skater-notebook-logo-closeup", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_08_54 PM.png", sha256: "4e9810b478ca3605f7ad475508c4ecbb84d0d558d9731bb7536678639fdb8639", assetCategory: "drop-card", sceneFamily: "skater-rooftop-code", priority: "support", summary: "Closeup notebook logo design with Action Replay sketches and controller-code arrows" },
  { imageNumber: 115, sourceImage: 35, slug: "skater-notebook-psychic-creature-code-sheet", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_07_43 PM.png", sha256: "ab615a8b6c953eeec959f4b75575aaffb3e706d109ddad857323ee13bbadb9f8", assetCategory: "drop-card", sceneFamily: "skater-rooftop-code", priority: "support", summary: "Top-down notebook sketch page with Action Replay codes and psychic creature drawing" },
  { imageNumber: 116, sourceImage: 36, slug: "psychic-billboard-rain-ultimate-cheat-system", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 10_59_51 PM.png", sha256: "99039c8b74ef11faf1f1ca4b00def055f6e9d698b3f43c678a869a93bbe7718e", assetCategory: "hero-poster", sceneFamily: "psychic-creature-billboard", priority: "primary", summary: "Rainy city billboard showing Action Replay ultimate cheat system above a creature silhouette" },
  { imageNumber: 117, sourceImage: 37, slug: "psychic-billboard-unleash-power-rain", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_03_17 PM.png", sha256: "c8da2b3a80986ddc1f155a547298b5a45d4ad69d7e5174ff21b3ddc0ae60c9d8", assetCategory: "hero-poster", sceneFamily: "psychic-creature-billboard", priority: "primary", summary: "Creature watches a huge rainy curved billboard advertising Action Replay hardware" },
  { imageNumber: 118, sourceImage: 38, slug: "skater-ar-action-replay-skate-poster", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_17_27 PM.png", sha256: "958c544361bed7022bf58d22a06eaf59b7abc2276a34be89bc116d7027873436", assetCategory: "hero-poster", sceneFamily: "action-replay-print-ad", priority: "primary", summary: "Glossy Action Replay skate poster with blue orbital trails and red unleash badge" },
  { imageNumber: 119, sourceImage: 39, slug: "ar-skate-poster-unleash-power", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_20_02 PM.png", sha256: "29c3fdfe8753c9e7306c7271f445febc38204c665a4581b57baec6d28aea0256", assetCategory: "hero-poster", sceneFamily: "action-replay-print-ad", priority: "support", summary: "White-blue AR Max poster with skater mid-trick and Datel-era menu graphics" },
  { imageNumber: 120, sourceImage: 40, slug: "arcade-action-replay-antihero-hallway", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 10_23_58 PM.png", sha256: "e3e522c06f15d2c4bb37734ee3197d4abaf5c54cb216ab5b5a2c723d8d1569b4", assetCategory: "shop-banner", sceneFamily: "arcade-interior", priority: "primary", summary: "Blue arcade corridor with spiky antihero mascot and Action Replay banner signage" },
  { imageNumber: 121, sourceImage: 41, slug: "psychic-import-store-smash-magazines", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_06_02 PM.png", sha256: "352f841393d814f0ab0c1b5d1f10affd1bc9631465bbc633f27500feb292e35b", assetCategory: "drop-card", sceneFamily: "psychic-creature-retail", priority: "support", summary: "Creature reads GameCube magazine in a bright import store with Smash match on CRT" },
  { imageNumber: 122, sourceImage: 42, slug: "notebook-psychic-creature-action-replay-max-overhead", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_18_12 PM.png", sha256: "c1f9c4c5a429827b4c77a05777800aae5d636896290513954749946bf60c9384", assetCategory: "drop-card", sceneFamily: "skater-rooftop-code", priority: "support", summary: "Overhead handwritten code page with Action Replay logo and psychic creature sketch" },
  { imageNumber: 123, sourceImage: 43, slug: "skater-action-replay-v2-code-notebook", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_09_04 PM.png", sha256: "512d840373f3a71aff39cb1703f7fc62f6632e221642ee94db39c562d4284a35", assetCategory: "drop-card", sceneFamily: "skater-rooftop-code", priority: "support", summary: "Skater writes Action Replay v2 PS2 notes beside a loader screen and Colosseum poster" },
  { imageNumber: 124, sourceImage: 44, slug: "skater-ps2-code-notebook-red-blue", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_08_09 PM.png", sha256: "be8762140157bb0f2e993faecaf2b1a5edef8c28019917f2d6dc04b570d6439a", assetCategory: "drop-card", sceneFamily: "skater-rooftop-code", priority: "support", summary: "Red-blue lit notebook page with PS2 Action Replay codes and cartridge sketch" },
  { imageNumber: 125, sourceImage: 45, slug: "skater-gamecube-box-workbench", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_13_54 PM.png", sha256: "52dca823b86742834fec6490e23064e8697ddb33e5e627c147245bbe3d7e8314", assetCategory: "product-mockup", sceneFamily: "skater-gamecube-hardware", priority: "primary", summary: "Skater leans over a stickered GameCube surrounded by memory cards and game cases" },
  { imageNumber: 126, sourceImage: 46, slug: "skater-bedroom-gamecube-sticker-sheet", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_10_09 PM.png", sha256: "b710f4c8ad6d64c1eb1bedc3cec0c82e9d6862aaacaf247c8ec65300231e74f6", assetCategory: "product-mockup", sceneFamily: "skater-gamecube-hardware", priority: "support", summary: "Skater decorates GameCube with sticker sheets in a bedroom full of PS2-era posters" },
  { imageNumber: 127, sourceImage: 47, slug: "skater-rooftop-notebook-ds-city", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_05_10 PM.png", sha256: "f6621c0c531b3d593464ef8094f21703a37f7b72c9b1abb6820ff9fb9f7cc8ba", assetCategory: "drop-card", sceneFamily: "skater-rooftop-code", priority: "support", summary: "Night rooftop sketch scene with open DS music menu, spray cans, and glowing city sign" },
  { imageNumber: 128, sourceImage: 48, slug: "skater-ar-max-white-menu-poster", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_17_32 PM.png", sha256: "641e7105524c1b22f56a34fa33c695ac52d595357841cf8a2aa887b2ec4d10c2", assetCategory: "hero-poster", sceneFamily: "action-replay-print-ad", priority: "support", summary: "White AR Max menu poster with helmeted skater and software menu layout" },
  { imageNumber: 129, sourceImage: 49, slug: "skull-skater-ar-max-white-promo", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 10_56_17 PM.png", sha256: "356b55e3b592e55a617e5ed48584a43c4ef190cecde7ec3b91e0515b90d3c2f4", assetCategory: "hero-poster", sceneFamily: "action-replay-print-ad", priority: "support", summary: "Masked skater promo pose on white AR interface background with bold red deck graphic" },
  { imageNumber: 130, sourceImage: 50, slug: "action-replay-ds-product-insert", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_18_20 PM.png", sha256: "76de1e38a6c581edb69dfe4a16b055a46a3c76b9680577bd5283a7719a3ec4cc", assetCategory: "product-mockup", sceneFamily: "ds-hardware-product", priority: "primary", summary: "Hands insert Action Replay DS cartridge into a silver Nintendo DS under red-blue light" },
  { imageNumber: 131, sourceImage: 51, slug: "arcade-action-replay-crowd-wide", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_26_54 PM.png", sha256: "1ff5850f8dd5ce50a935945922ece3985af23b23e4aa3bb4c67fa523b84a79e1", assetCategory: "shop-banner", sceneFamily: "arcade-interior", priority: "primary", summary: "Wide blue arcade crowd with Action Replay pillar graphics and rhythm-game cabinets" },
  { imageNumber: 132, sourceImage: 52, slug: "arcade-ddr-action-replay-wide", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_22_35 PM.png", sha256: "391a708c852b4778351e935b61d6d6c4fbb266674fb0f5e315351d5fcd90b06a", assetCategory: "shop-banner", sceneFamily: "arcade-interior", priority: "support", summary: "Dance cabinet scene with Action Replay stickers and cool violet arcade lighting" },
  { imageNumber: 133, sourceImage: 53, slug: "skater-notebook-ps2-codes-desk", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_09_59 PM.png", sha256: "1b61bc9522b72a658b79f80c84aa4bc3bde6f5351963a9fd7c5cdc0f88f0d394", assetCategory: "drop-card", sceneFamily: "skater-rooftop-code", priority: "support", summary: "Desk-side notebook page with Action Replay logo, PS2 code list, and CRT settings screen" },
  { imageNumber: 134, sourceImage: 54, slug: "psychic-import-shop-gamecube-magazine", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 10_31_57 PM.png", sha256: "694837c3f9b877ec0ea393e71adaa28d33c2c1f4931c0551edec3770921d6256", assetCategory: "drop-card", sceneFamily: "psychic-creature-retail", priority: "support", summary: "Creature reads black GameCube magazine behind an import-store glass counter" },
  { imageNumber: 135, sourceImage: 55, slug: "skater-gamecube-sticker-desk", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_13_49 PM.png", sha256: "1f9c4adccf4d3075a8236098e2ef27bf189f2514817fb392102bc288ae078f99", assetCategory: "product-mockup", sceneFamily: "skater-gamecube-hardware", priority: "support", summary: "Skater carefully marks a GameCube top panel with barcode sheets and warning labels nearby" },
  { imageNumber: 136, sourceImage: 56, slug: "skater-gamecube-sticker-table", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_14_08 PM.png", sha256: "93c583d3831f51c10dc1187951e54933fdcfa44bfb0949c5e25f3e58e6d31b9c", assetCategory: "product-mockup", sceneFamily: "skater-gamecube-hardware", priority: "support", summary: "Bright bedroom worktable with skater adding stickers to a GameCube and AR sheets" },
  { imageNumber: 137, sourceImage: 57, slug: "psychic-import-shop-counter-magazine", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 10_21_38 PM.png", sha256: "2cfa90a773f4c7c960485f3e3a80accef39588d5f0b028117095ae1eeb06c024", assetCategory: "drop-card", sceneFamily: "psychic-creature-retail", priority: "support", summary: "Creature studies a magazine at a busy import counter with glossy gaming stacks" },
  { imageNumber: 138, sourceImage: 58, slug: "arcade-dance-cabinet-action-replay", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_23_41 PM.png", sha256: "6c0b17a0e12bc3d9875e4b9226f00314d6626e8036ee2fa615b87d3941722d6d", assetCategory: "shop-banner", sceneFamily: "arcade-interior", priority: "support", summary: "Player on dance cabinet with Action Replay graphics, purple-blue lighting, and stickered machine" },
  { imageNumber: 139, sourceImage: 59, slug: "arcade-action-replay-max-cabinets", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_23_48 PM.png", sha256: "c7ba591cbc6b0317cc3e4edbd7052f8bde16d1891a6589d6a80241e24a9a23f9", assetCategory: "shop-banner", sceneFamily: "arcade-interior", priority: "primary", summary: "Long arcade aisle packed with Action Replay Max cabinet wraps and neon reflections" },
  { imageNumber: 140, sourceImage: 60, slug: "arcade-action-replay-cabinet-side", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_20_12 PM.png", sha256: "68c72f3258c14a0a7429f8a108bec16cb721a31dca870c3f115d0b8e58af5306", assetCategory: "shop-banner", sceneFamily: "arcade-interior", priority: "support", summary: "Side view of player at Action Replay-branded arcade cabinet in deep blue lighting" },
  { imageNumber: 141, sourceImage: 61, slug: "arcade-beatmania-action-replay-column", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_27_02 PM.png", sha256: "06f22c5ba27088c773b9c13e41a69c669c42ee451263f6594559cf6a497e04ed", assetCategory: "shop-banner", sceneFamily: "arcade-interior", priority: "support", summary: "Beatmania-style arcade corner with Action Replay sticker column and timestamp overlay" },
  { imageNumber: 142, sourceImage: 62, slug: "action-replay-ds-cartridge-insert-close", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_22_29 PM.png", sha256: "a7651ee2e5ac90b9b7fda6c9f6d40b41840575062582bb525cd983c6356c0636", assetCategory: "product-mockup", sceneFamily: "ds-hardware-product", priority: "support", summary: "Close hand inserts Action Replay DS cartridge into a silver handheld in arcade lighting" },
  { imageNumber: 143, sourceImage: 63, slug: "action-replay-ds-cartridge-in-hand", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_38_05 PM.png", sha256: "f4c76234b72d2af95f4e6b1052d16fb3aac69d68eafd4b69992a7811c64a4707", assetCategory: "product-mockup", sceneFamily: "ds-hardware-product", priority: "primary", summary: "Macro shot of Action Replay DS cart sliding into a Nintendo DS against arcade screens" },
  { imageNumber: 144, sourceImage: 64, slug: "action-replay-ds-bottom-slot-close", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_38_10 PM.png", sha256: "2e7e4f89cf70c85c707247e8ac9f354ad8f77f8faf3d36cf4be653bddf38feac", assetCategory: "product-mockup", sceneFamily: "ds-hardware-product", priority: "support", summary: "Bottom-slot closeup of Action Replay DS hardware being inserted under red-blue reflections" },
  { imageNumber: 145, sourceImage: 65, slug: "gamecube-shop-browser-wall", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_43_56 PM.png", sha256: "a1bf2b7751504314d4161dca6f1525d9f37946b87bcfaf8251d6f5e3e1b1545b", assetCategory: "shop-banner", sceneFamily: "shop-human-retail", priority: "support", summary: "Customer browsing Japanese GameCube shelves below an Action Replay CRT in a dense shop" },
  { imageNumber: 146, sourceImage: 66, slug: "shop-customer-main-menu-overlay", originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 11_54_28 PM.png", sha256: "4c79502fc728000dc42fbd4b6e6542707254600a3e4a0cf8fb04935f2f9aa929", assetCategory: "shop-banner", sceneFamily: "shop-human-retail", priority: "primary", summary: "Retail customer holding a game case with holographic Action Replay main-menu overlays" },
];

export const lateAdVideoAssets: AdVideoAsset[] = lateFrames.map(lateFrame);
