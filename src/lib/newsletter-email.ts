import { newsletterDiscountCode } from "./shopify-newsletter";

export type NewsletterEmailDelivery =
  | {
      configured: false;
      provider: "resend";
      sent: false;
      status: "not_configured";
    }
  | {
      configured: true;
      id?: string;
      provider: "resend";
      sent: true;
      status: "sent";
    }
  | {
      configured: true;
      error: string;
      provider: "resend";
      sent: false;
      status: "failed";
    };

type SendNewsletterEmailOptions = {
  code?: string;
  email: string;
  method?: string;
  placement?: string;
};

type ResendEmailResponse = {
  id?: string;
  message?: string;
  name?: string;
};

const RESEND_EMAILS_ENDPOINT = "https://api.resend.com/emails";

function cleanEnv(value: string | undefined) {
  return value?.trim() || "";
}

function siteUrl() {
  return (
    cleanEnv(process.env.NEXT_PUBLIC_SITE_URL) ||
    cleanEnv(process.env.SITE_URL) ||
    "https://shopactionreplay.com"
  ).replace(/\/$/, "");
}

function senderAddress() {
  return (
    cleanEnv(process.env.NEWSLETTER_EMAIL_FROM) ||
    "Action Replay <notify@shopactionreplay.com>"
  );
}

function supportEmail() {
  return (
    cleanEnv(process.env.NEWSLETTER_SUPPORT_EMAIL) ||
    "support@shopactionreplay.com"
  );
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function shopUrl() {
  return `${siteUrl()}/shop`;
}

function buildNewsletterEmailHtml(code: string) {
  const safeCode = escapeHtml(code);
  const safeSupport = escapeHtml(supportEmail());
  const safeShopUrl = escapeHtml(shopUrl());

  return `<!doctype html>
<html>
  <body style="margin:0;background:#05070d;color:#edf6ff;font-family:Arial,Helvetica,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#05070d;padding:28px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;border:1px solid #2a67c9;background:#081323;">
            <tr>
              <td style="padding:26px 24px 10px;font-family:monospace;color:#8fbfff;font-size:11px;letter-spacing:2px;text-transform:uppercase;">
                ACTION REPLAY / REPLAY CLUB / FILE RECEIVED
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 8px;">
                <h1 style="margin:0;color:#ffffff;font-size:32px;line-height:0.95;text-transform:uppercase;letter-spacing:-0.5px;">
                  ACCESS GRANTED
                </h1>
              </td>
            </tr>
            <tr>
              <td style="padding:4px 24px 18px;color:#cfe6ff;font-family:monospace;font-size:13px;line-height:1.7;">
                you entered the archive. this is the first code.
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 22px;">
                <div style="border:1px solid #8ec5ff;background:#dff3ff;color:#1247a5;font-family:monospace;font-size:28px;font-style:italic;font-weight:900;letter-spacing:5px;padding:18px 16px;text-align:center;">
                  ${safeCode}
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 24px 24px;">
                <a href="${safeShopUrl}" style="display:block;background:#2f7fff;color:#ffffff;font-family:monospace;font-size:13px;font-weight:900;letter-spacing:2px;padding:15px 18px;text-align:center;text-decoration:none;text-transform:uppercase;">
                  open shop file
                </a>
              </td>
            </tr>
            <tr>
              <td style="border-top:1px solid #173966;padding:18px 24px 24px;color:#8ea9c7;font-family:monospace;font-size:11px;line-height:1.7;">
                Your code is active. Use it at checkout.<br />
                If this file was not meant for you, contact ${safeSupport}.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

function buildNewsletterEmailText(code: string) {
  return [
    "ACTION REPLAY / REPLAY CLUB / FILE RECEIVED",
    "",
    "ACCESS GRANTED",
    "",
    "you entered the archive. this is the first code.",
    "",
    code,
    "",
    `Your code is active. Use it at checkout: ${shopUrl()}`,
    "",
    `Support: ${supportEmail()}`,
  ].join("\n");
}

function safeTagValue(value: string) {
  return value.replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 64) || "unknown";
}

export async function sendNewsletterDiscountEmail({
  code = newsletterDiscountCode(),
  email,
  method = "unknown",
  placement = "unknown",
}: SendNewsletterEmailOptions): Promise<NewsletterEmailDelivery> {
  const apiKey = cleanEnv(process.env.RESEND_API_KEY);

  if (!apiKey) {
    return {
      configured: false,
      provider: "resend",
      sent: false,
      status: "not_configured",
    };
  }

  let response: Response;
  try {
    response = await fetch(RESEND_EMAILS_ENDPOINT, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: senderAddress(),
        html: buildNewsletterEmailHtml(code),
        subject: `ACCESS GRANTED: ${code}`,
        tags: [
          { name: "source", value: "replay_club" },
          { name: "method", value: safeTagValue(method) },
          { name: "placement", value: safeTagValue(placement) },
        ],
        text: buildNewsletterEmailText(code),
        to: email,
      }),
      cache: "no-store",
    });
  } catch (error) {
    return {
      configured: true,
      error:
        error instanceof Error
          ? error.message
          : "Resend request failed before a response was returned.",
      provider: "resend",
      sent: false,
      status: "failed",
    };
  }
  const payload = (await response
    .json()
    .catch(() => ({}))) as ResendEmailResponse;

  if (!response.ok) {
    return {
      configured: true,
      error:
        payload.message ||
        payload.name ||
        `Resend request failed with HTTP ${response.status}.`,
      provider: "resend",
      sent: false,
      status: "failed",
    };
  }

  return {
    configured: true,
    id: payload.id,
    provider: "resend",
    sent: true,
    status: "sent",
  };
}
