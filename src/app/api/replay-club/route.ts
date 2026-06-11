import { NextResponse } from "next/server";

type ReplayClubPayload = {
  email?: string;
  phone?: string;
  source?: string;
  placement?: string;
  current_page?: string;
  favorite_platform?: string;
  style_preference?: string;
  attribution?: Record<string, string>;
};

function clean(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

async function subscribeToKlaviyo(payload: ReplayClubPayload) {
  const apiKey = process.env.KLAVIYO_PRIVATE_API_KEY;
  const listId = process.env.KLAVIYO_LIST_ID;

  if (!apiKey || !listId || !payload.email) {
    return { provider: "local_fallback", subscribed: false };
  }

  const response = await fetch(
    `https://a.klaviyo.com/api/v2/list/${encodeURIComponent(
      listId,
    )}/subscribe?api_key=${encodeURIComponent(apiKey)}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        profiles: [
          {
            email: payload.email,
            phone_number: payload.phone || undefined,
            $consent: ["email"],
            source: payload.source,
            placement: payload.placement,
            current_page: payload.current_page,
            favorite_platform: payload.favorite_platform,
            style_preference: payload.style_preference,
            ...(payload.attribution ?? {}),
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || "Klaviyo subscription failed.");
  }

  return { provider: "klaviyo", subscribed: true };
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as ReplayClubPayload;
  const email = clean(body.email).toLowerCase();

  if (!isEmail(email)) {
    return NextResponse.json(
      { ok: false, error: "Enter a valid email to request clearance." },
      { status: 400 },
    );
  }

  const payload = {
    ...body,
    email,
    phone: clean(body.phone),
    source: clean(body.source) || "site",
    placement: clean(body.placement) || "unknown",
    current_page: clean(body.current_page),
    favorite_platform: clean(body.favorite_platform),
    style_preference: clean(body.style_preference),
  };

  try {
    const provider = await subscribeToKlaviyo(payload);

    return NextResponse.json({
      ok: true,
      code: "REPLAY10",
      message: "ACCESS REQUEST RECEIVED.",
      ...provider,
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Replay Club access could not be stored.",
      },
      { status: 502 },
    );
  }
}
