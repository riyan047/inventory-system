import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

  // ✅ Log token for debugging (optional — you can remove later)
  console.log("Middleware token:", token);

  // 🚫 If not signed in, block access to any protected routes
  if (!token) {
    // Allow public pages like home, login, and signup redirect
    if (
      pathname === "/" ||
      pathname.startsWith("/signin") ||
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/products") // users can still view inventory
    ) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // ✅ ADMIN-only routes protection
  if (pathname.startsWith("/admin")) {
    if (token.role !== "ADMIN") {
      console.log(
        "User role is:",
        token.role,
        "→ redirecting to /unauthorized"
      );
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // ✅ ADMIN-only signup protection
  if (pathname.startsWith("/signup")) {
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  // ✅ /products route is open for all logged-in users
  if (pathname.startsWith("/products")) {
    return NextResponse.next();
  }

  // Default: allow access
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/signup",
    "/products/:path*",
    "/", // optional: covers home if you want to restrict it
  ],
};
