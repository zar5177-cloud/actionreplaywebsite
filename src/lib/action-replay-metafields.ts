import schema from "@/lib/action-replay-metafields.json";

export const ACTION_REPLAY_METAFIELD_NAMESPACE = schema.namespace;
export const ACTION_REPLAY_METAFIELD_OWNER_TYPE = schema.ownerType;

export const ACTION_REPLAY_PRODUCT_METAFIELD_KEYS = [
  "file_id",
  "release_code",
  "archive_status",
  "classification",
  "system_note",
  "drop_window",
  "access_tier",
  "artifact_index",
] as const;

export type ActionReplayProductMetafieldKey =
  (typeof ACTION_REPLAY_PRODUCT_METAFIELD_KEYS)[number];

export type ActionReplayProductMetafields = Partial<
  Record<ActionReplayProductMetafieldKey, string>
>;

export type StorefrontActionReplayMetafield = {
  namespace: string;
  key: string;
  type: string;
  value: string;
};

export const actionReplayMetafieldDefinitions = schema.fields;

export function actionReplayStorefrontMetafieldIdentifiers() {
  return ACTION_REPLAY_PRODUCT_METAFIELD_KEYS.map(
    (key) =>
      `{ namespace: "${ACTION_REPLAY_METAFIELD_NAMESPACE}", key: "${key}" }`,
  ).join(",\n      ");
}

export function mapActionReplayMetafields(
  metafields: (StorefrontActionReplayMetafield | null)[] | null | undefined,
): ActionReplayProductMetafields {
  const values: ActionReplayProductMetafields = {};
  const allowedKeys = new Set<string>(ACTION_REPLAY_PRODUCT_METAFIELD_KEYS);

  for (const metafield of metafields ?? []) {
    if (
      !metafield ||
      metafield.namespace !== ACTION_REPLAY_METAFIELD_NAMESPACE ||
      !allowedKeys.has(metafield.key)
    ) {
      continue;
    }

    values[metafield.key as ActionReplayProductMetafieldKey] = metafield.value;
  }

  return values;
}
