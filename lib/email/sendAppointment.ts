import { formatVisit } from "@/lib/admin/format";
import { getSiteUrl, site } from "@/lib/site";
import type { Appointment } from "@/lib/store/appointments";
import { getSettings } from "@/lib/store/settings";
import { emailDetails, emailParagraphs, renderEmail } from "@/lib/email/template";
import { sendMail } from "@/lib/email/transport";

export async function sendCustomerAppointmentEmail(
  appointment: Appointment,
  kind: "created" | "updated",
) {
  if (!appointment.email.includes("@")) return "not_configured" as const;

  const settings = await getSettings();
  const visit = formatVisit(appointment.date, appointment.time);
  const title =
    appointment.status === "Cancelled"
      ? "Appointment cancelled"
      : kind === "created"
        ? "Appointment booked"
        : "Appointment updated";

  const text = [
    `Hello ${appointment.customerName},`,
    "",
    title,
    "",
    `Service: ${appointment.service}`,
    `Location: ${appointment.location}`,
    `When: ${visit}`,
    `Status: ${appointment.status}`,
    appointment.notes ? "" : "",
    appointment.notes ? `Notes: ${appointment.notes}` : "",
    "",
    site.shortName,
    settings.phoneOne,
    settings.email || site.email,
  ]
    .filter((line) => line !== "")
    .join("\n");

  const html = renderEmail({
    eyebrow: "Appointment",
    title,
    intro: `Hello ${appointment.customerName}, here are the details for your Universal Sparkle Solution visit.`,
    preheader: `${title}: ${visit}`,
    bodyHtml: emailDetails([
      { label: "Service", value: appointment.service },
      { label: "Location", value: appointment.location },
      { label: "When", value: visit },
      { label: "Status", value: appointment.status },
      { label: "Phone", value: appointment.phone },
      ...(appointment.notes
        ? [{ label: "Notes", value: appointment.notes }]
        : []),
    ]),
    cta: { label: "Contact us", href: `${getSiteUrl()}/contact` },
    footerNote:
      appointment.status === "Cancelled"
        ? "If you need to rearrange, reply to this email or call us."
        : "If this time no longer suits, reply to this email or call us and we will help rearrange.",
  });

  return sendMail({
    to: appointment.email,
    replyTo: settings.email || site.email,
    subject: `${title} · ${appointment.service}`,
    text,
    html,
  });
}

export async function sendStaffAppointmentEmail(appointment: Appointment, kind: "created" | "updated") {
  const visit = formatVisit(appointment.date, appointment.time);
  const title = kind === "created" ? "New appointment" : "Appointment updated";
  const adminUrl = `${getSiteUrl()}/admin/appointments/${appointment.id}`;

  const text = [
    title,
    "",
    `Customer: ${appointment.customerName}`,
    `Phone: ${appointment.phone}`,
    appointment.email ? `Email: ${appointment.email}` : "",
    `Service: ${appointment.service}`,
    `Location: ${appointment.location}`,
    `When: ${visit}`,
    `Status: ${appointment.status}`,
    "",
    adminUrl,
  ]
    .filter((line) => line !== "")
    .join("\n");

  const html = renderEmail({
    eyebrow: "Admin appointment",
    title,
    intro: `${appointment.customerName} · ${visit}`,
    preheader: `${title}: ${appointment.customerName}`,
    bodyHtml: `${emailDetails([
      { label: "Customer", value: appointment.customerName },
      { label: "Phone", value: appointment.phone, href: `tel:${appointment.phone.replace(/\s+/g, "")}` },
      {
        label: "Email",
        value: appointment.email,
        href: appointment.email.includes("@") ? `mailto:${appointment.email}` : undefined,
      },
      { label: "Service", value: appointment.service },
      { label: "Location", value: appointment.location },
      { label: "When", value: visit },
      { label: "Status", value: appointment.status },
    ])}${
      appointment.notes
        ? `<div style="margin-top:18px;">${emailParagraphs(appointment.notes)}</div>`
        : ""
    }`,
    cta: { label: "Open appointment", href: adminUrl },
  });

  return sendMail({
    to: site.email,
    replyTo: appointment.email.includes("@") ? appointment.email : undefined,
    subject: `${title}: ${appointment.customerName}`,
    text,
    html,
  });
}
