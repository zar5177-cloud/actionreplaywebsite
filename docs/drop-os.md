# Drop OS

Internal Action Replay HQ doc.

Public routes:

```txt
/drops
/drops/[id]
```

Data:

```txt
src/data/drops.ts
```

Every drop should connect:

- product links,
- campaign IDs,
- code IDs,
- archive file IDs,
- creative assets by filename/reference,
- status,
- checklist.

Drop status:

```txt
planning -> teasing -> live -> sold_out -> archived
```

Do not call a materially different release a restock. Name the scar.
