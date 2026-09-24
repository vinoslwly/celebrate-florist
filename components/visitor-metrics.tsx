"use client";

import {
  Analytics,
  type BeforeSendEvent as AnalyticsEvent,
} from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

function redactPathname(pathname: string): {
  pathname: string;
  changed: boolean;
} {
  const parts = pathname.split("/");

  if ((parts[1] === "e" || parts[1] === "preview") && parts[2]) {
    parts[2] = "[token]";
    return { pathname: parts.join("/") || "/", changed: true };
  }

  if (
    parts[1] === "studio" &&
    parts[2] === "orders" &&
    parts[3] &&
    parts[3] !== "new"
  ) {
    parts[3] = "[id]";
    return { pathname: parts.join("/"), changed: true };
  }

  return { pathname, changed: false };
}

function redactUrl(value: string): string {
  try {
    const url = new URL(value, "https://celebrate-florist.local");
    const next = redactPathname(url.pathname);
    if (!next.changed) return value;

    url.pathname = next.pathname;
    url.search = "";
    url.hash = "";

    if (value.startsWith("http://") || value.startsWith("https://")) {
      return url.toString();
    }

    return url.pathname;
  } catch {
    return value;
  }
}

function redactAnalytics(event: AnalyticsEvent): AnalyticsEvent {
  return { ...event, url: redactUrl(event.url) };
}

function redactSpeed(event: { type: "vital"; url: string; route?: string }) {
  const route =
    event.route === undefined
      ? undefined
      : redactPathname(event.route).pathname;
  return { ...event, url: redactUrl(event.url), route };
}

export function VisitorMetrics() {
  return (
    <>
      <Analytics beforeSend={redactAnalytics} />
      <SpeedInsights beforeSend={redactSpeed} />
    </>
  );
}
