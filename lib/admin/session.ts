const COOKIE_NAME = "uss_admin_session";
const SESSION_DAYS = 7;

type SessionPayload = {
  v: 1;
  sub: string;
  exp: number;
};

function encoder() {
  return new TextEncoder();
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array) {
  const array = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  array.forEach((byte) => {
    binary += String.fromCharCode(byte);
  });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/");
  const binary = atob(padded);
  return Uint8Array.from(binary, (char) => char.charCodeAt(0));
}

export function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.ADMIN_PASSWORD?.trim() ||
    (process.env.NODE_ENV === "production" ? "" : "uss-dev-session-secret")
  );
}

export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME?.trim() || "admin";
  const password =
    process.env.ADMIN_PASSWORD?.trim() ||
    (process.env.NODE_ENV === "production" ? "" : "sparkle-admin");

  return {
    username,
    password,
    usingDevDefaults:
      !process.env.ADMIN_PASSWORD?.trim() && process.env.NODE_ENV !== "production",
  };
}

async function hmac(secret: string, value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  return crypto.subtle.sign("HMAC", key, encoder().encode(value));
}

export async function createSessionToken(username: string) {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error("Admin session secret is not configured.");
  }

  const payload: SessionPayload = {
    v: 1,
    sub: username,
    exp: Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000,
  };
  const encoded = toBase64Url(encoder().encode(JSON.stringify(payload)));
  const signature = toBase64Url(await hmac(secret, encoded));
  return `${encoded}.${signature}`;
}

export async function readSessionToken(token: string | undefined) {
  if (!token || !token.includes(".")) return null;
  const secret = getSessionSecret();
  if (!secret) return null;

  const [encoded, signature] = token.split(".");
  const expected = toBase64Url(await hmac(secret, encoded));
  const left = fromBase64Url(signature);
  const right = fromBase64Url(expected);
  if (left.length !== right.length) return null;

  let match = 0;
  left.forEach((byte, index) => {
    match |= byte ^ right[index];
  });
  if (match !== 0) return null;

  try {
    const payload = JSON.parse(
      new TextDecoder().decode(fromBase64Url(encoded)),
    ) as SessionPayload;
    if (payload.v !== 1 || !payload.sub || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export function sessionCookieOptions() {
  return {
    name: COOKIE_NAME,
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_DAYS * 24 * 60 * 60,
  };
}

export { COOKIE_NAME };
