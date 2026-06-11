"use client";

import Script from "next/script";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { trackEvent } from "@/lib/analytics/events";
import { persistUrlAttribution } from "@/lib/analytics/utm";
import { posthogSnippet } from "@/lib/analytics/posthog";

type AnalyticsRuntimeProps = {
  clarityProjectId?: string;
  gaMeasurementId?: string;
  gtmContainerId?: string;
  posthogKey?: string;
  posthogHost?: string;
  enableAnalyticsDev?: boolean;
};

function claritySnippet(projectId: string) {
  return `
(function(c,l,a,r,i,t,y){
  c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
  t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
  y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
})(window, document, "clarity", "script", ${JSON.stringify(projectId)});
`;
}

function gaSnippet(measurementId: string) {
  return `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag("js", new Date());
gtag("config", ${JSON.stringify(measurementId)}, { send_page_view: false });
`;
}

function consentAllowsAnalytics() {
  if (typeof window === "undefined") return false;

  return window.localStorage.getItem("ar_analytics_consent") !== "denied";
}

export function AnalyticsRuntime({
  clarityProjectId,
  enableAnalyticsDev,
  gaMeasurementId,
  gtmContainerId,
  posthogHost = "https://us.i.posthog.com",
  posthogKey,
}: AnalyticsRuntimeProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [canLoad, setCanLoad] = useState(false);
  const envAllows = process.env.NODE_ENV === "production" || enableAnalyticsDev;
  const search = searchParams.toString();
  const currentPath = useMemo(
    () => `${pathname}${search ? `?${search}` : ""}`,
    [pathname, search],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setCanLoad(Boolean(envAllows && consentAllowsAnalytics()));
    }, 0);

    return () => window.clearTimeout(timeout);
  }, [envAllows]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    persistUrlAttribution(new URL(window.location.href));
    trackEvent({
      name: "page_view",
      page_path: currentPath,
      page_title: document.title,
    });
  }, [currentPath]);

  if (!canLoad) {
    return null;
  }

  return (
    <>
      {gtmContainerId ? (
        <Script
          id="ar-gtm"
          src={`https://www.googletagmanager.com/gtm.js?id=${encodeURIComponent(
            gtmContainerId,
          )}`}
          strategy="afterInteractive"
        />
      ) : null}
      {gaMeasurementId ? (
        <>
          <Script
            id="ar-ga4-src"
            src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(
              gaMeasurementId,
            )}`}
            strategy="afterInteractive"
          />
          <Script
            id="ar-ga4"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{ __html: gaSnippet(gaMeasurementId) }}
          />
        </>
      ) : null}
      {clarityProjectId ? (
        <Script
          id="ar-clarity"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{ __html: claritySnippet(clarityProjectId) }}
        />
      ) : null}
      {posthogKey ? (
        <Script
          id="ar-posthog"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: posthogSnippet({ apiHost: posthogHost, projectKey: posthogKey }),
          }}
        />
      ) : null}
    </>
  );
}
