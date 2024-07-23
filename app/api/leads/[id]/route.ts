// app/api/leads/[id]/route.ts

import { NextResponse } from 'next/server'
import { z } from 'zod'
import { updateLead } from '@/lib/leadsStore'

const updateSchema = z.object({
  status: z.enum(['PENDING', 'REACHED_OUT']),
})

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await request.json()

    const { status } = updateSchema.parse(body)
    
    const updatedLead = updateLead(id, { status })
    if (!updatedLead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    return NextResponse.json(updatedLead)
  } catch (error) {
    console.error("Error updating lead status:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}