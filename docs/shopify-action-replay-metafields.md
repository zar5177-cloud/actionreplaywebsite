# Action Replay Shopify Metafields

This is the product file schema for Shopify. It keeps Shopify as the source of truth for commerce while letting Action Replay products behave like catalog files, system artifacts, and old account objects.

Owner type: `PRODUCT`  
Namespace: `action_replay`  
Storefront access: `PUBLIC_READ`

Run a local plan:

```bash
npm run shopify:metafields:plan
```

Sync the definitions to Shopify:

```bash
npm run shopify:metafields:sync
```

The sync command needs `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_ADMIN_API_VERSION`. It will use `SHOPIFY_ADMIN_ACCESS_TOKEN` if present, otherwise it will use the existing `SHOPIFY_CLIENT_ID` and `SHOPIFY_CLIENT_SECRET` client-credentials flow. Admin credentials must be server/operator only. Never expose them through `NEXT_PUBLIC_*`.

## Fields

| Key | Admin name | Type | Expected value | AR-001 example |
| --- | --- | --- | --- | --- |
| `file_id` | Action Replay File ID | `single_line_text_field` | `AR-` plus 3 or 4 digits. Stable after launch. | `AR-001` |
| `release_code` | Action Replay Release Code | `single_line_text_field` | Uppercase code up to 32 chars using letters, numbers, `.`, `_`, or `-`. | `DROP-001` |
| `archive_status` | Action Replay Archive Status | `single_line_text_field` | One of `LIVE`, `ARCHIVED`, `LOCKED`, `HIDDEN`, `SOLD_OUT`, `SAMPLE`. | `LIVE` |
| `classification` | Action Replay Classification | `single_line_text_field` | One of `GARMENT_OBJECT`, `PRINT_FILE`, `ACCESSORY`, `DIGITAL_FILE`, `STICKER_PACK`, `SYSTEM_OBJECT`. | `GARMENT_OBJECT` |
| `system_note` | Action Replay System Note | `multi_line_text_field` | Short artifact note, max 500 chars. Keep it specific, like a terminal remembered the product wrong. | `first live file after the access gate. sleeve mark survived the bad export.` |
| `drop_window` | Action Replay Drop Window | `single_line_text_field` | `YYYY-MM`, `TBA`, or `CLOSED`. | `2026-05` |
| `access_tier` | Action Replay Access Tier | `single_line_text_field` | One of `PUBLIC`, `CLUB`, `CODE_ONLY`, `STAFF`, `ARCHIVE_ONLY`. | `PUBLIC` |
| `artifact_index` | Action Replay Artifact Index | `number_integer` | Whole number from `1` to `9999`. Used for file sorting. | `1` |

## AR-001 Starting Values

Use these for the Galaxy tee once the definitions exist:

```txt
file_id: AR-001
release_code: DROP-001
archive_status: LIVE
classification: GARMENT_OBJECT
system_note: first live file after the access gate. sleeve mark survived the bad export.
drop_window: 2026-05
access_tier: PUBLIC
artifact_index: 1
```

## Storefront Read

The storefront now requests these product metafields by identifier:

```graphql
metafields(identifiers: [
  { namespace: "action_replay", key: "file_id" },
  { namespace: "action_replay", key: "release_code" },
  { namespace: "action_replay", key: "archive_status" },
  { namespace: "action_replay", key: "classification" },
  { namespace: "action_replay", key: "system_note" },
  { namespace: "action_replay", key: "drop_window" },
  { namespace: "action_replay", key: "access_tier" },
  { namespace: "action_replay", key: "artifact_index" }
]) {
  namespace
  key
  type
  value
}
```

The current UI does not redesign product pages yet. These values are loaded into the product model as `actionReplay` so future catalog and product screens can render Action Replay files from Shopify without mixing fake local archive data into sellable listings.
