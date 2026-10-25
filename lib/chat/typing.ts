import { readJsonFile, updateJsonFile } from "@/lib/store/io";

type TypingFile = Record<string, { customer?: string; staff?: string }>;

const FILE = "typing.json";
const FRESH_MS = 4000;

export async function markTyping(id: string, party: "customer" | "staff") {
  await updateJsonFile<TypingFile>(FILE, {}, (current) => ({
    ...current,
    [id]: { ...current[id], [party]: new Date().toISOString() },
  }));
}

export async function readTyping(id: string) {
  const all = await readJsonFile<TypingFile>(FILE, {});
  const row = all[id];
  return {
    customer: fresh(row?.customer),
    staff: fresh(row?.staff),
  };
}

function fresh(value?: string) {
  if (!value) return false;
  const time = new Date(value).getTime();
  return !Number.isNaN(time) && Date.now() - time < FRESH_MS;
}
