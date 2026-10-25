"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/guard";
import {
  deleteProject,
  getProject,
  upsertProject,
} from "@/lib/store/projects";
import { formatVisit } from "@/lib/admin/format";
import { notifyStaff } from "@/lib/admin/notify";
import { sendCustomerEnquiryReceived } from "@/lib/email/sendNewEnquiry";
import { sendEnquiryReplyEmail } from "@/lib/email/sendEnquiryReply";
import {
  appendEnquiryMessage,
  deleteEnquiries,
  deleteEnquiry,
  enquiryStatuses,
  ensureReplyToken,
  getEnquiry,
  getEnquiryByReplyToken,
  setEnquiryMessageEmailStatus,
  setEnquiryStatuses,
  updateEnquiry,
  upsertEnquiry,
  type Enquiry,
  type EnquiryStatus,
} from "@/lib/store/enquiries";
import {
  appointmentStatuses,
  deleteAppointment,
  deleteAppointments,
  getAppointment,
  setAppointmentStatuses,
  upsertAppointment,
  type Appointment,
  type AppointmentStatus,
} from "@/lib/store/appointments";
import { saveSettings, type AdminSettings } from "@/lib/store/settings";

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

function asBoolean(value: FormDataEntryValue | null) {
  return value === "on" || value === "true" || value === "1";
}

export async function updateEnquiryAction(formData: FormData) {
  await requireAdmin();
  const id = asString(formData.get("id"));
  const status = asString(formData.get("status")) as EnquiryStatus;
  const note = asString(formData.get("note"));

  const enquiry = await getEnquiry(id);
  if (!enquiry) {
    throw new Error("Enquiry not found.");
  }
  if (!enquiryStatuses.includes(status)) {
    throw new Error("Select a valid status.");
  }

  const notes = [...(enquiry.notes ?? [])];
  if (note) {
    notes.push({
      id: crypto.randomUUID(),
      at: new Date().toISOString(),
      text: note,
    });
  }

  await updateEnquiry(id, { status, notes });
  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
}

function enquiryFromForm(formData: FormData, existing: Enquiry | null): Enquiry {
  const status = asString(formData.get("status")) as EnquiryStatus;
  const fullName = asString(formData.get("fullName"));
  const email = asString(formData.get("email"));
  const phone = asString(formData.get("phone"));
  const service = asString(formData.get("service"));
  const location = asString(formData.get("location"));
  const message = asString(formData.get("message"));

  if (!fullName || !email || !phone || !service || !location || !message) {
    throw new Error("Please complete the required enquiry fields.");
  }
  if (!email.includes("@")) {
    throw new Error("Enter a valid email address.");
  }
  if (!enquiryStatuses.includes(status)) {
    throw new Error("Select a valid status.");
  }

  return {
    id: existing?.id ?? crypto.randomUUID(),
    receivedAt: existing?.receivedAt ?? new Date().toISOString(),
    status,
    fullName,
    company: asString(formData.get("company")),
    email,
    phone,
    service,
    location,
    frequency: asString(formData.get("frequency")),
    message,
    attachments: existing?.attachments ?? [],
    notes: existing?.notes,
    messages: existing?.messages,
    replyToken: existing?.replyToken,
    notification: existing?.notification,
  };
}

export async function saveEnquiryAction(formData: FormData) {
  await requireAdmin();
  const id = asString(formData.get("id"));
  const existing = id ? await getEnquiry(id) : null;
  if (id && !existing) {
    throw new Error("Enquiry not found.");
  }

  const saved = await upsertEnquiry(enquiryFromForm(formData, existing));
  if (!existing) {
    await sendCustomerEnquiryReceived(saved);
    await notifyStaff({
      topic: "enquiries",
      title: "New enquiry",
      body: `${saved.fullName} · ${saved.phone} · ${saved.service}`,
      url: `/admin/enquiries/${saved.id}`,
    });
  }
  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${saved.id}`);
  revalidatePath("/admin/customers");
  revalidatePath("/admin/campaigns");
  redirect(`/admin/enquiries/${saved.id}`);
}

function adminReturnPath(value: string, fallback: string) {
  if (!value.startsWith("/admin/") && value !== "/admin") return fallback;
  if (value.startsWith("//") || value.includes("\\")) return fallback;
  return value;
}

export async function bulkEnquiryAction(formData: FormData) {
  await requireAdmin();
  const ids = [
    ...new Set(formData.getAll("ids").map(asString).filter(Boolean)),
  ];
  const intent = asString(formData.get("intent"));
  const returnTo = adminReturnPath(
    asString(formData.get("returnTo")),
    "/admin/enquiries",
  );

  if (ids.length === 0) redirect(returnTo);

  if (intent === "delete") {
    await deleteEnquiries(ids);
  } else {
    const status = asString(formData.get("status")) as EnquiryStatus;
    if (!enquiryStatuses.includes(status)) {
      throw new Error("Select a valid status.");
    }
    await setEnquiryStatuses(ids, status);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  redirect(returnTo);
}

export async function deleteEnquiryAction(formData: FormData) {
  await requireAdmin();
  const id = asString(formData.get("id"));
  await deleteEnquiry(id);
  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  redirect("/admin/enquiries");
}

function chatText(value: string) {
  return value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
}

const replyHits = new Map<string, number[]>();

function replyLimited(token: string) {
  const now = Date.now();
  const recent = (replyHits.get(token) ?? []).filter((time) => now - time < 10 * 60 * 1000);
  recent.push(now);
  replyHits.set(token, recent);
  return recent.length > 8;
}

export async function sendEnquiryChatAction(formData: FormData) {
  await requireAdmin();
  const id = asString(formData.get("id"));
  const text = chatText(asString(formData.get("text")));
  if (!text || text.length > 2000) {
    throw new Error("Write a message of 2,000 characters or less.");
  }

  const enquiry = await ensureReplyToken(id);
  if (!enquiry?.replyToken) {
    throw new Error("Enquiry not found.");
  }

  const emailStatus = await sendEnquiryReplyEmail(
    { ...enquiry, replyToken: enquiry.replyToken },
    text,
  );
  const saved = await appendEnquiryMessage(id, {
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    from: "staff",
    text,
    emailStatus,
  });
  if (!saved) throw new Error("Enquiry not found.");

  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${id}`);
  revalidatePath(`/admin/enquiries/${id}/chat`);
  revalidatePath(`/chat/${enquiry.replyToken}`);
  redirect(`/admin/enquiries/${id}/chat`);
}

export async function resendEnquiryChatAction(formData: FormData) {
  await requireAdmin();
  const id = asString(formData.get("id"));
  const messageId = asString(formData.get("messageId"));
  const enquiry = await getEnquiry(id);
  const message = enquiry?.messages?.find((item) => item.id === messageId);
  if (!enquiry?.replyToken || !message || message.from !== "staff") {
    throw new Error("Message not found.");
  }

  const emailStatus = await sendEnquiryReplyEmail(enquiry, message.text);
  await setEnquiryMessageEmailStatus(id, messageId, emailStatus);
  revalidatePath(`/admin/enquiries/${id}/chat`);
  revalidatePath(`/chat/${enquiry.replyToken}`);
  redirect(`/admin/enquiries/${id}/chat`);
}

export async function replyToEnquiryAction(formData: FormData) {
  const token = asString(formData.get("token"));
  const text = chatText(asString(formData.get("text")));
  const enquiry = await getEnquiryByReplyToken(token);
  if (!enquiry) redirect("/chat/unavailable");
  if (!text || text.length > 2000 || replyLimited(token)) {
    redirect(`/chat/${token}?error=1`);
  }

  const saved = await appendEnquiryMessage(enquiry.id, {
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    from: "customer",
    text,
  });
  if (!saved) redirect("/chat/unavailable");

  await notifyStaff({
    topic: "enquiries",
    title: `Reply from ${enquiry.fullName}`,
    body: `${enquiry.phone} · ${text.slice(0, 140)}`,
    url: `/admin/enquiries/${enquiry.id}/chat`,
  });

  revalidatePath("/admin");
  revalidatePath("/admin/enquiries");
  revalidatePath(`/admin/enquiries/${enquiry.id}/chat`);
  revalidatePath(`/chat/${token}`);
  redirect(`/chat/${token}`);
}

function appointmentFromForm(formData: FormData, existing: Appointment | null): Appointment {
  const status = asString(formData.get("status")) as AppointmentStatus;
  const customerName = asString(formData.get("customerName"));
  const phone = asString(formData.get("phone"));
  const service = asString(formData.get("service"));
  const location = asString(formData.get("location"));
  const date = asString(formData.get("date"));
  const time = asString(formData.get("time")).slice(0, 5);
  const email = asString(formData.get("email"));
  const enquiryId = asString(formData.get("enquiryId"));

  if (!customerName || !phone || !service || !location || !date || !time) {
    throw new Error("Please complete the required appointment fields.");
  }
  if (email && !email.includes("@")) {
    throw new Error("Enter a valid email address.");
  }
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) {
    throw new Error("Enter a valid date and time.");
  }
  if (!appointmentStatuses.includes(status)) {
    throw new Error("Select a valid status.");
  }

  return {
    id: existing?.id ?? crypto.randomUUID(),
    createdAt: existing?.createdAt ?? new Date().toISOString(),
    customerName,
    phone,
    email,
    service,
    location,
    date,
    time,
    status,
    notes: asString(formData.get("notes")),
    enquiryId: enquiryId || undefined,
  };
}

export async function saveAppointmentAction(formData: FormData) {
  await requireAdmin();
  const id = asString(formData.get("id"));
  const existing = id ? await getAppointment(id) : null;
  if (id && !existing) {
    throw new Error("Appointment not found.");
  }

  const saved = await upsertAppointment(appointmentFromForm(formData, existing));
  const changed =
    !existing ||
    existing.date !== saved.date ||
    existing.time !== saved.time ||
    existing.status !== saved.status;
  if (changed) {
    await notifyStaff({
      topic: "appointments",
      title: existing ? "Appointment updated" : "New appointment",
      body: `${saved.customerName} · ${saved.phone} · ${formatVisit(saved.date, saved.time)}`,
      url: `/admin/appointments/${saved.id}`,
    });
  }
  revalidatePath("/admin");
  revalidatePath("/admin/appointments");
  revalidatePath(`/admin/appointments/${saved.id}`);
  redirect(`/admin/appointments/${saved.id}`);
}

export async function bulkAppointmentAction(formData: FormData) {
  await requireAdmin();
  const ids = [
    ...new Set(formData.getAll("ids").map(asString).filter(Boolean)),
  ];
  const intent = asString(formData.get("intent"));
  const returnTo = adminReturnPath(
    asString(formData.get("returnTo")),
    "/admin/appointments",
  );

  if (ids.length === 0) redirect(returnTo);

  if (intent === "delete") {
    await deleteAppointments(ids);
  } else {
    const status = asString(formData.get("status")) as AppointmentStatus;
    if (!appointmentStatuses.includes(status)) {
      throw new Error("Select a valid status.");
    }
    await setAppointmentStatuses(ids, status);
  }

  revalidatePath("/admin");
  revalidatePath("/admin/appointments");
  redirect(returnTo);
}

export async function deleteAppointmentAction(formData: FormData) {
  await requireAdmin();
  const id = asString(formData.get("id"));
  await deleteAppointment(id);
  revalidatePath("/admin");
  revalidatePath("/admin/appointments");
  redirect("/admin/appointments");
}

export async function saveProjectAction(formData: FormData) {
  await requireAdmin();
  const id = asString(formData.get("id")) || undefined;
  const title = asString(formData.get("title"));
  const category = asString(formData.get("category"));
  const homeLine = asString(formData.get("homeLine"));
  const summary = asString(formData.get("summary"));
  const image = asString(formData.get("image"));
  const imageAlt = asString(formData.get("imageAlt"));

  if (!title || !category || !homeLine || !summary || !image || !imageAlt) {
    throw new Error("Please complete the required project fields.");
  }

  const saved = await upsertProject({
    id,
    title,
    category,
    homeLine,
    summary,
    image,
    imageAlt,
    published: asBoolean(formData.get("published")),
    isNamedClient: asBoolean(formData.get("isNamedClient")),
  });

  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  revalidatePath(`/admin/projects/${saved.id}`);
  redirect("/admin/projects");
}

export async function toggleProjectPublishedAction(formData: FormData) {
  await requireAdmin();
  const id = asString(formData.get("id"));
  const project = await getProject(id);
  if (!project) {
    throw new Error("Project not found.");
  }

  await upsertProject({ ...project, published: !project.published });
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
}

export async function deleteProjectAction(formData: FormData) {
  await requireAdmin();
  const id = asString(formData.get("id"));
  await deleteProject(id);
  revalidatePath("/");
  revalidatePath("/admin");
  revalidatePath("/admin/projects");
  redirect("/admin/projects");
}

export async function saveSettingsAction(formData: FormData) {
  await requireAdmin();
  const settings: AdminSettings = {
    email: asString(formData.get("email")),
    phoneOne: asString(formData.get("phoneOne")),
    phoneTwo: asString(formData.get("phoneTwo")),
    whatsappNumber: asString(formData.get("whatsappNumber")),
    serviceArea: asString(formData.get("serviceArea")),
    homeTitle: asString(formData.get("homeTitle")),
    homeDescription: asString(formData.get("homeDescription")),
  };

  if (
    !settings.email ||
    !settings.phoneOne ||
    !settings.whatsappNumber ||
    !settings.serviceArea ||
    !settings.homeTitle ||
    !settings.homeDescription
  ) {
    throw new Error("Please complete the required settings.");
  }
  if (!settings.email.includes("@")) {
    throw new Error("Enter a valid email address.");
  }

  await saveSettings(settings);
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/admin/settings");
}
