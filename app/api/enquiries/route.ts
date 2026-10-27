import { NextResponse } from "next/server";
import { notifyStaff } from "@/lib/admin/notify";
import { sendCustomerEnquiryReceived, sendNewEnquiryEmail } from "@/lib/email/sendNewEnquiry";
import { quoteFrequencies, quoteServices } from "@/lib/site";
import { syncCustomers } from "@/lib/store/customers";
import { saveEnquiry, upsertEnquiry } from "@/lib/store/enquiries";

const MAX_FILES = 3;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 8;

const hits = new Map<string, number[]>();

function clientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_REQUESTS;
}

function asString(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function POST(request: Request) {
  if (isRateLimited(clientKey(request))) {
    return NextResponse.json(
      { message: "Too many enquiries. Please wait a few minutes or call us." },
      { status: 429 },
    );
  }

  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json({ message: "Invalid form submission." }, { status: 400 });
  }

  if (asString(formData.get("company_website"))) {
    return NextResponse.json({ ok: true });
  }

  const enquiry = {
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    status: "New" as const,
    fullName: asString(formData.get("fullName")),
    company: asString(formData.get("company")),
    email: asString(formData.get("email")),
    phone: asString(formData.get("phone")),
    service: asString(formData.get("service")),
    location: asString(formData.get("location")),
    frequency: asString(formData.get("frequency")),
    message: asString(formData.get("message")),
    attachments: [] as Array<{ name: string; type: string; size: number }>,
    notification: {
      customer: "pending",
      staff: "pending",
    },
  };

  if (!enquiry.fullName || !enquiry.email || !enquiry.phone || !enquiry.service || !enquiry.location || !enquiry.message) {
    return NextResponse.json(
      { message: "Please complete the required fields." },
      { status: 400 },
    );
  }

  if (!enquiry.email.includes("@")) {
    return NextResponse.json({ message: "Enter a valid email address." }, { status: 400 });
  }

  if (
    !quoteServices.includes(enquiry.service as (typeof quoteServices)[number])
  ) {
    return NextResponse.json({ message: "Select a valid service." }, { status: 400 });
  }

  if (
    enquiry.frequency &&
    !quoteFrequencies.includes(enquiry.frequency as (typeof quoteFrequencies)[number])
  ) {
    return NextResponse.json({ message: "Select a valid frequency." }, { status: 400 });
  }

  const files = formData.getAll("photos").filter((file): file is File => {
    return file instanceof File && file.size > 0;
  });

  if (files.length > MAX_FILES) {
    return NextResponse.json({ message: "You can attach up to 3 photos." }, { status: 400 });
  }

  for (const file of files) {
    if (!ACCEPTED_TYPES.includes(file.type) || file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "Photos must be JPEG, PNG or WebP and 5 MB or smaller." },
        { status: 400 },
      );
    }
    enquiry.attachments.push({
      name: file.name,
      type: file.type,
      size: file.size,
    });
  }

  let saved = false;
  try {
    await saveEnquiry(enquiry);
    saved = true;
  } catch (error) {
    console.error("enquiry-save-failed", error);
  }

  const staffMail = await sendNewEnquiryEmail(enquiry);
  const customerMail = await sendCustomerEnquiryReceived(enquiry);
  enquiry.notification = {
    staff: staffMail,
    customer: customerMail,
  };

  if (saved) {
    try {
      await upsertEnquiry(enquiry);
      await syncCustomers();
    } catch (error) {
      console.error("enquiry-followup-failed", error);
    }
  }

  try {
    await notifyStaff({
      topic: "enquiries",
      title: "New enquiry",
      body: `${enquiry.fullName} · ${enquiry.phone} · ${enquiry.service}`,
      url: `/admin/enquiries/${enquiry.id}`,
      email: false,
    });
  } catch {
    // Push failure must not stop the quote request.
  }

  if (!saved && staffMail !== "sent") {
    return NextResponse.json(
      { message: "We could not send your enquiry. Please call us and we will take the details." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true });
}
