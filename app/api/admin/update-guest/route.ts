import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/auth'

const ALLOWED_FIELDS = ['follower_count', 'required_posts', 'post_links', 'content_status', 'notes', 'goody_bag', 'dietary_requirements', 'speaker_session']

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  const { id, field, value } = await req.json()
  if (!id || !field || !ALLOWED_FIELDS.includes(field)) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
  const db = getServiceClient()
  const { error } = await db.from('guests').update({ [field]: value }).eq('id', id)
  if (error) return NextResponse.json({ error: 'Failed' }, { status: 500 })
  return NextResponse.json({ ok: true })
}
