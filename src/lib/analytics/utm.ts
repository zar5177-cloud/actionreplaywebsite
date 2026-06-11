export type UtmSnapshot = {
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  landingPage?: string;
  timestamp?: string;
};

export type AttributionSnapshot = {
  firstTouch: UtmSnapshot;
  lastTouch: UtmSnapshot;
  anonymousId?: string;
};

const UTM_KEYS = ["source", "medium", "campaign", "content", "term"] as const;

const STORAGE_KEY_BY_FIELD = {
  firstTouch: {
    source: "ar_first_touch_source",
    medium: "ar_first_touch_medium",
    campaign: "ar_first_touch_campaign",
    content: "ar_first_touch_content",
    term: "ar_first_touch_term",
    landingPage: "ar_first_touch_landing_page",
    timestamp: "ar_first_touch_timestamp",
  },
  lastTouch: {
    source: "ar_last_touch_source",
    medium: "ar_last_touch_medium",
    campaign: "ar_last_touch_campaign",
    content: "ar_last_touch_content",
    term: "ar_last_touch_term",
    landingPage: "ar_last_touch_landing_page",
    timestamp: "ar_last_touch_timestamp",
  },
} as const;

export const ANONYMOUS_ID_KEY = "ar_anonymous_visitor_id";

function readStorage(key: string) {
  if (typeof window === "undefined") return undefined;

  return window.localStorage.getItem(key) ?? undefined;
}

function writeStorage(key: string, value?: string) {
  if (typeof window === "undefined" || !value) return;

  window.localStorage.setItem(key, value);
}

export function getAnonymousId() {
  if (typeof window === "undefined") return undefined;

  const existing = window.localStorage.getItem(ANONYMOUS_ID_KEY);
  if (existing) return existing;

  const next =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : `ar-${Date.now()}-${Math.random().toString(16).slice(2)}`;

  window.localStorage.setItem(ANONYMOUS_ID_KEY, next);
  return next;
}

export function getUtmFromSearch(search: string): UtmSnapshot {
  const params = new URLSearchParams(search);
  const snapshot: UtmSnapshot = {};

  for (const key of UTM_KEYS) {
    const value = params.get(`utm_${key}`);
    if (value) {
      snapshot[key] = value;
    }
  }

  return snapshot;
}

function hasUtm(snapshot: UtmSnapshot) {
  return UTM_KEYS.some((key) => Boolean(snapshot[key]));
}

function readSnapshot(touch: keyof typeof STORAGE_KEY_BY_FIELD): UtmSnapshot {
  const keys = STORAGE_KEY_BY_FIELD[touch];

  return {
    source: readStorage(keys.source),
    medium: readStorage(keys.medium),
    campaign: readStorage(keys.campaign),
    content: readStorage(keys.content),
    term: readStorage(keys.term),
    landingPage: readStorage(keys.landingPage),
    timestamp: readStorage(keys.timestamp),
  };
}

function writeSnapshot(touch: keyof typeof STORAGE_KEY_BY_FIELD, snapshot: UtmSnapshot) {
  const keys = STORAGE_KEY_BY_FIELD[touch];

  writeStorage(keys.source, snapshot.source);
  writeStorage(keys.medium, snapshot.medium);
  writeStorage(keys.campaign, snapshot.campaign);
  writeStorage(keys.content, snapshot.content);
  writeStorage(keys.term, snapshot.term);
  writeStorage(keys.landingPage, snapshot.landingPage);
  writeStorage(keys.timestamp, snapshot.timestamp);
}

export function persistUrlAttribution(url: URL) {
  const utm = getUtmFromSearch(url.search);
  if (!hasUtm(utm)) {
    return getStoredAttribution();
  }

  const snapshot = {
    ...utm,
    landingPage: `${url.pathname}${url.search}`,
    timestamp: new Date().toISOString(),
  };

  const firstTouch = readSnapshot("firstTouch");
  if (!hasUtm(firstTouch)) {
    writeSnapshot("firstTouch", snapshot);
  }

  writeSnapshot("lastTouch", snapshot);

  return getStoredAttribution();
}

export function getStoredAttribution(): AttributionSnapshot {
  return {
    firstTouch: readSnapshot("firstTouch"),
    lastTouch: readSnapshot("lastTouch"),
    anonymousId: getAnonymousId(),
  };
}

export function attributionToFormFields() {
  const attribution = getStoredAttribution();

  return {
    first_touch_source: attribution.firstTouch.source ?? "",
    first_touch_medium: attribution.firstTouch.medium ?? "",
    first_touch_campaign: attribution.firstTouch.campaign ?? "",
    first_touch_content: attribution.firstTouch.content ?? "",
    first_touch_term: attribution.firstTouch.term ?? "",
    first_touch_landing_page: attribution.firstTouch.landingPage ?? "",
    first_touch_timestamp: attribution.firstTouch.timestamp ?? "",
    last_touch_source: attribution.lastTouch.source ?? "",
    last_touch_medium: attribution.lastTouch.medium ?? "",
    last_touch_campaign: attribution.lastTouch.campaign ?? "",
    last_touch_content: attribution.lastTouch.content ?? "",
    last_touch_term: attribution.lastTouch.term ?? "",
    last_touch_landing_page: attribution.lastTouch.landingPage ?? "",
    last_touch_timestamp: attribution.lastTouch.timestamp ?? "",
    anonymous_id: attribution.anonymousId ?? "",
  };
}
