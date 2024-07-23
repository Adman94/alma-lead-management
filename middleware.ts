import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('auth_token')?.value

  if (request.nextUrl.pathname.startsWith('/internal') || request.nextUrl.pathname.startsWith('/submit-lead')) {
    if (!authToken) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/internal/:path*', '/submit-lead/:path*']
}