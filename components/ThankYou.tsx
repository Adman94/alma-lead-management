'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import Image from 'next/image'
import styles from './ThankYou.module.css'

export default function ThankYouPage() {
  const router = useRouter()

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/internal/leads')
    }, 3000) // Redirect after 3 seconds

    return () => clearTimeout(timer)
  }, [router])

  return (
    <div className={styles.container}>
      <Image src="/uploads/file-info.png" alt="Document Icon" width={48} height={48} />
      <h1 className={styles.title}>Thank You</h1>
      <p className={styles.message}>
        Your information was submitted to our team of immigration attorneys. 
        Expect an email from hello@tryalma.ai.
      </p>
      <Button 
        onClick={() => router.push('/')} 
        className={styles.button}
      >
        Go Back to Homepage
      </Button>
    </div>
  )
}