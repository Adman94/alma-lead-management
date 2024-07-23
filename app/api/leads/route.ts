// app/api/leads/route.ts

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { addLead, getLeads } from '@/lib/leadsStore'
import type { Lead } from '@/lib/leadsStore'

const leadSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  countryOfCitizenship: z.string().min(1),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  visaCategories: z.array(z.string()),
  helpDescription: z.string().min(10),
})

export async function POST(request: Request) {
  console.log("Received POST request to /api/leads");

  try {
    const formData = await request.formData();
    console.log("FormData received:", Object.fromEntries(formData));

    const body: Record<string, FormDataEntryValue> = Object.fromEntries(formData);

    const resumeFile = body.resume as Blob | null;
    const resumeFilename = resumeFile ? (resumeFile as any).name : null;

    const visaCategoriesString = body.visaCategories as string;
    const visaCategories = JSON.parse(visaCategoriesString);

    const dataToValidate = {
      ...body,
      visaCategories,
    };

    const validatedData = leadSchema.parse(dataToValidate);

    const newLead: typeof Lead = {
      ...validatedData,
      id: Date.now().toString(),
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
      resumeFilename
    };

    addLead(newLead);

    console.log("New lead added:", newLead);
    console.log("Total leads:", getLeads().length);

    return NextResponse.json({ message: 'Lead created successfully', lead: newLead }, { status: 201 })
  } catch (error) {
    console.error("Error processing lead submission:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'An unexpected error occurred', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get('page') || '1', 10)
  const search = searchParams.get('search') || ''
  const status = searchParams.get('status') || 'ALL'

  let filteredLeads = getLeads()

  console.log("Total leads before filtering:", filteredLeads.length);

  if (search) {
    const searchLower = search.toLowerCase()
    filteredLeads = filteredLeads.filter((lead: typeof Lead) => 
      lead.firstName.toLowerCase().includes(searchLower) ||
      lead.lastName.toLowerCase().includes(searchLower) ||
      lead.email.toLowerCase().includes(searchLower) ||
      lead.countryOfCitizenship.toLowerCase().includes(searchLower)
    )
  }

  if (status !== 'ALL') {
    filteredLeads = filteredLeads.filter((lead: typeof Lead) => lead.status === status)
  }

  const PAGE_SIZE = 10
  const totalLeads = filteredLeads.length
  const totalPages = Math.ceil(totalLeads / PAGE_SIZE)

  const paginatedLeads = filteredLeads.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  console.log("Filtered leads:", filteredLeads.length);
  console.log("Paginated leads:", paginatedLeads.length);

  return NextResponse.json({
    leads: paginatedLeads,
    page,
    totalPages,
    totalLeads
  })
}