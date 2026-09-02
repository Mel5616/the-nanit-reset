'use client'

import { useState, useEffect, useCallback } from 'react'

const NAVY = '#111D41'
const BLUE = '#6681AB'

interface Entry {
  id: string
  created_at: string
  first_name: string
  last_name: string | null
  email: string
  phone: string | null
  postcode: string | null
  marketing_opt_in: boolean
  is_winner: boolean
  forfeited: boolean
  drawn_at: string | null
  source: string | null
}

export default function Giveaway() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [drawing, setDrawing] = useState(false)
  const [q, setQ] = useState('')

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/giveaway')
    if (res.ok) setEntries(await res.json())
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  async function draw(action: 'draw' | 'redraw') {
    if (action === 'redraw' && !confirm('Forfeit the current winner and draw again?')) return
    setDrawing(true)
    const res = await fetch('/api/admin/giveaway', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ action }),
    })
    const d = await res.json().catch(() => ({}))
    if (!res.ok) alert(d.error || 'Could not draw.')
    await load(); setDrawing(false)
  }

  const winner = entries.find(e => e.is_winner && !e.forfeited)
  const eligible = entries.filter(e => !e.is_winner).length
  const filtered = entries.filter(e => {
    if (!q.trim()) return true
    const s = q.toLowerCase()
    return `${e.first_name} ${e.last_name || ''} ${e.email} ${e.postcode || ''}`.toLowerCase().includes(s)
  })

  function exportCsv() {
    const cols = ['created_at', 'first_name', 'last_name', 'email', 'phone', 'postcode', 'marketing_opt_in', 'is_winner', 'source']
    const esc = (v: unknown) => { const s = v == null ? '' : String(v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s }
    const csv = [cols.join(','), ...entries.map(e => cols.map(c => esc((e as unknown as Record<string, unknown>)[c])).join(','))].join('\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }))
    const a = document.createElement('a'); a.href = url; a.download = 'giveaway-entries.csv'; a.click(); URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-light" style={{ color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}>Giveaway</h2>
          <p className="text-sm text-gray-400">
            {entries.length} entries · public form at <a href="/giveaway" target="_blank" rel="noreferrer" className="underline" style={{ color: BLUE }}>/giveaway</a>
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={exportCsv} className="px-4 py-2 rounded-full text-sm border border-gray-200 text-gray-500">Export CSV</button>
          {winner
            ? <button onClick={() => draw('redraw')} disabled={drawing} className="px-4 py-2 rounded-full text-white text-sm font-medium disabled:opacity-50" style={{ background: '#F59E0B' }}>{drawing ? '…' : 'Redraw'}</button>
            : <button onClick={() => draw('draw')} disabled={drawing || eligible === 0} className="px-4 py-2 rounded-full text-white text-sm font-medium disabled:opacity-50" style={{ background: BLUE }}>{drawing ? 'Drawing…' : '🎉 Draw winner'}</button>}
        </div>
      </div>

      {winner && (
        <div className="rounded-2xl p-6 mb-6 text-center" style={{ background: '#ECFDF5', border: '1px solid #A9DFBF' }}>
          <p className="text-xs uppercase tracking-widest mb-2" style={{ color: '#059669' }}>Winner</p>
          <p className="text-3xl font-light" style={{ color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}>{winner.first_name} {winner.last_name}</p>
          <p className="text-sm text-gray-500 mt-1">{winner.email}{winner.postcode ? ` · ${winner.postcode}` : ''}</p>
        </div>
      )}

      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search entries…" className="w-full mb-4 px-4 py-2.5 rounded-xl text-sm outline-none border border-gray-200 focus:border-blue-300" />

      {loading ? (
        <p className="text-gray-400 text-sm py-10 text-center">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center"><p className="text-gray-400 text-sm">No entries yet.</p></div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-100">
            {filtered.map(e => (
              <li key={e.id} className="px-5 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium truncate" style={{ color: NAVY }}>
                    {e.first_name} {e.last_name}
                    {e.is_winner && !e.forfeited && <span className="ml-2 text-xs" style={{ color: '#059669' }}>★ winner</span>}
                    {e.forfeited && <span className="ml-2 text-xs text-gray-300">forfeited</span>}
                  </p>
                  <p className="text-sm text-gray-400 truncate">{e.email}{e.postcode ? ` · ${e.postcode}` : ''}</p>
                </div>
                <span className="text-xs text-gray-300 shrink-0">{new Date(e.created_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
