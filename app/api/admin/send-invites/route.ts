import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/auth'
import { Resend } from 'resend'
import { renderInvitation } from '@/emails/render-helpers'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { guestIds } = await req.json()
  if (!Array.isArray(guestIds) || guestIds.length === 0) {
    return NextResponse.json({ error: 'No guests specified.' }, { status: 400 })
  }

  const db = getServiceClient()
  const { data: guests, error } = await db
    .from('guests')
    .select('*')
    .in('id', guestIds)
    .in('status', ['pending', 'waitlist'])

  if (error || !guests) {
    return NextResponse.json({ error: 'Failed to fetch guests.' }, { status: 500 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
  const results = { sent: 0, failed: 0 }

  for (const guest of guests) {
    try {
      const html = await renderInvitation(guest, baseUrl)
      await resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: guest.email,
        subject: `You're invited — The Nanit Reset, 15 November 2026`,
        html,
      })
      await db
        .from('guests')
        .update({ status: 'invited', invite_sent_at: new Date().toISOString() })
        .eq('id', guest.id)
      results.sent++
    } catch {
      results.failed++
    }
  }

  return NextResponse.json(results)
}
