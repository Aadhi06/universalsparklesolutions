"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/guard";
import {
  deleteProject,
  getProject,
  upsertProject,
} from "@/lib/store/projects";
import { getEnquiry, updateEnquiry } from "@/lib/store/enquiries";
import { enquiryStatuses, type EnquiryStatus } from "@/lib/store/enquiries";
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
