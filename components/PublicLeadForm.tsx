'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { JsonForms } from '@jsonforms/react'
import { materialRenderers, materialCells } from '@jsonforms/material-renderers'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import styles from './PublicLeadForm.module.css'

// Updated schema to make 'resume' optional
const schema = {
  type: 'object',
  properties: {
    firstName: { type: 'string', minLength: 2 },
    lastName: { type: 'string', minLength: 2 },
    email: { type: 'string', format: 'email' },
    countryOfCitizenship: { 
      type: 'string',
      enum: ['United States', 'Canada', 'Mexico', 'Brazil', 'United Kingdom', 'France', 'Germany', 'China', 'Japan', 'India']
    },
    linkedinUrl: { type: 'string', format: 'uri' },
    googleScholarUrl: { type: 'string', format: 'uri' },
    visaCategories: { 
      type: 'array',
      items: { type: 'string', enum: ['O-1', 'EB-1A', 'EB-2 NIW', 'I don\'t know'] },
      uniqueItems: true
    },
    helpDescription: { type: 'string', minLength: 10 },
    // Remove 'resume' from the schema required list
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
    // File upload input is handled separately, so remove it from the schema
    {
      type: 'Control',
      scope: '#/properties/countryOfCitizenship',
      label: 'Country of Citizenship'
    },
    {
      type: 'Control',
      scope: '#/properties/linkedinUrl',
      label: 'LinkedIn / Personal Website URL'
    },
    {
      type: 'Control',
      scope: '#/properties/googleScholarUrl',
      label: 'Google Scholar URL'
    },
    {
      type: 'Control',
      scope: '#/properties/visaCategories',
      label: 'Visa categories of interest?',
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
    }
  ]
}

export default function PublicLeadForm({ onSubmit }: { onSubmit: (data: any) => void }) {
  const [formData, setFormData] = useState<any>({});
  const [resume, setResume] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setResume(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      
      // Append formData fields
      Object.entries(formData).forEach(([key, value]) => {
        if (key === 'visaCategories') {
          formDataToSend.append(key, JSON.stringify(value));
        } else if (value !== undefined && value !== null) {
          formDataToSend.append(key, value as string);
        }
      });

      // Append resume file if provided
      if (resume) {
        formDataToSend.append('resume', resume);
      }

      const response = await fetch('/api/leads', {
        method: 'POST',
        body: formDataToSend,
      });

      if (response.ok) {
        router.push('/thank-you');
      } else {
        const errorData = await response.json();
        console.error('Failed to submit lead:', errorData);
        // Handle error (e.g., show error message to user)
      }
    } catch (error) {
      console.error('Error submitting lead:', error);
      // Handle error (e.g., show error message to user)
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.backgroundImage}>
        <Image src="/uploads/header_img.png" alt="Background Image" layout="fill" objectFit="contain" />  
      </div>
      <div className={styles.formContainer}>
        <div className={styles.formIntro}>
          <Image src="/uploads/file-info.png" alt="Document Icon" width={100} height={100} />
            <h2>Want to understand your visa options?</h2>
            <p>Submit the form below and our team of experienced attorneys will review your information and send a preliminary assessment of your case based on your goals.</p>
        </div>
        <JsonForms
          schema={schema}
          uischema={uischema}
          data={formData}
          renderers={materialRenderers}
          cells={materialCells}
          onChange={({ data }) => setFormData(data)}
        />
        <div className={`${styles.fileUpload} ${styles.antUpload} ant-upload-drag`}>
            <label htmlFor="cv" className={styles.antUploadBtn}>
              <input
                id="cv"
                type="file"
                name="cv"
                accept=".pdf,.doc,.docx"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                required
              />
              <div className="ant-upload-drag-container">
                <p className="ant-upload-text font-medium">Upload CV</p>
                <p className="ant-upload-hint">Drag & drop files here</p>
              </div>
            </label>
          </div>
        <Button 
          onClick={handleSubmit} 
          disabled={isSubmitting} 
          className={styles.submitButton}
        >
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
    </div>
  )
}
