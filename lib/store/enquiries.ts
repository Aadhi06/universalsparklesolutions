import { readJsonFile, writeJsonFile } from "@/lib/store/io";

export const enquiryStatuses = ["New", "Contacted", "Quoted", "Closed"] as const;

export type EnquiryStatus = (typeof enquiryStatuses)[number];

export type EnquiryNote = {
  id: string;
  at: string;
  text: string;
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
  notification?: {
    customer: string;
    staff: string;
  };
};

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
