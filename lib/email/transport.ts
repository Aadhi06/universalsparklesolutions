import nodemailer from "nodemailer";

export function mailConfigured() {
  return Boolean(process.env.SMTP_HOST?.trim() && process.env.SMTP_FROM?.trim());
}

export function createMailTransport() {
  const port = Number(process.env.SMTP_PORT || 587);
  return nodemailer.createTransport({
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
}

export async function sendMail(input: {
  to: string;
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
}) {
  if (!mailConfigured()) return "not_configured" as const;
  try {
    await createMailTransport().sendMail({
      from: process.env.SMTP_FROM,
      to: input.to,
      replyTo: input.replyTo,
      subject: input.subject,
      text: input.text,
      html: input.html,
    });
    return "sent" as const;
  } catch (error) {
    console.error("email-send-failed", input.subject, error);
    return "failed" as const;
  }
}
