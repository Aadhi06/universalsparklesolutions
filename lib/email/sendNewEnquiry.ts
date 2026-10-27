import nodemailer from "nodemailer";
import { getSiteUrl, quoteSuccessMessage, site } from "@/lib/site";
import type { Enquiry } from "@/lib/store/enquiries";

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

export async function sendNewEnquiryEmail(enquiry: Enquiry) {
  const host = process.env.SMTP_HOST?.trim();
  const from = process.env.SMTP_FROM?.trim();
  if (!host || !from) return "not_configured" as const;

  const to = site.email;
  const lines = [
    `Name: ${enquiry.fullName}`,
    enquiry.company ? `Company: ${enquiry.company}` : "",
    `Email: ${enquiry.email}`,
    `Phone: ${enquiry.phone}`,
    `Service: ${enquiry.service}`,
    `Location: ${enquiry.location}`,
    enquiry.frequency ? `Frequency: ${enquiry.frequency}` : "",
    "",
    enquiry.message,
  ].filter((line) => line !== "");

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
      to,
      replyTo: enquiry.email,
      subject: `New ${enquiry.service} enquiry from ${enquiry.fullName}`,
      text: lines.join("\n"),
      html: lines.map((line) => `<p>${escapeHtml(line) || "&nbsp;"}</p>`).join(""),
    });
    return "sent" as const;
  } catch (error) {
    console.error("staff-enquiry-email-failed", error);
    return "failed" as const;
  }
}

export async function sendCustomerEnquiryReceived(enquiry: Enquiry) {
  const host = process.env.SMTP_HOST?.trim();
  const from = process.env.SMTP_FROM?.trim();
  if (!host || !from || !enquiry.email.includes("@")) return "not_configured" as const;

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
      to: enquiry.email,
      replyTo: site.email,
      subject: "We received your cleaning enquiry",
      text,
      html: text
        .split("\n")
        .map((line) => `<p>${escapeHtml(line) || "&nbsp;"}</p>`)
        .join(""),
    });
    return "sent" as const;
  } catch {
    return "failed" as const;
  }
}

export async function sendAdminNotice(input: { title: string; body: string; url: string }) {
  const host = process.env.SMTP_HOST?.trim();
  const from = process.env.SMTP_FROM?.trim();
  if (!host || !from) return "not_configured" as const;

  const link = input.url.startsWith("http") ? input.url : `${getSiteUrl()}${input.url}`;
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
      to: site.email,
      subject: input.title,
      text: `${input.body}\n\n${link}`,
      html: `<p>${escapeHtml(input.body)}</p><p><a href="${escapeHtml(link)}">Open in admin</a></p>`,
    });
    return "sent" as const;
  } catch {
    return "failed" as const;
  }
}
