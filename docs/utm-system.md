# UTM System

Internal Action Replay HQ doc.

Every public traffic link should use UTM parameters. No more naked story links.

Builder:

```txt
/admin/utm-builder
```

Campaign registry:

```txt
src/data/campaigns.ts
```

## LocalStorage Keys

First touch:

- `ar_first_touch_source`
- `ar_first_touch_medium`
- `ar_first_touch_campaign`
- `ar_first_touch_content`
- `ar_first_touch_term`
- `ar_first_touch_landing_page`
- `ar_first_touch_timestamp`

Last touch:

- `ar_last_touch_source`
- `ar_last_touch_medium`
- `ar_last_touch_campaign`
- `ar_last_touch_content`
- `ar_last_touch_term`
- `ar_last_touch_landing_page`
- `ar_last_touch_timestamp`

Visitor:

- `ar_anonymous_visitor_id`

## Shopify Cart Attributes

Add-to-cart requests attach stored attribution to the Shopify cart as cart
attributes. Keys are allowlisted and prefixed:

- `ar_anonymous_id`
- `ar_first_touch_source`
- `ar_first_touch_medium`
- `ar_first_touch_campaign`
- `ar_first_touch_content`
- `ar_first_touch_term`
- `ar_first_touch_landing_page`
- `ar_first_touch_timestamp`
- `ar_last_touch_source`
- `ar_last_touch_medium`
- `ar_last_touch_campaign`
- `ar_last_touch_content`
- `ar_last_touch_term`
- `ar_last_touch_landing_page`
- `ar_last_touch_timestamp`

This is not a Meta replacement. It is a receipt trail. The file says how the
visitor got here before Shopify takes them away.

## Rule

Every post gets:

- campaign,
- source,
- medium,
- content label,
- matching landing page where possible.

Example:

```txt
/r/galaxy?utm_source=instagram&utm_medium=story&utm_campaign=ar001_repush_2026_06&utm_content=direct_flash_bluewall_slide3
```
