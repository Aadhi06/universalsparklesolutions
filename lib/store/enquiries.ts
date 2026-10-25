import { randomBytes } from "node:crypto";
import { readJsonFile, updateJsonFile, writeJsonFile } from "@/lib/store/io";

export const enquiryStatuses = ["New", "Contacted", "Quoted", "Closed"] as const;

export type EnquiryStatus = (typeof enquiryStatuses)[number];

export type EnquiryNote = {
  id: string;
  at: string;
  text: string;
};

export type EnquiryMessage = {
  id: string;
  at: string;
  from: "staff" | "customer";
  text: string;
  emailStatus?: "sent" | "not_configured" | "failed";
};

export type Enquiry = {
  id: string;
  receivedAt: string;
  status: EnquiryStatus | string;
  fullName: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  frequency: string;
  message: string;
  attachments: Array<{ name: string; type: string; size: number }>;
  notes?: EnquiryNote[];
  messages?: EnquiryMessage[];
  replyToken?: string;
  notification?: {
    customer: string;
    staff: string;
  };
};

export function enquiryNeedsReply(enquiry: Enquiry) {
  const last = enquiry.messages?.at(-1);
  return !last || last.from === "customer";
}

export function listEnquiryChats(enquiries: Enquiry[]) {
  return [...enquiries].sort((a, b) => {
    const left = a.messages?.at(-1)?.at ?? a.receivedAt;
    const right = b.messages?.at(-1)?.at ?? b.receivedAt;
    return new Date(right).getTime() - new Date(left).getTime();
  });
}

const FILE = "enquiries.json";

export async function listEnquiries() {
  const items = await readJsonFile<Enquiry[]>(FILE, []);
  return [...items].sort(
    (a, b) => new Date(b.receivedAt).getTime() - new Date(a.receivedAt).getTime(),
  );
}

export async function getEnquiry(id: string) {
  const items = await listEnquiries();
  return items.find((item) => item.id === id) ?? null;
}

export async function saveEnquiry(enquiry: Enquiry) {
  const items = await readJsonFile<Enquiry[]>(FILE, []);
  items.push(enquiry);
  await writeJsonFile(FILE, items);
}

export async function upsertEnquiry(enquiry: Enquiry) {
  const items = await readJsonFile<Enquiry[]>(FILE, []);
  const index = items.findIndex((item) => item.id === enquiry.id);
  if (index === -1) items.push(enquiry);
  else items[index] = enquiry;
  await writeJsonFile(FILE, items);
  return enquiry;
}

export async function updateEnquiry(
  id: string,
  patch: Partial<Pick<Enquiry, "status" | "notes">>,
) {
  const items = await readJsonFile<Enquiry[]>(FILE, []);
  const index = items.findIndex((item) => item.id === id);
  if (index === -1) return null;

  items[index] = { ...items[index], ...patch };
  await writeJsonFile(FILE, items);
  return items[index];
}

export async function deleteEnquiry(id: string) {
  return (await deleteEnquiries([id])) > 0;
}

export async function setEnquiryStatuses(ids: string[], status: string) {
  const selected = new Set(ids);
  const items = await readJsonFile<Enquiry[]>(FILE, []);
  let changed = 0;
  const next = items.map((item) => {
    if (!selected.has(item.id) || item.status === status) return item;
    changed += 1;
    return { ...item, status };
  });
  if (changed > 0) await writeJsonFile(FILE, next);
  return changed;
}

export function createReplyToken() {
  return randomBytes(32).toString("base64url");
}

export async function getEnquiryByReplyToken(token: string) {
  if (!token || token.length < 20) return null;
  const items = await listEnquiries();
  return items.find((item) => item.replyToken === token) ?? null;
}

export async function ensureReplyToken(id: string) {
  const items = await updateJsonFile<Enquiry[]>(FILE, [], (current) => {
    const index = current.findIndex((item) => item.id === id);
    if (index === -1 || current[index].replyToken) return current;
    const next = [...current];
    next[index] = { ...current[index], replyToken: createReplyToken() };
    return next;
  });
  return items.find((item) => item.id === id) ?? null;
}

export async function appendEnquiryMessage(id: string, message: EnquiryMessage) {
  const items = await updateJsonFile<Enquiry[]>(FILE, [], (current) => {
    const index = current.findIndex((item) => item.id === id);
    if (index === -1) return current;
    const item = current[index];
    const next = [...current];
    next[index] = {
      ...item,
      status: message.from === "staff" && item.status === "New" ? "Contacted" : item.status,
      messages: [...(item.messages ?? []), message],
    };
    return next;
  });
  return items.find((item) => item.id === id) ?? null;
}

export async function setEnquiryMessageEmailStatus(
  id: string,
  messageId: string,
  emailStatus: EnquiryMessage["emailStatus"],
) {
  await updateJsonFile<Enquiry[]>(FILE, [], (items) => {
    const index = items.findIndex((item) => item.id === id);
    if (index === -1) return items;
    items[index] = {
      ...items[index],
      messages: (items[index].messages ?? []).map((message) =>
        message.id === messageId ? { ...message, emailStatus } : message,
      ),
    };
    return items;
  });
}

export async function deleteEnquiries(ids: string[]) {
  const selected = new Set(ids);
  const items = await readJsonFile<Enquiry[]>(FILE, []);
  const next = items.filter((item) => !selected.has(item.id));
  const removed = items.length - next.length;
  if (removed > 0) await writeJsonFile(FILE, next);
  return removed;
}
