import { getSiteUrl, quoteSuccessMessage, site } from "@/lib/site";
import type { Enquiry } from "@/lib/store/enquiries";
import {
  emailDetails,
  emailParagraphs,
  renderEmail,
} from "@/lib/email/template";
import { sendMail } from "@/lib/email/transport";

export async function sendNewEnquiryEmail(enquiry: Enquiry) {
  const adminUrl = `${getSiteUrl()}/admin/enquiries/${enquiry.id}`;
  const text = [
    `New enquiry from ${enquiry.fullName}`,
    "",
    `Name: ${enquiry.fullName}`,
    enquiry.company ? `Company: ${enquiry.company}` : "",
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone}`,
    `Service: ${enquiry.service}`,
    `Location: ${enquiry.location}`,
    enquiry.frequency ? `Frequency: ${enquiry.frequency}` : "",
    "",
    enquiry.message,
    "",
    adminUrl,
  ]
    .filter((line) => line !== "")
    .join("\n");

  const html = renderEmail({
    eyebrow: "New enquiry",
    title: `${enquiry.service} request`,
    intro: `${enquiry.fullName} sent a quote request through the website.`,
    preheader: `New ${enquiry.service} enquiry from ${enquiry.fullName}`,
    bodyHtml: `${emailDetails([
      { label: "Name", value: enquiry.fullName },
      { label: "Company", value: enquiry.company },
      { label: "Email", value: enquiry.email, href: `mailto:${enquiry.email}` },
      { label: "Phone", value: enquiry.phone, href: `tel:${enquiry.phone.replace(/\s+/g, "")}` },
      { label: "Service", value: enquiry.service },
      { label: "Location", value: enquiry.location },
      { label: "Frequency", value: enquiry.frequency },
    ])}
    <div style="margin-top:18px;">
      <p style="margin:0 0 8px;font-size:12px;letter-spacing:0.08em;text-transform:uppercase;color:#4a5a73;font-weight:700;">Message</p>
      ${emailParagraphs(enquiry.message)}
    </div>`,
    cta: { label: "Open in admin", href: adminUrl },
  });

  return sendMail({
    to: site.email,
    replyTo: enquiry.email,
    subject: `New ${enquiry.service} enquiry from ${enquiry.fullName}`,
    text,
    html,
  });
}

export async function sendCustomerEnquiryReceived(enquiry: Enquiry) {
  if (!enquiry.email.includes("@")) return "not_configured" as const;

  const text = [
    `Hello ${enquiry.fullName},`,
    "",
    quoteSuccessMessage,
    "",
    `Service: ${enquiry.service}`,
    `Location: ${enquiry.location}`,
    enquiry.frequency ? `Frequency: ${enquiry.frequency}` : "",
    "",
    "This is a quote request, not a confirmed booking.",
    "",
    site.shortName,
    site.phones.map((phone) => phone.label).join(" · "),
    site.email,
  ]
    .filter((line) => line !== "")
    .join("\n");

  const html = renderEmail({
    eyebrow: "Quote request received",
    title: "Thank you for contacting us",
    intro: `Hello ${enquiry.fullName}, we have received your cleaning enquiry and our team will be in touch.`,
    preheader: "We received your cleaning enquiry",
    bodyHtml: `${emailDetails([
      { label: "Service", value: enquiry.service },
      { label: "Location", value: enquiry.location },
      { label: "Frequency", value: enquiry.frequency },
    ])}
    <div style="margin-top:18px;">${emailParagraphs(quoteSuccessMessage)}</div>`,
    cta: { label: "Visit our website", href: getSiteUrl() },
    footerNote: "This is a quote request, not a confirmed booking.",
  });

  return sendMail({
    to: enquiry.email,
    replyTo: site.email,
    subject: "We received your cleaning enquiry",
    text,
    html,
  });
}

export async function sendAdminNotice(input: { title: string; body: string; url: string }) {
  const link = input.url.startsWith("http") ? input.url : `${getSiteUrl()}${input.url}`;
  const html = renderEmail({
    eyebrow: "Admin alert",
    title: input.title,
    intro: input.body,
    preheader: input.title,
    bodyHtml: "",
    cta: { label: "Open in admin", href: link },
  });

  return sendMail({
    to: site.email,
    subject: input.title,
    text: `${input.body}\n\n${link}`,
    html,
  });
}
