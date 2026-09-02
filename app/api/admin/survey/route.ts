import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { requireRole } from '@/lib/auth'

export async function GET() {
  if (!(await requireRole('read'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getServiceClient()
  const { data } = await db.from('survey_responses').select('*').eq('status', 'submitted').order('submitted_at', { ascending: false })
  const rows = data || []

  const ratings = rows.map(r => r.overall_rating).filter((n): n is number => typeof n === 'number')
  const recs = rows.map(r => r.recommend).filter((n): n is number => typeof n === 'number')
  const avg = (a: number[]) => a.length ? Math.round((a.reduce((s, v) => s + v, 0) / a.length) * 10) / 10 : null

  // NPS = %promoters (9-10) − %detractors (0-6)
  let nps: number | null = null
  if (recs.length) {
    const prom = recs.filter(n => n >= 9).length
    const det = recs.filter(n => n <= 6).length
    nps = Math.round(((prom - det) / recs.length) * 100)
  }

  return NextResponse.json({
    rows,
    stats: {
      submitted: rows.length,
      avg_rating: avg(ratings),
      avg_recommend: avg(recs),
      nps,
      consented: rows.filter(r => r.consent).length,
    },
  }, { headers: { 'Cache-Control': 'no-store' } })
}
