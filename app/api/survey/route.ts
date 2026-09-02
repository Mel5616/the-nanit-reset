import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Resolve a guest token: prefill identity, note whether they attended, return any saved draft.
export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get('token')?.trim()
  if (!token) return NextResponse.json({ found: false })
  const db = getServiceClient()

  const { data: existing } = await db.from('survey_responses').select('*').eq('token', token).maybeSingle()
  const { data: guest } = await db
    .from('guests')
    .select('id, first_name, email, checked_in')
    .eq('invite_token', token)
    .maybeSingle()

  if (!guest && !existing) return NextResponse.json({ found: false })

  return NextResponse.json({
    found: true,
    guest_id: guest?.id ?? existing?.guest_id ?? null,
    first_name: guest?.first_name ?? existing?.first_name ?? '',
    email: guest?.email ?? existing?.email ?? '',
    attended: guest ? !!guest.checked_in : !!existing?.attended,
    saved: existing || null,
    already_submitted: existing?.status === 'submitted',
  })
}

// Save (draft) or submit a survey response.
export async function POST(req: NextRequest) {
  const b = await req.json().catch(() => ({}))
  const action = b.action === 'submit' ? 'submit' : 'save'
  const token = String(b.token || '').trim()
  if (!token) return NextResponse.json({ error: 'Missing token.' }, { status: 400 })

  const email = String(b.email || '').trim().toLowerCase()
  if (action === 'submit') {
    if (email && !EMAIL_RE.test(email)) return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 })
    if (!b.overall_rating) return NextResponse.json({ error: 'Please give an overall rating.' }, { status: 400 })
  }

  const clampInt = (v: unknown, min: number, max: number) => {
    const n = Number(v); return Number.isFinite(n) ? Math.max(min, Math.min(max, Math.round(n))) : null
  }

  const row = {
    token,
    guest_id: b.guest_id || null,
    first_name: b.first_name || null,
    email: email || null,
    attended: typeof b.attended === 'boolean' ? b.attended : null,
    overall_rating: clampInt(b.overall_rating, 1, 5),
    recommend: b.recommend == null ? null : clampInt(b.recommend, 0, 10),
    highlight: b.highlight || null,
    improve: b.improve || null,
    topics_next: b.topics_next || null,
    consent: !!b.consent,
    status: action === 'submit' ? 'submitted' : 'started',
    submitted_at: action === 'submit' ? new Date().toISOString() : null,
  }

  const db = getServiceClient()
  const { error } = await db.from('survey_responses').upsert(row, { onConflict: 'token' })
  if (error) return NextResponse.json({ error: 'Could not save. Please try again.' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
