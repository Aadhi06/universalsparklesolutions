import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { quoteFrequencies, quoteServices } from "@/lib/site";

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

  const formData = await request.formData();

  if (asString(formData.get("company_website"))) {
    return NextResponse.json({ ok: true });
  }

  const enquiry = {
    id: crypto.randomUUID(),
    receivedAt: new Date().toISOString(),
    status: "New",
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
      customer: "pending_laravel",
      staff: "pending_laravel",
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

  const laravelUrl = process.env.LARAVEL_API_URL;
  if (laravelUrl) {
    const upstream = await fetch(`${laravelUrl.replace(/\/$/, "")}/enquiries`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        Authorization: process.env.LARAVEL_API_TOKEN
          ? `Bearer ${process.env.LARAVEL_API_TOKEN}`
          : "",
      },
      body: formData,
    });

    if (!upstream.ok) {
      await persistLocally(enquiry);
      return NextResponse.json({
        ok: true,
        message:
          "Your enquiry has been received. Staff notification will be completed once the Laravel API is available.",
      });
    }

    return NextResponse.json({ ok: true });
  }

  await persistLocally(enquiry);
  return NextResponse.json({ ok: true });
}

async function persistLocally(enquiry: object) {
  const directory = path.join(process.cwd(), ".data");
  const file = path.join(directory, "enquiries.json");
  await mkdir(directory, { recursive: true });

  let existing: object[] = [];
  try {
    existing = JSON.parse(await readFile(file, "utf8")) as object[];
  } catch {
    existing = [];
  }

  existing.push(enquiry);
  await writeFile(file, JSON.stringify(existing, null, 2));
}
