# Replay Club

Internal Action Replay HQ doc.

Replay Club is the owned audience layer. Do not call it a newsletter.

Copy:

```txt
JOIN REPLAY CLUB
hidden codes, early files, private drops.
```

Component:

```txt
src/components/replay-club-signup.tsx
```

API:

```txt
src/app/api/replay-club/route.ts
```

## Klaviyo

If `KLAVIYO_PRIVATE_API_KEY` and `KLAVIYO_LIST_ID` exist, the API route attempts server-side Klaviyo list subscription.

If they do not exist, the form still works as a local fallback, stores a local signup marker, tracks `email_signup`, and shows the first code.

Install the native Klaviyo Shopify integration/app embed for best onsite tracking and flow behavior.

## Segmentation Fields

- favorite platform: DS, PS2, Xbox 360, Wii, PSP, GameCube.
- style preference: tee, poster, stickers, hoodie, baby tee, archive only.

Use these later for drop-specific flows.
