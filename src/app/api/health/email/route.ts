import { NextResponse } from "next/server";
import { newsletterEmailHealth } from "@/lib/newsletter-email";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(newsletterEmailHealth(), {
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
