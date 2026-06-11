# Event Map

Internal Action Replay HQ doc.

Typed event source: `src/lib/analytics/events.ts`

## Core Events

- `page_view`
- `view_item`
- `add_to_cart`
- `begin_checkout`
- `email_signup`
- `newsletter_signup`
- `archive_unlock_click`
- `hidden_code_attempt`
- `product_image_click`
- `size_guide_open`
- `outbound_instagram_click`
- `copy_share_link`
- `survey_answer`
- `campaign_landing_view`

Every event automatically receives:

- first-touch UTM snapshot,
- last-touch UTM snapshot,
- anonymous first-party visitor ID.

## Current Tracked Interactions

- Root page views via analytics runtime.
- Product page view via `ProductDetailActions`.
- Product add-to-cart via `ProductDetailActions`.
- Product card quick-add.
- Product gallery and card image taps.
- Mobile sticky add-to-cart via `ProductDetailActions`.
- Size guide open.
- Checkout click from extraction queue.
- Replay Club signup.
- Newsletter popup and footer signup.
- Archive grid/file click.
- Code success/failure attempt.
- Campaign landing view.
- UTM builder copy-link event.
- Native/copy share link event.
- One-question survey answer.

## Survey Storage

Survey answers are captured three ways:

- `survey_answer` analytics event.
- Browser `localStorage` key `ar_signal_survey_responses`.
- Optional server JSONL append when `SURVEY_WRITE_MODE=file`.
- Optional server log when `SURVEY_WRITE_MODE=log`.

Default server mode is event/local only. This is intentional until there is a
durable database or PostHog survey sink.

## QA

Use browser devtools:

```js
window.dataLayer
```

When GA4 is configured, use GA4 DebugView. When PostHog is configured, verify capture under the visitor timeline.
