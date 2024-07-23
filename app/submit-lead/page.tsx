'use client'

import { useRouter } from 'next/navigation'
import PublicLeadForm from '@/components/PublicLeadForm'
import React from 'react'

export default function SubmitLeadPage() {
  const router = useRouter()

  const handleSubmit = async (formData: any) => {
    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/thank-you')
      } else {
        // Handle error
        console.error('Failed to submit lead')
      }
    } catch (error) {
      console.error('Error submitting lead:', error)
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Submit Lead</h1>
      <PublicLeadForm />
    </div>
  )
}