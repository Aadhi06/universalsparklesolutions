"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin/guard";
import { deleteCustomer, saveCustomer } from "@/lib/store/customers";

function text(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function saveCustomerAction(formData: FormData) {
  await requireAdmin();
  const email = text(formData.get("email"));
  const phone = text(formData.get("phone"));
  if (!text(formData.get("fullName"))) {
    throw new Error("Enter the customer name.");
  }
  if (!email.includes("@") && phone.replace(/\D/g, "").length < 8) {
    throw new Error("Enter an email address or a phone number.");
  }
  if (email && !email.includes("@")) {
    throw new Error("Enter a valid email address.");
  }

  const saved = await saveCustomer({
    id: text(formData.get("id")) || undefined,
    fullName: text(formData.get("fullName")),
    company: text(formData.get("company")),
    email,
    phone,
    service: text(formData.get("service")),
    location: text(formData.get("location")),
    marketing: formData.get("marketing") === "on",
  });
  if (!saved) {
    throw new Error("Enter an email address or a phone number.");
  }

  revalidatePath("/admin/customers");
  revalidatePath("/admin/campaigns");
  revalidatePath(`/admin/customers/${saved.id}`);
  redirect(`/admin/customers/${saved.id}`);
}

export async function deleteCustomerAction(formData: FormData) {
  await requireAdmin();
  const id = text(formData.get("id"));
  if (id) await deleteCustomer(id);
  revalidatePath("/admin/customers");
  revalidatePath("/admin/campaigns");
  redirect("/admin/customers");
}
