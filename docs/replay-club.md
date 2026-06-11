# Replay Club

Internal Action Replay HQ doc.

Replay Club is the owned audience layer. Do not call it a newsletter.

Copy:

```txt
JOIN REPLAY CLUB
hidden codes, early files, private drops.
```

Components:

```txt
src/components/replay-club-signup.tsx
src/components/newsletter-signup-form.tsx
src/components/newsletter-popup.tsx
```

APIs:

```txt
src/app/api/replay-club/route.ts
src/app/api/newsletter/route.ts
```

## Shopify

All capture surfaces sync to Shopify first through Storefront
`customerCreate` with `acceptsMarketing: true`.

Duplicate or disabled customer responses are treated as success so the site
does not reveal whether an email is already registered.

Newsletter popup behavior:

- opens after 8-12 seconds or 40% scroll,
- shows once per session,
- dismiss suppression lasts 7 days,
- submitted visitors are suppressed longer,
- hidden on checkout and `/order-confirmed`.

## Klaviyo

If `KLAVIYO_PRIVATE_API_KEY` and `KLAVIYO_LIST_ID` exist, the Replay Club API route attempts server-side Klaviyo list subscription after Shopify capture.

If they do not exist, Shopify capture still works, the form stores a local signup marker, tracks `email_signup` or `newsletter_signup`, and shows the first code.

Install the native Klaviyo Shopify integration/app embed for best onsite tracking and flow behavior.

## Segmentation Fields

- favorite platform: DS, PS2, Xbox 360, Wii, PSP, GameCube.
- style preference: tee, poster, stickers, hoodie, baby tee, archive only.

Use these later for drop-specific flows.
