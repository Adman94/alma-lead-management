import { NextResponse } from 'next/server'
import { z } from 'zod'

const leadSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  countryOfCitizenship: z.string().min(1),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  visaCategories: z.array(z.string()),
  helpDescription: z.string().min(10),
})

export let leads: z.infer<typeof leadSchema>[] = []

const PAGE_SIZE = 10

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || 'ALL'

  let filteredLeads = leads

  if (search) {
    const searchLower = search.toLowerCase()
    filteredLeads = filteredLeads.filter(lead => 
      lead.firstName.toLowerCase().includes(searchLower) ||
      lead.lastName.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower) ||
      lead.countryOfCitizenship.toLowerCase().includes(searchLower)
    )
  }

  if (status !== 'ALL') {
    filteredLeads = filteredLeads.filter(lead => lead.status === status)
  }

  const totalLeads = filteredLeads.length
  const totalPages = Math.ceil(totalLeads / PAGE_SIZE)

  const paginatedLeads = filteredLeads.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return NextResponse.json({
    leads: paginatedLeads,
    page,
    totalPages,
    totalLeads
  })
}

export async function POST(request: Request) {
  const body = await request.json()

  try {
    const lead = leadSchema.parse(body)
    
    leads.push({
      ...lead,
      id: Date.now().toString(),
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
    })

    return NextResponse.json({ message: 'Lead created successfully' }, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}