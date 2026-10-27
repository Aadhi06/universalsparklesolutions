import { appOrigin } from "@/lib/admin/origin";
import { site } from "@/lib/site";
import { getSettings } from "@/lib/store/settings";
import type { Enquiry } from "@/lib/store/enquiries";
import {
  emailDetails,
  emailParagraphs,
  renderEmail,
} from "@/lib/email/template";
import { mailConfigured, sendMail } from "@/lib/email/transport";

export { mailConfigured };

export async function sendEnquiryReplyEmail(enquiry: Enquiry, text: string) {
  if (!enquiry.replyToken || !mailConfigured()) return "not_configured" as const;

  const settings = await getSettings();
  const chatUrl = `${await appOrigin()}/chat/${enquiry.replyToken}`;
  const subject = `Message about your ${enquiry.service} enquiry`;

  const plain = [
    `Hello ${enquiry.fullName},`,
    "",
    text,
    "",
    "Open the chat to reply:",
    chatUrl,
    "",
    site.shortName,
    settings.phoneOne,
  ].join("\n");

  const html = renderEmail({
    eyebrow: "Chat message",
    title: "You have a reply from our team",
    intro: `Hello ${enquiry.fullName}, Universal Sparkle Solution sent a message about your ${enquiry.service} enquiry.`,
    preheader: text.slice(0, 120),
    bodyHtml: `<div style="margin:0 0 18px;padding:16px 18px;border-left:4px solid #d6b66e;background:#f7fafc;border-radius:0 8px 8px 0;">
      ${emailParagraphs(text)}
    </div>
    ${emailDetails([
      { label: "Service", value: enquiry.service },
      { label: "Suburb", value: enquiry.location },
    ])}`,
    cta: { label: "Open the chat to reply", href: chatUrl },
    footerNote: `You can reply in the secure chat link. Or call ${settings.phoneOne}.`,
  });

  return sendMail({
    to: enquiry.email,
    replyTo: settings.email || site.email,
    subject,
    text: plain,
    html,
  });
}
