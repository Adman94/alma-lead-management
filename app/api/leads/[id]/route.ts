import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getLead, updateLead } from '@/lib/leadsStore';

const leadSchema = z.object({
  status: z.enum(['PENDING', 'REACHED_OUT']),
});

export async function PATCH(request: Request) {
  try {
    const contentType = request.headers.get('Content-Type') || '';

    if (contentType === 'application/json') {
      const body = await request.json();
      const validatedData = leadSchema.parse(body);
      const url = new URL(request.url);
      const leadId = url.pathname.split('/')[3];

      const existingLead = getLead(leadId);
      if (!existingLead) {
        console.error(`Lead with ID ${leadId} not found.`);
        return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
      }

      const updatedLead = {
        ...existingLead,
        status: validatedData.status,
        updatedAt: new Date().toISOString(),
      };

      updateLead(leadId, updatedLead);
      return NextResponse.json(updatedLead, { status: 200 });
    } else {
      return NextResponse.json({ error: 'Unsupported Media Type' }, { status: 415 });
    }
  } catch (error) {
    console.error("Error processing lead update:", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ errors: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}


export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const leadId = url.pathname.split('/')[3];

    const lead = getLead(leadId);
    if (!lead) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ lead }, { status: 200 });
  } catch (error) {
    console.error("Error fetching lead:", error);
    return NextResponse.json({ error: 'An unexpected error occurred', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 });
  }
}
