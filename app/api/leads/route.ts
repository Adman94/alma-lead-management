// app/api/leads/route.ts

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { addLead, getLeads, Lead } from '@/lib/leadsStore'

type Lead = {
  id: string;
  firstName: string;
  lastName: string;
  status: string;
  submittedAt: string;
  resumeFilename: File;
}

const leadSchema = z.object({
  firstName: z.string().min(2),
  lastName: z.string().min(2),
  email: z.string().email(),
  countryOfCitizenship: z.string().min(1),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  visaCategories: z.array(z.string()),
  helpDescription: z.string().min(10),
  // resume is handled separately
})

export async function POST(request: Request) {
  console.log("Received POST request to /api/leads");

  try {
    const formData = await request.formData();
    console.log("FormData received:", Object.fromEntries(formData));

    const body: Record<string, FormDataEntryValue> = Object.fromEntries(formData);

    // Handle resume file
    const resumeFile = body.resume as Blob | null;
    const resumeFilename = resumeFile ? (resumeFile as any).name : null;

    // Parse visaCategories from JSON string
    const visaCategoriesString = body.visaCategories as string;
    console.log("visaCategoriesString:", visaCategoriesString);
    const visaCategories = JSON.parse(visaCategoriesString);
    console.log("Parsed visaCategories:", visaCategories);

    const dataToValidate = {
      ...body,
      visaCategories,
    };
    console.log("Data to validate:", dataToValidate);

    const validatedData = leadSchema.parse(dataToValidate);
    console.log("Validated data:", validatedData);

    const newLead: Lead = {
      ...validatedData,
      id: Date.now().toString(),
      status: 'PENDING',
      submittedAt: new Date().toISOString(),
      resumeFilename
    };

    addLead(newLead);

    console.log("New lead added:", newLead);

    return NextResponse.json({ message: 'Lead created successfully', lead: newLead }, { status: 201 })
  } catch (error) {
    console.error("Error processing lead submission:", error);
    if (error instanceof z.ZodError) {
      console.error("Zod validation error:", error.errors);
      return NextResponse.json({ errors: error.errors }, { status: 400 })
    }
    if (error instanceof Error) {
      console.error("Error details:", error.message, error.stack);
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

  const PAGE_SIZE = 10
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