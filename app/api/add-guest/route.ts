import { NextRequest, NextResponse } from 'next/server'
import { getServiceClient } from '@/lib/supabase'
import { validateEmail, validateRequired } from '@/lib/validations'
import { isAdminAuthenticated } from '@/lib/auth'

export async function POST(req: NextRequest) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await req.json()
  const { first_name, last_name, email, phone, audience_type, company, instagram_handle, dietary_requirements, goody_bag, speaker_session, notes, added_by } = body

  if (!validateRequired(first_name) || !validateRequired(last_name)) {
    return NextResponse.json({ error: 'First and last name are required.' }, { status: 400 })
  }
  if (!validateEmail(email)) {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
  }
  if (!['influencer', 'media', 'wellness', 'hcp', 'retail', 'celebrity'].includes(audience_type)) {
    return NextResponse.json({ error: 'Please select an audience type.' }, { status: 400 })
  }

  const db = getServiceClient()

  const { error } = await db.from('guests').insert({
    first_name: first_name.trim(),
    last_name: last_name.trim(),
    email: email.trim().toLowerCase(),
    phone: phone?.trim() || null,
    audience_type,
    company: company?.trim() || null,
    instagram_handle: instagram_handle?.trim() || null,
    dietary_requirements: dietary_requirements?.trim() || null,
    goody_bag: goody_bag?.trim() || null,
    speaker_session: speaker_session || false,
    notes: notes?.trim() || null,
    added_by: added_by?.trim() || null,
  })

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'A guest with this email already exists.' }, { status: 409 })
    }
    return NextResponse.json({ error: 'Failed to add guest.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
