import { NextRequest, NextResponse } from "next/server";

import { getToken } from "next-auth/jwt";
export const config = {
  matcher: ["/sign-in", "/sign-up", "/dashboard", "/home"],
};

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });
  const url = request.nextUrl;

  if (token && url.pathname.startsWith("/sign-in")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (!token && url.pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}
