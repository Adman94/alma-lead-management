import { Button } from "@/components/ui/button"
import Link from 'next/link'
import React from "react"

export default function ThankYouPage() {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <h1 className="text-3xl font-bold mb-6">Thank You</h1>
      <p className="mb-6">Your information was submitted to our team of immigration attorneys. Expect an email from hello@tryalma.ai.</p>
      <Link href="/">
        <Button>Go Back to Homepage</Button>
      </Link>
    </div>
  )
}