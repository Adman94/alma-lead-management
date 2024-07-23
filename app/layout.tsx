import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Alma Lead Management',
  description: 'Manage leads for Alma',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}