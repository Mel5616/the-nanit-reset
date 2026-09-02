import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { newToken } from '@/lib/auth'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const AUDIENCES = ['influencer', 'media', 'wellness', 'hcp', 'retail', 'celebrity']

// Resolve the referring guest + count their opens.
export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const db = getServiceClient()
  const { data: referrer } = await db.from('guests').select('first_name, status').eq('invite_token', token).maybeSingle()
  if (!referrer) return NextResponse.json({ found: false })

  // Bump open count (best-effort).
  const { data: stat } = await db.from('referral_stats').select('opens').eq('token', token).maybeSingle()
  if (stat) await db.from('referral_stats').update({ opens: (stat.opens || 0) + 1, updated_at: new Date().toISOString() }).eq('token', token)
  else await db.from('referral_stats').insert({ token, opens: 1 })

  return NextResponse.json({ found: true, referrer_name: referrer.first_name })
}

// A referred person registers their interest.
export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const b = await req.json().catch(() => ({}))
  if (typeof b.website === 'string' && b.website.trim() !== '') return NextResponse.json({ ok: true }) // honeypot

  const first = String(b.first_name || '').trim()
  const last = String(b.last_name || '').trim()
  const email = String(b.email || '').toLowerCase().trim()
  const audience = AUDIENCES.includes(b.audience_type) ? b.audience_type : 'influencer'

  if (!first || !EMAIL_RE.test(email)) return NextResponse.json({ error: 'Please enter your name and a valid email.' }, { status: 400 })

  const db = getServiceClient()
  const { data: referrer } = await db.from('guests').select('first_name').eq('invite_token', token).maybeSingle()
  if (!referrer) return NextResponse.json({ error: 'This referral link isn\'t valid.' }, { status: 404 })

  const { data: existing } = await db.from('guests').select('id').eq('email', email).maybeSingle()
  if (existing) return NextResponse.json({ error: 'You\'re already on our list with this email.' }, { status: 409 })

  const { error } = await db.from('guests').insert({
    first_name: first,
    last_name: last || '',
    email,
    audience_type: audience,
    status: 'waitlist',
    invite_token: newToken(),
    added_by: `referral:${token}`,
    company: b.company || null,
    instagram_handle: b.instagram_handle || null,
    checked_in: false,
  })
  if (error) return NextResponse.json({ error: 'Could not register you. Please try again.' }, { status: 500 })

  return NextResponse.json({ ok: true })
}
