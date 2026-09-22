import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { newToken } from '@/lib/auth'
import { Resend } from 'resend'
import { renderEoiConfirmed } from '@/emails/render-helpers'
import { EVENT } from '@/lib/event'

const resend = new Resend(process.env.RESEND_API_KEY)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const AUDIENCES = ['influencer', 'media', 'wellness', 'hcp', 'retail', 'celebrity']

export async function POST(req: NextRequest) {
  try {
    const b = await req.json().catch(() => ({}))
    if (typeof b.website === 'string' && b.website.trim() !== '') return NextResponse.json({ ok: true }) // honeypot

    const first = String(b.first_name || '').trim()
    const last = String(b.last_name || '').trim()
    const email = String(b.email || '').toLowerCase().trim()
    const phone = String(b.phone || '').trim()
    const audience = AUDIENCES.includes(b.audience_type) ? b.audience_type : 'influencer'

    if (!first) return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
    if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 })
    if (!phone) return NextResponse.json({ error: 'Please enter your mobile number.' }, { status: 400 })

    const db = getServiceClient()
    const { data: existing } = await db.from('guests').select('id').eq('email', email).maybeSingle()
    if (existing) return NextResponse.json({ ok: true, duplicate: true })

    const { error } = await db.from('guests').insert({
      first_name: first,
      last_name: last || '',
      email,
      phone: phone || null,
      instagram_handle: b.instagram_handle ? String(b.instagram_handle).trim() : null,
      company: b.company ? String(b.company).trim() : null,
      audience_type: audience,
      status: 'waitlist',
      invite_token: newToken(),
      added_by: 'eoi',
      checked_in: false,
      notes: b.notes ? String(b.notes).trim().slice(0, 500) : null,
    })
    if (error) {
      if (error.message.toLowerCase().includes('duplicate')) return NextResponse.json({ ok: true, duplicate: true })
      throw new Error(error.message)
    }

    try {
      const html = await renderEoiConfirmed(first)
      await resend.emails.send({ from: process.env.FROM_EMAIL!, to: email, subject: `Save the date, ${EVENT.name}, ${EVENT.dateShort}`, html })
    } catch { /* registration saved regardless */ }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
