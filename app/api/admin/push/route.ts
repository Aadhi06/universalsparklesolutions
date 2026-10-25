import { NextResponse } from "next/server";
import { getSession } from "@/lib/admin/guard";
import { pushConfigured, pushPublicKey } from "@/lib/admin/notify";
import {
  deletePushSubscription,
  listPushSubscriptions,
  savePushSubscription,
} from "@/lib/store/pushSubscriptions";

export const runtime = "nodejs";

async function requireSession() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ message: "Sign in required." }, { status: 401 });
  }
  return null;
}

export async function GET() {
  const denied = await requireSession();
  if (denied) return denied;

  const subscriptions = await listPushSubscriptions();
  return NextResponse.json({
    configured: pushConfigured(),
    publicKey: pushConfigured() ? pushPublicKey() : "",
    subscriptions: subscriptions.map((item) => ({
      endpoint: item.endpoint,
      enquiries: item.enquiries,
      appointments: item.appointments,
    })),
  });
}

export async function POST(request: Request) {
  const denied = await requireSession();
  if (denied) return denied;
  if (!pushConfigured()) {
    return NextResponse.json(
      { message: "Push notifications are not configured on this server." },
      { status: 503 },
    );
  }

  const body = (await request.json()) as {
    subscription?: {
      endpoint?: string;
      keys?: { p256dh?: string; auth?: string };
    };
    enquiries?: boolean;
    appointments?: boolean;
  };

  const endpoint = body.subscription?.endpoint?.trim() ?? "";
  const p256dh = body.subscription?.keys?.p256dh?.trim() ?? "";
  const auth = body.subscription?.keys?.auth?.trim() ?? "";
  const enquiries = Boolean(body.enquiries);
  const appointments = Boolean(body.appointments);

  if (!endpoint || !p256dh || !auth) {
    return NextResponse.json({ message: "Missing push subscription." }, { status: 400 });
  }

  if (!enquiries && !appointments) {
    await deletePushSubscription(endpoint);
    return NextResponse.json({ ok: true });
  }

  await savePushSubscription({
    endpoint,
    keys: { p256dh, auth },
    enquiries,
    appointments,
  });
  return NextResponse.json({ ok: true });
}
