import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { requireRole } from '@/lib/auth'
import { Resend } from 'resend'
import { renderSurveyInvite } from '@/emails/render-helpers'
import { EVENT } from '@/lib/event'

const resend = new Resend(process.env.RESEND_API_KEY)

// Send the feedback survey to confirmed guests. audience: 'attended' (checked in) or 'all confirmed'.
export async function POST(req: NextRequest) {
  if (!(await requireRole('write'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { scope, guestIds } = await req.json().catch(() => ({ scope: 'attended' }))

  const db = getServiceClient()
  let query = db.from('guests').select('*').eq('status', 'confirmed')
  if (Array.isArray(guestIds) && guestIds.length) query = db.from('guests').select('*').in('id', guestIds)
  else if (scope === 'attended') query = query.eq('checked_in', true)

  const { data: guests } = await query
  if (!guests || !guests.length) return NextResponse.json({ error: 'No matching guests.' }, { status: 400 })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
  const results = { sent: 0, failed: 0 }
  for (const g of guests) {
    try {
      const html = await renderSurveyInvite({
        firstName: g.first_name,
        surveyUrl: `${baseUrl}/survey/${g.invite_token}`,
        attended: !!g.checked_in,
      })
      await resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: g.email,
        subject: `How did we do? — ${EVENT.name}`,
        html,
      })
      results.sent++
    } catch { results.failed++ }
  }
  return NextResponse.json(results)
}
