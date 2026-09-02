import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { newToken } from '@/lib/auth'

export async function GET(req: NextRequest, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const action = new URL(req.url).searchParams.get('action')
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!

  const db = getServiceClient()
  const { data: sp } = await db
    .from('speakers')
    .select('id, name, email, status')
    .eq('public_token', token)
    .single()

  if (!sp) return NextResponse.redirect(new URL('/', req.url))

  const status = action === 'accept' ? 'confirmed' : 'declined'
  await db.from('speakers').update({ status }).eq('id', sp.id)

  // On acceptance, add the speaker to the guest list as a VIP (if not already there).
  if (action === 'accept' && sp.email) {
    const email = sp.email.toLowerCase()
    const { data: existing } = await db.from('guests').select('id').eq('email', email).single()
    if (!existing) {
      const parts = sp.name.trim().split(' ')
      await db.from('guests').insert({
        first_name: parts[0],
        last_name: parts.length > 1 ? parts.slice(1).join(' ') : '',
        email,
        audience_type: 'celebrity',
        status: 'confirmed',
        invite_token: newToken(),
        added_by: 'speaker',
        checked_in: false,
        speaker_session: true,
      })
    }
  }

  return NextResponse.redirect(`${baseUrl}/speaker/${token}?rsvp=${action}`)
}
