import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const db = getServiceClient()
  const { data: sp } = await db
    .from('speakers')
    .select('name, title, organization, specialty, personalized_why, why_involved, proposed_topic, involvement_note, custom_provisions, involved_as, instagram_handle, status, agreement_status')
    .eq('public_token', token)
    .single()
  if (!sp) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(sp)
}
