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

// Validate an invite token
export async function GET(req: NextRequest) {
  const token = new URL(req.url).searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Missing token.' }, { status: 400 })
  const db = getServiceClient()
  const { data } = await db
    .from('admin_users')
    .select('email, name, role')
    .eq('invite_token', token)
    .single()
  if (!data) return NextResponse.json({ error: 'Invalid or expired invitation.' }, { status: 404 })
  return NextResponse.json(data)
}

// Accept: set name + password, sign in
export async function POST(req: NextRequest) {
  const { token, name, password } = await req.json()
  if (!token || !password || String(password).length < 8) {
    return NextResponse.json({ error: 'A password of at least 8 characters is required.' }, { status: 400 })
  }

  const db = getServiceClient()
  const { data: user } = await db
    .from('admin_users')
    .select('id, name')
    .eq('invite_token', token)
    .single()
  if (!user) return NextResponse.json({ error: 'Invalid or expired invitation.' }, { status: 404 })

  const session = newToken()
  await db.from('admin_users').update({
    name: name ? String(name).trim() : user.name,
    password_hash: hashPassword(password),
    invite_accepted_at: new Date().toISOString(),
    invite_token: null,
    session_token: session,
    last_login_at: new Date().toISOString(),
  }).eq('id', user.id)

  const res = NextResponse.json({ ok: true })
  res.cookies.set(getAdminCookieName(), session, COOKIE_OPTS)
  return res
}
