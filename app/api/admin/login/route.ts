import { NextRequest, NextResponse } from 'next/server'
import { getAdminCookieName, getAdminCookieValue } from '@/lib/auth'

export async function POST(req: NextRequest) {
  const { password } = await req.json()
  if (password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
  }
  const res = NextResponse.json({ ok: true })
  res.cookies.set(getAdminCookieName(), getAdminCookieValue(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  })
  return res
}
