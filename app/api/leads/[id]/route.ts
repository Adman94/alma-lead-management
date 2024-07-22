import { NextResponse } from 'next/server'
import { z } from 'zod'

// This should be replaced with a database query in a real application
import { leads } from '../route'

const updateSchema = z.object({
  status: z.enum(['PENDING', 'REACHED_OUT']),
})

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const id = params.id
  const body = await request.json()

  try {
    const { status } = updateSchema.parse(body)
    
    const leadIndex = leads.findIndex(lead => lead.id === id)
    if (leadIndex === -1) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
    }

    leads[leadIndex] = { ...leads[leadIndex], status }

    return NextResponse.json(leads[leadIndex])
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 })
  }
}