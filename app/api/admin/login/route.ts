import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { getAdminCookieName, getMasterCookieValue, verifyPassword, newToken } from '@/lib/auth'

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7,
}

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  // No email supplied → treat as the master password (owner).
  if (!email) {
    if (password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
    }
    const res = NextResponse.json({ ok: true, role: 'owner', name: 'Melanie' })
    res.cookies.set(getAdminCookieName(), getMasterCookieValue(), COOKIE_OPTS)
    return res
  }

  // Email + password → look up a team member.
  const db = getServiceClient()
  const { data: user } = await db
    .from('admin_users')
    .select('id, name, role, password_hash, invite_accepted_at')
    .eq('email', String(email).toLowerCase().trim())
    .single()

  if (!user || !user.invite_accepted_at || !verifyPassword(password, user.password_hash)) {
    return NextResponse.json({ error: 'Incorrect email or password.' }, { status: 401 })
  }

  const session = newToken()
  await db
    .from('admin_users')
    .update({ session_token: session, last_login_at: new Date().toISOString() })
    .eq('id', user.id)

  const res = NextResponse.json({ ok: true, role: user.role, name: user.name })
  res.cookies.set(getAdminCookieName(), session, COOKIE_OPTS)
  return res
}
