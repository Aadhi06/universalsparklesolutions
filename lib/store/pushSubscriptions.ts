import { readJsonFile, updateJsonFile, writeJsonFile } from "@/lib/store/io";

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
  const next: PushSubscriptionRecord = {
    ...record,
    updatedAt: new Date().toISOString(),
  };
  await updateJsonFile<PushSubscriptionRecord[]>(FILE, [], (items) => {
    const index = items.findIndex((item) => item.endpoint === record.endpoint);
    if (index === -1) return [...items, next];
    const copy = [...items];
    copy[index] = next;
    return copy;
  });
  return next;
}

export async function deletePushSubscription(endpoint: string) {
  let removed = false;
  await updateJsonFile<PushSubscriptionRecord[]>(FILE, [], (items) => {
    const next = items.filter((item) => item.endpoint !== endpoint);
    removed = next.length !== items.length;
    return next;
  });
  return removed;
}

export async function replacePushSubscriptions(items: PushSubscriptionRecord[]) {
  await writeJsonFile(FILE, items);
}
