import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { Resend } from 'resend'
import { renderRsvpConfirmed, renderRsvpDeclined } from '@/emails/render-helpers'
import { render } from '@react-email/render'
import { createElement } from 'react'
import AdminAlertEmail from '@/emails/admin-alert'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { token, guestId, action, details } = await req.json()

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
  const statusUnchanged = guest.status === newStatus

  // Build the update: status (if changed) + any details supplied on confirm.
  const update: Record<string, unknown> = {}
  if (!statusUnchanged) {
    update.status = newStatus
    if (action === 'confirm') update.rsvp_confirmed_at = new Date().toISOString()
  }
  if (action === 'confirm' && details) {
    if (details.first_name) update.first_name = String(details.first_name).trim()
    if (details.last_name != null) update.last_name = String(details.last_name).trim()
    if (details.email) update.email = String(details.email).toLowerCase().trim()
    if (details.instagram_handle) update.instagram_handle = String(details.instagram_handle).trim()
    if (details.phone) update.phone = String(details.phone).trim()
  }

  if (Object.keys(update).length) {
    const { error: updateError } = await db.from('guests').update(update).eq('id', guestId)
    if (updateError) return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }

  // Merge for downstream emails (use any updated email/name).
  const merged = { ...guest, ...update }

  // Only email on an actual status change.
  if (statusUnchanged) {
    return NextResponse.json({ ok: true, unchanged: true })
  }

  // Send confirmation/declined email
  try {
    if (action === 'confirm') {
      const html = await renderRsvpConfirmed(merged)
      await resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: merged.email,
        subject: "You're confirmed, The Nanit Reset",
        html,
      })
    } else {
      const html = await renderRsvpDeclined(merged)
      await resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: merged.email,
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
      const alertHtml = await render(createElement(AdminAlertEmail, { guest: merged, action: action === 'confirm' ? 'confirmed' : 'declined' }))
      await resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: process.env.ADMIN_NOTIFY_EMAIL,
        subject: `${merged.first_name} ${merged.last_name} has ${action === 'confirm' ? 'confirmed ✓' : 'declined ✗'}, The Nanit Reset`,
        html: alertHtml,
      })
    }
  } catch {
    // Don't fail RSVP if alert errors
  }

  return NextResponse.json({ ok: true })
}
