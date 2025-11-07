import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default async function proxy(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
  const { pathname } = req.nextUrl;

 
  console.log("Middleware token:", token);


  if (!token) {
    
    if (
      pathname === "/" ||
      pathname.startsWith("/signin") ||
      pathname.startsWith("/api/auth") ||
      pathname.startsWith("/products")  
    ) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/signin", req.url));
  }


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

  if (pathname.startsWith("/signup")) {
    if (token.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }
  }

  if (pathname.startsWith("/products")) {
    return NextResponse.next();
  }
 
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/signup",
    "/products/:path*",
    "/", 
  ],
};
