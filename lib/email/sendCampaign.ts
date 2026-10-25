import nodemailer from "nodemailer";
import { getSiteUrl, site } from "@/lib/site";
import type { Customer } from "@/lib/store/customers";
import { getSettings } from "@/lib/store/settings";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendCampaignEmail(
  customer: Customer,
  input: { subject: string; message: string; offer: string },
) {
  const host = process.env.SMTP_HOST?.trim();
  const from = process.env.SMTP_FROM?.trim();
  if (!host || !from) return "not_configured" as const;

  const settings = await getSettings();
  const unsubscribeUrl = `${getSiteUrl()}/unsubscribe/${customer.unsubscribeToken}`;
  const offer = input.offer.trim();
  const safeMessage = escapeHtml(input.message).replaceAll("\n", "<br />");
  const safeOffer = escapeHtml(offer);

  try {
    const port = Number(process.env.SMTP_PORT || 587);
    const transport = nodemailer.createTransport({
      host,
      port,
      secure: process.env.SMTP_SECURE === "true" || port === 465,
      auth: process.env.SMTP_USER
        ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD }
        : undefined,
    });

    await transport.sendMail({
      from,
      to: customer.email,
      replyTo: settings.email || site.email,
      subject: input.subject,
      text: [
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
        .join("\n"),
      html: `<p>Hello ${escapeHtml(customer.fullName)},</p>
${offer ? `<p><strong>${safeOffer}</strong></p>` : ""}
<p>${safeMessage}</p>
<p>${escapeHtml(site.shortName)}<br />${escapeHtml(settings.phoneOne)}<br />${escapeHtml(settings.email || site.email)}</p>
<p><a href="${escapeHtml(unsubscribeUrl)}">Unsubscribe from offers</a></p>`,
    });
    return "sent" as const;
  } catch {
    return "failed" as const;
  }
}
