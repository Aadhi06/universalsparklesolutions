import { readJsonFile, writeJsonFile } from "@/lib/store/io";

export type CampaignRecord = {
  id: string;
  at: string;
  subject: string;
  offer: string;
  sent: number;
  failed: number;
  skipped: number;
};

const FILE = "campaigns.json";

export async function listCampaigns() {
  const items = await readJsonFile<CampaignRecord[]>(FILE, []);
  return [...items].sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime());
}

export async function saveCampaign(record: CampaignRecord) {
  const items = await readJsonFile<CampaignRecord[]>(FILE, []);
  items.push(record);
  await writeJsonFile(FILE, items);
  return record;
}
