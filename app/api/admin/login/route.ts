import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import {
  createSessionToken,
  getAdminCredentials,
  sessionCookieOptions,
} from "@/lib/admin/session";
import { authenticateUser } from "@/lib/store/users";

const WINDOW_MS = 10 * 60 * 1000;
const MAX_REQUESTS = 8;
const hits = new Map<string, number[]>();

function clientKey(request: Request) {
  return (
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "local"
  );
}

function isRateLimited(key: string) {
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((time) => now - time < WINDOW_MS);
  recent.push(now);
  hits.set(key, recent);
  return recent.length > MAX_REQUESTS;
}

function safeEqual(left: string, right: string) {
  const a = Buffer.from(left);
  const b = Buffer.from(right);
  if (a.length !== b.length) {
    return false;
  }
  return timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (isRateLimited(clientKey(request))) {
    return NextResponse.json(
      { message: "Too many sign-in attempts. Please wait a few minutes." },
      { status: 429 },
    );
  }

  const credentials = getAdminCredentials();
  if (!credentials.password) {
    return NextResponse.json(
      { message: "Admin password is not configured on this server." },
      { status: 503 },
    );
  }

  const body = (await request.json().catch(() => null)) as
    | { username?: string; password?: string }
    | null;
  const username = body?.username?.trim() ?? "";
  const password = body?.password ?? "";

  const ownerMatch =
    Boolean(username) &&
    Boolean(password) &&
    safeEqual(username.toLowerCase(), credentials.username.toLowerCase()) &&
    safeEqual(password, credentials.password);

  const staff = ownerMatch ? null : await authenticateUser(username, password);
  if (!ownerMatch && !staff) {
    return NextResponse.json(
      { message: "Those details did not match. Check the username and password." },
      { status: 401 },
    );
  }

  const token = await createSessionToken(staff?.username ?? credentials.username);
  const cookie = sessionCookieOptions();
  const response = NextResponse.json({ ok: true });
  response.cookies.set({
    name: cookie.name,
    value: token,
    httpOnly: cookie.httpOnly,
    sameSite: cookie.sameSite,
    secure: cookie.secure,
    path: cookie.path,
    maxAge: cookie.maxAge,
  });
  return response;
}
