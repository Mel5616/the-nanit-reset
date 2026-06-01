import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/auth'
import { getServiceClient, Guest } from '@/lib/supabase'
import { audienceLabels, capacityTargets, TOTAL_CAPACITY } from '@/lib/invite-content'
import { AudienceType } from '@/lib/supabase'
import AdminDashboard from './AdminDashboard'

export const dynamic = 'force-dynamic'

async function getGuests(): Promise<Guest[]> {
  const db = getServiceClient()
  const { data } = await db.from('guests').select('*').order('created_at', { ascending: false })
  return data || []
}

export default async function AdminPage() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }

  const guests = await getGuests()

  const stats = {
    total: guests.length,
    invited: guests.filter(g => ['invited', 'confirmed', 'declined'].includes(g.status)).length,
    confirmed: guests.filter(g => g.status === 'confirmed').length,
    remaining: TOTAL_CAPACITY - guests.filter(g => g.status === 'confirmed').length,
  }

  const byAudience = Object.keys(audienceLabels).reduce((acc, key) => {
    const k = key as AudienceType
    acc[k] = guests.filter(g => g.audience_type === k)
    return acc
  }, {} as Record<AudienceType, Guest[]>)

  return <AdminDashboard guests={guests} stats={stats} byAudience={byAudience} capacityTargets={capacityTargets} audienceLabels={audienceLabels} />
}
