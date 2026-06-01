import { NextResponse } from 'next/server'
import { getAdminCookieName } from '@/lib/auth'

export async function POST() {
  const res = NextResponse.json({ ok: true })
  res.cookies.delete(getAdminCookieName())
  return res
}
