import { NextRequest, NextResponse } from "next/server";
import { cheatCodes, normalizeCode } from "@/data/config/cheat-codes";

const allowedSources = new Set([
  "console",
  "secret-page",
  "qr",
  "caption",
  "story",
]);

export async function POST(request: NextRequest) {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, error: "invalid_json" },
      { status: 400 },
    );
  }

  if (!payload || typeof payload !== "object") {
    return NextResponse.json(
      { ok: false, error: "invalid_payload" },
      { status: 400 },
    );
  }

  const record = payload as Record<string, unknown>;
  const code = typeof record.code === "string" ? normalizeCode(record.code) : "";
  const source = typeof record.source === "string" ? record.source : "";
  const path = typeof record.path === "string" ? record.path.slice(0, 200) : "";
  const occurredAt =
    typeof record.occurredAt === "string"
      ? record.occurredAt
      : new Date().toISOString();

  const knownCode = cheatCodes.some((cheatCode) => cheatCode.code === code);

  if (!knownCode || !allowedSources.has(source)) {
    return NextResponse.json(
      { ok: false, error: "unknown_unlock_event" },
      { status: 422 },
    );
  }

  const event = {
    code,
    source,
    path,
    occurredAt,
    acceptedAt: new Date().toISOString(),
  };

  console.info("[unlock-event]", event);

  return NextResponse.json({
    ok: true,
    mode: "stub",
    event,
  });
}
