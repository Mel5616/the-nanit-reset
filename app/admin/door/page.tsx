'use client'

import { useState, useCallback, useMemo, useEffect } from 'react'
import { Guest, AudienceType } from '@/lib/supabase'
import { audienceLabels } from '@/lib/invite-content'
import Link from 'next/link'

const NAVY = '#111D41'
const BLUE = '#6681AB'
const CREAM = '#F3E8E0'
const PEACH = '#EDB39A'

const audienceColors: Record<AudienceType, string> = {
  influencer: '#6681AB',
  media:      '#204977',
  wellness:   '#BDD4E7',
  hcp:        '#EDB39A',
  retail:     '#EFC973',
  celebrity:  '#111D41',
}

export default function DoorPage() {
  const [guests, setGuests] = useState<Guest[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [checkinLoading, setCheckinLoading] = useState<string | null>(null)
  const [lastCheckedIn, setLastCheckedIn] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'waiting' | 'done'>('all')

  const fetchGuests = useCallback(async () => {
    const res = await fetch('/api/admin/door-guests')
    if (res.ok) {
      const data = await res.json()
      setGuests(data)
    }
    setLoading(false)
  }, [])

  useEffect(() => { fetchGuests() }, [fetchGuests])

  // Auto-refresh every 20 seconds
  useEffect(() => {
    const interval = setInterval(fetchGuests, 20000)
    return () => clearInterval(interval)
  }, [fetchGuests])

  async function handleCheckin(id: string, undo: boolean) {
    setCheckinLoading(id)
    await fetch('/api/admin/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, undo }),
    })
    await fetchGuests()
    setCheckinLoading(null)
    if (!undo) setLastCheckedIn(id)
  }

  const confirmed = useMemo(() =>
    guests
      .filter(g => g.status === 'confirmed')
      .sort((a, b) => `${a.last_name}${a.first_name}`.localeCompare(`${b.last_name}${b.first_name}`)),
    [guests]
  )

  const filtered = useMemo(() => {
    let list = confirmed
    if (filter === 'waiting') list = list.filter(g => !g.checked_in)
    if (filter === 'done') list = list.filter(g => g.checked_in)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(g =>
        `${g.first_name} ${g.last_name}`.toLowerCase().includes(q) ||
        g.email.toLowerCase().includes(q) ||
        (g.company || '').toLowerCase().includes(q)
      )
    }
    return list
  }, [confirmed, search, filter])

  const checkedIn = confirmed.filter(g => g.checked_in).length
  const total = confirmed.length
  const pct = total > 0 ? Math.round((checkedIn / total) * 100) : 0

  return (
    <div className="min-h-screen flex flex-col" style={{ background: '#FAF7F3', fontFamily: 'BentonSans, Helvetica Neue, sans-serif' }}>

      {/* Sticky top bar */}
      <div className="sticky top-0 z-30 border-b border-gray-200" style={{ background: '#fff' }}>
        {/* Header */}
        <div className="px-4 pt-4 pb-3 flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: BLUE, fontFamily: 'NeuePlak, sans-serif' }}>Door check-in</p>
            <h1 className="text-lg font-light" style={{ color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}>The Nanit Reset</h1>
          </div>
          <div className="text-right">
            <p className="text-3xl font-light leading-none" style={{ color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}>
              {checkedIn}<span className="text-gray-300 text-xl mx-1">/</span><span className="text-gray-400">{total}</span>
            </p>
            <p className="text-xs mt-0.5" style={{ color: BLUE }}>{pct}% arrived</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1 mx-4 mb-3 rounded-full overflow-hidden bg-gray-100">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, background: BLUE }} />
        </div>

        {/* Search + refresh */}
        <div className="px-4 pb-3 flex gap-2">
          <div className="relative flex-1">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
            </svg>
            <input
              type="search"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name or company…"
              className="w-full rounded-xl pl-9 pr-4 py-2.5 text-sm outline-none border border-gray-200 focus:border-blue-300"
              style={{ fontFamily: 'BentonSans, sans-serif' }}
            />
          </div>
          <button
            onClick={fetchGuests}
            className="w-10 h-10 rounded-xl text-white flex items-center justify-center text-lg shrink-0"
            style={{ background: BLUE }}>
            ↻
          </button>
        </div>

        {/* Filter pills */}
        <div className="px-4 pb-3 flex gap-2">
          {([['all', 'All'], ['waiting', 'Waiting'], ['done', 'Checked in']] as const).map(([val, label]) => (
            <button
              key={val}
              onClick={() => setFilter(val)}
              className="px-4 py-1.5 rounded-full text-xs font-medium transition-all"
              style={filter === val
                ? { background: NAVY, color: '#fff' }
                : { background: CREAM, color: NAVY }}>
              {label}{val === 'waiting' && total > 0 ? ` (${total - checkedIn})` : val === 'done' && total > 0 ? ` (${checkedIn})` : ''}
            </button>
          ))}
          <Link href="/admin" className="ml-auto text-xs px-4 py-1.5 rounded-full" style={{ color: BLUE, background: CREAM }}>
            ← Admin
          </Link>
        </div>
      </div>

      {/* Guest list */}
      <div className="flex-1 px-4 py-3 space-y-2 pb-10">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: BLUE, borderTopColor: 'transparent' }} />
          </div>
        ) : total === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">No confirmed guests yet.</p>
            <p className="text-gray-300 text-xs mt-1">Guests will appear here once they RSVP confirmed.</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-gray-400 text-sm">No guests match your search.</div>
        ) : filtered.map(g => {
          const color = audienceColors[g.audience_type] || BLUE
          const isLoading = checkinLoading === g.id
          const justCheckedIn = lastCheckedIn === g.id

          return (
            <div
              key={g.id}
              className={`bg-white rounded-2xl px-4 py-4 flex items-center gap-4 shadow-sm transition-all ${g.checked_in ? 'opacity-55' : ''} ${justCheckedIn ? 'ring-2' : ''}`}
              style={justCheckedIn ? { ringColor: '#059669' } : undefined}
            >
              {/* Colour dot */}
              <div className="w-3 h-3 rounded-full shrink-0" style={{ background: color }} />

              {/* Name + meta */}
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-base leading-tight ${g.checked_in ? 'line-through text-gray-300' : ''}`}
                  style={{ color: g.checked_in ? undefined : NAVY, fontFamily: 'BentonSans, sans-serif' }}>
                  {g.first_name} {g.last_name}
                </p>
                <div className="flex flex-wrap items-center gap-1.5 mt-1">
                  <span className="text-xs" style={{ color: BLUE }}>{audienceLabels[g.audience_type]}</span>
                  {g.company && <span className="text-xs text-gray-400">· {g.company}</span>}
                </div>
                <div className="flex flex-wrap gap-1.5 mt-1.5">
                  {g.dietary_requirements && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-100">
                      {g.dietary_requirements}
                    </span>
                  )}
                  {g.goody_bag && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium border" style={{ background: '#F3E8E0', color: NAVY, borderColor: '#E5D8D0' }}>
                      {g.goody_bag}
                    </span>
                  )}
                  {g.speaker_session && (
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: '#EDF2F8', color: '#204977' }}>
                      1:1 Dr Natalie
                    </span>
                  )}
                </div>
                {g.checked_in && g.checked_in_at && (
                  <p className="text-xs mt-1" style={{ color: '#059669' }}>
                    ✓ Arrived {new Date(g.checked_in_at).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                  </p>
                )}
              </div>

              {/* Action button */}
              {g.checked_in ? (
                <button
                  onClick={() => handleCheckin(g.id, true)}
                  disabled={isLoading}
                  className="text-xs text-gray-400 border border-gray-200 px-3 py-2 rounded-xl shrink-0 disabled:opacity-50"
                  style={{ fontFamily: 'BentonSans, sans-serif' }}>
                  Undo
                </button>
              ) : (
                <button
                  onClick={() => handleCheckin(g.id, false)}
                  disabled={isLoading}
                  className="text-white font-semibold text-sm px-5 py-3 rounded-xl shrink-0 disabled:opacity-50 active:scale-95 transition-transform"
                  style={{ background: color, fontFamily: 'BentonSans, sans-serif' }}>
                  {isLoading ? '…' : 'Check in'}
                </button>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
