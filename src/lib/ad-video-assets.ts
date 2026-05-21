import { extraAdVideoAssets } from "./ad-video-extra-assets";
import { lateAdVideoAssets } from "./ad-video-late-assets";

type ManifestCategory =
  | "hero-poster"
  | "shop-banner"
  | "sticker-cutout"
  | "product-mockup"
  | "texture-overlay"
  | "logo-treatment"
  | "character-original"
  | "ui-badge"
  | "drop-card";

type ManifestRightsStatus =
  | "user-supplied mockup"
  | "brand-owned extraction candidate"
  | "generated original project asset"
  | "original replacement required before commercial launch";

export type AdVideoSceneFamily =
  | "memory-card-ui"
  | "action-replay-menu"
  | "hardware-macro"
  | "tokyo-seoul-world"
  | "retail-exterior"
  | "rooftop-establishing"
  | "code-sheet-ui"
  | "garage-racing"
  | "shadow-garage"
  | "visor-courier"
  | "creature-companion-city"
  | "arcade-interior"
  | "rooftop-creature"
  | "psychic-creature-retail"
  | "psychic-creature-game-room"
  | "skater-mall-replay"
  | "skater-rooftop-code"
  | "psychic-creature-billboard"
  | "action-replay-print-ad"
  | "ds-hardware-product"
  | "skater-gamecube-hardware"
  | "shop-human-retail";

export type AdVideoPriority = "primary" | "support" | "alternate";

export type AdVideoAsset = {
  id: string;
  imageNumber: number;
  filename: string;
  src: string;
  originalPath: string;
  sourceReference: string;
  sha256: string;
  width: 1448;
  height: 1086;
  assetCategory: ManifestCategory;
  sceneFamily: AdVideoSceneFamily;
  priority: AdVideoPriority;
  usage: string;
  promptSummary: string;
  alt: string;
  visualRead: string;
  motionPrompt: string;
  negativePrompt: string;
  rightsStatus: ManifestRightsStatus;
  rightsNotes: string;
  duplicateOf?: string;
};

const sourceRoot = "/assets/generated/ad-video/source-frames";
const rightsStatus = "original replacement required before commercial launch" as const;
const sharedNegativePrompt =
  "Avoid new logos, legible third-party brand names, warped hands, unreadable UI labels, modern smartphones, glossy generic sci-fi, clean showroom lighting, and random extra characters.";

const frame = (filename: string) => `${sourceRoot}/${filename}`;

export const adVideoAssets: AdVideoAsset[] = [
  {
    id: "ad-video-01-memory-card-closeup",
    imageNumber: 1,
    filename: "01-ps2-memory-card-final-mix-closeup.png",
    src: frame("01-ps2-memory-card-final-mix-closeup.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 07_05_50 PM.png",
    sourceReference: "Image #1, user-supplied AI reference, May 10 2026",
    sha256: "89ee3d13fbf753a178561e6fc15cbfc09a3444d2f8996cdb421b1b87efb0696d",
    width: 1448,
    height: 1086,
    assetCategory: "drop-card",
    sceneFamily: "memory-card-ui",
    priority: "primary",
    usage: "Cold-open reference for a close CRT push-in on final_mix.mov inside a hidden archive.",
    promptSummary:
      "Dark PS2 memory card browser on a Sony CRT, cluttered Y2K desk, blue UI glow, toys, console, red digital clock, file named final_mix.mov.",
    alt: "Close view of a CRT showing a PS2 memory card menu with final_mix.mov selected.",
    visualRead: "Best first shot: it clearly states the archive/file motif and has strong blue screen contrast.",
    motionPrompt:
      "Slow handheld push toward the selected final_mix.mov file, CRT scanlines rolling, tiny clock flicker, blue UI bloom breathing, desk shadows moving slightly.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains Sony, PlayStation, PS2-style UI, and third-party toy silhouettes. Treat as reference-only unless cleared.",
  },
  {
    id: "ad-video-02-memory-card-desk-wide",
    imageNumber: 2,
    filename: "02-ps2-memory-card-desk-wide.png",
    src: frame("02-ps2-memory-card-desk-wide.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 07_11_28 PM.png",
    sourceReference: "Image #2, user-supplied AI reference, May 10 2026",
    sha256: "d2a05e7aa39a25ddd67a1e1ed57f9a1545111d6d26fda1f923dd1c20de22c40f",
    width: 1448,
    height: 1086,
    assetCategory: "drop-card",
    sceneFamily: "memory-card-ui",
    priority: "support",
    usage: "Wide room reference for the hidden/archive/final_mix.mov file system beat.",
    promptSummary:
      "Black room with floating PS2 memory card UI, folder list, console, controller, CRT, drink can, toy figures, and stacked media.",
    alt: "Wide desk scene with floating blue memory card folders and final_mix.mov text.",
    visualRead: "Useful for a lateral pan that reveals the room props before returning to the file.",
    motionPrompt:
      "Slow left-to-right slider move across the desk, UI hovering in space, controller foreground parallax, final_mix.mov pulsing once.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains console-era UI, PlayStation styling, and visible consumer objects. Use as composition reference.",
  },
  {
    id: "ad-video-03-skater-selects-final-mix",
    imageNumber: 3,
    filename: "03-skater-selects-final-mix-tv.png",
    src: frame("03-skater-selects-final-mix-tv.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 07_11_20 PM.png",
    sourceReference: "Image #3, user-supplied AI reference, May 10 2026",
    sha256: "51292dbd77fb0490ca59a6f06f9c26c93a65a178245945e7ba7258a0c4f52d15",
    width: 1448,
    height: 1086,
    assetCategory: "drop-card",
    sceneFamily: "memory-card-ui",
    priority: "primary",
    usage: "Character interaction shot: viewer/player from behind selecting the final_mix.mov folder.",
    promptSummary:
      "Skater bedroom scene, seated figure in hoodie and cap, CRT memory card UI, blue selected file row, boards, posters, tapes, and low room light.",
    alt: "A seated skater watches a CRT menu with final_mix.mov highlighted.",
    visualRead: "Strong story shot because it connects the archive UI to a human protagonist.",
    motionPrompt:
      "Over-the-shoulder dolly in, hoodie fabric shifting slightly, TV glow flicker on cap brim, selected row blinking like a save file being opened.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains skateboard/media brand cues. Replace or abstract logos for final commercial use.",
  },
  {
    id: "ad-video-04-action-replay-menu-crt",
    imageNumber: 4,
    filename: "04-action-replay-main-menu-crt-lava-lamp.png",
    src: frame("04-action-replay-main-menu-crt-lava-lamp.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 06_45_40 PM.png",
    sourceReference: "Image #4, user-supplied AI reference, May 10 2026",
    sha256: "7e9c52f7089be132742b60d036c7e8246a202e364f4d88565271980bc41cdf0f",
    width: 1448,
    height: 1086,
    assetCategory: "drop-card",
    sceneFamily: "action-replay-menu",
    priority: "support",
    usage: "Boot menu reference for the Action Replay software reveal.",
    promptSummary:
      "CRT main menu with Action Replay logo, blue interface, red lava lamp, speakers, GameCube-like hardware, and poster-covered wall.",
    alt: "CRT television showing an Action Replay main menu beside a red lava lamp.",
    visualRead: "Good menu insert, especially for a cut after the file is selected.",
    motionPrompt:
      "Static tripod shot with CRT bloom, menu cursor flicking from Start Game to Select Codes, lava lamp blobs rising, faint handheld vibration.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains legacy Action Replay/Datel-style software and console hardware references.",
  },
  {
    id: "ad-video-05-browser-file-details",
    imageNumber: 5,
    filename: "05-ps2-browser-final-mix-file-details.png",
    src: frame("05-ps2-browser-final-mix-file-details.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 07_12_10 PM.png",
    sourceReference: "Image #5, user-supplied AI reference, May 10 2026",
    sha256: "1c59a8b48f2c84dc9f1e8a2658153d688d71dff3303285d97fcd49ae14928b5f",
    width: 1448,
    height: 1086,
    assetCategory: "drop-card",
    sceneFamily: "memory-card-ui",
    priority: "primary",
    usage: "Readable file-inspection insert showing final_mix.mov metadata.",
    promptSummary:
      "Close PS2-style file details screen, folders named _Hidden, _Archive, _Final, final_mix.mov icon, 2008 timestamp, blue and red room wash.",
    alt: "CRT browser details screen showing final_mix.mov with date and file size.",
    visualRead: "Excellent graphic insert for implying forbidden media recovered from an old memory card.",
    motionPrompt:
      "Very slow zoom into the file icon, UI jitter and horizontal CRT bands, red side light pulsing, file metadata sharpening for one beat.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains PS2 browser language and third-party poster/prop silhouettes.",
  },
  {
    id: "ad-video-06-action-replay-bedroom-wide",
    imageNumber: 6,
    filename: "06-action-replay-menu-bedroom-wide.png",
    src: frame("06-action-replay-menu-bedroom-wide.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 06_50_41 PM.png",
    sourceReference: "Image #6, user-supplied AI reference, May 10 2026",
    sha256: "06cc92c8675bae6c9895efe9a2209ad296e63b4956a2ffe5bb06f74a2686f46f",
    width: 1448,
    height: 1086,
    assetCategory: "drop-card",
    sceneFamily: "action-replay-menu",
    priority: "support",
    usage: "Bedroom wide establishing shot with Action Replay menu on the CRT.",
    promptSummary:
      "Dark bedroom viewpoint from bed, CRT displaying Action Replay menu, blue screen light, posters, speakers, console, and tangled controller.",
    alt: "Bedroom wide shot with an Action Replay menu glowing on a CRT.",
    visualRead: "Works as a moody pause between archive UI and city/world expansion.",
    motionPrompt:
      "Slow breathing handheld from the bed, blanket foreground drifting, TV menu flicker, blue light blooms on the room edges.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains console hardware, legacy menu wording, and poster references. Duplicate appears as image 10.",
  },
  {
    id: "ad-video-07-memory-card-sony-skull",
    imageNumber: 7,
    filename: "07-ps2-memory-card-sony-skull.png",
    src: frame("07-ps2-memory-card-sony-skull.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 07_08_14 PM.png",
    sourceReference: "Image #7, user-supplied AI reference, May 10 2026",
    sha256: "763d9d27f1ca4c9e273b6bb741ca36fbc27a19423634428c0105bbf4b600247e",
    width: 1448,
    height: 1086,
    assetCategory: "drop-card",
    sceneFamily: "memory-card-ui",
    priority: "support",
    usage: "Clean folder-list insert with final_mix.mov and strong Sony CRT framing.",
    promptSummary:
      "Sony CRT memory card slot screen with hidden, archive, final_mix.mov, blue UI text, skull toy, red side light, PS2 console on shelf.",
    alt: "Sony CRT showing hidden and archive folders above final_mix.mov.",
    visualRead: "Simple and legible. Good when the cut needs less clutter than the wider scenes.",
    motionPrompt:
      "Tight CRT push-in with shallow rack focus from skull toy to glowing final_mix.mov file, scanline drift and red rim light.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains Sony/PlayStation styling and skull toy reference. Duplicate appears as image 9.",
  },
  {
    id: "ad-video-08-action-replay-ultimate-apex",
    imageNumber: 8,
    filename: "08-action-replay-ultimate-apex-crt.png",
    src: frame("08-action-replay-ultimate-apex-crt.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 06_46_26 PM.png",
    sourceReference: "Image #8, user-supplied AI reference, May 10 2026",
    sha256: "b8e4ba40a8417fd504b7a9a7c7ad9fe5c9f4b66bf3ed4ec055358c12f188bfe3",
    width: 1448,
    height: 1086,
    assetCategory: "drop-card",
    sceneFamily: "action-replay-menu",
    priority: "support",
    usage: "Alternate Action Replay menu insert with clean centered CRT composition.",
    promptSummary:
      "Apex CRT showing Action Replay Ultimate main menu, blue UI, speakers, lava lamp, desk clock, and gaming room props.",
    alt: "CRT television displaying Action Replay Ultimate menu beside speakers and a lava lamp.",
    visualRead: "Clean centered product-software frame for a short cutaway.",
    motionPrompt:
      "Locked-off shot, menu highlight flickers, clock digits shimmer, lava lamp moves softly, slight CRT curvature warp.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains Action Replay/Datel wording and console-era props.",
  },
  {
    id: "ad-video-09-memory-card-sony-skull-alt",
    imageNumber: 9,
    filename: "09-ps2-memory-card-sony-skull-alt.png",
    src: frame("09-ps2-memory-card-sony-skull-alt.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 07_06_43 PM.png",
    sourceReference: "Image #9, user-supplied AI reference, May 10 2026",
    sha256: "763d9d27f1ca4c9e273b6bb741ca36fbc27a19423634428c0105bbf4b600247e",
    width: 1448,
    height: 1086,
    assetCategory: "drop-card",
    sceneFamily: "memory-card-ui",
    priority: "alternate",
    usage: "Exact duplicate archive of image 7, kept for source provenance.",
    promptSummary:
      "Duplicate of the Sony CRT memory card slot screen with hidden, archive, and final_mix.mov.",
    alt: "Duplicate Sony CRT memory card menu showing final_mix.mov.",
    visualRead: "Exact duplicate of image 7; use image 7 as the canonical version.",
    motionPrompt:
      "Use the motion direction from ad-video-07-memory-card-sony-skull if this duplicate is selected.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Same rights risk as image 7.",
    duplicateOf: "ad-video-07-memory-card-sony-skull",
  },
  {
    id: "ad-video-10-action-replay-bedroom-wide-alt",
    imageNumber: 10,
    filename: "10-action-replay-menu-bedroom-wide-alt.png",
    src: frame("10-action-replay-menu-bedroom-wide-alt.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 06_47_36 PM.png",
    sourceReference: "Image #10, user-supplied AI reference, May 10 2026",
    sha256: "06cc92c8675bae6c9895efe9a2209ad296e63b4956a2ffe5bb06f74a2686f46f",
    width: 1448,
    height: 1086,
    assetCategory: "drop-card",
    sceneFamily: "action-replay-menu",
    priority: "alternate",
    usage: "Exact duplicate archive of image 6, kept for source provenance.",
    promptSummary: "Duplicate of the bedroom-wide Action Replay menu on CRT.",
    alt: "Duplicate bedroom wide shot with Action Replay menu on a CRT.",
    visualRead: "Exact duplicate of image 6; use image 6 as the canonical version.",
    motionPrompt:
      "Use the motion direction from ad-video-06-action-replay-bedroom-wide if this duplicate is selected.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Same rights risk as image 6.",
    duplicateOf: "ad-video-06-action-replay-bedroom-wide",
  },
  {
    id: "ad-video-11-action-replay-menu-window",
    imageNumber: 11,
    filename: "11-action-replay-main-menu-window.png",
    src: frame("11-action-replay-main-menu-window.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 06_47_42 PM.png",
    sourceReference: "Image #11, user-supplied AI reference, May 10 2026",
    sha256: "8aade21588f191f2ae8bedc14cebac3bc1e66cc1b306553e817aa89c518e48a9",
    width: 1448,
    height: 1086,
    assetCategory: "drop-card",
    sceneFamily: "action-replay-menu",
    priority: "primary",
    usage: "High-impact Action Replay menu shot with strong blue glow and window depth.",
    promptSummary:
      "CRT with bright Action Replay tool menu, blue fog UI, speakers, lava lamp, city window, clock, posters, and controller foreground.",
    alt: "Action Replay main menu glowing blue on a CRT in a dark bedroom.",
    visualRead: "The strongest boot-menu frame because it adds depth through the window and rich prop layering.",
    motionPrompt:
      "Slow dolly from controller foreground toward CRT, window city lights twinkle, blue UI smoke animates, menu options flicker in sequence.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains legacy Action Replay/Datel-style UI, console props, and toy/poster references.",
  },
  {
    id: "ad-video-12-hidden-archive-user-side",
    imageNumber: 12,
    filename: "12-hidden-archive-final-mix-user-side.png",
    src: frame("12-hidden-archive-final-mix-user-side.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 07_12_05 PM.png",
    sourceReference: "Image #12, user-supplied AI reference, May 10 2026",
    sha256: "69a6f8938dfb1928ac211f942e820c4761f2f89a75ccc5113855464376dc7630",
    width: 1448,
    height: 1086,
    assetCategory: "drop-card",
    sceneFamily: "memory-card-ui",
    priority: "primary",
    usage: "Narrative midpoint: character watches final_mix.mov inside hidden/archive.",
    promptSummary:
      "Large CRT showing hidden/archive folder and final_mix.mov QuickTime file, seated figure in hoodie, PS2/GameCube hardware, purple-red room light.",
    alt: "A hooded viewer watches a CRT file browser highlighting final_mix.mov.",
    visualRead: "Strong story beat and one of the best Higgsfield base frames for character plus UI.",
    motionPrompt:
      "Over-the-shoulder camera creeps toward the CRT, character head turns slightly, selected final_mix.mov row glows brighter, room LEDs shimmer.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains PlayStation/GameCube hardware and poster references. Replace branded props before final commercial use.",
  },
  {
    id: "ad-video-13-ps2-128mb-browser",
    imageNumber: 13,
    filename: "13-ps2-128mb-browser-final-mix.png",
    src: frame("13-ps2-128mb-browser-final-mix.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 07_05_43 PM.png",
    sourceReference: "Image #13, user-supplied AI reference, May 10 2026",
    sha256: "0062706342902492d73f2f8ef93430475518d484b2069bd8a5ad2f358a937eb3",
    width: 1448,
    height: 1086,
    assetCategory: "drop-card",
    sceneFamily: "memory-card-ui",
    priority: "support",
    usage: "Clean browser UI insert with file card floating on a CRT.",
    promptSummary:
      "CRT browser screen reading PS2 128MB, final_mix.mov selected, toy figures, blue reflective desk, discs, and stacked game cases.",
    alt: "PS2 browser screen on a CRT with final_mix.mov selected.",
    visualRead: "Polished insert for quick cuts because the selected file card is highly legible.",
    motionPrompt:
      "Macro push toward selected file card, reflective desk shimmer, tiny toy figures remain still, blue CRT bands scroll downward.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains Sony/PS2 browser styling and visible game/media case references.",
  },
  {
    id: "ad-video-14-archive-folder-ps2-stack",
    imageNumber: 14,
    filename: "14-archive-folder-ps2-stack-blue-red.png",
    src: frame("14-archive-folder-ps2-stack-blue-red.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 07_04_52 PM.png",
    sourceReference: "Image #14, user-supplied AI reference, May 10 2026",
    sha256: "0f7e718f58bb33bb05394cacc8c96e2ed1d897c3b0f0707f5eab8d22a8815ca8",
    width: 1448,
    height: 1086,
    assetCategory: "drop-card",
    sceneFamily: "memory-card-ui",
    priority: "primary",
    usage: "Hero desk shot with PS2 stack, controller, archive UI, and blue-red lighting.",
    promptSummary:
      "Sony CRT browser showing hidden archive and final_mix.mov, stacked PS2 consoles, controller, game case, skateboard poster, blue-red rim light.",
    alt: "Archive folder UI on a CRT beside a stack of PS2 consoles and a controller.",
    visualRead: "Best hardware-plus-UI frame in the set. Strong product-like desk staging.",
    motionPrompt:
      "Low dolly across controller and stacked consoles toward the CRT, blue edge light sweeps over the hardware, file icon pulses once.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains Sony/PS2 hardware, PlayStation marks, and skateboard/media references.",
  },
  {
    id: "ad-video-15-final-mix-dvd-memory-card",
    imageNumber: 15,
    filename: "15-memory-card-folder-dvd-final-mix.png",
    src: frame("15-memory-card-folder-dvd-final-mix.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 07_03_43 PM.png",
    sourceReference: "Image #15, user-supplied AI reference, May 10 2026",
    sha256: "890f27d3403b072687884b10b45e6396f34768092e72e9a9b85314a49f253df2",
    width: 1448,
    height: 1086,
    assetCategory: "product-mockup",
    sceneFamily: "hardware-macro",
    priority: "primary",
    usage: "Object-story shot: final_mix DVD on the desk under the CRT file browser.",
    promptSummary:
      "Sony WEGA CRT memory card slot with final_mix.mov folder, PS2 console, skateboard wheel, scattered zines, and Final Mix DVD-R case.",
    alt: "A Final Mix DVD-R case sits below a CRT memory card menu.",
    visualRead: "Great bridge from digital file to physical artifact.",
    motionPrompt:
      "Camera tilts from the Final Mix disc case up to the CRT folder icon, desk reflections ripple, UI border hums with blue light.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains Sony/PlayStation marks and possible third-party poster/game references.",
  },
  {
    id: "ad-video-16-translucent-memory-card-overlay",
    imageNumber: 16,
    filename: "16-translucent-memory-card-overlay-room.png",
    src: frame("16-translucent-memory-card-overlay-room.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 07_10_20 PM.png",
    sourceReference: "Image #16, user-supplied AI reference, May 10 2026",
    sha256: "6097e95de9a56e023ee07f2056a4c9a176383c48c051808049c818316df6f341",
    width: 1448,
    height: 1086,
    assetCategory: "drop-card",
    sceneFamily: "memory-card-ui",
    priority: "primary",
    usage: "Stylized UI overlay shot for transitions between room and file system.",
    promptSummary:
      "Transparent memory card slot menu floating over a room with hooded figure, neon signs, small CRT, console, desk lamp, and GameCube controller.",
    alt: "A translucent memory card menu floats over a dark gaming room.",
    visualRead: "Most ad-like UI treatment. Useful as an overlay transition or glitch dissolve.",
    motionPrompt:
      "Transparent UI drifts forward as if projected on glass, background parallax slides slowly, selected final_mix.mov row blooms and glitches.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains console hardware and third-party skate/sign references. Treat as visual direction.",
  },
  {
    id: "ad-video-17-action-replay-bed-wide",
    imageNumber: 17,
    filename: "17-action-replay-main-menu-bed-wide.png",
    src: frame("17-action-replay-main-menu-bed-wide.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 06_55_55 PM.png",
    sourceReference: "Image #17, user-supplied AI reference, May 10 2026",
    sha256: "bbe052ca76bece7076c102db34abfe495628fb19da822687816373edd7e4f303",
    width: 1448,
    height: 1086,
    assetCategory: "drop-card",
    sceneFamily: "action-replay-menu",
    priority: "support",
    usage: "Wide bed-level Action Replay software menu shot.",
    promptSummary:
      "Dark bedroom view across bed toward CRT Action Replay main menu, lava lamp, speakers, posters, console cube, clock, and controller.",
    alt: "CRT Action Replay main menu seen from a bed in a dark room.",
    visualRead: "Good atmospheric room shot with a strong screen glow but less narrative specificity.",
    motionPrompt:
      "Low bed-level dolly forward, blanket highlights shimmer, CRT menu jitters, lava lamp and clock glow in counterpoint.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains legacy Action Replay styling, console props, and third-party poster references.",
  },
  {
    id: "ad-video-18-hidden-archive-size-58mb",
    imageNumber: 18,
    filename: "18-hidden-archive-final-mix-size-58mb.png",
    src: frame("18-hidden-archive-final-mix-size-58mb.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 07_04_58 PM.png",
    sourceReference: "Image #18, user-supplied AI reference, May 10 2026",
    sha256: "28bf933bff8839dbaa7fdc26d06fd38efc215309c7b01efb44ef2f8e2a12f772",
    width: 1448,
    height: 1086,
    assetCategory: "drop-card",
    sceneFamily: "memory-card-ui",
    priority: "support",
    usage: "Minimal file list insert inside hidden/archive with size metadata.",
    promptSummary:
      "Large Sony CRT with PS2 hidden/archive path, final_mix.mov row, size 58 MB, posters, figures, skull prop, and controller foreground.",
    alt: "PS2 hidden archive browser showing final_mix.mov size 58 MB.",
    visualRead: "Simple read and useful for a fast confirmation cut.",
    motionPrompt:
      "Slow zoom into the final_mix.mov row, foreground controller blur breathes, UI linework vibrates and horizontal CRT scanlines pass.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains Sony/PS2 UI and third-party poster/prop references.",
  },
  {
    id: "ad-video-19-blue-gamecube-cartridge",
    imageNumber: 19,
    filename: "19-blue-gamecube-action-replay-cartridge.png",
    src: frame("19-blue-gamecube-action-replay-cartridge.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 06_55_49 PM.png",
    sourceReference: "Image #19, user-supplied AI reference, May 10 2026",
    sha256: "2eaf7a801b616273f077d9b31a5d17b880802d5584c3233619200b47be0ed5fe",
    width: 1448,
    height: 1086,
    assetCategory: "product-mockup",
    sceneFamily: "hardware-macro",
    priority: "primary",
    usage: "Macro hardware reference for translucent blue cheat cartridge object language.",
    promptSummary:
      "Close-up of translucent blue Action Replay cartridge for GameCube with Japanese warning label, blue HUD borders, scratches, and cold lighting.",
    alt: "Macro shot of a translucent blue Action Replay cartridge.",
    visualRead: "The strongest physical-object macro. It anchors the ad in tactile hardware.",
    motionPrompt:
      "Macro orbit around the translucent cartridge edge, dust and scratches catching blue light, HUD date overlay flickering like camcorder footage.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains Datel, Action Replay, GameCube, and Japanese product-label references. Final should use original Action Replay universe packaging.",
  },
  {
    id: "ad-video-20-tokyo-seoul-quick-save-car",
    imageNumber: 20,
    filename: "20-tokyo-seoul-car-scene-quick-save.png",
    src: frame("20-tokyo-seoul-car-scene-quick-save.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 07_13_33 PM.png",
    sourceReference: "Image #20, user-supplied AI reference, May 10 2026",
    sha256: "ea84480b17cd59c5e6775848540b2bef4c9edf9c9d439d1bb572c03e7a15374b",
    width: 1448,
    height: 1086,
    assetCategory: "hero-poster",
    sceneFamily: "tokyo-seoul-world",
    priority: "primary",
    usage: "World expansion shot: rainy Tokyo-Seoul street, car, character, and HUD overlays.",
    promptSummary:
      "Rainy neon street under elevated rail, modified blue car, jacketed character, quick saving HUD, map and tachometer overlays, Tokyo-Seoul timestamp.",
    alt: "Rainy neon Tokyo-Seoul street with a blue tuned car and game HUD overlays.",
    visualRead: "Strong transition from bedroom file world into playable city fantasy.",
    motionPrompt:
      "Cinematic rear-quarter tracking move around the parked car, rain falling, neon signs reflecting in puddles, HUD elements softly animating.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains car/game HUD references and possible real-world brand cues. Use as mood and composition reference.",
  },
  {
    id: "ad-video-21-action-replay-ds-cartridge-macro",
    imageNumber: 21,
    filename: "21-action-replay-ds-cartridge-macro.png",
    src: frame("21-action-replay-ds-cartridge-macro.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 06_55_05 PM.png",
    sourceReference: "Image #21, user-supplied AI reference, May 10 2026",
    sha256: "8971006f1e287c28b62ac1b93070fa6f976e699cc237bc64c1778a14d5230e72",
    width: 1448,
    height: 1086,
    assetCategory: "product-mockup",
    sceneFamily: "hardware-macro",
    priority: "primary",
    usage: "Macro handheld-era cartridge reference with UI overlay language.",
    promptSummary:
      "Extreme close-up of blue translucent Action Replay DS cartridge, Japanese label, thin HUD marks, barcode, and cold studio light.",
    alt: "Close macro view of a blue translucent Action Replay DS cartridge.",
    visualRead: "Excellent tactile macro with the cleanest translucent-plastic surface detail.",
    motionPrompt:
      "Ultra-slow macro slide along cartridge shell, blue light refracts through plastic, dust particles drift, overlay graphics flicker subtly.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains Datel/Action Replay DS product references and Japanese label text. Replace with original brand-safe cartridge design.",
  },
  {
    id: "ad-video-22-project-x-rooftop-city",
    imageNumber: 22,
    filename: "22-project-x-rooftop-city.png",
    src: frame("22-project-x-rooftop-city.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 07_17_16 PM.png",
    sourceReference: "Image #22, user-supplied AI reference, May 10 2026",
    sha256: "d4cfeac52fe2abce3ea552b271e4ad6c5a7e6d4eec20a23a958d69633bdada4e",
    width: 1448,
    height: 1086,
    assetCategory: "hero-poster",
    sceneFamily: "rooftop-establishing",
    priority: "support",
    usage: "Rooftop establishing shot for the ad's city-scale chapter.",
    promptSummary:
      "Wet rooftop overlooking dense future city skyline, pale cyan sky, HUD overlays, communications tower, cones, and reflective concrete.",
    alt: "Rainy rooftop overlooking a dense blue-gray city skyline.",
    visualRead: "Clean atmospheric establishing shot with room for typography or a scene transition.",
    motionPrompt:
      "Slow panoramic rooftop drift, low clouds moving, red tower lights blinking, wet concrete reflections sliding as the camera pans.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains OGIO/Nokia-like signage in the world. Replace readable marks for commercial use.",
  },
  {
    id: "ad-video-23-action-replay-ds-product-macro",
    imageNumber: 23,
    filename: "23-action-replay-ds-product-macro.png",
    src: frame("23-action-replay-ds-product-macro.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 06_51_14 PM.png",
    sourceReference: "Image #23, user-supplied AI reference, May 10 2026",
    sha256: "926faeb5c14257af3d8ae42c9d84714555ceb57a5d53ba241747c8f519e2db5f",
    width: 1448,
    height: 1086,
    assetCategory: "product-mockup",
    sceneFamily: "hardware-macro",
    priority: "support",
    usage: "Alternate macro cartridge shot with racing/model-car world hints.",
    promptSummary:
      "Blue Action Replay DS cartridge upright in front of blurred racing game art, model car, Gran Turismo-like logo, scratches, and product label.",
    alt: "Blue Action Replay DS cartridge standing in front of racing-game imagery.",
    visualRead: "Useful if the ad leans into racing/game-culture references after the city car reveal.",
    motionPrompt:
      "Rack focus from blurred model car to scratched blue cartridge label, small highlight sweeps over the plastic, dust and film grain visible.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains Action Replay DS and racing-game/automotive brand references. Use as reference only.",
  },
  {
    id: "ad-video-24-tokyo-seoul-ramp-skyline-car",
    imageNumber: 24,
    filename: "24-tokyo-seoul-ramp-skyline-car.png",
    src: frame("24-tokyo-seoul-ramp-skyline-car.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 07_14_07 PM.png",
    sourceReference: "Image #24, user-supplied AI reference, May 10 2026",
    sha256: "272e4486959de834e1c46daf429c88807830baaaa81b1b6bb500bb508b7e1daf",
    width: 1448,
    height: 1086,
    assetCategory: "hero-poster",
    sceneFamily: "tokyo-seoul-world",
    priority: "primary",
    usage: "Hero city shot: blue car under elevated train with route signage.",
    promptSummary:
      "Rainy neon Tokyo-Seoul ramp, blue tuner car, elevated train, city billboards, route signs, timestamp overlays, and wet asphalt reflections.",
    alt: "Blue tuner car on a rainy Tokyo-Seoul city ramp under an elevated train.",
    visualRead: "Best city-car hero frame: readable composition, strong reflection, and clear route mythology.",
    motionPrompt:
      "Wide cinematic push past the blue car as a train glides overhead, puddle reflections ripple, route signs flicker, distant billboards animate.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains car/game and city-sign brand cues. Replace real or confusing brand marks in final production.",
  },
  {
    id: "ad-video-25-convenience-store-posters",
    imageNumber: 25,
    filename: "25-convenience-store-action-replay-posters.png",
    src: frame("25-convenience-store-action-replay-posters.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 07_14_58 PM.png",
    sourceReference: "Image #25, user-supplied AI reference, May 10 2026",
    sha256: "0cc085e8edfe80ad94bea7fc614af0c76cb2515ee5583f3df75291e8194984b5",
    width: 1448,
    height: 1086,
    assetCategory: "shop-banner",
    sceneFamily: "retail-exterior",
    priority: "primary",
    usage: "Retail-world shot: Action Replay posters invading a Japanese convenience store.",
    promptSummary:
      "Rainy nighttime convenience store, bright blue-white signage, vending machines, Action Replay posters in windows, PSP-like UI overlay, street reflections.",
    alt: "Convenience store at night covered in Action Replay posters and vending machine light.",
    visualRead: "Strong commerce/storefront bridge for the brand world.",
    motionPrompt:
      "Slow sidewalk tracking shot along the store windows, fluorescent lights buzzing, posters fluttering, rainwater reflecting vending machines.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains Coca-Cola, Kirin, Sony/PSP-style UI, and convenience-store brand references. Replace all for final ad.",
  },
  {
    id: "ad-video-26-tokyo-seoul-rain-crosswalk",
    imageNumber: 26,
    filename: "26-tokyo-seoul-rain-crosswalk-vhs.png",
    src: frame("26-tokyo-seoul-rain-crosswalk-vhs.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 07_15_05 PM.png",
    sourceReference: "Image #26, user-supplied AI reference, May 10 2026",
    sha256: "96250918cba3ad0ddd5c53892a3b27de77293c34813207b1d91dbaba34ab0527",
    width: 1448,
    height: 1086,
    assetCategory: "hero-poster",
    sceneFamily: "tokyo-seoul-world",
    priority: "support",
    usage: "Human-scale city walk shot with VHS timestamp overlays.",
    promptSummary:
      "Rainy neon crosswalk, elevated train, jacketed figure from behind, Tokyo-Seoul vertical sign, VHS timecode, city billboards, wet street reflections.",
    alt: "A person stands in a rainy neon Tokyo-Seoul crosswalk under an elevated train.",
    visualRead: "Good human transition shot when the ad needs less car emphasis.",
    motionPrompt:
      "VHS handheld street drift behind the jacketed figure, rain streaks across lens, train moves overhead, puddles shimmer with red-blue light.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains billboard and brand-like signage. Use as mood reference and replace readable marks.",
  },
  {
    id: "ad-video-27-action-replay-konbini-exterior",
    imageNumber: 27,
    filename: "27-action-replay-konbini-exterior.png",
    src: frame("27-action-replay-konbini-exterior.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 07_15_50 PM.png",
    sourceReference: "Image #27, user-supplied AI reference, May 10 2026",
    sha256: "eb2dd1936eb9ae7515f2106eac05ecbf961cb1bbc45e39d0bd8fd6e9d46f6e01",
    width: 1448,
    height: 1086,
    assetCategory: "shop-banner",
    sceneFamily: "retail-exterior",
    priority: "primary",
    usage: "Best full-store exterior for a fictional Action Replay retail takeover.",
    promptSummary:
      "Rainy street across from convenience store covered with Action Replay AR posters, vending machines, seated figure, minimap HUD, and blue fluorescent light.",
    alt: "Action Replay posters cover a convenience store on a rainy night street.",
    visualRead: "Best retail establishing frame: the store is readable, centered, and narratively useful.",
    motionPrompt:
      "Locked wide shot with rain falling, vending machines humming, seated figure shifting slightly, AR posters glowing behind wet window glass.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains convenience-store styling, soda vending, and AR marks. Final should use original Action Replay storefront branding only.",
  },
  {
    id: "ad-video-28-seoul-tokyo-namco-skyline-car",
    imageNumber: 28,
    filename: "28-seoul-tokyo-namco-skyline-car.png",
    src: frame("28-seoul-tokyo-namco-skyline-car.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 07_16_11 PM.png",
    sourceReference: "Image #28, user-supplied AI reference, May 10 2026",
    sha256: "323c4182470b7138064ba500d327aeee5868f872f9bcdae048e0de7fc8e4131c",
    width: 1448,
    height: 1086,
    assetCategory: "hero-poster",
    sceneFamily: "tokyo-seoul-world",
    priority: "primary",
    usage: "Rear car hero with city, rail, and racing-game HUD overlays.",
    promptSummary:
      "Rainy Seoul-Tokyo street, blue Nissan-like tuner car rear, elevated rail, namco-like signage, HUD time and minimap overlays, neon reflections.",
    alt: "Blue tuner car parked on a rainy neon Seoul-Tokyo street under rail tracks.",
    visualRead: "Strong racing-world shot, but the visible car/brand references are the biggest clearance issue.",
    motionPrompt:
      "Low rear tracking move around the car, taillights pulsing, train gliding left to right, wet pavement reflecting signs and HUD graphics.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains Namco/Nissan-like and other readable brand marks. Must be redesigned for brand-safe commercial use.",
  },
  {
    id: "ad-video-29-c-combo-store-window",
    imageNumber: 29,
    filename: "29-c-combo-store-action-replay-window.png",
    src: frame("29-c-combo-store-action-replay-window.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 07_16_35 PM.png",
    sourceReference: "Image #29, user-supplied AI reference, May 10 2026",
    sha256: "bef39e42dc8a7968eaabdf6e8c58db185f921bc777b72aeb34a0e4b9f528fcdc",
    width: 1448,
    height: 1086,
    assetCategory: "shop-banner",
    sceneFamily: "retail-exterior",
    priority: "primary",
    usage: "Most polished storefront hero for Action Replay retail mythology.",
    promptSummary:
      "Rainy night storefront labeled C-Combo convenience and amusement, AR posters filling windows, vending machines, lone figure in varsity jacket, blue-white fluorescent glow.",
    alt: "A lone figure stands outside a convenience store filled with Action Replay posters.",
    visualRead: "Best brand storefront image in the set, clean and poster-like.",
    motionPrompt:
      "Slow centered push toward the lone figure and store windows, rain glistens on pavement, fluorescent panels flicker, AR posters glow behind glass.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Fictionalized but still contains soda/vending conventions and many AR marks. Keep as reference until final brand-safe rebuild.",
  },
  {
    id: "ad-video-30-rainy-rooftop-helipad",
    imageNumber: 30,
    filename: "30-rainy-rooftop-helipad-city.png",
    src: frame("30-rainy-rooftop-helipad-city.png"),
    originalPath: "/Users/zrelich/Desktop/ChatGPT Image May 10, 2026, 07_17_25 PM.png",
    sourceReference: "Image #30, user-supplied AI reference, May 10 2026",
    sha256: "0c4144dbe0307ea7b984463230cfb2f6a0ae6e75da470e58124f11c599970276",
    width: 1448,
    height: 1086,
    assetCategory: "hero-poster",
    sceneFamily: "rooftop-establishing",
    priority: "primary",
    usage: "Clean rooftop end-card or establishing shot with room for overlay copy.",
    promptSummary:
      "Rainy rooftop helipad, moody storm sky, distant city skyline, red marker lights, wet blue reflections, and minimal branding.",
    alt: "Rainy rooftop helipad with a stormy blue skyline in the distance.",
    visualRead: "Best clean end-card or opening establishing frame because it has visual breathing room.",
    motionPrompt:
      "Slow crane rise from wet helipad markings to skyline, clouds rolling, red beacons blinking, rain ripples expanding across puddles.",
    negativePrompt: sharedNegativePrompt,
    rightsStatus,
    rightsNotes: "Contains a fictional building mark; still should be checked and cleaned before commercial use.",
  },
  ...extraAdVideoAssets,
  ...lateAdVideoAssets,
];

export const adVideoCollections = {
  coldOpenMemoryCard: [
    "ad-video-01-memory-card-closeup",
    "ad-video-03-skater-selects-final-mix",
    "ad-video-05-browser-file-details",
    "ad-video-12-hidden-archive-user-side",
    "ad-video-16-translucent-memory-card-overlay",
  ],
  bootMenu: [
    "ad-video-04-action-replay-menu-crt",
    "ad-video-06-action-replay-bedroom-wide",
    "ad-video-11-action-replay-menu-window",
    "ad-video-17-action-replay-bed-wide",
  ],
  hardwareMacros: [
    "ad-video-15-final-mix-dvd-memory-card",
    "ad-video-19-blue-gamecube-cartridge",
    "ad-video-21-action-replay-ds-cartridge-macro",
    "ad-video-23-action-replay-ds-product-macro",
  ],
  tokyoSeoulWorld: [
    "ad-video-20-tokyo-seoul-quick-save-car",
    "ad-video-24-tokyo-seoul-ramp-skyline-car",
    "ad-video-26-tokyo-seoul-rain-crosswalk",
    "ad-video-28-seoul-tokyo-namco-skyline-car",
  ],
  retailTakeover: [
    "ad-video-25-convenience-store-posters",
    "ad-video-27-action-replay-konbini-exterior",
    "ad-video-29-c-combo-store-window",
  ],
  cleanEstablishing: [
    "ad-video-22-project-x-rooftop-city",
    "ad-video-30-rainy-rooftop-helipad",
  ],
  shadowCodeAndGarage: [
    "ad-video-31-shadow-code-list-closeup",
    "ad-video-32-shadow-ps2-codes-crt",
    "ad-video-33-tokyo-garage-woman-supra-menu",
    "ad-video-35-underground-garage-z-menu",
    "ad-video-36-shadow-ar-max-code-sheet",
    "ad-video-37-garage-two-silver-cars-hud",
    "ad-video-39-shadow-on-car-hood-press-start",
    "ad-video-41-shadow-loading-car-hood-poster",
    "ad-video-42-shadow-smoking-car-hood",
    "ad-video-44-shadow-gp-car-hood-poster",
    "ad-video-46-shadow-pause-car-hood",
    "ad-video-57-shadow-cheat-code-sheet-closeup",
  ],
  visorCourier: [
    "ad-video-38-wes-action-replay-visor-closeup",
    "ad-video-40-wes-code-engine-visor-closeup",
    "ad-video-48-wes-sys-menu-visor-closeup",
    "ad-video-49-wes-device-info-visor-closeup",
    "ad-video-54-wes-action-replay-visor-logo-closeup",
    "ad-video-59-wes-menu-visor-closeup",
    "ad-video-71-wes-gamecube-visor-closeup",
    "ad-video-74-wes-visor-device-menu-closeup",
    "ad-video-80-wes-action-replay-visor-coded-closeup",
    "ad-video-81-wes-gamecube-memory-card-closeup",
  ],
  companionCity: [
    "ad-video-50-wes-chainlink-pokeball-alley",
    "ad-video-52-wes-ramen-ds-rain-window",
    "ad-video-53-wes-umbreon-neon-alley",
    "ad-video-58-wes-rooftop-fence-colosseum-promo",
    "ad-video-61-wes-restaurant-gameboy-sp",
    "ad-video-62-wes-umbreon-action-replay-alley",
    "ad-video-63-wes-umbreon-unlock-alley",
    "ad-video-64-wes-umbreon-ui-border-alley",
    "ad-video-67-wes-restaurant-booth-ds-rain",
    "ad-video-69-wes-fence-low-angle-colosseum",
    "ad-video-78-wes-gamecube-billboard-fence",
  ],
  arcadeInteriors: [
    "ad-video-45-shadow-enters-fisheye-arcade",
    "ad-video-51-shadow-arcade-hallway-over-shoulder",
    "ad-video-65-shadow-fisheye-arcade-ddr",
    "ad-video-66-shadow-fisheye-arcade-walk",
    "ad-video-68-shadow-record-arcade-walk",
    "ad-video-72-shadow-fisheye-sega-rally-arcade",
    "ad-video-73-shadow-fisheye-arcade-cabinets",
    "ad-video-120-arcade-action-replay-antihero-hallway",
    "ad-video-131-arcade-action-replay-crowd-wide",
    "ad-video-132-arcade-ddr-action-replay-wide",
    "ad-video-138-arcade-dance-cabinet-action-replay",
    "ad-video-139-arcade-action-replay-max-cabinets",
    "ad-video-140-arcade-action-replay-cabinet-side",
    "ad-video-141-arcade-beatmania-action-replay-column",
  ],
  rooftopCreature: [
    "ad-video-60-psychic-creature-rooftop-sp-day",
    "ad-video-70-psychic-creature-rooftop-sp-sunset",
    "ad-video-75-psychic-creature-rooftop-sp-night",
    "ad-video-77-psychic-creature-rooftop-sp-night-wide",
  ],
  psychicCreatureRetail: [
    "ad-video-82-psychic-creature-import-shop-magazine",
    "ad-video-83-psychic-creature-game-store-zelda-magazine",
    "ad-video-86-psychic-creature-import-games-counter",
    "ad-video-87-psychic-creature-nintendo-power-store-counter",
    "ad-video-90-psychic-creature-magazine-rack-action-replay",
    "ad-video-93-psychic-creature-import-games-nintendo-power-close",
    "ad-video-100-psychic-fzero-action-replay-magazine",
    "ad-video-103-psychic-gamecube-magazine-shelf",
    "ad-video-121-psychic-import-store-smash-magazines",
    "ad-video-134-psychic-import-shop-gamecube-magazine",
    "ad-video-137-psychic-import-shop-counter-magazine",
  ],
  psychicCreatureGameRooms: [
    "ad-video-84-psychic-creature-bedroom-gamecube-play",
    "ad-video-85-psychic-creature-night-bedroom-match",
    "ad-video-91-psychic-creature-dark-gamecube-bedroom",
    "ad-video-92-psychic-creature-bedroom-smash-crt",
    "ad-video-99-psychic-gamecube-campaign-bedroom",
  ],
  skaterMallReplay: [
    "ad-video-88-skater-fourside-mall-vhs-preview",
    "ad-video-89-skater-fourside-mall-replay-trick",
    "ad-video-94-skater-mall-fisheye-camera-mode",
    "ad-video-102-skater-mall-trick-meter-replay",
    "ad-video-113-skater-mall-normal-replay-fisheye",
  ],
  skaterRooftopCode: [
    "ad-video-95-skater-rooftop-drawing-ness-sign",
    "ad-video-96-skater-rooftop-action-replay-suit-your-game",
    "ad-video-98-skater-rooftop-earthbound-drawing",
    "ad-video-101-skater-rooftop-cheats-notebook",
    "ad-video-104-skater-rooftop-sketch-blue-ds",
    "ad-video-105-skater-rooftop-sound-mode-ds",
    "ad-video-107-skater-code-notebook-closeup",
    "ad-video-108-skater-rooftop-sunset-notebook",
    "ad-video-109-skater-action-replay-codes-notebook",
    "ad-video-110-visor-courier-code-notebook-gamecube",
    "ad-video-112-skater-action-replay-max-codebook",
    "ad-video-114-skater-notebook-logo-closeup",
    "ad-video-115-skater-notebook-psychic-creature-code-sheet",
    "ad-video-122-notebook-psychic-creature-action-replay-max-overhead",
    "ad-video-123-skater-action-replay-v2-code-notebook",
    "ad-video-124-skater-ps2-code-notebook-red-blue",
    "ad-video-127-skater-rooftop-notebook-ds-city",
    "ad-video-133-skater-notebook-ps2-codes-desk",
  ],
  psychicCreatureBillboards: [
    "ad-video-116-psychic-billboard-rain-ultimate-cheat-system",
    "ad-video-117-psychic-billboard-unleash-power-rain",
  ],
  actionReplayPrintAds: [
    "ad-video-111-skater-ar-max-white-promo",
    "ad-video-118-skater-ar-action-replay-skate-poster",
    "ad-video-119-ar-skate-poster-unleash-power",
    "ad-video-128-skater-ar-max-white-menu-poster",
    "ad-video-129-skull-skater-ar-max-white-promo",
  ],
  skaterGamecubeHardware: [
    "ad-video-97-skater-gamecube-sticker-workbench",
    "ad-video-106-skater-bedroom-gamecube-sticker",
    "ad-video-125-skater-gamecube-box-workbench",
    "ad-video-126-skater-bedroom-gamecube-sticker-sheet",
    "ad-video-135-skater-gamecube-sticker-desk",
    "ad-video-136-skater-gamecube-sticker-table",
  ],
  dsHardwareProduct: [
    "ad-video-130-action-replay-ds-product-insert",
    "ad-video-142-action-replay-ds-cartridge-insert-close",
    "ad-video-143-action-replay-ds-cartridge-in-hand",
    "ad-video-144-action-replay-ds-bottom-slot-close",
  ],
  shopHumanRetail: [
    "ad-video-145-gamecube-shop-browser-wall",
    "ad-video-146-shop-customer-main-menu-overlay",
  ],
  duplicateSources: [
    "ad-video-09-memory-card-sony-skull-alt",
    "ad-video-10-action-replay-bedroom-wide-alt",
    "ad-video-34-shadow-ps2-codes-crt-alt",
    "ad-video-47-shadow-gp-car-hood-poster-alt",
    "ad-video-79-wes-action-replay-visor-closeup-alt",
  ],
};

export const adVideoShotOrder = [
  "ad-video-30-rainy-rooftop-helipad",
  "ad-video-01-memory-card-closeup",
  "ad-video-03-skater-selects-final-mix",
  "ad-video-05-browser-file-details",
  "ad-video-19-blue-gamecube-cartridge",
  "ad-video-11-action-replay-menu-window",
  "ad-video-16-translucent-memory-card-overlay",
  "ad-video-20-tokyo-seoul-quick-save-car",
  "ad-video-24-tokyo-seoul-ramp-skyline-car",
  "ad-video-29-c-combo-store-window",
  "ad-video-27-action-replay-konbini-exterior",
  "ad-video-30-rainy-rooftop-helipad",
];

export const expandedAdVideoShotOrder = [
  ...adVideoShotOrder,
  "ad-video-31-shadow-code-list-closeup",
  "ad-video-36-shadow-ar-max-code-sheet",
  "ad-video-33-tokyo-garage-woman-supra-menu",
  "ad-video-39-shadow-on-car-hood-press-start",
  "ad-video-38-wes-action-replay-visor-closeup",
  "ad-video-40-wes-code-engine-visor-closeup",
  "ad-video-53-wes-umbreon-neon-alley",
  "ad-video-63-wes-umbreon-unlock-alley",
  "ad-video-65-shadow-fisheye-arcade-ddr",
  "ad-video-66-shadow-fisheye-arcade-walk",
  "ad-video-60-psychic-creature-rooftop-sp-day",
  "ad-video-70-psychic-creature-rooftop-sp-sunset",
  "ad-video-80-wes-action-replay-visor-coded-closeup",
  "ad-video-81-wes-gamecube-memory-card-closeup",
  "ad-video-82-psychic-creature-import-shop-magazine",
  "ad-video-84-psychic-creature-bedroom-gamecube-play",
  "ad-video-88-skater-fourside-mall-vhs-preview",
  "ad-video-96-skater-rooftop-action-replay-suit-your-game",
  "ad-video-107-skater-code-notebook-closeup",
  "ad-video-116-psychic-billboard-rain-ultimate-cheat-system",
  "ad-video-117-psychic-billboard-unleash-power-rain",
  "ad-video-130-action-replay-ds-product-insert",
  "ad-video-131-arcade-action-replay-crowd-wide",
  "ad-video-143-action-replay-ds-cartridge-in-hand",
  "ad-video-146-shop-customer-main-menu-overlay",
];

export const primaryAdVideoAssets = adVideoAssets.filter(
  (asset) => asset.priority === "primary" && !asset.duplicateOf,
);

export const adVideoAssetById = adVideoAssets.reduce<Record<string, AdVideoAsset>>(
  (assets, asset) => {
    assets[asset.id] = asset;
    return assets;
  },
  {},
);
