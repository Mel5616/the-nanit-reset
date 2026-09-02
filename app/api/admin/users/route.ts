import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { getCurrentAdmin, canDo, newToken, type AdminRole } from '@/lib/auth'
import { Resend } from 'resend'
import { renderAdminInvite } from '@/emails/render-helpers'

const resend = new Resend(process.env.RESEND_API_KEY)
const ROLES: AdminRole[] = ['owner', 'manager', 'viewer', 'door']

async function requireOwner() {
  const admin = await getCurrentAdmin()
  if (!admin || !canDo(admin.role, 'manage_users')) return null
  return admin
}

// List team members
export async function GET() {
  if (!(await requireOwner())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const db = getServiceClient()
  const { data } = await db
    .from('admin_users')
    .select('id, email, name, role, invite_sent_at, invite_accepted_at, last_login_at, created_at')
    .order('created_at', { ascending: true })
  return NextResponse.json(data || [])
}

// Invite a new team member
export async function POST(req: NextRequest) {
  const owner = await requireOwner()
  if (!owner) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const email = String(body.email || '').toLowerCase().trim()
  const name = body.name ? String(body.name).trim() : null
  const role = ROLES.includes(body.role) ? (body.role as AdminRole) : 'viewer'

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'A valid email is required.' }, { status: 400 })
  }

  const db = getServiceClient()
  const invite_token = newToken()
  const now = new Date().toISOString()

  const { data: existing } = await db.from('admin_users').select('id').eq('email', email).single()

  if (existing) {
    // Re-invite: refresh token, keep any accepted state cleared so they can reset.
    await db.from('admin_users').update({
      name, role, invite_token, invite_sent_at: now, invited_by: owner.name,
    }).eq('id', existing.id)
  } else {
    const { error } = await db.from('admin_users').insert({
      email, name, role, invite_token, invite_sent_at: now, invited_by: owner.name,
    })
    if (error) return NextResponse.json({ error: 'Could not create user.' }, { status: 500 })
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL!
  const acceptUrl = `${baseUrl}/admin/accept/${invite_token}`
  try {
    const html = await renderAdminInvite({ name, role, acceptUrl, invitedBy: owner.name })
    await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: email,
      subject: 'You have been invited to the The Nanit Reset admin team',
      html,
    })
  } catch {
    return NextResponse.json({ ok: true, warning: 'User saved but invite email failed to send.' })
  }

  return NextResponse.json({ ok: true })
}

// Change a member's role
export async function PATCH(req: NextRequest) {
  if (!(await requireOwner())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id, role } = await req.json()
  if (!id || !ROLES.includes(role)) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  const db = getServiceClient()
  await db.from('admin_users').update({ role }).eq('id', id)
  return NextResponse.json({ ok: true })
}

// Remove a member
export async function DELETE(req: NextRequest) {
  if (!(await requireOwner())) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await req.json()
  if (!id) return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  const db = getServiceClient()
  await db.from('admin_users').delete().eq('id', id)
  return NextResponse.json({ ok: true })
}
