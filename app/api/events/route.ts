import { NextResponse } from "next/server";
import { incrementEvent, trackableEvents, type TrackableEvent } from "@/lib/store/events";

export async function POST(request: Request) {
  const body = (await request.json().catch(() => null)) as { name?: string } | null;
  const name = body?.name;

  if (!name || !trackableEvents.includes(name as TrackableEvent)) {
    return NextResponse.json({ message: "Unknown event." }, { status: 400 });
  }

  await incrementEvent(name as TrackableEvent);
  return NextResponse.json({ ok: true });
}
