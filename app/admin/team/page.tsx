import { redirect } from 'next/navigation'
import { getCurrentAdmin, canDo } from '@/lib/auth'
import { getServiceClient } from '@/lib/supabase'
import TeamClient, { type TeamMember } from './TeamClient'

export const dynamic = 'force-dynamic'

export default async function TeamPage() {
  const admin = await getCurrentAdmin()
  if (!admin) redirect('/admin/login')
  if (!canDo(admin.role, 'manage_users')) redirect('/admin')

  const db = getServiceClient()
  const { data } = await db
    .from('admin_users')
    .select('id, email, name, role, invite_sent_at, invite_accepted_at, last_login_at, created_at')
    .order('created_at', { ascending: true })

  return <TeamClient initialMembers={(data as TeamMember[]) || []} currentEmail={admin.email} />
}
