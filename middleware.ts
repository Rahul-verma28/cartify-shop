import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    // Check if user is admin for admin routes
    if (req.nextUrl.pathname.startsWith("/admin")) {
      if (!req.nextauth.token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
      if (req.nextauth.token?.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    // Prevent logged-in users from accessing the sign-in page
    if (
      (req.nextUrl.pathname === "/auth/signin" ||
        req.nextUrl.pathname === "/auth/signup") &&
      req.nextauth.token
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        if (req.nextUrl.pathname.startsWith("/api/auth")) return true;
        if (req.nextUrl.pathname === "/") return true;
        if (req.nextUrl.pathname.startsWith("/products")) return true;
        if (req.nextUrl.pathname.startsWith("/auth")) return true;

        // Require authentication for protected routes
        if (req.nextUrl.pathname.startsWith("/account")) return !!token;
        if (req.nextUrl.pathname.startsWith("/admin")) return !!token;
        if (req.nextUrl.pathname.startsWith("/checkout")) return !!token;

        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    "/account/:path*",
    "/admin/:path*",
    "/checkout/:path*",
    "/auth/signin",
  ],
};
