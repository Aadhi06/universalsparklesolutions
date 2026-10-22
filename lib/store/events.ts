import { readJsonFile, writeJsonFile } from "@/lib/store/io";

const FILE = "events.json";

export const trackableEvents = [
  "phone_click",
  "whatsapp_click",
  "quote_submitted",
] as const;

export type TrackableEvent = (typeof trackableEvents)[number];

export type EventCounts = Record<TrackableEvent, number>;

const emptyCounts: EventCounts = {
  phone_click: 0,
  whatsapp_click: 0,
  quote_submitted: 0,
};

export async function getEventCounts() {
  const stored = await readJsonFile<Partial<EventCounts>>(FILE, {});
  return { ...emptyCounts, ...stored };
}

export async function incrementEvent(name: TrackableEvent) {
  const counts = await getEventCounts();
  counts[name] += 1;
  await writeJsonFile(FILE, counts);
  return counts;
}
