import nodemailer from "nodemailer";
import { appOrigin } from "@/lib/admin/origin";
import { site } from "@/lib/site";
import { getSettings } from "@/lib/store/settings";
import type { Enquiry } from "@/lib/store/enquiries";

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST?.trim() && process.env.SMTP_FROM?.trim());
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendEnquiryReplyEmail(enquiry: Enquiry, text: string) {
  if (!enquiry.replyToken || !mailConfigured()) return "not_configured" as const;

  const settings = await getSettings();
  const chatUrl = `${await appOrigin()}/chat/${enquiry.replyToken}`;
  const safeText = escapeHtml(text).replaceAll("\n", "<br />");
  const subject = `Message about your ${enquiry.service} enquiry`;

  try {
    const port = Number(process.env.SMTP_PORT || 587);
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE === "true" || port === 465,
      auth: process.env.SMTP_USER
        ? {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
          }
        : undefined,
    });

    await transport.sendMail({
      from: process.env.SMTP_FROM,
      to: enquiry.email,
      replyTo: settings.email || site.email,
      subject,
      text: [
        `Hello ${enquiry.fullName},`,
        "",
        text,
        "",
        "Reply in the chat:",
        chatUrl,
        "",
        site.shortName,
        settings.phoneOne,
      ].join("\n"),
      html: `<p>Hello ${escapeHtml(enquiry.fullName)},</p>
<p>${safeText}</p>
<p><a href="${escapeHtml(chatUrl)}">Open the chat to reply</a></p>
<p>${escapeHtml(site.shortName)}<br />${escapeHtml(settings.phoneOne)}</p>`,
    });
    return "sent" as const;
  } catch {
    return "failed" as const;
  }
}
