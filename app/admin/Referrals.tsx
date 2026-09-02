'use client'

import { useState, useEffect, useCallback } from 'react'

const NAVY = '#111D41'
const BLUE = '#6681AB'

interface Referrer { id: string; name: string; token: string; opens: number; signups: number }
interface Referred { id: string; name: string; email: string; status: string; audience_type: string; referred_by: string; created_at: string }

export default function Referrals() {
  const [referrers, setReferrers] = useState<Referrer[]>([])
  const [referred, setReferred] = useState<Referred[]>([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState<string | null>(null)

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/referrals')
    if (res.ok) { const d = await res.json(); setReferrers(d.referrers); setReferred(d.referred) }
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  function copy(token: string) {
    navigator.clipboard?.writeText(`${baseUrl}/refer/${token}`)
    setCopied(token); setTimeout(() => setCopied(null), 1500)
  }

  const totalSignups = referred.length

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-light" style={{ color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}>Referrals</h2>
        <p className="text-sm text-gray-400">Confirmed guests can invite others. Referred sign-ups land on the waitlist for review.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: BLUE }}>Referrers</p>
          <p className="text-3xl font-light" style={{ color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}>{referrers.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: BLUE }}>Referred sign-ups</p>
          <p className="text-3xl font-light" style={{ color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}>{totalSignups}</p>
        </div>
        <div className="bg-white rounded-2xl p-5 shadow-sm text-center">
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: BLUE }}>Link opens</p>
          <p className="text-3xl font-light" style={{ color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}>{referrers.reduce((s, r) => s + r.opens, 0)}</p>
        </div>
      </div>

      {loading ? (
        <p className="text-gray-400 text-sm py-10 text-center">Loading…</p>
      ) : (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Referrers + their links */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-xs uppercase tracking-widest" style={{ color: BLUE, fontFamily: 'NeuePlak, sans-serif', letterSpacing: '0.1em' }}>Share links · confirmed guests</p>
            </div>
            {referrers.length === 0 ? (
              <p className="px-5 py-8 text-center text-gray-400 text-sm">No confirmed guests yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100 max-h-[520px] overflow-auto">
                {referrers.map(r => (
                  <li key={r.id} className="px-5 py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="font-medium truncate" style={{ color: NAVY }}>{r.name}</p>
                      <p className="text-xs text-gray-400">{r.signups} sign-up{r.signups === 1 ? '' : 's'} · {r.opens} open{r.opens === 1 ? '' : 's'}</p>
                    </div>
                    <button onClick={() => copy(r.token)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300 shrink-0">
                      {copied === r.token ? 'Copied ✓' : 'Copy link'}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Referred people */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-xs uppercase tracking-widest" style={{ color: BLUE, fontFamily: 'NeuePlak, sans-serif', letterSpacing: '0.1em' }}>Referred sign-ups</p>
            </div>
            {referred.length === 0 ? (
              <p className="px-5 py-8 text-center text-gray-400 text-sm">No referred sign-ups yet.</p>
            ) : (
              <ul className="divide-y divide-gray-100 max-h-[520px] overflow-auto">
                {referred.map(r => (
                  <li key={r.id} className="px-5 py-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-medium truncate" style={{ color: NAVY }}>{r.name}</p>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-gray-100 text-gray-500 shrink-0">{r.status}</span>
                    </div>
                    <p className="text-xs text-gray-400 truncate">{r.email} · referred by {r.referred_by}</p>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
