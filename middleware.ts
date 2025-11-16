import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const isAuthenticated = !!req.auth;
  const userRole = (req.auth?.user as any)?.role;

  // Public routes
  const publicRoutes = ["/", "/login", "/register", "/forgot-password"];
  const isPublicRoute = 
    publicRoutes.some((route) => pathname === route) || 
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon");

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Protect admin routes
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
    if (userRole !== "admin") {
      return NextResponse.json(
        { error: "Forbidden" },
        { status: 403 }
      );
    }
  }

  // Protect dashboard routes
  if (
    pathname.startsWith("/dashboard") || 
    pathname.startsWith("/education") || 
    pathname.startsWith("/interview") || 
    pathname.startsWith("/cv") || 
    pathname.startsWith("/jobs") || 
    pathname.startsWith("/career") || 
    pathname.startsWith("/employer") || 
    pathname.startsWith("/profile")
  ) {
    if (!isAuthenticated) {
      const loginUrl = new URL("/login", req.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*|).*)"],
};

