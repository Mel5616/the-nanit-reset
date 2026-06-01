import { NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { isAdminAuthenticated } from '@/lib/auth'
import { audienceLabels } from '@/lib/invite-content'

export async function GET() {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getServiceClient()
  const { data: guests, error } = await db
    .from('guests')
    .select('*')
    .order('created_at', { ascending: true })

  if (error || !guests) {
    return NextResponse.json({ error: 'Failed to fetch guests.' }, { status: 500 })
  }

  const headers = ['First Name', 'Last Name', 'Email', 'Phone', 'Audience', 'Company/Handle', 'Status', 'Dietary', 'Goody Bag', 'Speaker Session', 'Checked In', 'Arrival Time', 'Notes', 'Added By', 'Invite Sent', 'RSVP Date']
  const rows = guests.map(g => [
    g.first_name,
    g.last_name,
    g.email,
    g.phone || '',
    audienceLabels[g.audience_type as keyof typeof audienceLabels] || g.audience_type,
    g.company || g.instagram_handle || '',
    g.status,
    g.dietary_requirements || '',
    g.goody_bag || '',
    g.speaker_session ? 'Yes' : 'No',
    g.checked_in ? 'Yes' : 'No',
    g.checked_in_at ? new Date(g.checked_in_at).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' }) : '',
    g.notes || '',
    g.added_by || '',
    g.invite_sent_at ? new Date(g.invite_sent_at).toLocaleDateString('en-AU') : '',
    g.rsvp_confirmed_at ? new Date(g.rsvp_confirmed_at).toLocaleDateString('en-AU') : '',
  ])

  const csv = [headers, ...rows]
    .map(row => row.map(v => `"${String(v).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  return new NextResponse(csv, {
    headers: {
      'Content-Type': 'text/csv',
      'Content-Disposition': 'attachment; filename="nanit-reset-guests.csv"',
    },
  })
}
