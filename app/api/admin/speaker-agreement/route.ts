import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { requireRole } from '@/lib/auth'

// Owner/manager counter-signs a speaker agreement to fully execute it.
export async function POST(req: NextRequest) {
  if (!(await requireRole('write'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, signature } = await req.json()
  if (!id || !signature || !String(signature).trim()) {
    return NextResponse.json({ error: 'Signature required.' }, { status: 400 })
  }
  const db = getServiceClient()
  const { data: sp } = await db.from('speakers').select('agreement_status').eq('id', id).single()
  if (!sp) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (sp.agreement_status !== 'signed_by_speaker') {
    return NextResponse.json({ error: 'The speaker must sign first.' }, { status: 409 })
  }
  await db.from('speakers').update({
    agreement_status: 'fully_executed',
    agreement_org_signature: String(signature).trim(),
    agreement_org_signed_at: new Date().toISOString(),
  }).eq('id', id)
  return NextResponse.json({ ok: true })
}
