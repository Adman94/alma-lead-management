'use client'

import { useRouter } from 'next/navigation'
import PublicLeadForm from '@/components/PublicLeadForm'
import React from 'react'

export default function SubmitLeadPage() {
  const router = useRouter()

  const handleSubmit = async (formData: any) => {
    try {
      const formDataToSend = new FormData()

      // Append all form fields to FormData
      Object.keys(formData).forEach(key => {
        if (key === 'resume' && formData[key]) {
          // Handle file upload
          const file = dataURItoBlob(formData[key])
          formDataToSend.append('resume', file, 'resume.pdf')
        } else if (key === 'visaCategories') {
          // Convert array to JSON string
          formDataToSend.append(key, JSON.stringify(formData[key]))
        } else {
          formDataToSend.append(key, formData[key])
        }
      })

      const response = await fetch('/api/leads', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        router.push('/thank-you')
      } else {
        // Handle error
        console.error('Failed to submit lead')
        const errorData = await response.json()
        console.error('Error details:', errorData)
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('Error submitting lead:', error)
      // You might want to show an error message to the user here
    }
  }

  // Helper function to convert data URI to Blob
  function dataURItoBlob(dataURI: string) {
    const byteString = atob(dataURI.split(',')[1])
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab)
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i)
    }
    return new Blob([ab], { type: mimeString })
  }

  return (
    <div className="container mx-auto p-4">
      <PublicLeadForm onSubmit={handleSubmit} />
    </div>
  )
}