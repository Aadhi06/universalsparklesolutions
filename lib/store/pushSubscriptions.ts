import { readJsonFile, writeJsonFile } from "@/lib/store/io";

export type PushSubscriptionRecord = {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
  enquiries: boolean;
  appointments: boolean;
  updatedAt: string;
};

const FILE = "push-subscriptions.json";

export async function listPushSubscriptions() {
  return readJsonFile<PushSubscriptionRecord[]>(FILE, []);
}

export async function savePushSubscription(
  record: Omit<PushSubscriptionRecord, "updatedAt">,
) {
  const items = await listPushSubscriptions();
  const next: PushSubscriptionRecord = {
    ...record,
    updatedAt: new Date().toISOString(),
  };
  const index = items.findIndex((item) => item.endpoint === record.endpoint);
  if (index === -1) items.push(next);
  else items[index] = next;
  await writeJsonFile(FILE, items);
  return next;
}

export async function deletePushSubscription(endpoint: string) {
  const items = await listPushSubscriptions();
  const next = items.filter((item) => item.endpoint !== endpoint);
  if (next.length === items.length) return false;
  await writeJsonFile(FILE, next);
  return true;
}
