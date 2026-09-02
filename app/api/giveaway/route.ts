import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { Resend } from 'resend'
import { renderGiveawayConfirmed } from '@/emails/render-helpers'
import { EVENT } from '@/lib/event'

const resend = new Resend(process.env.RESEND_API_KEY)
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export async function POST(req: NextRequest) {
  try {
    const b = await req.json().catch(() => ({}))

    // Honeypot — bots fill hidden fields. Pretend success.
    if (typeof b.website === 'string' && b.website.trim() !== '') return NextResponse.json({ ok: true })

    const firstName = String(b.first_name || '').trim()
    const lastName = String(b.last_name || '').trim()
    const email = String(b.email || '').toLowerCase().trim()
    const phone = String(b.phone || '').trim()
    const postcode = String(b.postcode || '').trim()
    const answer = String(b.answer || '').trim().slice(0, 500)
    const marketing = !!b.marketing_opt_in

    if (!firstName || firstName.length > 60) return NextResponse.json({ error: 'Please enter your first name.' }, { status: 400 })
    if (!EMAIL_RE.test(email)) return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    if (!b.eligibility) return NextResponse.json({ error: 'Please confirm you are 18 or over and accept the terms.' }, { status: 400 })

    const db = getServiceClient()

    const { data: prior } = await db.from('giveaway_entries').select('id').eq('email', email).maybeSingle()
    if (prior) return NextResponse.json({ ok: true, duplicate: true })

    const { error } = await db.from('giveaway_entries').insert({
      first_name: firstName, last_name: lastName || null, email, phone: phone || null,
      postcode: postcode || null, answer: answer || null, marketing_opt_in: marketing,
      source: String(b.source || 'direct').toLowerCase().slice(0, 40),
    })
    if (error) {
      if (error.message.toLowerCase().includes('duplicate')) return NextResponse.json({ ok: true, duplicate: true })
      throw new Error(error.message)
    }

    try {
      const html = await renderGiveawayConfirmed(firstName)
      await resend.emails.send({ from: process.env.FROM_EMAIL!, to: email, subject: `You're in the draw — ${EVENT.name}`, html })
    } catch { /* entry saved regardless */ }

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
