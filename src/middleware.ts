import { NextResponse, type NextRequest } from "next/server";

// Edge-safe presence check (the authoritative HMAC verify runs in the
// protected admin layout, which is Node runtime). Keep the name in sync
// with SESSION_COOKIE in src/lib/auth.ts.
const SESSION_COOKIE = "lpd_admin";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  if (pathname.startsWith("/admin/login")) return NextResponse.next();
  if (!req.cookies.has(SESSION_COOKIE)) {
    const url = req.nextUrl.clone();
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*"] };
