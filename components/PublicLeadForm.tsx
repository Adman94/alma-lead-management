'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { JsonForms } from '@jsonforms/react'
import { materialRenderers, materialCells } from '@jsonforms/material-renderers'
import { Button } from "@/components/ui/button"

const schema = {
  type: 'object',
  properties: {
    firstName: { type: 'string', minLength: 2 },
    lastName: { type: 'string', minLength: 2 },
    email: { type: 'string', format: 'email' },
    countryOfCitizenship: { type: 'string' },
    linkedinUrl: { type: 'string', format: 'uri' },
    visaCategories: { 
      type: 'array',
      items: { type: 'string', enum: ['O-1', 'EB-1A', 'EB-2 NIW'] },
      uniqueItems: true
    },
    helpDescription: { type: 'string', minLength: 10 },
    resume: { type: 'string', format: 'data-url' }
  },
  required: ['firstName', 'lastName', 'email', 'countryOfCitizenship', 'visaCategories', 'helpDescription']
}

const uischema = {
  type: 'VerticalLayout',
  elements: [
    {
      type: 'Control',
      scope: '#/properties/firstName',
      label: 'First Name'
    },
    {
      type: 'Control',
      scope: '#/properties/lastName',
      label: 'Last Name'
    },
    {
      type: 'Control',
      scope: '#/properties/email',
      label: 'Email'
    },
    {
      type: 'Control',
      scope: '#/properties/countryOfCitizenship',
      label: 'Country of Citizenship'
    },
    {
      type: 'Control',
      scope: '#/properties/linkedinUrl',
      label: 'LinkedIn URL (Optional)'
    },
    {
      type: 'Control',
      scope: '#/properties/visaCategories',
      label: 'Visa Categories',
      options: {
        format: 'checkbox'
      }
    },
    {
      type: 'Control',
      scope: '#/properties/helpDescription',
      label: 'How can we help you?',
      options: {
        multi: true
      }
    },
    {
      type: 'Control',
      scope: '#/properties/resume',
      label: 'Resume (Optional)',
      options: {
        accept: '.pdf,.doc,.docx'
      }
    }
  ]
}

export default function PublicLeadForm() {
  const [formData, setFormData] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  async function onSubmit() {
    setIsSubmitting(true)
    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'resume' && value) {
          // Assuming the value is a data URL
          const blob = dataURItoBlob(value)
          formDataToSend.append(key, blob, 'resume.pdf') // Adjust filename as needed
        } else if (key === 'visaCategories') {
          formDataToSend.append(key, JSON.stringify(value))
        } else if (value !== undefined && value !== null) {
          formDataToSend.append(key, value as string)
        }
      })

      const response = await fetch('/api/leads', {
        method: 'POST',
        body: formDataToSend,
      })

      if (response.ok) {
        console.log("Lead submitted successfully")
        router.push('/thank-you')
      } else {
        console.error('Failed to submit lead:', await response.json())
        // Handle error (e.g., show error message to user)
      }
    } catch (error) {
      console.error('Error submitting lead:', error)
      // Handle error (e.g., show error message to user)
    } finally {
      setIsSubmitting(false)
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
      <h1 className="text-2xl font-bold mb-6">Submit Lead</h1>
      <JsonForms
        schema={schema}
        uischema={uischema}
        data={formData}
        renderers={materialRenderers}
        cells={materialCells}
        onChange={({ data }) => setFormData(data)}
      />
      <Button 
        onClick={onSubmit} 
        disabled={isSubmitting} 
        className="mt-4"
      >
        {isSubmitting ? 'Submitting...' : 'Submit'}
      </Button>
    </div>
  )
}