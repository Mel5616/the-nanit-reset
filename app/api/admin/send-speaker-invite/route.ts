import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { requireRole } from '@/lib/auth'
import { Resend } from 'resend'
import { renderSpeakerInvite } from '@/emails/render-helpers'
import { speakerDisplay } from '@/lib/speaker-agreement'
import { EVENT } from '@/lib/event'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  if (!(await requireRole('write'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { id } = await req.json()
  const db = getServiceClient()
  const { data: sp } = await db.from('speakers').select('*').eq('id', id).single()

  if (!sp) return NextResponse.json({ error: 'Speaker not found' }, { status: 404 })
  if (!sp.email) return NextResponse.json({ error: 'No email address for this speaker.' }, { status: 400 })

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
  const { fullName } = speakerDisplay(sp.name, sp.title, sp.organization)
  const firstName = sp.name.split(' ')[0]

  const html = await renderSpeakerInvite({
    displayName: fullName,
    firstName,
    organization: sp.organization,
    personalizedWhy: sp.personalized_why,
    involvedAs: sp.involved_as,
    letterUrl: `${baseUrl}/speaker/${sp.public_token}`,
    acceptUrl: `${baseUrl}/api/speaker/${sp.public_token}/rsvp?action=accept`,
    declineUrl: `${baseUrl}/api/speaker/${sp.public_token}/rsvp?action=decline`,
  })

  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      replyTo: EVENT.contactEmail,
      to: sp.email,
      subject: `An invitation to speak — ${EVENT.name}, ${EVENT.dateShort}`,
      html,
    })
  } catch {
    return NextResponse.json({ error: 'Failed to send email.' }, { status: 500 })
  }

  await db.from('speakers').update({ email_sent_at: new Date().toISOString() }).eq('id', id)
  return NextResponse.json({ ok: true })
}
