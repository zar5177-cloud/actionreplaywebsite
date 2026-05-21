<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## ActionReplay.io Project Rules

This project is a greenfield Next.js + Tailwind storefront/mock-commerce site for `actionreplay.io`.

### Brand Direction

- Build in a dense Y2K cyber-streetwear language: chrome wordmarks, black/blue/purple foundations, lime/pink alert accents, DS-era cheat-code UI, sticker sheets, barcode modules, scanlines, grunge texture, hardware props, and poster-like layouts.
- The site should feel like a usable shop/drop experience first, not a marketing landing page. Keep cart, filters, selectors, countdowns, waitlist, and navigation functional even when checkout is mocked.
- Use short, sharp brand copy around replaying, unlocking, overriding, loading, cheat codes, archives, drops, and worldwide street culture.

### Asset Workflow

- For every generated or extracted visual asset, attach the closest reference image and request one specific asset, not a vague style transfer.
- Use these asset categories consistently: `hero-poster`, `shop-banner`, `sticker-cutout`, `product-mockup`, `texture-overlay`, `logo-treatment`, `character-original`, `ui-badge`, and `drop-card`.
- Save final project-bound bitmap assets under `public/assets/generated/`.
- Update `src/lib/assets-manifest.ts` whenever adding an asset. Include filename, category, usage, source reference, prompt summary, alt text, and rights status.
- Brand-owned Action Replay pieces may preserve layout role, logo treatment, colors, crop, product silhouette, and material feel.
- Recognizable third-party characters/logos should be replaced with original Action Replay universe characters unless licensed source files are provided. Preserve the composition function, pose energy, palette, and mood rather than the protected identity.

### Commerce V2

- Live commerce is Shopify-backed. Cart creation and checkout handoff must go through server-side API routes or server components.
- Never call Shopify Admin or Storefront APIs directly from client components. Do not expose Shopify tokens through `NEXT_PUBLIC_*`.
- Use `SHOPIFY_PRIVATE_STOREFRONT_ACCESS_TOKEN` with the `Shopify-Storefront-Private-Token` header for Storefront API calls.
- The live Galaxy Tee product handle is `enzyme-washed-t-shirt`; `action-replay-mewtwo-tee` is a hidden duplicate and must not become a sellable product path.
- Galaxy Tee cart line items must use the `SHOPIFY_GALAXY_TEE_VARIANT_*` environment variables, not hardcoded variant IDs.
