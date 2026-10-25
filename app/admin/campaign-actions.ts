"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/guard";
import { sendCampaignEmail } from "@/lib/email/sendCampaign";
import { saveCampaign } from "@/lib/store/campaigns";
import { customerCanReceive, listCustomers } from "@/lib/store/customers";

function text(value: FormDataEntryValue | null) {
  return typeof value === "string" ? value.trim() : "";
}

export async function sendCampaignAction(formData: FormData) {
  await requireAdmin();
  const subject = text(formData.get("subject"));
  const message = text(formData.get("message"));
  const offer = text(formData.get("offer"));
  const ids = [...new Set(formData.getAll("ids").map(text).filter(Boolean))];

  if (!subject || !message) {
    return { error: "Add a subject and a message." };
  }
  if (subject.length > 120 || message.length > 4000 || offer.length > 160) {
    return { error: "Shorten the subject, offer or message." };
  }
  if (ids.length === 0) {
    return { error: "Select at least one customer." };
  }

  const customers = await listCustomers();
  const chosen = customers.filter((customer) => ids.includes(customer.id));
  let sent = 0;
  let failed = 0;
  let skipped = 0;

  for (const customer of chosen) {
    if (!customerCanReceive(customer)) {
      skipped += 1;
      continue;
    }
    const result = await sendCampaignEmail(customer, { subject, message, offer });
    if (result === "sent") sent += 1;
    else failed += 1;
  }

  await saveCampaign({
    id: crypto.randomUUID(),
    at: new Date().toISOString(),
    subject,
    offer,
    sent,
    failed,
    skipped,
  });
  revalidatePath("/admin/customers");
  revalidatePath("/admin/campaigns");

  return { sent, failed, skipped };
}
