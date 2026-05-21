const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const ts = require("typescript");

const repoRoot = path.resolve(__dirname, "..");
const outputRoot = path.join(
  repoRoot,
  "action-replay-higgsfield/prompts/seedance2-master-prompts",
);
const promptRoot = path.join(outputRoot, "all-frames");
const sourceRoot = path.join(repoRoot, "public/assets/generated/ad-video/source-frames");
const analysisPath = path.join(
  repoRoot,
  "action-replay-higgsfield/prompts/AR_FinalMix_NewImageAnalysis_82-146.md",
);

const moduleCache = new Map();

const ipSanitizationReplacements = [
  [/\bPlayStation\b/gi, "early-2000s console"],
  [/\bPSP\b/g, "early-2000s handheld interface"],
  [/\bPS1\b/g, "late-90s console"],
  [/\bPS2\b/g, "sixth-generation console"],
  [/\bPS3\b/g, "mid-2000s console"],
  [/\bSony\b/gi, "consumer-electronics"],
  [/\bNintendo Power\b/gi, "import gaming magazine"],
  [/\bNintendo\b/gi, "classic console-company"],
  [/\bGameCube\b/gi, "sixth-generation console"],
  [/\bPok[eé]mon Colosseum\b/gi, "desert-arena creature game"],
  [/\bPok[eé]mon\b/gi, "creature-collector game"],
  [/\bMewtwo\b/gi, "pale psychic signal creature"],
  [/\bPikachu\b/gi, "electric mascot creature"],
  [/\bUmbreon\b/gi, "shadow companion"],
  [/\bShadow-like Sonic\b/gi, "black-red original antihero mascot"],
  [/\bShadow-like\b/gi, "black-red antihero"],
  [/\bSonic\b/gi, "mascot-racer"],
  [/\bZelda\b/gi, "fantasy-adventure magazine"],
  [/\bEarthbound\b/gi, "quirky RPG-inspired"],
  [/\bNess\b/gi, "striped-shirt skater icon"],
  [/\bF-Zero\b/gi, "futuristic racing magazine"],
  [/\bFourside\b/gi, "fictional mall district"],
  [/\bXbox\b/gi, "console platform"],
  [/\bSega Rally\b/gi, "arcade rally cabinet"],
  [/\bSega\b/gi, "arcade publisher-style"],
  [/\bDreamcast\b/gi, "late-90s disc-console"],
  [/\bWii\b/gi, "motion-console"],
  [/\bDS\b/g, "dual-screen handheld"],
  [/\bDatel\b/gi, "cheat-device manufacturer"],
  [/\bNamco\b/gi, "arcade-brand signage"],
  [/\bNissan\b/gi, "tuner-car"],
  [/\bSupra\b/gi, "silver tuner car"],
  [/\bCoca-Cola\b/gi, "red soda brand"],
  [/\bCoke\b/gi, "red soda brand"],
  [/\bKirin\b/gi, "drink-vending brand"],
  [/\bDDR\b/g, "rhythm-dance cabinet"],
  [/\bColosseum\b/g, "desert arena"],
  [/\bWes\b/g, "visor courier"],
];

function sanitizeGenerationText(text) {
  let sanitized = String(text || "");
  for (const [pattern, replacement] of ipSanitizationReplacements) {
    sanitized = sanitized.replace(pattern, replacement);
  }
  return sanitized
    .replace(/\/Users\/zrelich\/Desktop\/actionreplaywebsite\/public\/assets\/generated\/ad-video\/source-frames\/[^\s]+/g, "attached approved source frame")
    .replace(/\b[a-z0-9-]*(?:ps2|psp|gamecube|nintendo|pokemon|mewtwo|zelda|earthbound|sonic|sega|namco|nissan|datel)[a-z0-9-]*\.(png|jpg|jpeg|webp)\b/gi, "approved source frame");
}

function loadTsModule(filePath) {
  const resolved = path.resolve(filePath);
  if (moduleCache.has(resolved)) return moduleCache.get(resolved).exports;

  const source = fs.readFileSync(resolved, "utf8");
  const transpiled = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2022,
      esModuleInterop: true,
    },
  }).outputText;

  const module = { exports: {} };
  moduleCache.set(resolved, module);

  const dirname = path.dirname(resolved);
  const localRequire = (request) => {
    if (request.startsWith(".")) {
      const candidate = path.resolve(dirname, request);
      const tsPath = fs.existsSync(`${candidate}.ts`) ? `${candidate}.ts` : candidate;
      return loadTsModule(tsPath);
    }
    return require(request);
  };

  vm.runInNewContext(transpiled, {
    require: localRequire,
    module,
    exports: module.exports,
    __dirname: dirname,
    __filename: resolved,
    console,
  });

  return module.exports;
}

function parseNewFrameAnalysis() {
  if (!fs.existsSync(analysisPath)) return new Map();
  const text = fs.readFileSync(analysisPath, "utf8");
  const map = new Map();

  for (const line of text.split(/\r?\n/)) {
    if (!line.startsWith("| ")) continue;
    const cells = line
      .split("|")
      .slice(1, -1)
      .map((cell) => cell.trim());

    if (cells.length < 7 || !/^\d+$/.test(cells[0])) continue;

    const imageNumber = Number(cells[0]);
    map.set(imageNumber, {
      filename: cells[1].replaceAll("`", ""),
      shotClass: normalizeClass(cells[2]),
      role: cells[3],
      motionGuidance: cells[4],
      riskNotes: cells[5],
      status: cells[6],
    });
  }

  return map;
}

const classNames = {
  "01": "CLASS 01 - OBSERVATIONAL HANDHELD",
  "02": "CLASS 02 - PROMOTIONAL HERO SHOT",
  "03": "CLASS 03 - SECURITY CAMERA / FOUND FOOTAGE",
  "04": "CLASS 04 - DREAMLIKE MEMORY SHOT",
  "05": "CLASS 05 - PRODUCT / OBJECT DETAIL",
};

const classBehaviors = {
  "CLASS 01 - OBSERVATIONAL HANDHELD":
    "Feels accidentally captured and documentary-real, with restrained handheld sway, slight framing correction, imperfect subject centering, and subtle focus inconsistency.",
  "CLASS 02 - PROMOTIONAL HERO SHOT":
    "Feels like a rare 2000s game-accessory commercial hero frame, with controlled composition, a restrained slow push, and environmental atmosphere over spectacle.",
  "CLASS 03 - SECURITY CAMERA / FOUND FOOTAGE":
    "Feels archival and surveillance-like, with static or minimally moving framing, imperfect exposure, compression-heavy behavior, and alternate-timeline authenticity.",
  "CLASS 04 - DREAMLIKE MEMORY SHOT":
    "Feels emotionally nostalgic and melancholic, with slower motion, heavier bloom, environmental drift, soft focus transitions, and restrained surrealism.",
  "CLASS 05 - PRODUCT / OBJECT DETAIL":
    "Feels physically believable and tactile, with close-up framing, realistic material response, tiny hand or prop movement, focus breathing, and visible wear.",
};

function normalizeClass(raw) {
  const match = String(raw).match(/Class\s*0?([1-5])/i);
  return match ? classNames[`0${match[1]}`] : undefined;
}

function inferClass(asset) {
  const filename = asset.filename.toLowerCase();
  const family = asset.sceneFamily;

  if (asset.duplicateOf) return "CLASS 03 - SECURITY CAMERA / FOUND FOOTAGE";
  if (filename.includes("closeup") || filename.includes("macro") || filename.includes("cartridge") || filename.includes("sticker") || filename.includes("notebook") || filename.includes("code-sheet") || filename.includes("codebook")) {
    return "CLASS 05 - PRODUCT / OBJECT DETAIL";
  }
  if (filename.includes("crt") || filename.includes("browser") || filename.includes("menu") || family === "action-replay-menu" || family === "arcade-interior") {
    return "CLASS 03 - SECURITY CAMERA / FOUND FOOTAGE";
  }
  if (family.includes("rooftop") || family.includes("tokyo") || family.includes("city") || family === "creature-companion-city" || family === "psychic-creature-game-room") {
    return "CLASS 04 - DREAMLIKE MEMORY SHOT";
  }
  if (family.includes("retail") || family.includes("billboard") || family.includes("print-ad") || family.includes("garage") || family === "visor-courier") {
    return "CLASS 02 - PROMOTIONAL HERO SHOT";
  }
  if (family.includes("mall") || family.includes("shop-human")) {
    return "CLASS 01 - OBSERVATIONAL HANDHELD";
  }
  return "CLASS 01 - OBSERVATIONAL HANDHELD";
}

function sceneIntent(asset, analysis) {
  if (analysis?.role) return analysis.role;
  return asset.usage || asset.visualRead || asset.promptSummary;
}

function ensureSentence(text) {
  const trimmed = String(text || "").trim();
  if (!trimmed) return "Subtle restrained motion only.";
  return /[.!?]$/.test(trimmed) ? trimmed : `${trimmed}.`;
}

function classMotionBudget(shotClass) {
  if (shotClass.includes("SECURITY")) {
    return "Use a locked-off or nearly locked-off frame with 0-1% mechanical jitter, light exposure pulsing, codec shimmer, screen flicker, timestamp/UI instability only if already implied by the frame, and minimal subject movement. The camera should feel mounted, forgotten, or captured from a store/security feed, never operated for spectacle.";
  }
  if (shotClass.includes("OBSERVATIONAL")) {
    return "Use 1-3% handheld sway, one or two tiny operator corrections, natural breath-scale body movement, small cloth settling, subtle focus inconsistency, and environmental background life. The subject may shift weight or adjust hands slightly, but the shot should still feel caught in passing.";
  }
  if (shotClass.includes("PROMOTIONAL")) {
    return "Use a controlled slow push-in or restrained low-angle hold, under roughly 5% frame-scale change over the whole clip. Add only one or two atmospheric motions: light bloom breathing, signage flicker, rain haze, smoke drift, sleeve movement, or reflective shimmer. Keep the hero read stable.";
  }
  if (shotClass.includes("DREAMLIKE")) {
    return "Use slow memory-like drift, soft focus breathing, bloom expansion, rain/steam/window reflection movement, and gentle environmental parallax. The pace should feel melancholic and late-night, with no surreal morphing, no fast camera move, and no literal fantasy transformation.";
  }
  if (shotClass.includes("PRODUCT")) {
    return "Use macro-scale tactile motion only: a tiny push, focus rack, hand/fingertip micro-adjustment, screen scanline roll, paper flutter, cable movement, plastic glint, dust, scratches, and material response. Do not expand the scene or turn the object into a product-demo animation.";
  }
  return "Use restrained physical movement only, with one camera behavior and one environmental behavior. Preserve the source frame as the anchor.";
}

function motionFor(asset, analysis, shotClass) {
  const base = ensureSentence(analysis?.motionGuidance || asset.motionPrompt || "Subtle restrained motion only.");
  let motion = base
    .replace(/\bcrane\b/gi, "very slow handheld rise")
    .replace(/\borbit\b/gi, "restrained handheld edge pass")
    .replace(/\bslider\b/gi, "subtle handheld lateral drift")
    .replace(/\bdolly\b/gi, "slow handheld push")
    .replace(/\bfast\b/gi, "restrained")
    .replace(/\baggressive\b/gi, "restrained");

  if (shotClass.includes("SECURITY")) {
    motion = `${motion} Keep the frame mostly static or minimally moving, with surveillance-like compression, exposure imperfections, and no performative camera move.`;
  } else if (shotClass.includes("OBSERVATIONAL")) {
    motion = `${motion} Let the operator feel present through tiny framing corrections and natural handheld sway, as if the moment was caught rather than staged.`;
  } else if (shotClass.includes("PROMOTIONAL")) {
    motion = `${motion} Keep the composition controlled and commercial, but restrained, with atmosphere doing more work than camera movement.`;
  } else if (shotClass.includes("DREAMLIKE")) {
    motion = `${motion} Keep the pace slower, melancholic, and memory-like; use bloom, environmental drift, and soft focus behavior without surreal excess.`;
  } else if (shotClass.includes("PRODUCT")) {
    motion = `${motion} Prioritize tactile materials, focus breathing, hand/prop micro-movement, dust, scratches, plastic, paper, and realistic specular response.`;
  }

  return motion;
}

function statusFor(asset, analysis) {
  if (asset.duplicateOf) return "HOLD - duplicate source; use only if explicitly selected for provenance.";
  if (analysis?.status) return analysis.status.toUpperCase();
  if (asset.priority === "primary") return "STRONG";
  if (asset.priority === "alternate") return "HOLD / ALTERNATE";
  return "SUPPORT";
}

function riskFor(asset, analysis) {
  return analysis?.riskNotes || asset.rightsNotes || "Treat as reference-only until final rights clearance.";
}

function promptFor(asset, analysis) {
  const shotClass = analysis?.shotClass || inferClass(asset);
  const behavior = classBehaviors[shotClass];
  const status = statusFor(asset, analysis);
  const risk = riskFor(asset, analysis);
  const intent = sceneIntent(asset, analysis);
  const motion = motionFor(asset, analysis, shotClass);
  const cleanSubject = asset.promptSummary.replace(/\.$/, "");

  const prompt = `MODEL:
Seedance 2.0 in Higgsfield, image-to-video from the supplied approved source frame only.

SOURCE INPUT:
Use the attached approved source frame only. Do not infer content from local filenames or external platform names.

FRAME ID:
AR_${String(asset.imageNumber).padStart(3, "0")}

SOURCE FRAME:
Approved numbered source frame ${String(asset.imageNumber).padStart(3, "0")}

APPROVAL / USE STATUS:
${status}. This prompt is prepared for the approved source-frame workflow, but generation still requires explicit owner approval, a cost estimate, and prototype/production quality confirmation.

SEEDANCE SETTINGS:
Prototype default: aspect_ratio 4:3, duration 4 seconds, mode std, resolution 720p, genre auto.
Production pass only after prototype approval: keep 4:3, preserve this same prompt structure, upgrade duration or resolution only if explicitly approved.

SHOT CLASS:
${shotClass}

CLASS BEHAVIOR:
${behavior}

MOTION BUDGET:
${classMotionBudget(shotClass)}

SHOT INTENT:
${intent}

SUBJECT / SOURCE READ:
${cleanSubject}. Preserve the exact source-frame composition, silhouette hierarchy, subject placement, props, lighting direction, palette, and emotional read.

HIGGSFIELD EXECUTION NOTES:
Use Higgsfield Seedance 2.0 as image-to-video from the source image above. Attach exactly this approved source frame as the input media/reference. Treat this as a single-shot cinematography pass, not a multi-shot ad system. Keep aspect_ratio 4:3 and do not auto-crop to widescreen or vertical. Use duration 4 seconds, mode std, resolution 720p, genre auto for the prototype unless the owner explicitly approves a production upgrade. Do not add dialogue, music, or generated audio unless explicitly requested. If Higgsfield exposes seed, job id, input media id, or returned settings, record them in the generation log.

POST-GENERATION QC / LOGGING:
After generation, log the output as PASS or REJECT in the local generation ledger. If rejected, assign one or more failure tags from the failure-tag taxonomy, write a one-sentence diagnosis, and mark the issue category as one or more of: motion, lighting, continuity, anatomy, environment, camera, pacing, texture, platform. Approved clips use failure tags: none.

ACTION:
Animate this exact still into a restrained 4-second captured-footage moment. The shot should feel like a rare forgotten gaming-fashion promo discovered on a hard drive in 2007, not a newly rendered AI commercial.

MOTION DIRECTION:
${motion}

CAMERA LANGUAGE:
Handheld but restrained, slight operator imperfection, grounded physical framing, tiny focus breathing, no floating AI camera behavior, no aggressive digital stabilization. Camera movement must match ${shotClass}; do not mix shot classes.

TEMPORAL FEEL:
Movement should imply weight and inertia. Characters, hands, clothes, props, signs, screens, rain, dust, cables, and reflections should move with real-world delay and friction. Avoid hyper-responsive animation timing.

IMAGE CHARACTERISTICS:
Soft CRT/video bloom, slight QuickTime/VHS compression feel, subtle chromatic aberration, controlled grain, imperfect low-light handling, authentic highlight rolloff, mild sensor noise, restrained shadows, no ultra-clean HDR sharpness.

ENVIRONMENT / WORLD RULES:
Technology must feel like an alternate 2003-2008 timeline: cheat devices, early-2000s handheld menu logic, sixth-generation console accessory displays, kiosk demos, CRT/early-LCD UI, old game-shop graphics, mall/arcade/storefront culture, and physically lived-in rooms or streets. Environments should feel touched, worn, dusty, wet, stickered, handled, and real.

TEXT / UI HANDLING:
Preserve existing approved Action Replay universe text only when it is already readable in the source frame. Keep UI overlays planar, screen-locked, and era-correct, with mild CRT/LCD flicker and compression crawl. Do not invent new slogans, menu labels, fake Japanese text, unreadable logo blobs, or modern app-style overlays. Any cheat-code symbols should behave like old cartridge menus, memory-card browsers, dual-screen handheld overlays, code lists, sticker sheets, or magazine callouts from 2003-2008.

WARDROBE / PRODUCT / MATERIAL HANDLING:
Preserve clothing fit, fabric weight, sleeve behavior, stitching, decals, product edges, cartridge bevels, glossy plastic, worn paper, sticker adhesive, screen glass, chrome glare, dust, scratches, fingerprints, and compression-softened details. Clothing and props should move like real physical objects with weight. Do not smooth them into clean luxury-fashion surfaces or glossy AI product renders.

BRAND / RIGHTS SAFETY:
${risk}
Treat any recognizable third-party character, console, game, car, store, soda, magazine, or platform mark in the source as composition reference only. Do not introduce new protected marks. Do not sharpen, invent, or add readable real-world logos. If text appears, keep it as Action Replay universe text, abstract cheat-code glyphs, or already-approved source-frame wording.

STYLE DNA:
Action Replay high-quality vintage 2000s console-and-handheld-era nostalgic gaming streetwear ad; alternate-timeline 2004-2008 gaming fashion universe; authentic early-2000s Japanese gaming commercial mood; underground skate video bonus-footage energy; cool blue/red techno palette with occasional green/white console UI accents; glossy plastic, paper, fabric, sticker, screen, rain, chrome, and vinyl-toy-like tactile materials; cool but slightly melancholic; late-night; emotionally nostalgic; restrained confidence instead of loud hype.

CONTINUITY:
Footage captured, not rendered. Preserve behavioral accuracy: how the camera breathes, how compression fails, how old low-light footage rolls highlights, how early-2000s game-accessory marketing frames subjects, how real clothing and hands move, how CRTs and handheld screens flicker, and how edits would breathe in a rare 2007 promo file.

NEGATIVE:
No model comparisons, no creative variations, no widescreen expansion, no new B-roll, no new characters, no new third-party logos, no readable real brand names, no malformed anatomy, no broken hands, no warped faces, no synthetic AI facial movement, no text morphing, no UI text drift, no overactive HUD, no excessive cyberpunk clutter, no generic AI gloss, no modern TikTok pacing, no esports trailer, no Marvel/VFX lighting, no Fortnite look, no over-rendered Unreal Engine realism, no fake anamorphic cinema, no fast drone move, no music-video spin shot, no exaggerated parallax, no showroom lighting, no ultra-sharp HDR, no random extra props.

FINAL APPROVAL TEST:
Approve only if the clip looks like a rare forgotten gaming-fashion promo discovered on a hard drive in 2007. Reject if it feels like a generic AI commercial, modern luxury fashion ad, esports edit, or cinematic VFX trailer.
`;

  return sanitizeGenerationText(prompt);
}

function safeSlug(filename) {
  return filename.replace(/\.[a-z0-9]+$/i, "");
}

function writePromptPack() {
  const { adVideoAssets } = loadTsModule(path.join(repoRoot, "src/lib/ad-video-assets.ts"));
  const analysis = parseNewFrameAnalysis();

  fs.rmSync(promptRoot, { recursive: true, force: true });
  fs.mkdirSync(promptRoot, { recursive: true });

  const sortedAssets = [...adVideoAssets].sort((a, b) => a.imageNumber - b.imageNumber);
  const indexRows = [];

  for (const asset of sortedAssets) {
    const perFrameAnalysis = analysis.get(asset.imageNumber);
    const shotClass = perFrameAnalysis?.shotClass || inferClass(asset);
    const prompt = promptFor(asset, perFrameAnalysis);
    const filename = `AR_${String(asset.imageNumber).padStart(3, "0")}_${safeSlug(asset.filename)}_Seedance2_MasterPrompt.txt`;
    const outPath = path.join(promptRoot, filename);
    fs.writeFileSync(outPath, prompt);
    indexRows.push({
      number: asset.imageNumber,
      source: asset.filename,
      prompt: `all-frames/${filename}`,
      className: shotClass,
      status: statusFor(asset, perFrameAnalysis),
      risk: riskFor(asset, perFrameAnalysis),
    });
  }

  const index = `# Action Replay Seedance 2.0 Master Prompt Pack

Last updated: 2026-05-11

This pack contains one prompt-only text file for every source frame in:

\`/Users/zrelich/Desktop/actionreplaywebsite/public/assets/generated/ad-video/source-frames/\`

## Model / Workflow

- Model: \`seedance_2_0\`
- Prototype settings: \`4:3\`, \`4s\`, \`std\`, \`720p\`, \`genre auto\`
- Generation is not automatic. Run a cost estimate first, then generate only after explicit owner approval.
- Every prompt declares one shot class and inherits the continuity bible.
- Every prompt is designed for image-to-video from the supplied approved source frame only.
- Production upgrades should preserve prompt structure and 4:3 framing; change duration/resolution only after prototype approval.

## Official / Live Checks Used

- [Official Higgsfield Seedance 2.0 page](https://higgsfield.ai/seedance/2.0): image references, frame-level control, consistent characters/branding, multimodal input, and clips up to 15 seconds.
- [Official Higgsfield CLI page](https://higgsfield.ai/cli): CLI install and terminal generation workflow.
- Local authenticated CLI schema for \`seedance_2_0\`: \`aspect_ratio\`, \`duration\`, \`genre\`, \`medias\`, \`mode\`, \`prompt\`, and \`resolution\` options.

## IP Sanitization

- Runnable prompt files in \`all-frames/\` are sanitized for Higgsfield.
- Do not paste local filenames, source paths, or explicit protected platform/company/character names into \`generate cost\` or \`generate create\`.
- Internal index rows preserve source filenames for local provenance only.
- Sanitization rules live at \`../AR_FinalMix_IPSanitization.md\`.

## Rejection / QC Rules

- Failure tag definitions: \`../AR_FinalMix_FailureTags.md\`
- Every actual generation entry must include \`PASS\` or \`REJECT\`.
- Rejected clips must include one or more \`FT-*\` tags, one-sentence diagnosis, and issue category/categories.
- Valid issue categories: \`motion\`, \`lighting\`, \`continuity\`, \`anatomy\`, \`environment\`, \`camera\`, \`pacing\`, \`texture\`, \`platform\`.

## Higgsfield CLI Pattern

\`\`\`sh
/Users/zrelich/.local/bin/higgsfield generate cost seedance_2_0 \\
  --prompt "$(cat /ABS/PATH/TO/PROMPT.txt)" \\
  --image /ABS/PATH/TO/SOURCE_FRAME.png \\
  --aspect_ratio 4:3 \\
  --duration 4 \\
  --mode std \\
  --resolution 720p \\
  --genre auto \\
  --no-color
\`\`\`

## Current Best-Practice Notes

- Keep the source image dominant. The prompt tells Seedance what motion to add, not what scene to reinvent.
- Use one shot class per clip. Camera movement outside the class is a reject.
- Use one restrained camera move and one or two ambient motions.
- Preserve behavioral accuracy over maximum detail.
- Keep every clip to one prompt, one approved source image, one shot class, one camera behavior, and one short prototype before production.
- Do not generate alternate prompts, model comparisons, widescreen versions, B-roll, or creative variations automatically.
- Hold/high-risk frames may still have prompts, but should not be generated for commercial final use until rights-safe replacements are approved.

## Prompt Index

| # | Source Frame | Prompt File | Shot Class | Status | Rights / Style Risk |
| --- | --- | --- | --- | --- | --- |
${indexRows
  .map(
    (row) =>
      `| ${row.number} | \`${row.source}\` | [prompt](${row.prompt}) | ${row.className} | ${row.status} | ${row.risk.replaceAll("|", "/")} |`,
  )
  .join("\n")}
`;

  fs.writeFileSync(path.join(outputRoot, "AR_AllFrames_Seedance2_MasterPrompt_Index.md"), index);
}

writePromptPack();
