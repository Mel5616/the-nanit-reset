import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getServiceClient } from '@/lib/supabase'
import { getAdminCookieName, getMasterCookieValue } from '@/lib/auth'

export async function POST() {
  const cookieStore = await cookies()
  const value = cookieStore.get(getAdminCookieName())?.value

  // Clear the server-side session for team members (not the master cookie).
  if (value && value !== getMasterCookieValue()) {
    const db = getServiceClient()
    await db.from('admin_users').update({ session_token: null }).eq('session_token', value)
  }

  const res = NextResponse.json({ ok: true })
  res.cookies.delete(getAdminCookieName())
  return res
}
