import { headers } from "next/headers";
import { getSiteUrl } from "@/lib/site";

export async function appOrigin() {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host");
  if (!host) return getSiteUrl();
  const forwarded = headerStore.get("x-forwarded-proto");
  const proto =
    forwarded ||
    (host.startsWith("localhost") || host.startsWith("127.") ? "http" : "https");
  return `${proto}://${host}`;
}
