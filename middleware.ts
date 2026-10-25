import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, readSessionToken } from "@/lib/admin/session";

const publicAdminFiles = new Set([
  "/admin/manifest.webmanifest",
  "/admin/sw.js",
  "/admin/offline.html",
  "/admin/icon-192.png",
  "/admin/icon-512.png",
  "/admin/apple-touch-icon.png",
]);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (publicAdminFiles.has(pathname) || pathname.startsWith("/admin/splash-")) {
    return NextResponse.next();
  }

  const session = await readSessionToken(request.cookies.get(COOKIE_NAME)?.value);
  const isLogin = pathname === "/admin/login";

  if (pathname.startsWith("/admin") && !isLogin && !session) {
    const login = new URL("/admin/login", request.url);
    login.searchParams.set("next", pathname);
    return NextResponse.redirect(login);
  }

  if (isLogin && session) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};
