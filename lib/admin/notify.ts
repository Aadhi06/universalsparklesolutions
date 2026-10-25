import webpush from "web-push";
import { sendAdminNotice } from "@/lib/email/sendNewEnquiry";
import {
  deletePushSubscription,
  listPushSubscriptions,
} from "@/lib/store/pushSubscriptions";

type Topic = "enquiries" | "appointments";

export function pushConfigured() {
  return Boolean(
    process.env.VAPID_PUBLIC_KEY?.trim() && process.env.VAPID_PRIVATE_KEY?.trim(),
  );
}

export function pushPublicKey() {
  return process.env.VAPID_PUBLIC_KEY?.trim() ?? "";
}

export async function notifyStaff(input: {
  topic: Topic;
  title: string;
  body: string;
  url: string;
  email?: boolean;
}) {
  if (input.email !== false) {
    try {
      await sendAdminNotice(input);
    } catch {
      // A mail failure should not stop the push attempt.
    }
  }

  const publicKey = pushPublicKey();
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim() ?? "";
  if (!publicKey || !privateKey) return;

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT?.trim() ||
      "mailto:admin@universalsparklesolution.com.au",
    publicKey,
    privateKey,
  );

  const subscriptions = (await listPushSubscriptions()).filter((item) =>
    input.topic === "enquiries" ? item.enquiries : item.appointments,
  );

  await Promise.all(
    subscriptions.map(async (item) => {
      try {
        await webpush.sendNotification(
          { endpoint: item.endpoint, keys: item.keys },
          JSON.stringify({
            title: input.title,
            body: input.body,
            url: input.url,
          }),
        );
      } catch (error) {
        const statusCode =
          typeof error === "object" && error && "statusCode" in error
            ? Number(error.statusCode)
            : 0;
        if (statusCode === 404 || statusCode === 410) {
          await deletePushSubscription(item.endpoint);
        }
      }
    }),
  );
}
