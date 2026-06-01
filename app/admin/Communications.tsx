'use client'

import { useState } from 'react'
import { Guest, AudienceType } from '@/lib/supabase'
import { audienceLabels, inviteContent } from '@/lib/invite-content'

const NAVY = '#111D41'
const BLUE = '#6681AB'
const CREAM = '#F3E8E0'
const SOFT_BLUE = '#BDD4E7'

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100" style={{ background: CREAM }}>
        <h2 className="font-semibold text-sm uppercase tracking-widest"
          style={{ color: NAVY, fontFamily: 'NeuePlak, sans-serif', letterSpacing: '0.12em' }}>
          {title}
        </h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

const EMAIL_TYPES = [
  {
    id: 'savethedate',
    name: 'Save the date',
    description: 'Send before formal invitations go out. Announces the date with no RSVP link — just a heads-up to hold the date.',
    trigger: 'Manual — sent by Coolkidz team',
    subject: 'Save the date — The Nanit Reset, 15 November 2026',
    audiences: false,
    sendable: true,
    apiRoute: '/api/admin/send-save-the-date',
  },
  {
    id: 'invitation',
    name: 'Invitation email',
    description: 'Sent when you click Send from the Send invitations tab. Personalised per audience type.',
    trigger: 'Manual — sent by Coolkidz team',
    subject: "You're invited — The Nanit Reset, 15 November 2026",
    audiences: true,
    sendable: false,
  },
  {
    id: 'confirmed',
    name: 'RSVP confirmed',
    description: 'Sent automatically when a guest clicks "Yes, I\'ll be there" on their invitation page.',
    trigger: 'Automatic on RSVP confirm',
    subject: "You're confirmed for The Nanit Reset",
    audiences: false,
    sendable: false,
  },
  {
    id: 'declined',
    name: 'RSVP declined',
    description: 'Sent automatically when a guest clicks "Can\'t make it this time".',
    trigger: 'Automatic on RSVP decline',
    subject: "Thank you — The Nanit Reset",
    audiences: false,
    sendable: false,
  },
  {
    id: 'thankyou',
    name: 'Post-event thank you',
    description: 'Sent to all guests who checked in on the day. Warm follow-up with hashtag and social nudge.',
    trigger: 'Manual — sent after the event',
    subject: 'Thank you for joining us — The Nanit Reset',
    audiences: false,
    sendable: true,
    apiRoute: '/api/admin/send-thank-you',
  },
]

function EmailPreviewCard({ guests }: { guests: Guest[] }) {
  const [open, setOpen] = useState<string | null>(null)
  const [selectedAudience, setSelectedAudience] = useState<AudienceType>('influencer')
  const [sending, setSending] = useState<string | null>(null)
  const [sendResult, setSendResult] = useState<Record<string, string>>({})

  async function sendAll(email: typeof EMAIL_TYPES[0]) {
    if (!email.apiRoute) return
    setSending(email.id)
    const allIds = guests.map(g => g.id)
    const res = await fetch(email.apiRoute, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestIds: allIds }),
    })
    const data = await res.json()
    setSendResult(r => ({ ...r, [email.id]: `Sent: ${data.sent || 0} · Failed: ${data.failed || 0}` }))
    setSending(null)
  }

  return (
    <div className="space-y-3">
      {EMAIL_TYPES.map(email => {
        const isOpen = open === email.id
        const content = inviteContent[selectedAudience]

        return (
          <div key={email.id} className="rounded-xl border border-gray-100 overflow-hidden">
            <button
              onClick={() => setOpen(isOpen ? null : email.id)}
              className="w-full px-5 py-4 flex items-center gap-4 text-left hover:bg-gray-50 transition-colors"
            >
              <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-white text-xs font-bold"
                style={{ background: BLUE }}>
                ✉
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm" style={{ color: NAVY, fontFamily: 'BentonSans, sans-serif' }}>{email.name}</p>
                <p className="text-xs text-gray-400 mt-0.5">{email.trigger}</p>
              </div>
              {email.sendable && (
                <button
                  onClick={e => { e.stopPropagation(); sendAll(email) }}
                  disabled={sending === email.id}
                  className="px-4 py-1.5 rounded-full text-white text-xs font-medium mr-2 shrink-0 disabled:opacity-50"
                  style={{ background: BLUE }}>
                  {sending === email.id ? 'Sending…' : 'Send to all'}
                </button>
              )}
              {sendResult[email.id] && <span className="text-xs text-green-600 mr-2 shrink-0">{sendResult[email.id]}</span>}
              <span className="text-gray-300 text-lg shrink-0">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
              <div className="border-t border-gray-100">
                <div className="px-5 py-4 bg-gray-50 text-sm" style={{ color: '#6B7280' }}>
                  <p className="mb-2">{email.description}</p>
                  <p><span className="font-medium" style={{ color: NAVY }}>Subject:</span> {email.subject}</p>
                </div>

                {email.audiences && (
                  <div className="px-5 py-3 border-t border-gray-100">
                    <p className="text-xs uppercase tracking-widest mb-2" style={{ color: BLUE, fontFamily: 'NeuePlak, sans-serif' }}>Preview by audience</p>
                    <div className="flex flex-wrap gap-2">
                      {(Object.keys(audienceLabels) as AudienceType[]).map(k => (
                        <button
                          key={k}
                          onClick={() => setSelectedAudience(k)}
                          className="px-3 py-1.5 rounded-full text-xs border transition-all"
                          style={selectedAudience === k
                            ? { background: NAVY, color: '#fff', borderColor: NAVY }
                            : { color: '#6B7280', borderColor: '#E5E7EB' }}>
                          {audienceLabels[k]}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Email preview */}
                <div className="border-t border-gray-100" style={{ background: NAVY }}>
                  <div className="h-1 w-full" style={{ background: BLUE }} />
                  <div className="px-8 py-10 text-center max-w-lg mx-auto">
                    {/* Logo */}
                    <img src="/nanit-logo-light.png" alt="Nanit" style={{ width: 100, margin: '0 auto 28px', display: 'block', opacity: 0.9 }} />
                    <p className="text-xs uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'NeuePlak, sans-serif' }}>
                      {email.id === 'invitation' ? 'You are invited to' : 'The Nanit Reset'}
                    </p>
                    <p className="text-white font-light mb-2 text-2xl" style={{ fontFamily: 'Cotford, Georgia, serif' }}>
                      {email.id === 'invitation' ? 'The Nanit Reset.' : email.id === 'confirmed' ? "You're confirmed." : 'Thanks for letting us know.'}
                    </p>
                    {email.id === 'invitation' && (
                      <p className="text-xs mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>15 November 2026 · Sydney</p>
                    )}
                    <div className="w-8 h-px mx-auto mb-6" style={{ background: BLUE }} />

                    {email.id === 'invitation' && (
                      <>
                        <p className="text-white font-light mb-3 leading-relaxed" style={{ fontFamily: 'Cotford, Georgia, serif' }}>
                          {content.hook}
                        </p>
                        <p className="mb-6 text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'BentonSans, sans-serif' }}>
                          {content.sub}
                        </p>
                        <div className="rounded-xl p-4 mb-6 text-left space-y-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          {[['Date', 'Saturday, 15 November 2026'], ['Time', '10:00am – 1:00pm'], ['Location', 'Sydney, NSW — venue details to follow']].map(([l, v]) => (
                            <div key={l}>
                              <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'NeuePlak, sans-serif' }}>{l}</p>
                              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'BentonSans, sans-serif' }}>{v}</p>
                            </div>
                          ))}
                        </div>
                        <div className="inline-block px-8 py-3 rounded-full text-white text-sm font-medium" style={{ background: BLUE, fontFamily: 'BentonSans, sans-serif' }}>
                          RSVP now
                        </div>
                      </>
                    )}

                    {email.id === 'confirmed' && (
                      <>
                        <p className="text-sm mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'BentonSans, sans-serif' }}>
                          We have you down for The Nanit Reset.<br />We're looking forward to seeing you there.
                        </p>
                        <div className="rounded-xl p-4 text-left space-y-3" style={{ background: 'rgba(255,255,255,0.05)' }}>
                          {[['Date', 'Saturday, 15 November 2026'], ['Time', '10:00am – 1:00pm'], ['Location', 'Sydney, NSW — venue details to follow']].map(([l, v]) => (
                            <div key={l}>
                              <p className="text-xs uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.4)', fontFamily: 'NeuePlak, sans-serif' }}>{l}</p>
                              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.9)', fontFamily: 'BentonSans, sans-serif' }}>{v}</p>
                            </div>
                          ))}
                        </div>
                      </>
                    )}

                    {email.id === 'declined' && (
                      <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'BentonSans, sans-serif' }}>
                        We're sorry you can't make it this time.<br />We hope to see you at a future Nanit event.
                      </p>
                    )}
                  </div>
                  <div className="h-1 w-full" style={{ background: BLUE }} />
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

export default function Communications({ guests }: { guests: Guest[] }) {
  const invited = guests.filter(g => g.invite_sent_at)
  const confirmed = guests.filter(g => g.status === 'confirmed')
  const declined = guests.filter(g => g.status === 'declined')
  const pending = guests.filter(g => g.status === 'invited')

  // Build activity log from guest data
  const events = [
    ...invited.map(g => ({
      time: g.invite_sent_at!,
      type: 'invited' as const,
      guest: g,
      label: 'Invitation sent',
      color: BLUE,
    })),
    ...confirmed.map(g => ({
      time: g.rsvp_confirmed_at!,
      type: 'confirmed' as const,
      guest: g,
      label: 'RSVP confirmed',
      color: '#059669',
    })),
    ...declined.map(g => ({
      time: g.rsvp_confirmed_at || g.invite_sent_at || g.created_at,
      type: 'declined' as const,
      guest: g,
      label: 'RSVP declined',
      color: '#DC2626',
    })),
  ].sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

  return (
    <div>
      {/* Stats */}
      <SectionCard title="Email overview">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Invitations sent', value: invited.length, color: BLUE },
            { label: 'Awaiting RSVP', value: pending.length, color: '#D97706' },
            { label: 'RSVP confirmed', value: confirmed.length, color: '#059669' },
            { label: 'RSVP declined', value: declined.length, color: '#DC2626' },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-xl px-4 py-4 text-center" style={{ background: CREAM }}>
              <p className="text-3xl font-light mb-1" style={{ color, fontFamily: 'Cotford, Georgia, serif' }}>{value}</p>
              <p className="text-xs uppercase tracking-widest" style={{ color: '#9CA3AF', fontFamily: 'NeuePlak, sans-serif' }}>{label}</p>
            </div>
          ))}
        </div>

        {invited.length > 0 && (
          <div className="mt-4">
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden flex">
              {confirmed.length > 0 && (
                <div className="h-full transition-all" style={{ width: `${(confirmed.length / invited.length) * 100}%`, background: '#059669' }} />
              )}
              {declined.length > 0 && (
                <div className="h-full transition-all" style={{ width: `${(declined.length / invited.length) * 100}%`, background: '#FCA5A5' }} />
              )}
            </div>
            <p className="text-xs mt-1" style={{ color: '#9CA3AF' }}>
              {invited.length > 0 ? `${Math.round(((confirmed.length + declined.length) / invited.length) * 100)}% response rate` : ''}
            </p>
          </div>
        )}
      </SectionCard>

      {/* Activity log */}
      <SectionCard title={`Activity log (${events.length} events)`}>
        {events.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No emails sent yet. Invitations will appear here once sent from the Send invitations tab.</p>
        ) : (
          <div className="space-y-0">
            {events.map((ev, i) => (
              <div key={`${ev.guest.id}-${ev.type}`} className="flex gap-4 pb-4 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className="w-2.5 h-2.5 rounded-full mt-1 shrink-0" style={{ background: ev.color }} />
                  {i < events.length - 1 && <div className="w-px flex-1 mt-1" style={{ background: '#E5E7EB' }} />}
                </div>
                <div className="pb-0 flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="text-sm font-medium" style={{ color: NAVY, fontFamily: 'BentonSans, sans-serif' }}>
                        {ev.guest.first_name} {ev.guest.last_name}
                      </p>
                      <p className="text-xs mt-0.5" style={{ color: ev.color }}>{ev.label}</p>
                      <p className="text-xs text-gray-400">{audienceLabels[ev.guest.audience_type]}{ev.guest.company ? ` · ${ev.guest.company}` : ''}</p>
                    </div>
                    <p className="text-xs text-gray-400 whitespace-nowrap shrink-0">
                      {new Date(ev.time).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}
                      {' '}
                      {new Date(ev.time).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </SectionCard>

      {/* Email templates */}
      <SectionCard title="Email templates">
        <p className="text-sm mb-5" style={{ color: '#6B7280' }}>
          Preview how each email looks before sending. Click an email to expand and see the full template — the invitation email can be previewed per audience type.
        </p>
        <EmailPreviewCard guests={guests} />
      </SectionCard>
    </div>
  )
}
