const fs = require("fs");
const path = require("path");

const root = "/Users/zrelich/Desktop/actionreplaywebsite";
const manualRoot = path.join(root, "action-replay-higgsfield/manual-higgsfield");
const uploadDir = path.join(manualRoot, "upload-frames/QUEUE_02_ExtendedAdBuildout");
const promptDir = path.join(manualRoot, "prompts/queue-02-extended-ad-buildout");
const queueFile = path.join(manualRoot, "render-queues/QUEUE_02_ExtendedAdBuildout.md");
const packFile = path.join(manualRoot, "PROMPT_PACK_QUEUE_02_EXTENDED_AD_BUILDOUT.md");

const intro = `Use the attached image as the exact first frame / start frame of the video. The opening frame must match the uploaded image composition, subject placement, lighting, crop, and overall identity. Do not redraw, reinterpret, restyle, or create a new opening image.

If Higgsfield exposes an image token in the prompt field, use it this way:
@image is the exact first frame / start frame and continuity anchor for this video.`;

const footerByClass = {
  "CLASS 01 - OBSERVATIONAL HANDHELD":
    "Handheld but restrained. Slight operator imperfection, natural sway, tiny framing corrections, believable body or object inertia, mild focus inconsistency, and no performative camera move.",
  "CLASS 02 - PROMOTIONAL HERO SHOT":
    "Controlled composition and restrained cool factor. Slow push, minimal motion, low or mid-angle framing when present, environmental atmosphere over spectacle, and no trailer-style hero exaggeration.",
  "CLASS 03 - SECURITY CAMERA / FOUND FOOTAGE":
    "Locked-off or nearly locked-off archival camera. 0-1% mechanical jitter, imperfect exposure, compression shimmer, screen flicker, and no operated commercial camera move.",
  "CLASS 04 - DREAMLIKE MEMORY SHOT":
    "Slow melancholic motion, heavier bloom, soft focus breathing, environmental drift, and restrained surreal feeling without fantasy transformation.",
  "CLASS 05 - PRODUCT / OBJECT DETAIL":
    "Macro-scale tactile motion only. Tiny push, focus breathing, hand or prop micro-adjustment, paper flutter, plastic glint, dust, scratches, screen glow, and real material response.",
};

const universalStyle =
  "Rare forgotten 2006-2007 gaming-fashion promo footage from an alternate 2004-2008 console-and-handheld-era youth culture. Captured footage, not rendered. Soft video bloom, mild chromatic aberration, controlled grain, faint QuickTime compression artifacts, imperfect low-light handling, authentic highlight rolloff, cool blue/red techno palette, occasional green/white interface glow, underground skate-video restraint, emotionally real before nostalgic.";

const universalNegative =
  "No AI artifacts, no identity drift, no malformed anatomy, no broken hands, no synthetic facial motion, no text morphing, no fake readable typography, no new third-party marks, no new real-world logos, no modern TikTok pacing, no esports trailer, no Marvel/VFX lighting, no Fortnite look, no over-rendered Unreal Engine realism, no ultra-clean HDR sharpness, no excessive cyberpunk clutter, no fast drone move, no music-video spin, no exaggerated parallax, no generic AI commercial look.";

const shots = [
  {
    run: "01",
    title: "Boot Discovery / Human Select",
    source: "public/assets/generated/ad-video/source-frames/03-skater-selects-final-mix-tv.png",
    upload: "01_BootDiscovery_HumanSelect.png",
    prompt: "RUN01_BootDiscovery_HumanSelect_ManualPrompt.txt",
    section: "Boot / Archive",
    shotClass: "CLASS 01 - OBSERVATIONAL HANDHELD",
    sceneRole:
      "A person discovers the hidden archive file on a glowing CRT in a cluttered room. This is the human entry point into the recovered promo.",
    action:
      "Animate this exact still into a restrained 4-second over-the-shoulder discovery beat. The moment should feel quiet, private, and accidental.",
    motion:
      "Use subtle handheld drift, a tiny cursor/screen glow pulse if already present, CRT scanline breathing, room-light flicker, and a small shoulder or hand micro-shift. Do not make the subject perform or turn to camera.",
    preserve:
      "Preserve the first-frame composition, over-the-shoulder framing, CRT placement, room clutter, blue screen glow, subject posture, and intimate archive-discovery tone. Do not add new interface text, new people, new posters, new logos, or new props.",
  },
  {
    run: "02",
    title: "Archive Metadata / CRT File Detail",
    source: "public/assets/generated/ad-video/source-frames/05-ps2-browser-final-mix-file-details.png",
    upload: "02_ArchiveMetadata_CRTFileDetail.png",
    prompt: "RUN02_ArchiveMetadata_CRTFileDetail_ManualPrompt.txt",
    section: "Boot / Archive",
    shotClass: "CLASS 03 - SECURITY CAMERA / FOUND FOOTAGE",
    sceneRole:
      "Close CRT file-browser insert that sells the recovered archive structure before the world opens.",
    action:
      "Animate the exact still into a 4-second locked CRT insert. This should feel like a captured menu screen inside an old room, not a newly generated UI.",
    motion:
      "Keep camera nearly locked. Add CRT scanline roll, mild glow breathing, tiny exposure flicker, dust/noise crawl, and subtle compression shimmer only. No new menu navigation.",
    preserve:
      "Preserve the first-frame menu layout, screen crop, room context, blue interface glow, and file-detail mood. Keep existing readable project-world text stable. Do not invent, rewrite, sharpen, or morph typography.",
  },
  {
    run: "03",
    title: "Boot Menu / Firmware Screen",
    source: "public/assets/generated/ad-video/source-frames/11-action-replay-main-menu-window.png",
    upload: "03_BootMenu_FirmwareScreen.png",
    prompt: "RUN03_BootMenu_FirmwareScreen_ManualPrompt.txt",
    section: "Boot / Archive",
    shotClass: "CLASS 03 - SECURITY CAMERA / FOUND FOOTAGE",
    sceneRole:
      "Firmware menu insert for the system-boot section. This becomes a reusable editorial bridge between scenes.",
    action:
      "Animate the exact still into a restrained 4-second menu-breathing insert. Use it as footage of an old screen, not a clean software animation.",
    motion:
      "Nearly locked frame, mild CRT/LCD flicker, cursor glow breathing if already present, scanline crawl, tiny exposure pumping, and compression crawl. No new menu items or UI changes.",
    preserve:
      "Preserve the first-frame 4:3 menu composition, window framing, blue interface color, room reflections, and old-system boot mood. Do not add new slogans, new options, new title cards, or extra overlays.",
  },
  {
    run: "04",
    title: "Memory Overlay / Room Projection",
    source: "public/assets/generated/ad-video/source-frames/16-translucent-memory-card-overlay-room.png",
    upload: "04_MemoryOverlay_RoomProjection.png",
    prompt: "RUN04_MemoryOverlay_RoomProjection_ManualPrompt.txt",
    section: "Boot / Archive",
    shotClass: "CLASS 01 - OBSERVATIONAL HANDHELD",
    sceneRole:
      "Transition bridge from the boot archive into the larger world: translucent memory-interface energy over a lived-in room.",
    action:
      "Animate the exact still into a restrained 4-second projection shimmer. The transition should feel like old hardware leaking into reality.",
    motion:
      "Use subtle handheld drift, faint projection shimmer, room-light breathing, small reflection shifts, and dust movement. Keep the interface anchored to the original plane and do not make it fly around.",
    preserve:
      "Preserve the first-frame room layout, translucent interface placement, palette, desk/bedroom clutter, and quiet supernatural-tech feeling. Do not add new UI labels, characters, logos, or dramatic glitch effects.",
  },
  {
    run: "05",
    title: "Blue Cheat Device / Hardware Macro",
    source: "public/assets/generated/ad-video/source-frames/19-blue-gamecube-action-replay-cartridge.png",
    upload: "05_BlueCheatDevice_HardwareMacro.png",
    prompt: "RUN05_BlueCheatDevice_HardwareMacro_ManualPrompt.txt",
    section: "Boot / Hardware",
    shotClass: "CLASS 05 - PRODUCT / OBJECT DETAIL",
    sceneRole:
      "Tactile hardware macro insert for the boot sequence and final montage.",
    action:
      "Animate the exact still into a 4-second macro object shot. It should feel like a handheld camcorder examining a real translucent accessory on a desk.",
    motion:
      "Use tiny focus breathing, microscopic handheld push, blue plastic specular glints, dust movement, edge highlights, and subtle shadow shift. Do not rotate the object into a full product demo.",
    preserve:
      "Preserve the first-frame object shape, transparent blue material, label placement, desk surface, scratches, dust, and close-up composition. Keep visible project-world text stable and do not invent new label text.",
  },
  {
    run: "06",
    title: "Handheld Cheat Cartridge / Macro",
    source: "public/assets/generated/ad-video/source-frames/21-action-replay-ds-cartridge-macro.png",
    upload: "06_HandheldCheatCartridge_Macro.png",
    prompt: "RUN06_HandheldCheatCartridge_Macro_ManualPrompt.txt",
    section: "Boot / Hardware",
    shotClass: "CLASS 05 - PRODUCT / OBJECT DETAIL",
    sceneRole:
      "Small handheld accessory macro for product reality and edit texture.",
    action:
      "Animate the exact still into a restrained 4-second tactile insert. The object should feel used, handled, and physically present.",
    motion:
      "Use a tiny rack focus across the cartridge edge, small plastic glints, dust, fingerprint shine, and barely perceptible camera drift. Do not insert it into a device or create a new action.",
    preserve:
      "Preserve the first-frame crop, cartridge position, label geometry, plastic bevels, tabletop material, and low-light blue glow. Do not rewrite text or add new logos.",
  },
  {
    run: "07",
    title: "Antihero Code List / Close Insert",
    source: "public/assets/generated/ad-video/source-frames/31-shadow-code-list-closeup.png",
    upload: "07_AntiheroCodeList_CloseInsert.png",
    prompt: "RUN07_AntiheroCodeList_CloseInsert_ManualPrompt.txt",
    section: "Antihero Garage",
    shotClass: "CLASS 05 - PRODUCT / OBJECT DETAIL",
    characterId: "AR_BLACK_RED_ANTIHERO",
    sceneRole:
      "A close insert of AR_BLACK_RED_ANTIHERO with printed code sheets, used before or after the garage hero shot.",
    action:
      "Animate the exact still into a restrained 4-second close insert. The character should remain quiet and tired, focused on the paper, not performing.",
    motion:
      "Use tiny paper movement, hand micro-adjustment only if already implied, soft focus breathing, blue light flicker, and minimal head/eye stillness. No expression change or action beat.",
    preserve:
      "Preserve the first-frame character silhouette, black-red color blocking, code-sheet position, hand placement, lighting, and isolated mood. Do not redesign the character, add new accessories, rewrite paper text, or add new logos.",
  },
  {
    run: "08",
    title: "Garage Car / Wet Underground HUD",
    source: "public/assets/generated/ad-video/source-frames/33-tokyo-garage-woman-supra-menu.png",
    upload: "08_GarageCar_WetUndergroundHUD.png",
    prompt: "RUN08_GarageCar_WetUndergroundHUD_ManualPrompt.txt",
    section: "Antihero Garage",
    shotClass: "CLASS 03 - SECURITY CAMERA / FOUND FOOTAGE",
    sceneRole:
      "Underground parking-garage world texture: wet concrete, silver car, blue underglow, and old game-menu overlay feeling.",
    action:
      "Animate the exact still into a restrained 4-second found-footage garage shot. It should feel like a saved replay file or parking-garage camera, not a car commercial.",
    motion:
      "Keep frame mostly static with tiny mechanical jitter. Let wet reflections shimmer, blue underglow pulse, distant lights flicker, and haze drift. Any human movement should remain minimal.",
    preserve:
      "Preserve the first-frame car placement, garage depth, wet floor reflections, blue/red light palette, subject placement, and interface-like overlay feeling. Do not add new cars, new UI labels, new brand marks, drifting camera, or racing action.",
  },
  {
    run: "09",
    title: "Antihero Code Sheet / Tactile Insert",
    source: "public/assets/generated/ad-video/source-frames/57-shadow-cheat-code-sheet-closeup.png",
    upload: "09_AntiheroCodeSheet_TactileInsert.png",
    prompt: "RUN09_AntiheroCodeSheet_TactileInsert_ManualPrompt.txt",
    section: "Antihero Garage",
    shotClass: "CLASS 05 - PRODUCT / OBJECT DETAIL",
    characterId: "AR_BLACK_RED_ANTIHERO",
    sceneRole:
      "Printed code sheet close-up that bridges the antihero garage scene into the broader cheat-device mythology.",
    action:
      "Animate the exact still into a restrained 4-second tactile code-paper insert. Keep it intimate and physical.",
    motion:
      "Use small paper flutter, fingertip micro-motion only if already present, focus breathing, CRT glow fluctuation, and compression crawl. Keep all visible code marks stable.",
    preserve:
      "Preserve the first-frame paper crop, hand relationship, character silhouette if visible, blue/red low-light palette, and printed-code feeling. Do not invent new code text, sharpen old text, add props, or change the character.",
  },
  {
    run: "10",
    title: "Antihero Vending Alley / Profile",
    source: "public/assets/generated/ad-video/source-frames/76-shadow-vending-alley-profile.png",
    upload: "10_AntiheroVendingAlley_Profile.png",
    prompt: "RUN10_AntiheroVendingAlley_Profile_ManualPrompt.txt",
    section: "Antihero Garage",
    shotClass: "CLASS 02 - PROMOTIONAL HERO SHOT",
    characterId: "AR_BLACK_RED_ANTIHERO",
    sceneRole:
      "A quiet profile beat for AR_BLACK_RED_ANTIHERO near vending-machine light, useful as a melancholic character cutaway.",
    action:
      "Animate the exact still into a restrained 4-second profile shot. The subject should feel famous, exhausted, and quietly present.",
    motion:
      "Use a slow handheld push under 3% frame-scale change, slight fabric movement, vending light flicker, wet ground shimmer, and minimal head stillness. No dramatic turn, no action, no expressive acting.",
    preserve:
      "Preserve the first-frame profile silhouette, red/black wardrobe, vending glow, alley depth, cool palette, and isolated emotional tone. Do not redesign the character or add new signs, crowds, powers, or logos.",
  },
  {
    run: "11",
    title: "Visor Courier / Reflective Closeup",
    source: "public/assets/generated/ad-video/source-frames/38-wes-action-replay-visor-closeup.png",
    upload: "11_VisorCourier_ReflectiveCloseup.png",
    prompt: "RUN11_VisorCourier_ReflectiveCloseup_ManualPrompt.txt",
    section: "Visor Courier Reveal",
    shotClass: "CLASS 05 - PRODUCT / OBJECT DETAIL",
    characterId: "AR_VISOR_COURIER",
    sceneRole:
      "Reflective visor close-up for the older-brother figure, used as a reveal insert or firmware-reflection cutaway.",
    action:
      "Animate the exact still into a restrained 4-second close-up. The courier should remain calm and detached.",
    motion:
      "Use tiny focus breathing, visor reflection movement, minimal head stillness, blue light pulse, and subtle jacket collar movement. No facial acting, no speech, no dramatic turn.",
    preserve:
      "Preserve the first-frame visor shape, face crop, hair silhouette, blue jacket, reflected interface glow, and quiet cool tone. Do not redesign the character, change wardrobe, add UI text, or alter the visor logo/text.",
  },
  {
    run: "12",
    title: "Visor Courier / Code Reflection",
    source: "public/assets/generated/ad-video/source-frames/80-wes-action-replay-visor-coded-closeup.png",
    upload: "12_VisorCourier_CodeReflection.png",
    prompt: "RUN12_VisorCourier_CodeReflection_ManualPrompt.txt",
    section: "Visor Courier Reveal",
    shotClass: "CLASS 05 - PRODUCT / OBJECT DETAIL",
    characterId: "AR_VISOR_COURIER",
    sceneRole:
      "Second visor/code close-up for continuity, showing the character as part of the hidden system rather than an action hero.",
    action:
      "Animate the exact still into a restrained 4-second reflective insert. The motion should live inside the visor reflection and camera breathing.",
    motion:
      "Use tiny reflection crawl, blue code glow, slight focus rack across visor curvature, and barely perceptible handheld drift. Keep the character still and grounded.",
    preserve:
      "Preserve the first-frame visor crop, hair silhouette, face proportions, jacket material, reflected code pattern, and blue glow. Do not invent new readable UI, add new logos, change expression, or redesign the courier.",
  },
  {
    run: "13",
    title: "Courier Rain Booth / Quiet Interior",
    source: "public/assets/generated/ad-video/source-frames/67-wes-restaurant-booth-ds-rain.png",
    upload: "13_CourierRainBooth_QuietInterior.png",
    prompt: "RUN13_CourierRainBooth_QuietInterior_ManualPrompt.txt",
    section: "Visor Courier / Human Warmth",
    shotClass: "CLASS 04 - DREAMLIKE MEMORY SHOT",
    characterId: "AR_VISOR_COURIER",
    sceneRole:
      "Quiet restaurant or booth cutaway that makes the courier feel like a real person between city scenes.",
    action:
      "Animate the exact still into a restrained 4-second rainy interior memory shot. It should feel private and late-night.",
    motion:
      "Use slow rain streak movement on the window, subtle handheld drift, screen glow pulse, tiny shoulder or hand stillness, and warm interior reflection shifts. No dialogue or acting.",
    preserve:
      "Preserve the first-frame booth composition, character posture, handheld device placement if present, rain-window glow, food/table props, and lonely calm mood. Do not add new patrons, new signs, new UI, or character redesign.",
  },
  {
    run: "14",
    title: "Courier Companion / Neon Alley",
    source: "public/assets/generated/ad-video/source-frames/53-wes-umbreon-neon-alley.png",
    upload: "14_CourierCompanion_NeonAlley.png",
    prompt: "RUN14_CourierCompanion_NeonAlley_ManualPrompt.txt",
    section: "Visor Courier Reveal",
    shotClass: "CLASS 04 - DREAMLIKE MEMORY SHOT",
    characterId: "AR_VISOR_COURIER and AR_SHADOW_COMPANION",
    sceneRole:
      "Alley companionship shot: the courier and small shadow companion feel like part of the same hidden late-night network.",
    action:
      "Animate the exact still into a restrained 4-second alley memory shot. Keep the relationship quiet and grounded.",
    motion:
      "Use slow handheld drift, neon reflection breathing, wet alley shimmer, subtle jacket movement, and at most a tiny companion weight shift. No running, no powers, no battle stance.",
    preserve:
      "Preserve the first-frame courier placement, companion placement, alley depth, blue/red neon, wet pavement, and calm loyalty tone. Do not redesign either figure, duplicate the companion, add new creatures, or add new signage.",
  },
  {
    run: "15",
    title: "Arcade Walk / Fisheye Corridor",
    source: "public/assets/generated/ad-video/source-frames/66-shadow-fisheye-arcade-walk.png",
    upload: "15_ArcadeWalk_FisheyeCorridor.png",
    prompt: "RUN15_ArcadeWalk_FisheyeCorridor_ManualPrompt.txt",
    section: "Arcade / Montage",
    shotClass: "CLASS 01 - OBSERVATIONAL HANDHELD",
    sceneRole:
      "Fisheye arcade walking shot for the breakbeat montage and import-shop world.",
    action:
      "Animate the exact still into a restrained 4-second fisheye walk-through. It should feel captured by a friend with a small camera.",
    motion:
      "Use grounded handheld fisheye movement, slight roll, small forward drift, cabinet light flicker, floor reflections, and natural subject inertia. Do not create a fast music-video camera path.",
    preserve:
      "Preserve the first-frame corridor depth, subject placement, fisheye distortion, cabinet rhythm, blue/red lights, and wet reflective arcade floor. Do not add crowds, new machines, new logos, or new UI overlays.",
  },
  {
    run: "16",
    title: "Arcade Shoulder / Hallway Surveillance",
    source: "public/assets/generated/ad-video/source-frames/51-shadow-arcade-hallway-over-shoulder.png",
    upload: "16_ArcadeShoulder_HallwaySurveillance.png",
    prompt: "RUN16_ArcadeShoulder_HallwaySurveillance_ManualPrompt.txt",
    section: "Arcade / Import Shop",
    shotClass: "CLASS 03 - SECURITY CAMERA / FOUND FOOTAGE",
    sceneRole:
      "Over-shoulder arcade hallway proof that the hidden culture exists in public spaces.",
    action:
      "Animate the exact still into a restrained 4-second found-footage hallway shot.",
    motion:
      "Use nearly locked framing, exposure pulse, cabinet flicker, compression shimmer, and tiny subject movement. No clean commercial push-in.",
    preserve:
      "Preserve the first-frame over-shoulder composition, arcade hallway depth, subject silhouette, blue light, machine placement, and surveillance-like mood. Do not add new signs, logos, characters, or text.",
  },
  {
    run: "17",
    title: "Arcade Antihero / Hallway Poster",
    source: "public/assets/generated/ad-video/source-frames/120-arcade-action-replay-antihero-hallway.png",
    upload: "17_ArcadeAntihero_HallwayPoster.png",
    prompt: "RUN17_ArcadeAntihero_HallwayPoster_ManualPrompt.txt",
    section: "Arcade / Montage",
    shotClass: "CLASS 03 - SECURITY CAMERA / FOUND FOOTAGE",
    characterId: "AR_BLACK_RED_ANTIHERO",
    sceneRole:
      "Arcade hallway character texture, useful as a quick montage insert or transition before the crowd scenes.",
    action:
      "Animate the exact still into a restrained 4-second archival arcade insert. Treat the character as part of the environment, not the center of an action scene.",
    motion:
      "Use mostly locked framing, cabinet flicker, blue neon pulse, tiny subject stillness, and compression crawl. No dramatic walk, turn, or action beat.",
    preserve:
      "Preserve the first-frame hallway composition, character silhouette, cabinet/poster density, blue lighting, and found-footage mood. Do not add new logos, new characters, new readable signage, or redesign the subject.",
  },
  {
    run: "18",
    title: "Arcade Cabinet Side / Dense World Texture",
    source: "public/assets/generated/ad-video/source-frames/140-arcade-action-replay-cabinet-side.png",
    upload: "18_ArcadeCabinetSide_DenseTexture.png",
    prompt: "RUN18_ArcadeCabinetSide_DenseTexture_ManualPrompt.txt",
    section: "Arcade / Montage",
    shotClass: "CLASS 03 - SECURITY CAMERA / FOUND FOOTAGE",
    sceneRole:
      "Dense arcade cabinet texture for montage layering and visual worldbuilding.",
    action:
      "Animate the exact still into a restrained 4-second cabinet-side found-footage insert.",
    motion:
      "Keep camera nearly static. Let cabinet screens flicker, neon edges breathe, reflections shimmer, and codec artifacts crawl. No camera travel through the arcade.",
    preserve:
      "Preserve the first-frame cabinet placement, poster/sticker density, blue/purple lighting, aisle geometry, and gritty arcade atmosphere. Do not add new labels, real-world brand names, people, or UI overlays.",
  },
  {
    run: "19",
    title: "Skater Rooftop / Project-Brand Promo",
    source: "public/assets/generated/ad-video/source-frames/96-skater-rooftop-action-replay-suit-your-game.png",
    upload: "19_SkaterRooftop_ProjectBrandPromo.png",
    prompt: "RUN19_SkaterRooftop_ProjectBrandPromo_ManualPrompt.txt",
    section: "Skater Drawing",
    shotClass: "CLASS 02 - PROMOTIONAL HERO SHOT",
    characterId: "AR_RED_CAP_SKATER",
    sceneRole:
      "Skater rooftop promo beat: youthful, handmade, slightly funny, but still emotionally real.",
    action:
      "Animate the exact still into a restrained 4-second rooftop hero beat. Keep the skater grounded and casual.",
    motion:
      "Use a slow handheld push under 4% frame-scale change, rooftop air movement, slight clothing movement, screen/light flicker, and tiny posture weight. No trick, no jump, no pose change.",
    preserve:
      "Preserve the first-frame skater proportions, red cap, outfit color blocking, rooftop composition, project-brand graphic placement, and handmade youth-culture tone. Do not redesign the skater or rewrite visible text.",
  },
  {
    run: "20",
    title: "Skater Sketch / Blue Handheld Rooftop",
    source: "public/assets/generated/ad-video/source-frames/104-skater-rooftop-sketch-blue-ds.png",
    upload: "20_SkaterSketch_BlueHandheldRooftop.png",
    prompt: "RUN20_SkaterSketch_BlueHandheldRooftop_ManualPrompt.txt",
    section: "Skater Drawing",
    shotClass: "CLASS 01 - OBSERVATIONAL HANDHELD",
    characterId: "AR_RED_CAP_SKATER",
    sceneRole:
      "Rooftop sketching shot that supports the line about the kid drawing sticker concepts and broken cartridges.",
    action:
      "Animate the exact still into a restrained 4-second handheld sketching moment. It should feel like a friend filming from nearby.",
    motion:
      "Use tiny hand/pencil movement if already implied, page flutter, handheld drift, screen glow pulse, rooftop wind, and gentle focus breathing. Keep drawing text and symbols stable.",
    preserve:
      "Preserve the first-frame skater position, red cap, notebook/sketch placement, blue handheld device, rooftop city background, and warm handmade tone. Do not add new drawings, change wardrobe, or invent UI text.",
  },
  {
    run: "21",
    title: "Skater Code Notebook / Close Detail",
    source: "public/assets/generated/ad-video/source-frames/109-skater-action-replay-codes-notebook.png",
    upload: "21_SkaterCodeNotebook_CloseDetail.png",
    prompt: "RUN21_SkaterCodeNotebook_CloseDetail_ManualPrompt.txt",
    section: "Skater Drawing",
    shotClass: "CLASS 05 - PRODUCT / OBJECT DETAIL",
    sceneRole:
      "Notebook/code detail for the handmade culture section and final montage inserts.",
    action:
      "Animate the exact still into a restrained 4-second tactile notebook close-up.",
    motion:
      "Use micro focus breathing, small pencil or fingertip movement only if already present, paper texture movement, desk-shadow shift, and faint screen glow. Keep all visible writing stable.",
    preserve:
      "Preserve the first-frame notebook layout, code symbols, hand relationship, desk clutter, blue/red light, and personal archive feeling. Do not rewrite, sharpen, invent, or morph text.",
  },
  {
    run: "22",
    title: "Project Code Notebook V2 / Overhead Insert",
    source: "public/assets/generated/ad-video/source-frames/123-skater-action-replay-v2-code-notebook.png",
    upload: "22_ProjectCodeNotebookV2_OverheadInsert.png",
    prompt: "RUN22_ProjectCodeNotebookV2_OverheadInsert_ManualPrompt.txt",
    section: "Skater Drawing / Boot Motif",
    shotClass: "CLASS 05 - PRODUCT / OBJECT DETAIL",
    sceneRole:
      "Overhead notebook insert for repeating the version-2.0, code, and save-file motifs without relying on new UI generation.",
    action:
      "Animate the exact still into a restrained 4-second overhead paper insert.",
    motion:
      "Use subtle paper flutter, small hand stillness, focus breathing, light flicker, and compression crawl. Typography must remain stable; do not make the page write itself.",
    preserve:
      "Preserve the first-frame page position, code diagram layout, hand/desk context, existing project-brand marks, and intimate sketchbook mood. Do not add new symbols, new props, or new page content.",
  },
  {
    run: "23",
    title: "Psychic Import Shop / Magazine Rack",
    source: "public/assets/generated/ad-video/source-frames/90-psychic-creature-magazine-rack-action-replay.png",
    upload: "23_PsychicImportShop_MagazineRack.png",
    prompt: "RUN23_PsychicImportShop_MagazineRack_ManualPrompt.txt",
    section: "Import Shop / Psychic Entity",
    shotClass: "CLASS 02 - PROMOTIONAL HERO SHOT",
    characterId: "AR_PSYCHIC_SIGNAL_ENTITY",
    sceneRole:
      "Import shop cutaway where the pale psychic signal entity casually browses magazines and nobody treats it as strange.",
    action:
      "Animate the exact still into a restrained 4-second shop-world hero beat. The entity should stay calm and accepted by the environment.",
    motion:
      "Use a tiny push-in, magazine page micro-shift, fluorescent flicker, screen glow, and slight body stillness. No speech, no magical effect, no dramatic facial expression.",
    preserve:
      "Preserve the first-frame entity silhouette, magazine position, shop shelf density, blue/red lighting, calm posture, and casual acceptance tone. Do not redesign the entity, add powers, rewrite magazine text, or add new customers.",
  },
  {
    run: "24",
    title: "Psychic Rain Billboard / Brand Myth",
    source: "public/assets/generated/ad-video/source-frames/116-psychic-billboard-rain-ultimate-cheat-system.png",
    upload: "24_PsychicRainBillboard_BrandMyth.png",
    prompt: "RUN24_PsychicRainBillboard_BrandMyth_ManualPrompt.txt",
    section: "City / Psychic Myth",
    shotClass: "CLASS 02 - PROMOTIONAL HERO SHOT",
    characterId: "AR_PSYCHIC_SIGNAL_ENTITY",
    sceneRole:
      "Rainy billboard mythology shot tying the psychic figure to the project-brand world without turning it into a fantasy scene.",
    action:
      "Animate the exact still into a restrained 4-second rainy promotional hero shot.",
    motion:
      "Use a slow grounded push, rain shimmer, billboard glow breathing, puddle reflections, tiny atmospheric haze, and still character presence. No powers, no action pose, no new title animation.",
    preserve:
      "Preserve the first-frame billboard placement, figure silhouette, wet street reflections, blue/red glow, poster scale, and mythic-but-believable tone. Keep existing project-world text stable and do not invent new typography.",
  },
  {
    run: "25",
    title: "Handheld Cartridge In Hand / Product Action",
    source: "public/assets/generated/ad-video/source-frames/143-action-replay-ds-cartridge-in-hand.png",
    upload: "25_HandheldCartridgeInHand_ProductAction.png",
    prompt: "RUN25_HandheldCartridgeInHand_ProductAction_ManualPrompt.txt",
    section: "Hardware / Final Montage",
    shotClass: "CLASS 05 - PRODUCT / OBJECT DETAIL",
    sceneRole:
      "Tactile handheld-device cartridge shot for the shop sequence and final rapid montage.",
    action:
      "Animate the exact still into a restrained 4-second product-action insert. The hand and cartridge should feel physical and cautious.",
    motion:
      "Use tiny fingertip adjustment, slight cartridge edge movement only if stable, focus breathing, plastic glint, screen glow, and arcade reflections. Do not complete a new insertion animation if it was not already implied.",
    preserve:
      "Preserve the first-frame hand placement, cartridge position, dual-screen handheld device, background arcade glow, object scale, and tactile plastic/paper texture. Do not add labels, rewrite text, or deform fingers.",
  },
  {
    run: "26",
    title: "Shop Wall / Browser Overlay",
    source: "public/assets/generated/ad-video/source-frames/145-gamecube-shop-browser-wall.png",
    upload: "26_ShopWall_BrowserOverlay.png",
    prompt: "RUN26_ShopWall_BrowserOverlay_ManualPrompt.txt",
    section: "Import Shop / Final Gathering",
    shotClass: "CLASS 03 - SECURITY CAMERA / FOUND FOOTAGE",
    sceneRole:
      "Shop-wall and old-browser overlay texture for the import-shop section and final montage.",
    action:
      "Animate the exact still into a restrained 4-second shop surveillance insert.",
    motion:
      "Use nearly locked framing, shelf-light flicker, old-screen glow breathing, compression shimmer, and tiny ambient movement. No camera push, no new overlay animation.",
    preserve:
      "Preserve the first-frame shop wall, shelf density, browser/menu overlay placement if present, blue/red lighting, and archival retail atmosphere. Do not add new customers, new logos, new UI labels, or new readable text.",
  },
];

function makePrompt(shot) {
  const identityLock = shot.characterId
    ? `\nIDENTITY LOCK:\nPreserve ${shot.characterId} exactly as shown in the uploaded first frame: silhouette, proportions, color blocking, wardrobe/materials, pose, emotional read, and physical weight. Do not redesign, hybridize, age-change, restyle, substitute, exaggerate, or add franchise-specific traits. Motion may add only source-consistent weight shift, fabric/material response, reflection movement, focus breathing, and restrained camera behavior.\n`
    : "";

  return `${intro}

SHOT CLASS:
${shot.shotClass}

CLASS BEHAVIOR:
${footerByClass[shot.shotClass]}
${identityLock}
SCENE ROLE:
${shot.sceneRole}

ACTION:
${shot.action}

MOTION:
${shot.motion}

PRESERVE:
${shot.preserve}

STYLE:
${universalStyle}

NEGATIVE:
${universalNegative}`;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

ensureDir(uploadDir);
ensureDir(promptDir);
ensureDir(path.dirname(queueFile));

for (const shot of shots) {
  const src = path.join(root, shot.source);
  const dest = path.join(uploadDir, shot.upload);
  if (!fs.existsSync(src)) {
    throw new Error(`Missing source: ${src}`);
  }
  fs.copyFileSync(src, dest);
  fs.writeFileSync(path.join(promptDir, shot.prompt), makePrompt(shot));
}

const queueRows = shots
  .map((shot) => {
    const uploadPath = path.join(uploadDir, shot.upload);
    const promptPath = path.join(promptDir, shot.prompt);
    return `| ${shot.run} | ${shot.section} | ${shot.title} | \`${uploadPath}\` | \`${promptPath}\` | ${shot.shotClass} |`;
  })
  .join("\n");

const queue = `# Queue 02 - Extended Ad Buildout

Use this queue after Queue 01 starts producing passable motion language. Each row is one Seedance 2.0 prototype, not a batch instruction.

Default settings for every row: \`Video\`, \`Seedance 2.0\`, \`4:3\`, \`720p\`, \`4s\`, \`std\`, \`Audio Off\`, one generation only.

Upload role for every row: \`First frame\`, \`Start frame\`, or \`Keyframe\`. If Higgsfield exposes an image token, place it at the top of the prompt. If the image is only attached as a loose inspiration/reference image, do not generate.

If a character/logo is owned or licensed, use the normal rights confirmation path. If a source gets blocked, log FT-21/FT-22/FT-23 and do not retry with disguised wording.

| Run | Script Section | Clip Role | Upload Image | Prompt | Shot Class |
| --- | --- | --- | --- | --- | --- |
${queueRows}

## Suggested Use

Prioritize 01-06 for boot and hardware inserts, then 15-18 for arcade texture, then 19-22 for skater handmade culture. Character-heavy runs should wait until the rights/first-frame workflow is stable.
`;

fs.writeFileSync(queueFile, queue);

const packHeader = `# Queue 02 Extended Ad Buildout - Manual Higgsfield Prompt Pack

Use each prompt with the matching upload frame in render-queues/QUEUE_02_ExtendedAdBuildout.md. Attach the image as First frame / Start frame / Keyframe. Do not generate from loose reference-only mode.
`;

const packBlocks = shots
  .map((shot) => {
    const promptPath = path.join(promptDir, shot.prompt);
    return `## RUN ${shot.run} - ${shot.title}

\`\`\`text
${fs.readFileSync(promptPath, "utf8")}
\`\`\``;
  })
  .join("\n\n---\n\n");

fs.writeFileSync(packFile, `${packHeader}\n${packBlocks}\n`);

console.log(`Wrote ${shots.length} Queue 02 prompts`);
console.log(queueFile);
console.log(packFile);
