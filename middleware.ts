import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { COOKIE_NAME, readSessionToken } from "@/lib/admin/session";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
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
