'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Guest, AudienceType, GuestStatus } from '@/lib/supabase'
import EventPlanning from './EventPlanning'
import Communications from './Communications'
import Budget from './Budget'
import InfluencerTracking from './InfluencerTracking'
import WrapReport from './WrapReport'
import Vendors from './Vendors'
import Speakers from './Speakers'
import Feedback from './Feedback'
import Referrals from './Referrals'

const NAVY = '#111D41'
const BLUE = '#6681AB'

// Refined line icons for the section nav.
const NAV_ICONS: Record<string, React.ReactNode> = {
  guests:     <><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20c0-3.6 2.9-6 6.5-6s6.5 2.4 6.5 6" /></>,
  send:       <><path d="M22 2 11 13" /><path d="M22 2 15 22l-4-9-9-4 20-7Z" /></>,
  comms:      <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
  influencer: <path d="M12 3l2.2 5.6L20 9l-4 3.9 1 6-5-3-5 3 1-6L4 9l5.8-.4z" />,
  speakers:   <><rect x="9" y="3" width="6" height="11" rx="3" /><path d="M6 11a6 6 0 0 0 12 0" /><path d="M12 17v4" /></>,
  vendors:    <><rect x="3" y="8" width="18" height="12" rx="2" /><path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></>,
  planning:   <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 9h18M8 3v4M16 3v4" /></>,
  budget:     <><rect x="3" y="6" width="18" height="13" rx="2" /><path d="M3 10h18" /><circle cx="16.5" cy="13.5" r="1" /></>,
  referrals:  <><circle cx="6" cy="12" r="2.4" /><circle cx="18" cy="6" r="2.4" /><circle cx="18" cy="18" r="2.4" /><path d="m8.2 10.9 7.6-3.7M8.2 13.1l7.6 3.7" /></>,
  feedback:   <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.4A8 8 0 1 1 21 12Z" />,
  wrap:       <><rect x="4" y="3" width="16" height="18" rx="2" /><path d="M8 12v4M12 9v7M16 13v3" /></>,
}

function NavIcon({ id }: { id: string }) {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, opacity: 0.85 }}>
      {NAV_ICONS[id]}
    </svg>
  )
}

const statusColors: Record<GuestStatus, string> = {
  pending: '#D97706',
  invited: '#7C3AED',
  confirmed: '#059669',
  declined: '#DC2626',
  waitlist: '#6B7280',
}

const statusLabels: Record<GuestStatus, string> = {
  pending: 'Pending',
  invited: 'Invited',
  confirmed: 'Confirmed',
  declined: 'Declined',
  waitlist: 'Waitlist',
}

function StatusBadge({ status }: { status: GuestStatus }) {
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white"
      style={{ background: statusColors[status] }}>
      {statusLabels[status]}
    </span>
  )
}

export default function AdminDashboard({
  guests, stats, byAudience, capacityTargets, audienceLabels, currentAdmin,
}: {
  guests: Guest[]
  stats: { total: number; invited: number; confirmed: number; remaining: number }
  byAudience: Record<AudienceType, Guest[]>
  capacityTargets: Record<AudienceType, number>
  audienceLabels: Record<AudienceType, string>
  currentAdmin: { id: string | null; email: string | null; name: string | null; role: 'owner' | 'manager' | 'viewer' | 'door' }
}) {
  const router = useRouter()
  const [tab, setTab] = useState<'guests' | 'send' | 'comms' | 'influencer' | 'speakers' | 'vendors' | 'planning' | 'budget' | 'referrals' | 'feedback' | 'wrap'>('guests')
  const [filterStatus, setFilterStatus] = useState<GuestStatus | 'all'>('all')
  const [filterAudience, setFilterAudience] = useState<AudienceType | 'all'>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())
  const [sending, setSending] = useState(false)
  const [sendResult, setSendResult] = useState<string | null>(null)
  const [reminding, setReminding] = useState(false)
  const [reminderSelected, setReminderSelected] = useState<Set<string>>(new Set())

  const filtered = guests.filter(g => {
    if (filterStatus !== 'all' && g.status !== filterStatus) return false
    if (filterAudience !== 'all' && g.audience_type !== filterAudience) return false
    return true
  })

  const uninvited = guests.filter(g => g.status === 'pending' || g.status === 'waitlist')

  const awaitingRsvp = guests.filter(g => g.status === 'invited')

  async function sendReminders() {
    if (reminderSelected.size === 0) return
    setReminding(true)
    const res = await fetch('/api/admin/send-reminder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestIds: [...reminderSelected] }),
    })
    const data = await res.json()
    setSendResult(`Reminders sent: ${data.sent} · Failed: ${data.failed}`)
    setReminding(false)
    setReminderSelected(new Set())
    router.refresh()
  }

  async function sendInvites() {
    if (selected.size === 0) return
    setSending(true)
    setSendResult(null)
    const res = await fetch('/api/admin/send-invites', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ guestIds: [...selected] }),
    })
    const data = await res.json()
    setSendResult(`Sent: ${data.sent} · Failed: ${data.failed}`)
    setSending(false)
    setSelected(new Set())
    router.refresh()
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''

  return (
    <div className="min-h-screen" style={{ background: '#FAF7F3' }}>
      {/* Header */}
      <header style={{ background: NAVY }} className="px-4 md:px-6 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <img src="/nanit-logo-light.png" alt="Nanit" style={{ height: 28, opacity: 0.9 }} />
          <div className="w-px h-8 bg-white/10" />
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest" style={{ fontFamily: 'NeuePlak, sans-serif', letterSpacing: '0.12em' }}>Admin</p>
            <h1 className="text-white text-xl font-light" style={{ fontFamily: 'Cotford, Georgia, serif' }}>The Nanit Reset</h1>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          <Link href="/admin/guests/new"
            className="hidden sm:block px-4 py-2 rounded-full text-white text-sm font-medium"
            style={{ background: BLUE }}>
            + Add guest
          </Link>
          <Link href="/admin/door"
            className="px-4 py-2 rounded-full text-white text-sm border border-white/20 hover:border-white/40">
            🚪 Door
          </Link>
          <Link href="/admin/badges"
            className="px-4 py-2 rounded-full text-white text-sm border border-white/20 hover:border-white/40">
            🏷 Badges
          </Link>
          <a href="/invite/preview" target="_blank" rel="noopener noreferrer"
            className="px-4 py-2 rounded-full text-white text-sm border border-white/20 hover:border-white/40">
            ✉️ View invite
          </a>
          <a href="/api/admin/export"
            className="px-4 py-2 rounded-full text-white/70 text-sm border border-white/20 hover:border-white/40">
            Export CSV
          </a>
          {currentAdmin.role === 'owner' && (
            <Link href="/admin/team"
              className="px-4 py-2 rounded-full text-white text-sm border border-white/20 hover:border-white/40">
              👥 Team
            </Link>
          )}
          <div className="flex items-center gap-2">
            {currentAdmin.name && (
              <span className="hidden md:inline text-white/50 text-sm">{currentAdmin.name}</span>
            )}
            <button onClick={logout} className="text-white/40 text-sm hover:text-white/70">Logout</button>
          </div>
        </div>
      </header>

      <div className="max-w-[1400px] mx-auto px-4 md:px-6 py-6 md:flex md:gap-6">
        {/* Sidebar navigation */}
        <aside className="md:w-56 md:shrink-0 mb-4 md:mb-0">
          <nav className="flex md:flex-col gap-1 bg-white rounded-2xl p-2 shadow-sm overflow-x-auto md:overflow-visible md:sticky md:top-6" style={{ scrollbarWidth: 'none' }}>
            {([
              ['guests', 'Guests'],
              ['send', `Send (${uninvited.length})`],
              ['comms', 'Comms'],
              ['influencer', 'Creators'],
              ['speakers', 'Speakers'],
              ['vendors', 'Vendors'],
              ['planning', 'Planning'],
              ['budget', 'Budget'],
              ['referrals', 'Referrals'],
              ['feedback', 'Feedback'],
              ['wrap', 'Wrap report'],
            ] as const).map(([t, label]) => (
              <button key={t} onClick={() => setTab(t)}
                className="flex items-center gap-2.5 text-left px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all whitespace-nowrap md:w-full"
                style={tab === t ? { background: NAVY, color: '#fff' } : { color: '#6B7280' }}>
                <NavIcon id={t} />
                {label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0">
        {tab === 'guests' && (
        <>
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Total guests', value: stats.total },
            { label: 'Invites sent', value: stats.invited },
            { label: 'Confirmed', value: stats.confirmed },
            { label: 'Places remaining', value: stats.remaining },
          ].map(({ label, value }) => (
            <div key={label} className="bg-white rounded-2xl p-6 shadow-sm">
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#6681AB', fontFamily: 'NeuePlak, sans-serif', letterSpacing: '0.1em' }}>{label}</p>
              <p className="text-3xl font-light" style={{ color: '#111D41', fontFamily: 'Cotford, Georgia, serif' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Audience breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: '#6681AB', fontFamily: 'NeuePlak, sans-serif', letterSpacing: '0.1em' }}>Audience breakdown</p>
          <div className="grid grid-cols-3 gap-4 lg:grid-cols-6">
            {(Object.keys(audienceLabels) as AudienceType[]).map(k => {
              const list = byAudience[k] || []
              const confirmed = list.filter(g => g.status === 'confirmed').length
              const pct = Math.round((confirmed / capacityTargets[k]) * 100)
              return (
                <div key={k} className="text-center">
                  <p className="text-gray-400 text-xs mb-1">{audienceLabels[k]}</p>
                  <p className="text-2xl font-light mb-1" style={{ color: NAVY }}>{list.length}</p>
                  <p className="text-xs text-gray-400">of {capacityTargets[k]} target</p>
                  <div className="h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${Math.min(pct, 100)}%`, background: BLUE }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        </>
        )}

        {tab === 'guests' && (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Filters */}
            <div className="flex gap-3 p-4 border-b border-gray-100">
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as GuestStatus | 'all')}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700">
                <option value="all">All statuses</option>
                {(Object.keys(statusLabels) as GuestStatus[]).map(s => (
                  <option key={s} value={s}>{statusLabels[s]}</option>
                ))}
              </select>
              <select value={filterAudience} onChange={e => setFilterAudience(e.target.value as AudienceType | 'all')}
                className="text-sm border border-gray-200 rounded-lg px-3 py-2 text-gray-700">
                <option value="all">All audiences</option>
                {(Object.keys(audienceLabels) as AudienceType[]).map(k => (
                  <option key={k} value={k}>{audienceLabels[k]}</option>
                ))}
              </select>
              <span className="text-sm text-gray-400 self-center ml-auto">{filtered.length} guests</span>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                  <th className="px-4 py-3">Name</th>
                  <th className="px-4 py-3">Audience</th>
                  <th className="px-4 py-3">Company / Handle</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Dietary</th>
                  <th className="px-4 py-3">Goody Bag</th>
                  <th className="px-4 py-3">Speaker</th>
                  <th className="px-4 py-3">Notes</th>
                  <th className="px-4 py-3">Added</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((g, i) => (
                  <tr key={g.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap">
                      <a href={`/invite/${g.invite_token}`} target="_blank" rel="noopener noreferrer" className="hover:underline" title="View this guest's invitation" style={{ color: NAVY }}>
                        {g.first_name} {g.last_name}
                      </a>
                    </td>
                    <td className="px-4 py-3 text-gray-600 whitespace-nowrap">{audienceLabels[g.audience_type]}</td>
                    <td className="px-4 py-3 text-gray-500">{g.company || g.instagram_handle || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={g.status} /></td>
                    <td className="px-4 py-3">
                      {g.dietary_requirements
                        ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">{g.dietary_requirements}</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3">
                      {g.goody_bag
                        ? <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">{g.goody_bag}</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-center">
                      {g.speaker_session
                        ? <span title="One-on-one with Dr Natalie" className="inline-block w-5 h-5 rounded-full text-white text-xs flex items-center justify-center" style={{ background: BLUE }}>✓</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs max-w-xs truncate">{g.notes || '—'}</td>
                    <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{new Date(g.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={7} className="text-center py-12 text-gray-400">No guests found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {tab === 'comms' && <Communications guests={guests} />}
        {tab === 'influencer' && <InfluencerTracking guests={guests} />}
        {tab === 'speakers' && <Speakers />}
        {tab === 'vendors' && <Vendors />}
        {tab === 'planning' && <EventPlanning />}
        {tab === 'budget' && <Budget />}
        {tab === 'referrals' && <Referrals />}
        {tab === 'feedback' && <Feedback />}
        {tab === 'wrap' && <WrapReport guests={guests} />}

        {tab === 'send' && (
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <p className="text-gray-600 text-sm mb-6">
              Select guests to send personalised invitation emails. Only pending and waitlisted guests are shown.
            </p>
            {sendResult && (
              <div className="mb-4 px-4 py-3 rounded-lg bg-green-50 text-green-700 text-sm">{sendResult}</div>
            )}
            {uninvited.length === 0 ? (
              <p className="text-gray-400 text-sm">All guests have already been invited.</p>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox"
                      checked={selected.size === uninvited.length}
                      onChange={e => setSelected(e.target.checked ? new Set(uninvited.map(g => g.id)) : new Set())}
                    />
                    Select all ({uninvited.length})
                  </label>
                  <button
                    onClick={sendInvites}
                    disabled={selected.size === 0 || sending}
                    className="px-6 py-2 rounded-full text-white text-sm font-medium disabled:opacity-40"
                    style={{ background: BLUE }}>
                    {sending ? 'Sending…' : `Send to ${selected.size} guest${selected.size !== 1 ? 's' : ''}`}
                  </button>
                </div>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-gray-400 text-xs uppercase tracking-wider border-b border-gray-100">
                      <th className="px-4 py-3 w-10" />
                      <th className="px-4 py-3">Name</th>
                      <th className="px-4 py-3">Email</th>
                      <th className="px-4 py-3">Audience</th>
                      <th className="px-4 py-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {uninvited.map((g, i) => (
                      <tr key={g.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                        <td className="px-4 py-3">
                          <input type="checkbox"
                            checked={selected.has(g.id)}
                            onChange={e => {
                              const s = new Set(selected)
                              e.target.checked ? s.add(g.id) : s.delete(g.id)
                              setSelected(s)
                            }}
                          />
                        </td>
                        <td className="px-4 py-3 font-medium text-gray-900">{g.first_name} {g.last_name}</td>
                        <td className="px-4 py-3 text-gray-500">{g.email}</td>
                        <td className="px-4 py-3 text-gray-600">{audienceLabels[g.audience_type]}</td>
                        <td className="px-4 py-3"><StatusBadge status={g.status} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </>
            )}

            {/* RSVP reminders */}
            {awaitingRsvp.length > 0 && (
              <div className="mt-8 pt-6 border-t border-gray-100">
                <p className="text-sm font-semibold mb-1" style={{ color: NAVY }}>RSVP reminders</p>
                <p className="text-xs text-gray-400 mb-4">{awaitingRsvp.length} guest{awaitingRsvp.length !== 1 ? 's' : ''} invited but haven't responded yet.</p>
                <div className="flex justify-between items-center mb-3">
                  <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                    <input type="checkbox"
                      checked={reminderSelected.size === awaitingRsvp.length}
                      onChange={e => setReminderSelected(e.target.checked ? new Set(awaitingRsvp.map(g => g.id)) : new Set())}
                    />
                    Select all ({awaitingRsvp.length})
                  </label>
                  <button
                    onClick={sendReminders}
                    disabled={reminderSelected.size === 0 || reminding}
                    className="px-5 py-2 rounded-full text-white text-sm font-medium disabled:opacity-40"
                    style={{ background: '#D97706' }}>
                    {reminding ? 'Sending…' : `Send reminder to ${reminderSelected.size}`}
                  </button>
                </div>
                <div className="space-y-1">
                  {awaitingRsvp.map(g => (
                    <label key={g.id} className="flex items-center gap-3 text-sm py-1.5 cursor-pointer">
                      <input type="checkbox" checked={reminderSelected.has(g.id)}
                        onChange={e => { const s = new Set(reminderSelected); e.target.checked ? s.add(g.id) : s.delete(g.id); setReminderSelected(s) }} />
                      <span style={{ color: NAVY }}>{g.first_name} {g.last_name}</span>
                      <span className="text-gray-400 text-xs">{g.email}</span>
                      {g.invite_sent_at && <span className="text-gray-300 text-xs">Invited {new Date(g.invite_sent_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</span>}
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Quick reference URLs */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-3">Quick reference</p>
              <div className="space-y-2 text-sm">
                {[
                  ['Invitation template', `/invite/[token]`],
                  ['Admin dashboard', `/admin`],
                  ['Export guest list', `/api/admin/export`],
                ].map(([label, path]) => (
                  <div key={label} className="flex gap-3">
                    <span className="text-gray-400 w-40">{label}</span>
                    <code className="text-gray-600 text-xs">{path}</code>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
        </main>
      </div>
    </div>
  )
}
