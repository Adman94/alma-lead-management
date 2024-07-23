import { NextResponse } from 'next/server'

const MOCK_USER = {
  username: 'admin',
  password: 'password123'
}

export async function POST(request: Request) {
  const body = await request.json()
  const { username, password } = body

  if (username === MOCK_USER.username && password === MOCK_USER.password) {
    const response = NextResponse.json({ success: true, message: 'Login successful' })
    response.cookies.set('auth_token', 'mock_token', { 
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 // 1 hour
    })
    
    return response
  }

  return NextResponse.json({ success: false, message: 'Invalid credentials' }, { status: 401 })
}