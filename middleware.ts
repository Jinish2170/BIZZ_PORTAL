import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const authState = request.cookies.get("auth-state")?.value
  const isLoginPage = request.nextUrl.pathname === "/login"

  // If the user is not authenticated and trying to access a protected route
  if (!authState && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url))
  }

  // If the user is authenticated and trying to access login page
  if (authState && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
}