import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { newToken } from '@/lib/auth'
import { Resend } from 'resend'
import { renderPasswordReset } from '@/emails/render-helpers'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
  const { email } = await req.json()
  const addr = String(email || '').toLowerCase().trim()
  // Always return ok to avoid leaking which emails exist.
  if (!addr) return NextResponse.json({ ok: true })

  const db = getServiceClient()
  const { data: user } = await db
    .from('admin_users')
    .select('id, name')
    .eq('email', addr)
    .not('invite_accepted_at', 'is', null)
    .single()

  if (user) {
    const reset_token = newToken()
    const reset_expires_at = new Date(Date.now() + 60 * 60 * 1000).toISOString()
    await db.from('admin_users').update({ reset_token, reset_expires_at }).eq('id', user.id)

    const resetUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/admin/reset-password/${reset_token}`
    try {
      const html = await renderPasswordReset({ name: user.name, resetUrl })
      await resend.emails.send({
        from: process.env.FROM_EMAIL!,
        to: addr,
        subject: 'Reset your The Nanit Reset admin password',
        html,
      })
    } catch { /* swallow — still return ok */ }
  }

  return NextResponse.json({ ok: true })
}
