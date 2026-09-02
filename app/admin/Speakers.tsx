'use client'

import { useState, useEffect, useCallback } from 'react'

const NAVY = '#111D41'
const BLUE = '#6681AB'
const CREAM = '#F3E8E0'

interface Speaker {
  id: string
  name: string
  title: string | null
  organization: string | null
  email: string | null
  instagram_handle: string | null
  involved_as: string | null
  specialty: string | null
  personalized_why: string | null
  why_involved: string | null
  proposed_topic: string | null
  public_token: string
  status: 'invited' | 'confirmed' | 'declined'
  email_sent_at: string | null
  agreement_fee: string | null
  agreement_status: 'not_sent' | 'sent' | 'signed_by_speaker' | 'fully_executed'
}

const STATUS: Record<string, { bg: string; text: string; label: string }> = {
  invited:   { bg: '#EFF6FF', text: '#3B82F6', label: 'Invited' },
  confirmed: { bg: '#ECFDF5', text: '#059669', label: 'Confirmed ✓' },
  declined:  { bg: '#FEF2F2', text: '#DC2626', label: 'Declined' },
}
const AGREEMENT: Record<string, { text: string; label: string }> = {
  not_sent:         { text: '#9CA3AF', label: 'No agreement yet' },
  sent:             { text: '#3B82F6', label: 'Agreement sent' },
  signed_by_speaker:{ text: '#F59E0B', label: 'Signed — needs countersign' },
  fully_executed:   { text: '#059669', label: 'Fully executed ✓' },
}

const EMPTY = {
  name: '', title: '', organization: '', email: '', instagram_handle: '',
  involved_as: 'a featured speaker', specialty: '', agreement_fee: '',
  personalized_why: '', why_involved: '', proposed_topic: '',
}

export default function Speakers() {
  const [speakers, setSpeakers] = useState<Speaker[]>([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ ...EMPTY })
  const [showForm, setShowForm] = useState(false)
  const [busy, setBusy] = useState<string | null>(null)
  const [msg, setMsg] = useState<string | null>(null)
  const [signId, setSignId] = useState<string | null>(null)
  const [signName, setSignName] = useState('')

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || (typeof window !== 'undefined' ? window.location.origin : '')

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/speakers')
    if (res.ok) setSpeakers(await res.json())
    setLoading(false)
  }, [])
  useEffect(() => { load() }, [load])

  async function add(e: React.FormEvent) {
    e.preventDefault()
    setBusy('add'); setMsg(null)
    const res = await fetch('/api/admin/speakers', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) { setForm({ ...EMPTY }); setShowForm(false); await load() }
    else { const d = await res.json().catch(() => ({})); setMsg(d.error || 'Could not add speaker.') }
    setBusy(null)
  }

  async function sendInvite(id: string) {
    setBusy(id); setMsg(null)
    const res = await fetch('/api/admin/send-speaker-invite', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    const d = await res.json().catch(() => ({}))
    setMsg(res.ok ? 'Invitation sent.' : (d.error || 'Failed to send.'))
    await load(); setBusy(null)
  }

  async function countersign(id: string) {
    if (!signName.trim()) return
    setBusy(id)
    const res = await fetch('/api/admin/speaker-agreement', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, signature: signName }),
    })
    const d = await res.json().catch(() => ({}))
    setMsg(res.ok ? 'Agreement fully executed.' : (d.error || 'Failed.'))
    setSignId(null); setSignName(''); await load(); setBusy(null)
  }

  async function remove(id: string, name: string) {
    if (!confirm(`Remove ${name}?`)) return
    await fetch('/api/admin/speakers', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await load()
  }

  function copyLink(token: string) {
    navigator.clipboard?.writeText(`${baseUrl}/speaker/${token}`)
    setMsg('Portal link copied.')
  }

  const input = 'w-full px-3 py-2 rounded-xl text-sm outline-none border border-gray-200 focus:border-blue-300'

  return (
    <div>
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <h2 className="text-2xl font-light" style={{ color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}>Speakers</h2>
          <p className="text-sm text-gray-400">Invite speakers, track RSVPs and manage talent agreements.</p>
        </div>
        <button onClick={() => setShowForm(v => !v)} className="px-4 py-2 rounded-full text-white text-sm font-medium" style={{ background: BLUE }}>
          {showForm ? 'Close' : '+ Add speaker'}
        </button>
      </div>

      {msg && <div className="mb-4 text-sm px-4 py-2.5 rounded-xl" style={{ background: '#EFF6FF', color: NAVY }}>{msg}</div>}

      {showForm && (
        <form onSubmit={add} className="bg-white rounded-2xl shadow-sm p-6 mb-6 grid gap-3 sm:grid-cols-2">
          <input required placeholder="Name *" className={input} value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
          <input placeholder="Title (Dr, Founder…)" className={input} value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
          <input placeholder="Organisation" className={input} value={form.organization} onChange={e => setForm({ ...form, organization: e.target.value })} />
          <input type="email" placeholder="Email" className={input} value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input placeholder="Instagram handle" className={input} value={form.instagram_handle} onChange={e => setForm({ ...form, instagram_handle: e.target.value })} />
          <input placeholder="Involved as (e.g. our host)" className={input} value={form.involved_as} onChange={e => setForm({ ...form, involved_as: e.target.value })} />
          <input placeholder="Fee (AUD, agreement)" className={input} value={form.agreement_fee} onChange={e => setForm({ ...form, agreement_fee: e.target.value })} />
          <input placeholder="Specialty / area" className={input} value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} />
          <textarea placeholder="Personalised opening (why them) — optional" className={`${input} sm:col-span-2`} rows={2} value={form.personalized_why} onChange={e => setForm({ ...form, personalized_why: e.target.value })} />
          <textarea placeholder="Why we'd love you involved — optional" className={`${input} sm:col-span-2`} rows={2} value={form.why_involved} onChange={e => setForm({ ...form, why_involved: e.target.value })} />
          <textarea placeholder="Proposed involvement / topic — optional" className={`${input} sm:col-span-2`} rows={2} value={form.proposed_topic} onChange={e => setForm({ ...form, proposed_topic: e.target.value })} />
          <div className="sm:col-span-2">
            <button type="submit" disabled={busy === 'add'} className="px-5 py-2.5 rounded-full text-white text-sm font-medium disabled:opacity-50" style={{ background: NAVY }}>
              {busy === 'add' ? 'Adding…' : 'Add speaker'}
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-400 text-sm py-10 text-center">Loading…</p>
      ) : speakers.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-10 text-center">
          <p className="text-gray-400 text-sm">No speakers yet. Add your first above.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {speakers.map(sp => {
            const st = STATUS[sp.status]
            const ag = AGREEMENT[sp.agreement_status]
            return (
              <div key={sp.id} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="min-w-0">
                    <p className="font-semibold" style={{ color: NAVY }}>
                      {sp.title ? `${sp.title} ` : ''}{sp.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {[sp.organization, sp.email].filter(Boolean).join(' · ') || sp.involved_as}
                    </p>
                    <div className="flex items-center gap-2 mt-2 flex-wrap">
                      <span className="text-xs px-2.5 py-0.5 rounded-full font-medium" style={{ background: st.bg, color: st.text }}>{st.label}</span>
                      <span className="text-xs" style={{ color: ag.text }}>{ag.label}</span>
                      {sp.email_sent_at && <span className="text-xs text-gray-300">· invited {new Date(sp.email_sent_at).toLocaleDateString('en-AU', { day: 'numeric', month: 'short' })}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2 flex-wrap justify-end">
                    <button onClick={() => copyLink(sp.public_token)} className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300">Copy link</button>
                    <a href={`/speaker/${sp.public_token}`} target="_blank" rel="noreferrer" className="text-xs px-3 py-1.5 rounded-lg border border-gray-200 text-gray-500 hover:border-gray-300">Preview</a>
                    {sp.email && (
                      <button onClick={() => sendInvite(sp.id)} disabled={busy === sp.id} className="text-xs px-3 py-1.5 rounded-lg text-white disabled:opacity-50" style={{ background: BLUE }}>
                        {busy === sp.id ? '…' : sp.email_sent_at ? 'Resend invite' : 'Send invite'}
                      </button>
                    )}
                    {sp.agreement_status === 'signed_by_speaker' && (
                      signId === sp.id ? (
                        <span className="flex items-center gap-1">
                          <input autoFocus placeholder="Your name" value={signName} onChange={e => setSignName(e.target.value)} className="text-xs px-2 py-1.5 rounded-lg border border-gray-200 w-28" />
                          <button onClick={() => countersign(sp.id)} disabled={busy === sp.id} className="text-xs px-3 py-1.5 rounded-lg text-white" style={{ background: NAVY }}>Sign</button>
                        </span>
                      ) : (
                        <button onClick={() => setSignId(sp.id)} className="text-xs px-3 py-1.5 rounded-lg text-white" style={{ background: '#F59E0B' }}>Countersign</button>
                      )
                    )}
                    <button onClick={() => remove(sp.id, sp.name)} className="text-xs px-2 py-1.5 rounded-lg text-gray-300 hover:text-red-500">Remove</button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
