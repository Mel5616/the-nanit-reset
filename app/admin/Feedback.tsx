'use client'

import { useState, useEffect, useCallback } from 'react'

const NAVY = '#111D41'
const BLUE = '#6681AB'

interface Row {
  id: string
  submitted_at: string
  first_name: string | null
  email: string | null
  attended: boolean | null
  overall_rating: number | null
  recommend: number | null
  highlight: string | null
  improve: string | null
  topics_next: string | null
  consent: boolean
}
interface Stats { submitted: number; avg_rating: number | null; avg_recommend: number | null; nps: number | null; consented: number }

export default function Feedback() {
  const [rows, setRows] = useState<Row[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [sending, setSending] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/survey')
    if (res.ok) { const d = await res.json(); setRows(d.rows); setStats(d.stats) }
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  async function send(scope: 'attended' | 'confirmed') {
    const who = scope === 'attended' ? 'everyone who checked in' : 'all confirmed guests'
    if (!confirm(`Send the feedback survey to ${who}?`)) return
    setSending(true); setMsg(null)
    const res = await fetch('/api/admin/send-survey', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ scope }),
    })
    const d = await res.json().catch(() => ({}))
    setMsg(res.ok ? `Sent: ${d.sent} · Failed: ${d.failed}` : (d.error || 'Failed to send.'))
    setSending(false)
  }

  const Stat = ({ label, value }: { label: string; value: string | number | null }) => (
    <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
      <p className="text-xs uppercase tracking-widest mb-1" style={{ color: BLUE, fontFamily: 'NeuePlak, sans-serif', letterSpacing: '0.1em' }}>{label}</p>
      <p className="text-3xl font-light" style={{ color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}>{value ?? '—'}</p>
    </div>
  )

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-light" style={{ color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}>Feedback</h2>
          <p className="text-sm text-gray-400">Post-event survey responses.</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => send('attended')} disabled={sending} className="px-4 py-2 rounded-full text-white text-sm font-medium disabled:opacity-50" style={{ background: BLUE }}>
            {sending ? 'Sending…' : 'Send to attendees'}
          </button>
          <button onClick={() => send('confirmed')} disabled={sending} className="px-4 py-2 rounded-full text-sm border border-gray-200 text-gray-500 disabled:opacity-50">
            Send to all confirmed
          </button>
        </div>
      </div>

      {msg && <div className="mb-4 text-sm px-4 py-2.5 rounded-xl" style={{ background: '#EFF6FF', color: NAVY }}>{msg}</div>}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <Stat label="Responses" value={stats?.submitted ?? 0} />
        <Stat label="Avg rating" value={stats?.avg_rating != null ? `${stats.avg_rating} / 5` : null} />
        <Stat label="NPS" value={stats?.nps ?? null} />
        <Stat label="Contactable" value={stats?.consented ?? 0} />
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm py-10 text-center">Loading…</p>
      ) : rows.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <p className="text-gray-400 text-sm">No responses yet. Send the survey after the event.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {rows.map(r => (
            <div key={r.id} className="bg-white rounded-2xl shadow-sm p-5">
              <div className="flex items-center justify-between gap-3 flex-wrap mb-2">
                <p className="font-medium" style={{ color: NAVY }}>
                  {r.first_name || r.email || 'Guest'}
                  {r.attended === false && <span className="ml-2 text-xs text-gray-300">didn&apos;t attend</span>}
                </p>
                <div className="flex items-center gap-3 text-sm">
                  {r.overall_rating != null && <span style={{ color: '#EDB39A' }}>{'★'.repeat(r.overall_rating)}<span className="text-gray-200">{'★'.repeat(5 - r.overall_rating)}</span></span>}
                  {r.recommend != null && <span className="text-gray-400">NPS {r.recommend}</span>}
                </div>
              </div>
              {r.highlight && <p className="text-sm text-gray-600 mb-1"><span className="text-gray-400">Loved: </span>{r.highlight}</p>}
              {r.improve && <p className="text-sm text-gray-600 mb-1"><span className="text-gray-400">Better: </span>{r.improve}</p>}
              {r.topics_next && <p className="text-sm text-gray-600"><span className="text-gray-400">Next: </span>{r.topics_next}</p>}
              <p className="text-xs text-gray-300 mt-2">{new Date(r.submitted_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}{r.email ? ` · ${r.email}` : ''}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
