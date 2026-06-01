import { render } from '@react-email/render'
import { createElement } from 'react'
import { Guest } from '@/lib/supabase'
import InvitationEmail from './invitation'
import RsvpConfirmedEmail from './rsvp-confirmed'
import RsvpDeclinedEmail from './rsvp-declined'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''

export async function renderInvitation(guest: Guest, inviteBaseUrl: string): Promise<string> {
  return render(createElement(InvitationEmail, { guest, baseUrl: inviteBaseUrl }))
}

export async function renderRsvpConfirmed(guest: Guest): Promise<string> {
  return render(createElement(RsvpConfirmedEmail, { guest, baseUrl }))
}

export async function renderRsvpDeclined(guest: Guest): Promise<string> {
  return render(createElement(RsvpDeclinedEmail, { guest, baseUrl }))
}
