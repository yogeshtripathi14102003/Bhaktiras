import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Edge-compatible token check (jsonwebtoken doesn't run in the Edge
// runtime, so middleware uses `jose` instead — same JWT_SECRET).
const encoder = new TextEncoder();

export async function middleware(req) {
  const { pathname } = req.nextUrl;
  const isAdminRoute = pathname.startsWith("/admin");
  const isDashboardRoute = pathname.startsWith("/dashboard");

  if (!isAdminRoute && !isDashboardRoute) return NextResponse.next();

  const token = req.cookies.get("kb_token")?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, encoder.encode(process.env.JWT_SECRET));
    if (isAdminRoute && payload.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    return NextResponse.next();
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*"],
};
