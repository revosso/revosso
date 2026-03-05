import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Protect admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    const authHeader = request.headers.get("authorization")
    const password = process.env.ADMIN_PASSWORD

    if (!password) {
      return NextResponse.json({ error: "Admin not configured" }, { status: 500 })
    }

    if (!authHeader || authHeader !== `Basic ${Buffer.from(`admin:${password}`).toString("base64")}`) {
      return new NextResponse("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'Basic realm="Admin Access"',
        },
      })
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: "/admin/:path*",
}

