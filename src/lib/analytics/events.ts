import { getStoredAttribution } from "./utm";

export type AnalyticsEvent =
  | { name: "page_view"; page_path: string; page_title?: string }
  | {
      name: "view_item";
      product_id: string;
      product_title: string;
      variant_id?: string;
    }
  | {
      name: "add_to_cart";
      product_id: string;
      variant_id: string;
      value?: number;
    }
  | { name: "begin_checkout"; cart_value?: number }
  | { name: "email_signup"; source: string; placement: string }
  | { name: "archive_unlock_click"; file_id: string; location: string }
  | { name: "hidden_code_attempt"; code: string; success: boolean }
  | { name: "product_image_click"; product_id: string; image_index: number }
  | { name: "size_guide_open"; product_id: string }
  | { name: "outbound_instagram_click"; location: string }
  | { name: "copy_share_link"; location: string; share_url?: string }
  | { name: "survey_answer"; question_id: string; answer: string; page: string }
  | { name: "campaign_landing_view"; slug: string; campaign: string };

export function analyticsConsentDenied() {
  if (typeof window === "undefined") return false;

  return window.localStorage.getItem("ar_analytics_consent") === "denied";
}

export function eventPayload(event: AnalyticsEvent) {
  const attribution = getStoredAttribution();

  return {
    ...event,
    ar_first_touch: attribution.firstTouch,
    ar_last_touch: attribution.lastTouch,
    ar_anonymous_id: attribution.anonymousId,
  };
}

export function trackEvent(event: AnalyticsEvent) {
  if (typeof window === "undefined" || analyticsConsentDenied()) return;

  const payload = eventPayload(event);

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: event.name,
    ...payload,
  });

  if (window.gtag) {
    window.gtag("event", event.name, payload);
  }

  if (window.posthog) {
    window.posthog.capture(event.name, payload);
  }
}
