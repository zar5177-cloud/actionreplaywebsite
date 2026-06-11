# Analytics Setup

Internal Action Replay HQ doc.

Meta Pixel is unavailable, so the site uses first-party and env-gated analytics:

- Microsoft Clarity for recordings, heatmaps, dead clicks, rage clicks, and scroll behavior.
- GA4/GTM for event history and source attribution when env vars exist.
- Optional PostHog for product analytics, feature flags, surveys, and replay backup.
- UTM persistence in localStorage for first touch and last touch.
- Replay Club signup forms that include attribution fields.

## Env Vars

```txt
CLARITY_PROJECT_ID=
GA4_MEASUREMENT_ID=
GTM_CONTAINER_ID=
POSTHOG_KEY=
POSTHOG_HOST=https://us.i.posthog.com
ENABLE_ANALYTICS_DEV=false
```

## Current Implementation

Runtime: `src/components/analytics/analytics-runtime.tsx`

Events: `src/lib/analytics/events.ts`

UTM storage: `src/lib/analytics/utm.ts`

Micro-conversions: `src/lib/analytics/microConversions.ts`

Scripts load only when configured and when production or `ENABLE_ANALYTICS_DEV=true`.

## Clarity Note

Install the official Microsoft Clarity Shopify app for best Shopify checkout coverage. The Next app snippet is useful for the custom storefront routes, but Shopify checkout coverage depends on Shopify pixel/app embed behavior.

## Nightly Review

Every night after a traffic spike:

- review recordings from `/`, `/shop/*`, `/archive`, `/codes`, `/replay-club`, `/go`, and `/r/*`;
- list top rage/dead click locations;
- note first-scroll dropoff;
- record whether viewers saw the buy button and Replay Club signup;
- convert the finding into one page or creative change.
