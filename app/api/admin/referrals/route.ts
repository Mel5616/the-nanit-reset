import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { requireRole } from '@/lib/auth'

export async function GET() {
  if (!(await requireRole('read'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getServiceClient()

  const { data: guests } = await db
    .from('guests')
    .select('id, first_name, last_name, email, status, audience_type, invite_token, added_by, created_at')

  const all = guests || []

  // People who arrived via a referral link (added_by = 'referral:<referrer token>')
  const referred = all
    .filter(g => (g.added_by || '').startsWith('referral:'))
    .map(g => ({ ...g, referrer_token: (g.added_by || '').slice('referral:'.length) }))

  const countByToken: Record<string, number> = {}
  for (const r of referred) countByToken[r.referrer_token] = (countByToken[r.referrer_token] || 0) + 1

  // Opens per referrer
  const { data: stats } = await db.from('referral_stats').select('token, opens')
  const opensByToken: Record<string, number> = {}
  for (const s of stats || []) opensByToken[s.token] = s.opens || 0

  // Confirmed guests are the pool of potential referrers.
  const referrers = all
    .filter(g => g.status === 'confirmed')
    .map(g => ({
      id: g.id,
      name: `${g.first_name} ${g.last_name || ''}`.trim(),
      token: g.invite_token,
      opens: opensByToken[g.invite_token] || 0,
      signups: countByToken[g.invite_token] || 0,
    }))
    .sort((a, b) => b.signups - a.signups || b.opens - a.opens)

  const referrerName: Record<string, string> = {}
  for (const g of all) referrerName[g.invite_token] = `${g.first_name} ${g.last_name || ''}`.trim()

  return NextResponse.json({
    referrers,
    referred: referred.map(r => ({
      id: r.id,
      name: `${r.first_name} ${r.last_name || ''}`.trim(),
      email: r.email,
      status: r.status,
      audience_type: r.audience_type,
      referred_by: referrerName[r.referrer_token] || 'Unknown',
      created_at: r.created_at,
    })),
  })
}
