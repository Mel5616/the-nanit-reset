import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/auth'
import { Resend } from 'resend'
import { render } from '@react-email/render'
import { createElement } from 'react'
import ThankYouEmail from '@/emails/thank-you'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const db = getServiceClient()
  const { data: guests } = await db.from('guests').select('*').eq('checked_in', true)
  if (!guests) return NextResponse.json({ error: 'Failed to fetch guests.' }, { status: 500 })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
  const results = { sent: 0, failed: 0 }
  for (const guest of guests) {
    try {
      const html = await render(createElement(ThankYouEmail, { guest, baseUrl }))
      await resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: guest.email,
        subject: `Thank you for joining us — The Nanit Reset`,
        html,
      })
      results.sent++
    } catch { results.failed++ }
  }
  return NextResponse.json(results)
}
