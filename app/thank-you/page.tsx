'use client'

import { useRouter } from 'next/navigation'
import React from 'react'
import { useEffect } from 'react'

export default function ThankYouPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/internal')
    }, 3000) // Redirect after 3 seconds

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold mb-4">Thank You!</h1>
        <p>Your information was submitted to our team of immigration attorneys.</p>
        <p>Expect an email from hello@tryalma.ai</p>
      </div>
    </div>
  )
}