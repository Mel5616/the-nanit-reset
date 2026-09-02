import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { requireRole } from '@/lib/auth'

export async function GET() {
  if (!(await requireRole('read'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getServiceClient()
  const { data } = await db.from('giveaway_entries').select('*').order('created_at', { ascending: false })
  return NextResponse.json(data || [])
}

// Draw or redraw a random winner from entries that have never won.
export async function POST(req: NextRequest) {
  if (!(await requireRole('write'))) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { action } = await req.json().catch(() => ({ action: 'draw' }))
  const db = getServiceClient()

  if (action === 'redraw') {
    const { data: prev } = await db.from('giveaway_entries')
      .select('id').eq('is_winner', true).eq('forfeited', false)
      .order('drawn_at', { ascending: false }).limit(1).maybeSingle()
    if (prev) await db.from('giveaway_entries').update({ forfeited: true }).eq('id', prev.id)
  }

  const { data: pool } = await db.from('giveaway_entries').select('id, first_name, last_name, email, postcode').eq('is_winner', false)
  if (!pool || !pool.length) return NextResponse.json({ error: 'No eligible entries left to draw.' }, { status: 400 })

  const pick = pool[Math.floor(Math.random() * pool.length)]
  await db.from('giveaway_entries').update({ is_winner: true, drawn_at: new Date().toISOString() }).eq('id', pick.id)
  return NextResponse.json({ ok: true, winner: pick })
}
