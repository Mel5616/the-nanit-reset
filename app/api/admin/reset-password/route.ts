import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { getAdminCookieName, hashPassword, newToken } from '@/lib/auth'

const COOKIE_OPTS = {
  httpOnly: true,
  sameSite: 'lax' as const,
  path: '/',
  secure: process.env.NODE_ENV === 'production',
  maxAge: 60 * 60 * 24 * 7,
}

// Validate a reset token
export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Missing token.' }, { status: 400 })
  const db = getServiceClient()
  const { data } = await db
    .from('admin_users')
    .select('email, reset_expires_at')
    .eq('reset_token', token)
    .single()
  if (!data || !data.reset_expires_at || new Date(data.reset_expires_at) < new Date()) {
    return NextResponse.json({ error: 'This reset link has expired.' }, { status: 404 })
  }
  return NextResponse.json({ email: data.email })
}

// Set a new password, sign in
export async function POST(req: NextRequest) {
  const { token, password } = await req.json()
  if (!token || !password || String(password).length < 8) {
    return NextResponse.json({ error: 'A password of at least 8 characters is required.' }, { status: 400 })
  }
  const db = getServiceClient()
  const { data: user } = await db
    .from('admin_users')
    .select('id, reset_expires_at')
    .eq('reset_token', token)
    .single()
  if (!user || !user.reset_expires_at || new Date(user.reset_expires_at) < new Date()) {
    return NextResponse.json({ error: 'This reset link has expired.' }, { status: 404 })
  }

  const session = newToken()
  await db.from('admin_users').update({
    password_hash: hashPassword(password),
    reset_token: null,
    reset_expires_at: null,
    session_token: session,
    last_login_at: new Date().toISOString(),
  }).eq('id', user.id)

  const res = NextResponse.json({ ok: true })
  res.cookies.set(getAdminCookieName(), session, COOKIE_OPTS)
  return res
}
