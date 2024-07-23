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
      <h1 className="text-4xl font-bold mb-4 text-center">Get an Assessment Of Your Immigration Case</h1>
      <br/><br/>
      <h1 className="text-2lg font-bold mb-4 text-center">Want to understand your visa options?</h1>
      <br/>
      <h1 className="text-sm mb-4 text-center">Submit the form below and our team of experienced attorneys will review your information and send a preliminary assessment of your case based on your goals.</h1>
      <PublicLeadForm />
    </div>
  )
}