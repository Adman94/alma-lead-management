// middleware.ts

import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value

  console.log('Middleware - Token received:', token) // Debug log

  if (request.nextUrl.pathname.startsWith('/internal')) {
    if (!token) {
      console.log('Middleware - No token, redirecting to login') // Debug log
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // For this simple example, we're just checking if the token exists
    // In a real application, you'd want to validate the token more thoroughly
    if (token) {
      console.log('Middleware - Token exists, allowing access') // Debug log
      return NextResponse.next()
    } else {
      console.log('Middleware - Invalid token, redirecting to login') // Debug log
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/internal/:path*'],
}