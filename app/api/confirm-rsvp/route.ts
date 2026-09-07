import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { Resend } from 'resend'
import { renderRsvpConfirmed, renderRsvpDeclined } from '@/emails/render-helpers'
import { render } from '@react-email/render'
import { createElement } from 'react'
import AdminAlertEmail from '@/emails/admin-alert'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { token, guestId, action } = await req.json()

  if (!token || !guestId || !['confirm', 'decline'].includes(action)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const db = getServiceClient()

  const { data: guest, error } = await db
    .from('guests')
    .select('*')
    .eq('id', guestId)
    .eq('invite_token', token)
    .single()

  if (error || !guest) {
    return NextResponse.json({ error: 'Guest not found' }, { status: 404 })
  }

  const newStatus = action === 'confirm' ? 'confirmed' : 'declined'

  // No change, don't re-send emails.
  if (guest.status === newStatus) {
    return NextResponse.json({ ok: true, unchanged: true })
  }

  const update =
    action === 'confirm'
      ? { status: 'confirmed', rsvp_confirmed_at: new Date().toISOString() }
      : { status: 'declined' }

  const { error: updateError } = await db.from('guests').update(update).eq('id', guestId)

  if (updateError) {
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }

  // Send confirmation/declined email
  try {
    if (action === 'confirm') {
      const html = await renderRsvpConfirmed(guest)
      await resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: guest.email,
        subject: "You're confirmed, The Nanit Reset",
        html,
      })
    } else {
      const html = await renderRsvpDeclined(guest)
      await resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: guest.email,
        subject: "Thank you, The Nanit Reset",
        html,
      })
    }
  } catch {
    // Don't fail the RSVP if email errors
  }

  // Admin alert
  try {
    if (process.env.ADMIN_NOTIFY_EMAIL) {
      const alertHtml = await render(createElement(AdminAlertEmail, { guest, action: action === 'confirm' ? 'confirmed' : 'declined' }))
      await resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: process.env.ADMIN_NOTIFY_EMAIL,
        subject: `${guest.first_name} ${guest.last_name} has ${action === 'confirm' ? 'confirmed ✓' : 'declined ✗'}, The Nanit Reset`,
        html: alertHtml,
      })
    }
  } catch {
    // Don't fail RSVP if alert errors
  }

  return NextResponse.json({ ok: true })
}
