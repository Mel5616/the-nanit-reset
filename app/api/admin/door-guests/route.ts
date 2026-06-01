import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/auth'

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getServiceClient()
  const { data, error } = await db
    .from('guests')
    .select('*')
    .eq('status', 'confirmed')
    .order('last_name', { ascending: true })

  if (error) return NextResponse.json({ error: 'Failed' }, { status: 500 })
  return NextResponse.json(data || [])
}
