// app/api/auth/route.ts

import { NextResponse } from 'next/server'

const SECRET_KEY = process.env.SECRET_KEY || 'your-secret-key'

// Mock user data
const MOCK_USER = {
  username: 'admin',
  password: 'password123'
}

function generateToken(username: string): string {
  return `${username}-${Date.now()}-${SECRET_KEY}`
}

export async function POST(request: Request) {
  const body = await request.json()
  const { username, password } = body

  if (username === MOCK_USER.username && password === MOCK_USER.password) {
    const token = generateToken(username)
    
    console.log('Token generated:', token) // Debug log

    const response = NextResponse.json({ success: true, message: 'Login successful' })
    response.cookies.set('token', token, { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 // 1 hour
    })
    
    console.log('Cookie set:', response.cookies.get('token')) // Debug log
    
    return response
  }

  return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
}