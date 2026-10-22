type AnalyticsDetail = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function getAnalyticsId() {
  return process.env.NEXT_PUBLIC_ANALYTICS_ID ?? "";
}

export function trackEvent(name: string, detail: AnalyticsDetail = {}) {
  if (typeof window === "undefined") return;

  const safeDetail = Object.fromEntries(
    Object.entries(detail).filter(
      ([key]) =>
        !["email", "phone", "name", "message", "fullName", "attachment"].includes(
          key,
        ),
    ),
  );

  window.dispatchEvent(new CustomEvent(name, { detail: safeDetail }));
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({
    event: name,
    analytics_id: getAnalyticsId() || undefined,
    ...safeDetail,
  });

  if (
    name === "phone_click" ||
    name === "whatsapp_click" ||
    name === "quote_submitted"
  ) {
    void fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
      keepalive: true,
    }).catch(() => undefined);
  }
}

export function trackPhoneClick(numberLabel: string) {
  trackEvent("phone_click", { phone_label: numberLabel });
}

export function trackQuoteSubmitted() {
  trackEvent("quote_submitted", { form: "quote_request" });
}

export function trackWhatsAppClick() {
  trackEvent("whatsapp_click", { channel: "whatsapp" });
}
