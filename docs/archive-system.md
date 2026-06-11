# Archive System

Internal Action Replay HQ doc.

Primary route:

```txt
/archive
/archive/[fileId]
```

Data:

```txt
src/data/config/archive-files.ts
```

Fields include:

- file ID,
- title,
- status,
- access tier,
- classification,
- release date,
- product handle,
- corruption level,
- system note,
- recovery notes,
- tags.

## Locked Files

Locked files open a Replay Club clearance form. The form sends:

- email,
- source,
- placement,
- current page,
- favorite platform,
- style preference,
- first-touch attribution,
- last-touch attribution.

## Tracking

Archive grid/file clicks fire `archive_unlock_click`.

Code attempts fire `hidden_code_attempt`.
