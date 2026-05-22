export const brandSlogans = [
  "don't cheat the player. cheat the game.",
  "washed cotton. chrome memory. wrong purple.",
  "made for people who kept the manual.",
  "worldwide shipping from the current capsule.",
] as const;

export const navItems = [
  { label: "Archive", href: "/archive", code: "FILE" },
  { label: "Hidden Event", href: "/hidden-event", code: "EVT" },
  { label: "Shop Drop", href: "/shop", code: "DROP" },
  { label: "Forum", href: "/forum", code: "BBS" },
] as const;

export const systemBootLines = [
  "AR_OS v2.6.01 initializing cartridge bridge...",
  "checking memory card slot A...",
  "loading recovered index from /public_html/archive",
  "checksum mismatch accepted",
  "hidden event listener armed",
  "shop drop state: locked_partial",
  "forum mirror mounted read-only",
  "enter code when prompted",
] as const;

export const technicalSideText = [
  "改造コード",
  "MEMORY_SLOT_A",
  "CRC: 0x00F5A1",
  "DS-LINK / PS2-BBS",
  "NO_HINTS",
] as const;
