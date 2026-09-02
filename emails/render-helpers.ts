import { render } from '@react-email/render'
import { createElement } from 'react'
import { Guest } from '@/lib/supabase'
import InvitationEmail from './invitation'
import RsvpConfirmedEmail from './rsvp-confirmed'
import RsvpDeclinedEmail from './rsvp-declined'
import AdminInviteEmail from './admin-invite'
import PasswordResetEmail from './password-reset'
import SpeakerInviteEmail from './speaker-invite'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''

export async function renderAdminInvite(opts: { name: string | null; role: string; acceptUrl: string; invitedBy: string | null }): Promise<string> {
  return render(createElement(AdminInviteEmail, opts))
}

export async function renderPasswordReset(opts: { name: string | null; resetUrl: string }): Promise<string> {
  return render(createElement(PasswordResetEmail, opts))
}

export async function renderSpeakerInvite(opts: {
  displayName: string; firstName: string; organization: string | null
  personalizedWhy: string | null; involvedAs: string | null
  letterUrl: string; acceptUrl: string; declineUrl: string
}): Promise<string> {
  return render(createElement(SpeakerInviteEmail, opts))
}

export async function renderInvitation(guest: Guest, inviteBaseUrl: string): Promise<string> {
  return render(createElement(InvitationEmail, { guest, baseUrl: inviteBaseUrl }))
}

export async function renderRsvpConfirmed(guest: Guest): Promise<string> {
  return render(createElement(RsvpConfirmedEmail, { guest, baseUrl }))
}

export async function renderRsvpDeclined(guest: Guest): Promise<string> {
  return render(createElement(RsvpDeclinedEmail, { guest, baseUrl }))
}
