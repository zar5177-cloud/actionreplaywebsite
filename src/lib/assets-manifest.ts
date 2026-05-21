import { adVideoAssets } from "./ad-video-assets";

export type AssetCategory =
  | "hero-poster"
  | "shop-banner"
  | "sticker-cutout"
  | "product-mockup"
  | "texture-overlay"
  | "logo-treatment"
  | "character-original"
  | "ui-badge"
  | "drop-card";

export type RightsStatus =
  | "user-supplied mockup"
  | "brand-owned extraction candidate"
  | "generated original project asset"
  | "original replacement required before commercial launch";

export type VisualAsset = {
  id: string;
  src: string;
  category: AssetCategory;
  usage: string;
  sourceReference: string;
  promptSummary: string;
  rightsStatus: RightsStatus;
  alt: string;
};

export const visualAssets: VisualAsset[] = [
  {
    id: "actionreplay-wide-hero-v2",
    src: "/assets/generated/actionreplay-wide-hero-v2.png",
    category: "hero-poster",
    usage: "Home hero background, shop banner, drop console hero, and campaign preview",
    sourceReference: "Built-in image_gen Apr 27, 2026 using existing Action Replay reference assets as style and composition references",
    promptSummary:
      "Original wide Action Replay ecommerce hero with chrome wordmark, black-blue product drop, sticker cards, member card, blue glass tray, and right-side negative space.",
    rightsStatus: "generated original project asset",
    alt: "Wide Action Replay Summer '26 drop banner with chrome logo, apparel, stickers, and blue accessory objects.",
  },
  {
    id: "actionreplay-wide-hero-clean-collage-base",
    src: "/assets/generated/actionreplay-wide-hero-clean-collage-base.png",
    category: "hero-poster",
    usage: "Home hero background cleaned for transparent interactive product cutout layering",
    sourceReference:
      "Locally composited Apr 27, 2026 from actionreplay-wide-hero-v2.png using Action Replay grid, scanline, and blue shadow texture patches",
    promptSummary:
      "Cleaned hero base that removes old embedded product silhouettes and preserves the chrome Action Replay backdrop for transparent PNG collage overlays.",
    rightsStatus: "generated original project asset",
    alt: "Clean Action Replay blue chrome hero background prepared for transparent product collage overlays.",
  },
  {
    id: "actionreplay-chrome-wordmark-v1",
    src: "/assets/generated/logo/actionreplay-chrome-wordmark-v1.png",
    category: "logo-treatment",
    usage: "Home hero primary logo image, brand moments, and chrome wordmark replacement",
    sourceReference:
      "Built-in image_gen Apr 27, 2026 using current Action Replay hero/logo language as reference direction",
    promptSummary:
      "Generated chrome ACTION REPLAY wordmark on chroma-key background, then converted locally to transparent PNG.",
    rightsStatus: "generated original project asset",
    alt: "Chrome Action Replay wordmark logo with AR star crest.",
  },
  {
    id: "topbar-character-logo",
    src: "/assets/generated/logo/topbar-character-logo.jpeg",
    category: "logo-treatment",
    usage: "Topbar square brand mark image inside the Action Replay header logo box",
    sourceReference: "_ (3) copy 30.jpeg supplied by user Apr 28, 2026",
    promptSummary:
      "User-supplied character image cropped with CSS into the existing square topbar brand mark.",
    rightsStatus: "user-supplied mockup",
    alt: "Blue, black, and yellow character artwork used as the Action Replay topbar mark.",
  },
  {
    id: "ar-cutout-tee",
    src: "/assets/generated/current-drop/current-drop-ar-star-tee-cutout.png",
    category: "product-mockup",
    usage: "Interactive home hero collage, AR Star Tee product card, and product detail hero",
    sourceReference: "Built-in image_gen Apr 27, 2026 using the Action Replay wide hero as style/composition reference",
    promptSummary:
      "Isolated black Action Replay graphic tee on chroma-key background, converted locally to transparent PNG.",
    rightsStatus: "generated original project asset",
    alt: "Transparent cutout of a black Action Replay graphic T-shirt with chrome and blue artwork.",
  },
  {
    id: "ar-cutout-hoodie",
    src: "/assets/generated/current-drop/current-drop-override-hoodie-cutout.png",
    category: "product-mockup",
    usage: "Interactive home hero collage, Override Hoodie product card, and product detail hero",
    sourceReference: "Built-in image_gen Apr 27, 2026 using the Action Replay wide hero as style/composition reference",
    promptSummary:
      "Isolated black Action Replay hoodie on chroma-key background, converted locally to transparent PNG.",
    rightsStatus: "generated original project asset",
    alt: "Transparent cutout of a black Action Replay hoodie with chrome star and blue glitch graphics.",
  },
  {
    id: "ar-cutout-stickers",
    src: "/assets/generated/current-drop/current-drop-chrome-sticker-pack-cutout.png",
    category: "sticker-cutout",
    usage: "Interactive home hero collage, Chrome Sticker Pack product card, and sticker collection panels",
    sourceReference: "Built-in image_gen Apr 27, 2026 using the Action Replay wide hero as style/composition reference",
    promptSummary:
      "Isolated glossy Action Replay sticker sheet on chroma-key background, converted locally to transparent PNG.",
    rightsStatus: "generated original project asset",
    alt: "Transparent cutout of an Action Replay sticker sheet with chrome star, globe, barcode, and blue vinyl stickers.",
  },
  {
    id: "ar-cutout-cartridge",
    src: "/assets/generated/current-drop/current-drop-replay-cartridge-charm-cutout.png",
    category: "product-mockup",
    usage: "Interactive home hero collage and Replay Cartridge Charm product detail",
    sourceReference: "Built-in image_gen Apr 27, 2026 using the Action Replay wide hero as style/composition reference",
    promptSummary:
      "Isolated translucent blue cartridge charm with chain on chroma-key background, converted locally to transparent PNG.",
    rightsStatus: "generated original project asset",
    alt: "Transparent cutout of a blue Action Replay cartridge charm with chrome star and chain.",
  },
  {
    id: "ar-cutout-tray",
    src: "/assets/generated/current-drop/current-drop-blue-replay-tray-cutout.png",
    category: "product-mockup",
    usage: "Interactive home hero collage and Replay Tray product detail",
    sourceReference: "Built-in image_gen Apr 27, 2026 using the Action Replay wide hero as style/composition reference",
    promptSummary:
      "Isolated translucent blue glass Action Replay tray on chroma-key background, converted locally to transparent PNG.",
    rightsStatus: "generated original project asset",
    alt: "Transparent cutout of a translucent blue Action Replay tray with chrome star emblem.",
  },
  {
    id: "ar-cutout-lighter",
    src: "/assets/generated/current-drop/current-drop-replay-lighter-cutout.png",
    category: "product-mockup",
    usage: "Interactive home hero collage and Replay Lighter product detail",
    sourceReference: "Built-in image_gen Apr 27, 2026 using the Action Replay wide hero as style/composition reference",
    promptSummary:
      "Isolated smoke-black Action Replay lighter on chroma-key background, converted locally to transparent PNG.",
    rightsStatus: "generated original project asset",
    alt: "Transparent cutout of a smoke-black Action Replay lighter with blue vertical lettering.",
  },
  {
    id: "ar-cutout-member-card",
    src: "/assets/generated/current-drop/current-drop-member-card-set-cutout.png",
    category: "ui-badge",
    usage: "Interactive home hero collage and Member Card Set product detail",
    sourceReference: "Built-in image_gen Apr 27, 2026 using the Action Replay wide hero as style/composition reference",
    promptSummary:
      "Isolated glossy black Action Replay member card on chroma-key background, converted locally to transparent PNG.",
    rightsStatus: "generated original project asset",
    alt: "Transparent cutout of a black Action Replay member card with blue globe, barcode, and holographic sticker.",
  },
  {
    id: "hero-overlay-tee",
    src: "/assets/generated/hero-overlays/hero-overlay-tee.png",
    category: "product-mockup",
    usage: "Desktop home hero exact source-aligned interactive overlay for the tee artwork",
    sourceReference: "Extracted Apr 27, 2026 from actionreplay-wide-hero-v2.png",
    promptSummary:
      "Masked PNG crop from the generated wide hero, positioned on the same 1672x941 source-art coordinate plane.",
    rightsStatus: "generated original project asset",
    alt: "Source-matched Action Replay tee overlay from the hero artwork.",
  },
  {
    id: "hero-overlay-hoodie",
    src: "/assets/generated/hero-overlays/hero-overlay-hoodie.png",
    category: "product-mockup",
    usage: "Desktop home hero exact source-aligned interactive overlay for the hoodie artwork",
    sourceReference: "Extracted Apr 27, 2026 from actionreplay-wide-hero-v2.png",
    promptSummary:
      "Masked PNG crop from the generated wide hero, positioned on the same 1672x941 source-art coordinate plane.",
    rightsStatus: "generated original project asset",
    alt: "Source-matched Action Replay hoodie overlay from the hero artwork.",
  },
  {
    id: "hero-overlay-stickers",
    src: "/assets/generated/hero-overlays/hero-overlay-stickers.png",
    category: "sticker-cutout",
    usage: "Desktop home hero exact source-aligned interactive overlay for the sticker sheet artwork",
    sourceReference: "Extracted Apr 27, 2026 from actionreplay-wide-hero-v2.png",
    promptSummary:
      "Masked PNG crop from the generated wide hero, positioned on the same 1672x941 source-art coordinate plane.",
    rightsStatus: "generated original project asset",
    alt: "Source-matched Action Replay sticker sheet overlay from the hero artwork.",
  },
  {
    id: "hero-overlay-cartridge",
    src: "/assets/generated/hero-overlays/hero-overlay-cartridge.png",
    category: "product-mockup",
    usage: "Desktop home hero exact source-aligned interactive overlay for the cartridge charm artwork",
    sourceReference: "Extracted Apr 27, 2026 from actionreplay-wide-hero-v2.png",
    promptSummary:
      "Masked PNG crop from the generated wide hero, positioned on the same 1672x941 source-art coordinate plane.",
    rightsStatus: "generated original project asset",
    alt: "Source-matched blue Action Replay cartridge charm overlay from the hero artwork.",
  },
  {
    id: "hero-overlay-tray",
    src: "/assets/generated/hero-overlays/hero-overlay-tray.png",
    category: "product-mockup",
    usage: "Desktop home hero exact source-aligned interactive overlay for the blue tray artwork",
    sourceReference: "Extracted Apr 27, 2026 from actionreplay-wide-hero-v2.png",
    promptSummary:
      "Masked PNG crop from the generated wide hero, positioned on the same 1672x941 source-art coordinate plane.",
    rightsStatus: "generated original project asset",
    alt: "Source-matched translucent blue Action Replay tray overlay from the hero artwork.",
  },
  {
    id: "hero-overlay-lighter",
    src: "/assets/generated/hero-overlays/hero-overlay-lighter.png",
    category: "product-mockup",
    usage: "Desktop home hero exact source-aligned interactive overlay for the lighter artwork",
    sourceReference: "Extracted Apr 27, 2026 from actionreplay-wide-hero-v2.png",
    promptSummary:
      "Masked PNG crop from the generated wide hero, positioned on the same 1672x941 source-art coordinate plane.",
    rightsStatus: "generated original project asset",
    alt: "Source-matched smoke-black Action Replay lighter overlay from the hero artwork.",
  },
  {
    id: "hero-overlay-member-card",
    src: "/assets/generated/hero-overlays/hero-overlay-member-card.png",
    category: "ui-badge",
    usage: "Desktop home hero exact source-aligned interactive overlay for the member card artwork",
    sourceReference: "Extracted Apr 27, 2026 from actionreplay-wide-hero-v2.png",
    promptSummary:
      "Masked PNG crop from the generated wide hero, positioned on the same 1672x941 source-art coordinate plane.",
    rightsStatus: "generated original project asset",
    alt: "Source-matched Action Replay member card overlay from the hero artwork.",
  },
  {
    id: "drop-blue-collage",
    src: "/assets/generated/current-drop/current-drop-blue-catalog-poster.png",
    category: "hero-poster",
    usage: "Home hero, drop preview, featured product art",
    sourceReference: "ChatGPT Image Apr 27, 2026, 01_00_15 AM.png",
    promptSummary: "Blue-black Action Replay apparel drop poster with stickers, chrome logos, hardware details, and catalog panels.",
    rightsStatus: "user-supplied mockup",
    alt: "Blue Action Replay summer drop collage with apparel, stickers, and chrome brand details.",
  },
  {
    id: "hero-lime-model",
    src: "/assets/generated/hero-lime-model.png",
    category: "hero-poster",
    usage: "Collection hero and lookbook callout",
    sourceReference: "ChatGPT Image Apr 27, 2026, 01_01_27 AM.png",
    promptSummary: "Lime and blue streetwear poster with model, chrome graphics, sticker badges, and product thumbnails.",
    rightsStatus: "user-supplied mockup",
    alt: "Action Replay poster with a model in a white tee surrounded by blue and lime graphic elements.",
  },
  {
    id: "lookbook-white-models",
    src: "/assets/generated/lookbook-white-models.png",
    category: "hero-poster",
    usage: "About and lookbook panels",
    sourceReference: "ChatGPT Image Apr 27, 2026, 01_01_38 AM.png",
    promptSummary: "White-background drop lookbook with two models, chrome logo, handheld console, badges, and product stickers.",
    rightsStatus: "user-supplied mockup",
    alt: "White Action Replay lookbook page with two models and chrome streetwear stickers.",
  },
  {
    id: "sticker-kit-blue",
    src: "/assets/generated/current-drop/current-drop-sticker-accessory-sheet.png",
    category: "sticker-cutout",
    usage: "Product cards, sticker pack product, collection wall",
    sourceReference: "ChatGPT Image Apr 27, 2026, 01_02_21 AM.png",
    promptSummary: "Blue sticker sheet with logos, lighter, ashtray, cards, and poster fragments.",
    rightsStatus: "brand-owned extraction candidate",
    alt: "Action Replay blue sticker and accessory sheet on a white background.",
  },
  {
    id: "hardware-kit-lime",
    src: "/assets/generated/hardware-kit-lime.png",
    category: "product-mockup",
    usage: "Accessory collection cards and product grid",
    sourceReference: "ChatGPT Image Apr 27, 2026, 01_02_56 AM.png",
    promptSummary: "Lime-blue hardware kit with stickers, ashtray, lighter, and boxed accessories.",
    rightsStatus: "brand-owned extraction candidate",
    alt: "Action Replay accessory kit with lime and blue stickers, lighter, ashtray, and box.",
  },
  {
    id: "character-sticker-sheet",
    src: "/assets/generated/character-sticker-sheet.png",
    category: "character-original",
    usage: "Archive and character universe concept panels",
    sourceReference: "ChatGPT Image Apr 27, 2026, 01_03_56 AM.png",
    promptSummary: "Anime/game-inspired sticker sheet with original mascot direction, hardware props, and Action Replay labels.",
    rightsStatus: "original replacement required before commercial launch",
    alt: "Action Replay character sticker sheet with blue and lime mascot-style graphics.",
  },
  {
    id: "ds-smoke-kit",
    src: "/assets/generated/current-drop/current-drop-desk-relics-kit.png",
    category: "product-mockup",
    usage: "Archive product and accessory panels",
    sourceReference: "ChatGPT Image Apr 27, 2026, 01_05_41 AM.png",
    promptSummary: "Black, blue, and silver handheld-era branded accessory set with ashtray, lighter, stickers, and cards.",
    rightsStatus: "brand-owned extraction candidate",
    alt: "Black and blue Action Replay handheld-inspired accessory mockups.",
  },
  {
    id: "logo-blue-kit",
    src: "/assets/generated/current-drop/current-drop-logo-sticker-kit.png",
    category: "logo-treatment",
    usage: "Logo studies, archive thumbnails, product details",
    sourceReference: "ChatGPT Image Apr 27, 2026, 01_05_46 AM.png",
    promptSummary: "Blue and purple chrome logo kit with lighter, ashtray, cartridge, and sticker labels.",
    rightsStatus: "brand-owned extraction candidate",
    alt: "Action Replay chrome logo and blue-purple accessory layout.",
  },
  {
    id: "sticker-poster-blue",
    src: "/assets/generated/sticker-poster-blue.png",
    category: "sticker-cutout",
    usage: "Sticker collection and homepage motion rail",
    sourceReference: "ChatGPT Image Apr 27, 2026, 01_07_38 AM.png",
    promptSummary: "Black-blue sticker sheet with chrome logo, character panels, lighter, and ashtray.",
    rightsStatus: "original replacement required before commercial launch",
    alt: "Blue Action Replay sticker sheet with character-style panels and accessory mockups.",
  },
  {
    id: "purple-kit",
    src: "/assets/generated/purple-kit.png",
    category: "product-mockup",
    usage: "Purple capsule product cards and archive panels",
    sourceReference: "ChatGPT Image Apr 27, 2026, 01_09_00 AM.png",
    promptSummary: "Purple chrome Action Replay kit with lighter, ashtray, game cartridge, badges, and poster card.",
    rightsStatus: "brand-owned extraction candidate",
    alt: "Purple Action Replay accessory and logo kit.",
  },
  {
    id: "shop-ui-concept",
    src: "/assets/generated/shop-ui-concept.png",
    category: "shop-banner",
    usage: "Shop route hero and UI direction reference",
    sourceReference: "ChatGPT Image Apr 27, 2026, 01_58_16 AM.png",
    promptSummary: "Full shop concept with dark blue grunge layout, nav, product cards, filters, and footer panels.",
    rightsStatus: "user-supplied mockup",
    alt: "Action Replay shop concept with dark blue product wall.",
  },
  {
    id: "about-ui-concept",
    src: "/assets/generated/about-ui-concept.png",
    category: "shop-banner",
    usage: "About route hero and mission sections",
    sourceReference: "ChatGPT Image Apr 27, 2026, 02_01_48 AM.png",
    promptSummary: "About page concept with mission panels, timeline, dark grunge layout, and character graphics.",
    rightsStatus: "user-supplied mockup",
    alt: "Action Replay about page concept with dark blue poster layout.",
  },
  {
    id: "green-poster",
    src: "/assets/generated/green-poster.png",
    category: "hero-poster",
    usage: "Archive green capsule, visual wall",
    sourceReference: "ChatGPT Image Apr 26, 2026, 11_18_07 PM.png",
    promptSummary: "Dark green Action Replay poster with handheld console, face overlay, star light, and status panels.",
    rightsStatus: "user-supplied mockup",
    alt: "Green and blue Action Replay poster with handheld console and status-style graphics.",
  },
  {
    id: "blue-ds-poster",
    src: "/assets/generated/blue-ds-poster.png",
    category: "hero-poster",
    usage: "Archive hero and replay override panel",
    sourceReference: "ChatGPT Image Apr 26, 2026, 11_23_15 PM.png",
    promptSummary: "Blue handheld-era poster with chrome Action Replay logo, console-like artifact, planet, layouts, and replay copy.",
    rightsStatus: "brand-owned extraction candidate",
    alt: "Blue Action Replay handheld-era poster with chrome logo and console-like artifact.",
  },
  {
    id: "city-blue-poster",
    src: "/assets/generated/city-blue-poster.png",
    category: "hero-poster",
    usage: "Home hero background and worldwide section",
    sourceReference: "ChatGPT Image Apr 26, 2026, 11_29_47 PM.png",
    promptSummary: "Blue city poster with chrome Action Replay logo, transparent hardware, map overlays, and status panels.",
    rightsStatus: "brand-owned extraction candidate",
    alt: "Blue city Action Replay poster with chrome logo and transparent hardware.",
  },
  {
    id: "landing-ui-concept",
    src: "/assets/generated/landing-ui-concept.png",
    category: "shop-banner",
    usage: "Home reference and archive visual",
    sourceReference: "ChatGPT Image Apr 26, 2026, 11_31_19 PM.png",
    promptSummary: "Full Action Replay ecommerce homepage concept with grunge hero, product categories, nav, and footer panels.",
    rightsStatus: "user-supplied mockup",
    alt: "Action Replay ecommerce homepage concept with blue grunge hero and product category cards.",
  },
  {
    id: "ad-video-source-contact-sheet",
    src: "/assets/generated/ad-video/ad-video-source-contact-sheet.jpg",
    category: "drop-card",
    usage: "Ad video source-frame index for quickly scanning May 10 reference images 1-30",
    sourceReference: "Locally composited May 10, 2026 from the 30 user-supplied ad-video source frames",
    promptSummary:
      "Contact sheet of the Action Replay ad-video reference set: memory-card UI shots, CRT boot menus, cartridge macros, rainy Tokyo-Seoul city shots, storefronts, and rooftops.",
    rightsStatus: "original replacement required before commercial launch",
    alt: "Contact sheet showing all Action Replay ad video reference frames.",
  },
  {
    id: "ad-video-source-contact-sheet-31-55",
    src: "/assets/generated/ad-video/ad-video-source-contact-sheet-31-55.jpg",
    category: "drop-card",
    usage: "Ad video source-frame index for quickly scanning May 10 reference images 31-55",
    sourceReference: "Locally composited May 11, 2026 from user-supplied ad-video source frames 31-55",
    promptSummary:
      "Contact sheet of the expanded Action Replay ad-video reference set: code sheets, garage cars, Shadow-style mascot frames, visor courier closeups, and arcade/store beats.",
    rightsStatus: "original replacement required before commercial launch",
    alt: "Contact sheet showing Action Replay ad video reference frames 31 through 55.",
  },
  {
    id: "ad-video-source-contact-sheet-56-81",
    src: "/assets/generated/ad-video/ad-video-source-contact-sheet-56-81.jpg",
    category: "drop-card",
    usage: "Ad video source-frame index for quickly scanning May 10 reference images 56-81",
    sourceReference: "Locally composited May 11, 2026 from user-supplied ad-video source frames 56-81",
    promptSummary:
      "Contact sheet of the expanded Action Replay ad-video reference set: vending alleys, visor courier and companion shots, arcade fisheye frames, rooftop creature shots, and memory-card closeups.",
    rightsStatus: "original replacement required before commercial launch",
    alt: "Contact sheet showing Action Replay ad video reference frames 56 through 81.",
  },
  {
    id: "ad-video-source-contact-sheet-82-112",
    src: "/assets/generated/ad-video/ad-video-source-contact-sheet-82-112.jpg",
    category: "drop-card",
    usage: "Ad video source-frame index for quickly scanning May 10 reference images 82-112",
    sourceReference: "Locally composited May 11, 2026 from user-supplied ad-video source frames 82-112",
    promptSummary:
      "Contact sheet of the late Action Replay ad-video reference set: psychic creature import-shop shots, GameCube bedroom play, mall replay frames, rooftop code notebooks, and early AR Max print-ad beats.",
    rightsStatus: "original replacement required before commercial launch",
    alt: "Contact sheet showing Action Replay ad video reference frames 82 through 112.",
  },
  {
    id: "ad-video-source-contact-sheet-113-146",
    src: "/assets/generated/ad-video/ad-video-source-contact-sheet-113-146.jpg",
    category: "drop-card",
    usage: "Ad video source-frame index for quickly scanning May 10 reference images 113-146",
    sourceReference: "Locally composited May 11, 2026 from user-supplied ad-video source frames 113-146",
    promptSummary:
      "Contact sheet of the late Action Replay ad-video reference set: rainy creature billboard reveals, AR skate poster layouts, arcade takeovers, DS hardware macros, GameCube sticker-workbench shots, and human retail browsing.",
    rightsStatus: "original replacement required before commercial launch",
    alt: "Contact sheet showing Action Replay ad video reference frames 113 through 146.",
  },
  {
    id: "galaxy-tee-product",
    src: "/assets/generated/current-drop/galaxy-tee-product.jpg",
    category: "product-mockup",
    usage: "Live AR-001 Galaxy tee product card, shop fallback, homepage live drop grid, and product detail fallback",
    sourceReference: "/Users/zrelich/Documents/actionreplayshirt5.jpg supplied by user for the May 20, 2026 live drop",
    promptSummary:
      "User-supplied product mockup for the white AR-001 Galaxy tee with purple psychic cat graphic, chrome AR logo, and sleeve mark.",
    rightsStatus: "user-supplied mockup",
    alt: "White Action Replay Galaxy tee showing the front and back purple psychic cat graphic.",
  },
  {
    id: "galaxy-tee-editorial-blue",
    src: "/assets/generated/current-drop/galaxy-tee-editorial-blue.jpg",
    category: "product-mockup",
    usage: "Primary AR-001 Galaxy tee editorial hero image, homepage hero product tile, and product detail gallery",
    sourceReference: "/Users/zrelich/Documents/actionreplayshot10.jpg supplied by user for the May 20, 2026 live drop",
    promptSummary:
      "User-supplied blue studio editorial image of the white AR-001 Galaxy tee with headphones, denim, and flash-lit campaign styling.",
    rightsStatus: "user-supplied mockup",
    alt: "Model in headphones wearing the white Action Replay Galaxy tee against a blue studio backdrop.",
  },
  {
    id: "galaxy-tee-editorial-floor",
    src: "/assets/generated/current-drop/galaxy-tee-editorial-floor.jpg",
    category: "product-mockup",
    usage: "Secondary AR-001 Galaxy tee editorial image for lookbook strips and product detail gallery",
    sourceReference: "/Users/zrelich/Documents/actionreplayshot11.jpg supplied by user for the May 20, 2026 live drop",
    promptSummary:
      "User-supplied floor pose editorial image showing the Galaxy tee back print in soft violet-blue flash lighting.",
    rightsStatus: "user-supplied mockup",
    alt: "Model seated on the floor showing the back print of the white Action Replay Galaxy tee.",
  },
  {
    id: "galaxy-tee-editorial-shoulder",
    src: "/assets/generated/current-drop/galaxy-tee-editorial-shoulder.jpg",
    category: "product-mockup",
    usage: "Tertiary AR-001 Galaxy tee editorial image for product gallery and campaign lookbook rail",
    sourceReference: "/Users/zrelich/Documents/actionreplayshot12.jpg supplied by user for the May 20, 2026 live drop",
    promptSummary:
      "User-supplied shoulder pose editorial image showing the Galaxy tee back graphic and sleeve mark.",
    rightsStatus: "user-supplied mockup",
    alt: "Model looking over her shoulder while wearing the white Action Replay Galaxy tee.",
  },
  {
    id: "galaxy-tee-model-01",
    src: "/assets/generated/current-drop/galaxy-tee-model-01.jpg",
    category: "product-mockup",
    usage: "Live AR-001 Galaxy tee homepage and product gallery model image",
    sourceReference: "/Users/zrelich/Documents/actionreplay19.jpg supplied by user for the May 20, 2026 live drop",
    promptSummary:
      "User-supplied model image for the AR-001 Galaxy tee in the current drop campaign.",
    rightsStatus: "user-supplied mockup",
    alt: "Model wearing the white Action Replay Galaxy tee.",
  },
  {
    id: "galaxy-tee-model-02",
    src: "/assets/generated/current-drop/galaxy-tee-model-02.jpg",
    category: "product-mockup",
    usage: "Secondary live AR-001 Galaxy tee homepage and product gallery model image",
    sourceReference: "/Users/zrelich/Documents/actionreplay16.jpg supplied by user for the May 20, 2026 live drop",
    promptSummary:
      "Second user-supplied model image for the AR-001 Galaxy tee in the current drop campaign.",
    rightsStatus: "user-supplied mockup",
    alt: "Second model view of the white Action Replay Galaxy tee.",
  },
  {
    id: "action-replay-2026-promo-poster",
    src: "/assets/generated/current-drop/action-replay-2026-promo-poster.jpg",
    category: "hero-poster",
    usage: "AR-003 corrupted promo poster archive file, hidden product page fallback, homepage texture, and print verification placeholder",
    sourceReference: "/Users/zrelich/Documents/actionreplayposter7.jpg supplied by user for the May 20, 2026 live drop",
    promptSummary:
      "User-supplied purple and chrome Action Replay 2026 promotional poster artwork.",
    rightsStatus: "user-supplied mockup",
    alt: "Purple and chrome Action Replay 2026 promotional poster artwork.",
  },
  {
    id: "galaxy-poster-product-black",
    src: "/assets/generated/current-drop/galaxy-poster-product-black.jpg",
    category: "hero-poster",
    usage: "Alternate black chrome Galaxy poster artwork for homepage atmosphere, poster gallery, and shop banners",
    sourceReference: "/Users/zrelich/Documents/actionreplayposter8.jpg supplied by user for the May 20, 2026 live drop",
    promptSummary:
      "User-supplied black chrome Action Replay Galaxy promotional art with dense UI panels, white tee mockups, barcode modules, and city strip.",
    rightsStatus: "user-supplied mockup",
    alt: "Black chrome Action Replay Galaxy promo artwork with tee mockups and dense catalog interface details.",
  },
  {
    id: "galaxy-poster-light",
    src: "/assets/generated/current-drop/galaxy-poster-light.jpg",
    category: "hero-poster",
    usage: "Light violet Galaxy collection poster artwork for pale sections, lookbook transitions, and product gallery",
    sourceReference: "/Users/zrelich/Documents/actionreplay14.jpg supplied by user for the May 20, 2026 live drop",
    promptSummary:
      "User-supplied light violet Galaxy collection poster with white tee mockups and soft orbital ring layout.",
    rightsStatus: "user-supplied mockup",
    alt: "Light violet Galaxy collection poster with white tee mockups and orbital rings.",
  },
  {
    id: "galaxy-poster-chrome",
    src: "/assets/generated/current-drop/galaxy-poster-chrome.jpg",
    category: "hero-poster",
    usage: "Chrome creature poster artwork for product gallery, archive panel, and visual texture reference",
    sourceReference: "/Users/zrelich/Documents/actionreplay13.jpg supplied by user for the May 20, 2026 live drop",
    promptSummary:
      "User-supplied black chrome Action Replay poster artwork with metallic purple character, grid panels, barcode, and hardware UI references.",
    rightsStatus: "user-supplied mockup",
    alt: "Black chrome Action Replay poster with metallic purple character and dense cyber catalog layout.",
  },
  {
    id: "action-replay-ar-mark-black",
    src: "/assets/generated/current-drop/action-replay-ar-mark-black.png",
    category: "logo-treatment",
    usage: "Black AR mark for light product detail sections, badges, and responsive logo treatments",
    sourceReference: "/Users/zrelich/Documents/actionreplaypslogoblack2.png supplied by user for the May 20, 2026 live drop",
    promptSummary:
      "User-supplied black Action Replay AR mark prepared for site logo and product-detail badge use.",
    rightsStatus: "user-supplied mockup",
    alt: "Black Action Replay AR mark.",
  },
  {
    id: "action-replay-ar-mark-white",
    src: "/assets/generated/current-drop/action-replay-ar-mark-white.png",
    category: "logo-treatment",
    usage: "White AR mark for dark header, footer, cart, and hero brand treatments",
    sourceReference: "/Users/zrelich/Documents/actionreplaywhite2.png supplied by user for the May 20, 2026 live drop",
    promptSummary:
      "User-supplied white Action Replay AR mark prepared for dark interface surfaces.",
    rightsStatus: "user-supplied mockup",
    alt: "White Action Replay AR mark.",
  },
  {
    id: "action-replay-ar-mark-color",
    src: "/assets/generated/current-drop/action-replay-ar-mark-color.png",
    category: "logo-treatment",
    usage: "Color AR mark for hidden detail panels, archive references, and future about sections",
    sourceReference: "/Users/zrelich/Documents/actionreplaypslogo2.png supplied by user for the May 20, 2026 live drop",
    promptSummary:
      "User-supplied multicolor Action Replay AR mark with red, teal, yellow, and blue orbit segments.",
    rightsStatus: "user-supplied mockup",
    alt: "Multicolor Action Replay AR mark.",
  },
  ...adVideoAssets.map((asset) => ({
    id: asset.id,
    src: asset.src,
    category: asset.assetCategory,
    usage: asset.usage,
    sourceReference: asset.sourceReference,
    promptSummary: asset.promptSummary,
    rightsStatus: asset.rightsStatus,
    alt: asset.alt,
  })),
];

export const assetById = visualAssets.reduce<Record<string, VisualAsset>>(
  (assets, asset) => {
    assets[asset.id] = asset;
    return assets;
  },
  {},
);
