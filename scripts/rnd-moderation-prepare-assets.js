#!/usr/bin/env node
/* eslint-disable @typescript-eslint/no-require-imports */

const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const repoRoot = path.resolve(__dirname, "..");
const labRoot = path.join(repoRoot, "action-replay-higgsfield/rnd/moderation-tests");
const generatedRoot = path.join(labRoot, "assets/generated");
const fixtureRoot = path.join(generatedRoot, "fixtures");
const variantRoot = path.join(generatedRoot, "variants");
const manifestPath = path.join(generatedRoot, "manifest.json");

function usage() {
  console.log(`Usage:
  node scripts/rnd-moderation-prepare-assets.js fixtures
  node scripts/rnd-moderation-prepare-assets.js variants [image ...]
  node scripts/rnd-moderation-prepare-assets.js all

Creates disposable moderation-test fixtures and local variants under:
  ${path.relative(repoRoot, generatedRoot)}
`);
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: "utf8",
    stdio: options.capture ? ["ignore", "pipe", "pipe"] : "inherit",
  });

  if (result.status !== 0) {
    const stderr = result.stderr ? `\n${result.stderr}` : "";
    throw new Error(`${command} ${args.join(" ")} failed${stderr}`);
  }

  return result.stdout || "";
}

function magick(args, options) {
  return run("magick", args, options);
}

function svgFile(name, body) {
  ensureDir(fixtureRoot);
  const svgPath = path.join(fixtureRoot, `${name}.svg`);
  fs.writeFileSync(svgPath, body);
  return svgPath;
}

function svgShell(inner) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="720" viewBox="0 0 1280 720">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#050711"/>
      <stop offset="52%" stop-color="#10174a"/>
      <stop offset="100%" stop-color="#19081e"/>
    </linearGradient>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7"/>
      <feColorMatrix type="saturate" values="0"/>
      <feComponentTransfer>
        <feFuncA type="table" tableValues="0 0.12"/>
      </feComponentTransfer>
    </filter>
    <filter id="glow">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <rect width="1280" height="720" fill="url(#bg)"/>
  <rect width="1280" height="720" filter="url(#grain)" opacity="0.22"/>
  ${inner}
</svg>`;
}

function createFixture(name, svg) {
  const svgPath = svgFile(name, svg);
  const pngPath = path.join(fixtureRoot, `${name}.png`);
  run("sips", ["-s", "format", "png", svgPath, "--out", pngPath], { capture: true });
  const strippedPath = path.join(fixtureRoot, `${name}.strip.png`);
  magick([pngPath, "-strip", strippedPath]);
  fs.renameSync(strippedPath, pngPath);
  fs.rmSync(svgPath);
  return pngPath;
}

function createFixtures() {
  ensureDir(fixtureRoot);

  const fixtures = [
    createFixture(
      "synthetic-ui-logo-control",
      svgShell(`
        <rect x="110" y="82" width="1060" height="550" rx="22" fill="#071022" stroke="#43e7ff" stroke-width="3"/>
        <rect x="140" y="116" width="1000" height="72" fill="#0c1531" stroke="#f4ff33" stroke-width="2"/>
        <text x="168" y="164" fill="#f4ff33" font-family="Courier New, monospace" font-size="38" font-weight="700">ARX REPLAY LAB</text>
        <text x="920" y="162" fill="#ff4ed8" font-family="Courier New, monospace" font-size="24">BUILD 07</text>
        <g font-family="Courier New, monospace" font-size="28" fill="#d7f7ff">
          <rect x="170" y="236" width="390" height="62" fill="#152654" stroke="#6ef3ff"/>
          <text x="195" y="276">LOAD SLOT 07</text>
          <rect x="170" y="320" width="390" height="62" fill="#152654" stroke="#6ef3ff"/>
          <text x="195" y="360">UNLOCK ARCHIVE</text>
          <rect x="170" y="404" width="390" height="62" fill="#152654" stroke="#6ef3ff"/>
          <text x="195" y="444">PATCH MEMORY</text>
        </g>
        <rect x="655" y="230" width="380" height="250" fill="#060a16" stroke="#ff4ed8" stroke-width="3"/>
        <g stroke="#43e7ff" stroke-width="2" opacity="0.75">
          <path d="M685 275 H1005"/>
          <path d="M685 325 H1005"/>
          <path d="M685 375 H1005"/>
          <path d="M685 425 H1005"/>
        </g>
        <text x="684" y="522" fill="#f4ff33" font-family="Courier New, monospace" font-size="24">ERROR CODE 05 // TEST OCR</text>
        <g fill="#fff">
          <rect x="178" y="540" width="8" height="70"/>
          <rect x="194" y="540" width="4" height="70"/>
          <rect x="206" y="540" width="12" height="70"/>
          <rect x="232" y="540" width="6" height="70"/>
          <rect x="249" y="540" width="18" height="70"/>
          <rect x="278" y="540" width="4" height="70"/>
          <rect x="292" y="540" width="10" height="70"/>
          <rect x="320" y="540" width="14" height="70"/>
        </g>
      `),
    ),
    createFixture(
      "synthetic-silhouette-face-control",
      svgShell(`
        <rect x="0" y="500" width="1280" height="220" fill="#07070c"/>
        <path d="M0 468 C220 390 340 430 520 380 C740 315 810 410 1010 350 C1130 315 1200 330 1280 300 L1280 720 L0 720 Z" fill="#101b31"/>
        <circle cx="650" cy="274" r="86" fill="#11151f" stroke="#43e7ff" stroke-width="3"/>
        <rect x="590" y="250" width="120" height="26" rx="13" fill="#f4ff33" opacity="0.9"/>
        <path d="M565 378 C565 316 735 316 735 378 L778 646 L522 646 Z" fill="#151722" stroke="#ff4ed8" stroke-width="4"/>
        <path d="M578 405 C502 438 478 504 450 610" fill="none" stroke="#151722" stroke-width="46" stroke-linecap="round"/>
        <path d="M722 405 C804 436 832 512 850 626" fill="none" stroke="#151722" stroke-width="46" stroke-linecap="round"/>
        <text x="480" y="685" fill="#d7f7ff" font-family="Courier New, monospace" font-size="24">ORIGINAL SIGNAL COURIER TEST</text>
      `),
    ),
    createFixture(
      "synthetic-hardware-label-control",
      svgShell(`
        <g transform="translate(210 90) rotate(-6 430 270)">
          <rect x="0" y="0" width="860" height="540" rx="36" fill="#09162a" stroke="#43e7ff" stroke-width="5"/>
          <rect x="52" y="56" width="756" height="132" rx="18" fill="#1d2b62" stroke="#f4ff33" stroke-width="3"/>
          <text x="86" y="138" fill="#f4ff33" font-family="Courier New, monospace" font-size="50" font-weight="700">A/R LAB DEVICE</text>
          <rect x="74" y="238" width="350" height="192" fill="#060a16" stroke="#ff4ed8" stroke-width="3"/>
          <g fill="#d7f7ff" font-family="Courier New, monospace" font-size="26">
            <text x="456" y="272">MODEL: TEST-00</text>
            <text x="456" y="316">MODE: SAFE FIXTURE</text>
            <text x="456" y="360">OCR: VISIBLE</text>
            <text x="456" y="404">LOGO: FICTIONAL</text>
          </g>
          <circle cx="695" cy="462" r="38" fill="#ff4ed8"/>
          <circle cx="594" cy="462" r="38" fill="#43e7ff"/>
        </g>
      `),
    ),
    createFixture(
      "synthetic-poster-storefront-control",
      svgShell(`
        <rect x="90" y="96" width="1100" height="516" fill="#0a0d16" stroke="#d7f7ff" stroke-width="4"/>
        <rect x="130" y="130" width="1020" height="110" fill="#121e46" stroke="#f4ff33" stroke-width="3"/>
        <text x="176" y="202" fill="#f4ff33" font-family="Courier New, monospace" font-size="56" font-weight="700">REPLAY SUPPLY</text>
        <g transform="translate(150 286)">
          <rect width="190" height="250" fill="#ff4ed8"/>
          <text x="26" y="86" fill="#060a16" font-family="Courier New, monospace" font-size="30" font-weight="700">LOAD</text>
          <text x="26" y="128" fill="#060a16" font-family="Courier New, monospace" font-size="30" font-weight="700">NEW</text>
          <text x="26" y="170" fill="#060a16" font-family="Courier New, monospace" font-size="30" font-weight="700">RULES</text>
        </g>
        <g transform="translate(382 286)">
          <rect width="190" height="250" fill="#43e7ff"/>
          <circle cx="96" cy="108" r="52" fill="#060a16"/>
          <text x="35" y="198" fill="#060a16" font-family="Courier New, monospace" font-size="26" font-weight="700">SIGNAL</text>
        </g>
        <g transform="translate(614 286)">
          <rect width="190" height="250" fill="#f4ff33"/>
          <path d="M42 176 L96 60 L148 176 Z" fill="#060a16"/>
          <text x="30" y="218" fill="#060a16" font-family="Courier New, monospace" font-size="25" font-weight="700">ARCHIVE</text>
        </g>
        <g transform="translate(846 286)">
          <rect width="190" height="250" fill="#d7f7ff"/>
          <g fill="#060a16">
            <rect x="35" y="44" width="16" height="148"/>
            <rect x="63" y="44" width="8" height="148"/>
            <rect x="85" y="44" width="22" height="148"/>
            <rect x="122" y="44" width="12" height="148"/>
            <rect x="150" y="44" width="8" height="148"/>
          </g>
          <text x="32" y="224" fill="#060a16" font-family="Courier New, monospace" font-size="22" font-weight="700">BARCODE</text>
        </g>
      `),
    ),
  ];

  return fixtures;
}

function imageDimensions(input) {
  const out = magick(["identify", "-format", "%w %h", input], { capture: true }).trim();
  const [width, height] = out.split(/\s+/).map(Number);
  if (!width || !height) throw new Error(`Could not read dimensions for ${input}`);
  return { width, height };
}

function variantName(input) {
  return path.basename(input).replace(/\.[^.]+$/, "");
}

function outputPath(baseName, slug) {
  return path.join(variantRoot, baseName, `${slug}.jpg`);
}

function cropArgs(input, output, geometry, resize) {
  return [input, "-crop", geometry, "+repage", "-resize", `${resize.width}x${resize.height}!`, "-strip", "-quality", "88", output];
}

function makeVariantsFor(input) {
  const absoluteInput = path.resolve(input);
  if (!fs.existsSync(absoluteInput)) {
    throw new Error(`Missing input image: ${absoluteInput}`);
  }

  const baseName = variantName(absoluteInput);
  const outDir = path.join(variantRoot, baseName);
  ensureDir(outDir);

  const size = imageDimensions(absoluteInput);
  const w = size.width;
  const h = size.height;
  const centerW = Math.round(w * 0.8);
  const centerH = Math.round(h * 0.8);
  const centerX = Math.round((w - centerW) / 2);
  const centerY = Math.round((h - centerH) / 2);
  const topH = Math.round(h * 0.72);
  const lowerY = Math.round(h * 0.18);
  const lowerH = h - lowerY;
  const partialW = Math.round(w * 0.55);
  const partialH = Math.round(h * 0.7);
  const partialX = Math.round(w * 0.2);
  const partialY = Math.round(h * 0.15);
  const topBlurH = Math.round(h * 0.18);
  const bottomBlurH = Math.round(h * 0.27);
  const bottomBlurY = h - bottomBlurH;

  const variants = [
    {
      slug: "00-original-copy",
      args: [absoluteInput, "-strip", "-quality", "92", outputPath(baseName, "00-original-copy")],
    },
    {
      slug: "01-center-crop-80",
      args: cropArgs(absoluteInput, outputPath(baseName, "01-center-crop-80"), `${centerW}x${centerH}+${centerX}+${centerY}`, size),
    },
    {
      slug: "02-no-lower-ui-crop",
      args: cropArgs(absoluteInput, outputPath(baseName, "02-no-lower-ui-crop"), `${w}x${topH}+0+0`, size),
    },
    {
      slug: "03-no-header-crop",
      args: cropArgs(absoluteInput, outputPath(baseName, "03-no-header-crop"), `${w}x${lowerH}+0+${lowerY}`, size),
    },
    {
      slug: "04-partial-frame-crop",
      args: cropArgs(absoluteInput, outputPath(baseName, "04-partial-frame-crop"), `${partialW}x${partialH}+${partialX}+${partialY}`, size),
    },
    {
      slug: "05-subtle-blur-all",
      args: [absoluteInput, "-blur", "0x1.2", "-strip", "-quality", "88", outputPath(baseName, "05-subtle-blur-all")],
    },
    {
      slug: "06-ocr-zone-blur",
      args: [
        absoluteInput,
        "-region",
        `${w}x${topBlurH}+0+0`,
        "-blur",
        "0x8",
        "-region",
        `${w}x${bottomBlurH}+0+${bottomBlurY}`,
        "-blur",
        "0x8",
        "+region",
        "-strip",
        "-quality",
        "88",
        outputPath(baseName, "06-ocr-zone-blur"),
      ],
    },
    {
      slug: "07-metadata-strip",
      args: [absoluteInput, "-strip", "-quality", "90", outputPath(baseName, "07-metadata-strip")],
    },
    {
      slug: "08-recapture-compression",
      args: [
        absoluteInput,
        "-resize",
        "88%",
        "-resize",
        `${w}x${h}!`,
        "-attenuate",
        "0.05",
        "+noise",
        "Gaussian",
        "-strip",
        "-quality",
        "52",
        outputPath(baseName, "08-recapture-compression"),
      ],
    },
    {
      slug: "09-lowres-blockout",
      args: [absoluteInput, "-resize", "35%", "-filter", "point", "-resize", `${w}x${h}!`, "-strip", "-quality", "70", outputPath(baseName, "09-lowres-blockout")],
    },
    {
      slug: "10-grayscale-low-detail",
      args: [absoluteInput, "-colorspace", "Gray", "-blur", "0x1", "-strip", "-quality", "76", outputPath(baseName, "10-grayscale-low-detail")],
    },
  ];

  const records = [];
  for (const variant of variants) {
    magick(variant.args);
    records.push({
      source: path.relative(repoRoot, absoluteInput),
      variant: variant.slug,
      file: path.relative(repoRoot, outputPath(baseName, variant.slug)),
      purpose: "RND moderation variable-isolation asset. Not production cleared.",
    });
  }

  return records;
}

function writeManifest(records) {
  ensureDir(generatedRoot);
  const existing = fs.existsSync(manifestPath)
    ? JSON.parse(fs.readFileSync(manifestPath, "utf8"))
    : { lastUpdated: null, fixtures: [], variants: [] };

  const manifest = {
    lastUpdated: new Date().toISOString(),
    rightsStatus: "Synthetic or transformed R&D scratch assets only. Not production assets.",
    fixtures: existing.fixtures || [],
    variants: records,
  };

  fs.writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
}

function defaultFixtureInputs() {
  if (!fs.existsSync(fixtureRoot)) createFixtures();
  return fs
    .readdirSync(fixtureRoot)
    .filter((file) => file.endsWith(".png"))
    .map((file) => path.join(fixtureRoot, file));
}

function main() {
  const [mode, ...inputs] = process.argv.slice(2);
  if (!mode || mode === "--help" || mode === "-h") {
    usage();
    return;
  }

  ensureDir(generatedRoot);

  if (mode === "fixtures") {
    const fixtures = createFixtures();
    fs.writeFileSync(
      manifestPath,
      `${JSON.stringify(
        {
          lastUpdated: new Date().toISOString(),
          rightsStatus: "Synthetic R&D scratch assets only. Not production assets.",
          fixtures: fixtures.map((file) => ({
            file: path.relative(repoRoot, file),
            category: "moderation-test-fixture",
            purpose: "Disposable variable-isolation control image.",
            rightsStatus: "Synthetic original test fixture.",
          })),
          variants: [],
        },
        null,
        2,
      )}\n`,
    );
    console.log(`Created ${fixtures.length} fixtures in ${path.relative(repoRoot, fixtureRoot)}`);
    return;
  }

  if (mode === "variants") {
    const sources = inputs.length > 0 ? inputs : defaultFixtureInputs();
    const records = sources.flatMap(makeVariantsFor);
    writeManifest(records);
    console.log(`Created ${records.length} variants in ${path.relative(repoRoot, variantRoot)}`);
    return;
  }

  if (mode === "all") {
    createFixtures();
    const records = defaultFixtureInputs().flatMap(makeVariantsFor);
    writeManifest(records);
    console.log(`Created fixtures and ${records.length} variants under ${path.relative(repoRoot, generatedRoot)}`);
    return;
  }

  usage();
  process.exitCode = 1;
}

try {
  main();
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
