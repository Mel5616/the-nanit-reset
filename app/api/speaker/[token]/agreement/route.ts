import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { Resend } from 'resend'
import { EVENT } from '@/lib/event'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function GET(_req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const db = getServiceClient()
  const { data: sp } = await db
    .from('speakers')
    .select('name, title, organization, involved_as, agreement_fee, agreement_body, agreement_status, agreement_speaker_signature, agreement_speaker_signed_at, agreement_org_signature, agreement_org_signed_at')
    .eq('public_token', token)
    .single()
  if (!sp) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(sp)
}

export async function POST(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const { signature } = await req.json().catch(() => ({ signature: null }))
  if (!signature || !String(signature).trim()) {
    return NextResponse.json({ error: 'Please type your full name to sign.' }, { status: 400 })
  }

  const db = getServiceClient()
  const { data: sp } = await db.from('speakers').select('id, name, agreement_status').eq('public_token', token).single()
  if (!sp) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  if (sp.agreement_status === 'signed_by_speaker' || sp.agreement_status === 'fully_executed') {
    return NextResponse.json({ error: 'This agreement has already been signed.' }, { status: 409 })
  }

  await db.from('speakers').update({
    agreement_status: 'signed_by_speaker',
    agreement_speaker_signature: String(signature).trim(),
    agreement_speaker_signed_at: new Date().toISOString(),
  }).eq('id', sp.id)

  try {
    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: process.env.ADMIN_NOTIFY_EMAIL || EVENT.contactEmail,
      subject: `Speaker agreement signed — ${sp.name}`,
      html: `<div style="font-family:Arial,sans-serif;font-size:14px;color:#333;line-height:1.6"><p><strong>${sp.name}</strong> has signed their speaker agreement for ${EVENT.name}.</p><p>Counter-sign it from the dashboard → Speakers tab to finalise.</p></div>`,
    })
  } catch { /* non-fatal */ }

  return NextResponse.json({ ok: true })
}
