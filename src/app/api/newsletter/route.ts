import { NextResponse } from "next/server";
import { sendNewsletterDiscountEmail } from "@/lib/newsletter-email";
import {
  newsletterDiscountCode,
  subscribeEmailToShopifyMarketing,
} from "@/lib/shopify-newsletter";

export const dynamic = "force-dynamic";

type NewsletterPayload = {
  attribution?: Record<string, string>;
  current_page?: string;
  email?: string;
  method?: string;
  placement?: string;
  source?: string;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as NewsletterPayload;
  const email = clean(body.email).toLowerCase();

  if (!isEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid email address." },
      { status: 400 },
    );
  }

  try {
    const result = await subscribeEmailToShopifyMarketing(email);
    const code = newsletterDiscountCode();
    const emailDelivery = await sendNewsletterDiscountEmail({
      code,
      email,
      method: clean(body.method) || "popup",
      placement: clean(body.placement) || "newsletter_popup",
    });

    return NextResponse.json({
      ok: true,
      duplicate: result.duplicate,
      code,
      emailDelivery,
      emailSent: emailDelivery.sent,
      message: "Your code is active. Use it at checkout.",
      provider: result.provider,
    });
  } catch {
    return NextResponse.json(
      {
        ok: false,
        error:
          "Something went wrong. Try again or email us at support@shopactionreplay.com",
      },
      { status: 502 },
    );
  }
}
