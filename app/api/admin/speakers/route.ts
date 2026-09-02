import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { requireRole, newToken } from '@/lib/auth'
import { defaultAgreementClauses } from '@/lib/speaker-agreement'

export async function GET() {
  if (!(await requireRole('read'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getServiceClient()
  const { data } = await db.from('speakers').select('*').order('created_at', { ascending: false })
  return NextResponse.json(data || [])
}

export async function POST(req: NextRequest) {
  if (!(await requireRole('write'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const body = await req.json()
  if (!body.name) return NextResponse.json({ error: 'Name is required.' }, { status: 400 })

  const db = getServiceClient()
  const insert = {
    ...body,
    public_token: newToken(),
    agreement_body: body.agreement_body || defaultAgreementClauses({ org: body.organization || null, fee: body.agreement_fee || null }),
  }
  const { data, error } = await db.from('speakers').insert(insert).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PATCH(req: NextRequest) {
  if (!(await requireRole('write'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, ...updates } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 })
  const db = getServiceClient()
  const { data, error } = await db.from('speakers').update(updates).eq('id', id).select().single()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  if (!(await requireRole('write'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Missing id.' }, { status: 400 })
  const db = getServiceClient()
  await db.from('speakers').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
