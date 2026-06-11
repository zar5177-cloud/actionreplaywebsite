import { NextResponse } from "next/server";
import { cheatCodes, normalizeCode } from "@/data/config/cheat-codes";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { code?: string };
  const code = typeof body.code === "string" ? normalizeCode(body.code) : "";
  const match = cheatCodes.find((item) => item.code === code);

  if (!match) {
    return NextResponse.json(
      {
        ok: false,
        code,
        message: "code rejected. no matching event flag.",
      },
      { status: 404 },
    );
  }

  return NextResponse.json({
    ok: true,
    code: match.code,
    label: match.label,
    message: match.message,
    href: match.href,
    discountCode: match.discountCode,
    unlockedFileId: match.unlockedFileId,
    unlockType: match.unlockType,
  });
}
