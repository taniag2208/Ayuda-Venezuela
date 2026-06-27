import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  // Protect admin routes — all other routes are public
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // In production, add proper auth check here
    return NextResponse.next();
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
