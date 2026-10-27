import { getSiteUrl, site } from "@/lib/site";
import type { Customer } from "@/lib/store/customers";
import { getSettings } from "@/lib/store/settings";
import {
  emailParagraphs,
  escapeHtml,
  renderEmail,
} from "@/lib/email/template";
import { sendMail } from "@/lib/email/transport";

export async function sendCampaignEmail(
  customer: Customer,
  input: { subject: string; message: string; offer: string },
) {
  const settings = await getSettings();
  const unsubscribeUrl = `${getSiteUrl()}/unsubscribe/${customer.unsubscribeToken}`;
  const offer = input.offer.trim();

  const text = [
    `Hello ${customer.fullName},`,
    "",
    offer ? `Offer: ${offer}` : "",
    offer ? "" : "",
    input.message,
    "",
    site.shortName,
    settings.phoneOne,
    settings.email,
    "",
    `Unsubscribe: ${unsubscribeUrl}`,
  ]
    .filter((line) => line !== "")
    .join("\n");

  const html = renderEmail({
    eyebrow: "Special offer",
    title: input.subject,
    intro: `Hello ${customer.fullName},`,
    preheader: offer || input.message.slice(0, 120),
    bodyHtml: `${
      offer
        ? `<div style="margin:0 0 18px;padding:16px 18px;border-radius:8px;background:#102342;color:#ffffff;">
      <p style="margin:0 0 6px;font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#d6b66e;font-weight:700;">Offer</p>
      <p style="margin:0;font-size:20px;line-height:1.35;color:#ffffff;font-weight:700;">${escapeHtml(offer)}</p>
    </div>`
        : ""
    }
    ${emailParagraphs(input.message)}`,
    cta: { label: "Request a quote", href: `${getSiteUrl()}/contact#quote` },
    footerNote: "You are receiving this because you enquired with Universal Sparkle Solution.",
    secondaryLink: { label: "Unsubscribe from offers", href: unsubscribeUrl },
  });

  return sendMail({
    to: customer.email,
    replyTo: settings.email || site.email,
    subject: input.subject,
    text,
    html,
  });
}
