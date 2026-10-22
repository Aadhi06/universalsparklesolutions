import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { COOKIE_NAME, readSessionToken } from "@/lib/admin/session";

export async function getSession() {
  const jar = await cookies();
  return readSessionToken(jar.get(COOKIE_NAME)?.value);
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }
  return session;
}
