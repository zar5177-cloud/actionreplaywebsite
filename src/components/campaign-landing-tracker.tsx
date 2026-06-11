"use client";

import { useEffect } from "react";
import { trackEvent } from "@/lib/analytics/events";

export function CampaignLandingTracker({
  campaign,
  slug,
}: {
  campaign: string;
  slug: string;
}) {
  useEffect(() => {
    trackEvent({ name: "campaign_landing_view", campaign, slug });
  }, [campaign, slug]);

  return null;
}
