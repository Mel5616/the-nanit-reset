'use client'

import { useState, useEffect } from 'react'

const NAVY = '#111D41'
const BLUE = '#6681AB'

const AUDIENCES: [string, string][] = [
  ['influencer', 'Influencer / Creator'],
  ['wellness', 'Wellness Creator'],
  ['media', 'Media & PR'],
  ['hcp', 'Healthcare Professional'],
  ['retail', 'Retail Partner'],
  ['celebrity', 'Other'],
]

export default function ReferPage({ params }: { params: Promise<{ token: string }> }) {
  const [token, setToken] = useState<string | null>(null)
  const [referrer, setReferrer] = useState<string | null>(null)
  const [stage, setStage] = useState<'loading' | 'ready' | 'notfound' | 'done'>('loading')
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', company: '', instagram_handle: '', audience_type: 'influencer', website: '' })
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => { params.then(p => setToken(p.token)) }, [params])
  useEffect(() => {
    if (!token) return
    fetch(`/api/refer/${token}`)
      .then(r => r.json())
      .then(d => { if (!d.found) setStage('notfound'); else { setReferrer(d.referrer_name); setStage('ready') } })
      .catch(() => setStage('notfound'))
  }, [token])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setBusy(true)
    const res = await fetch(`/api/refer/${token}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    })
    const d = await res.json().catch(() => ({}))
    if (res.ok) setStage('done')
    else { setError(d.error || 'Something went wrong.'); setBusy(false) }
  }

  const input: React.CSSProperties = { width: '100%', padding: '13px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 15, outline: 'none' }

  if (stage === 'loading') return (
    <div style={{ minHeight: '100vh', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: `2px solid ${BLUE}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
  if (stage === 'notfound') return (
    <div style={{ minHeight: '100vh', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>This referral link isn&apos;t valid.</p>
    </div>
  )
  if (stage === 'done') return (
    <div style={{ minHeight: '100vh', background: NAVY, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>💙</div>
      <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 300, fontFamily: 'Cotford, Georgia, serif' }}>You&apos;re on the list.</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginTop: 8, maxWidth: 360 }}>Thanks for registering your interest in The Nanit Reset. Our team will be in touch as places are confirmed.</p>
    </div>
  )

  return (
    <main style={{ minHeight: '100vh', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 26 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>The Nanit Reset · 15 November 2026</p>
          <h1 style={{ color: '#fff', fontSize: 32, fontWeight: 300, fontFamily: 'Cotford, Georgia, serif', lineHeight: 1.2 }}>You&apos;re invited</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginTop: 12, lineHeight: 1.6 }}>
            {referrer ? `${referrer} thought you'd love to join us.` : 'Register your interest below.'} Leave your details and our team will be in touch.
          </p>
        </div>
        <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
          <input style={input} required placeholder="First name" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
          <input style={input} placeholder="Last name" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
          <input style={input} type="email" required placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
          <input style={input} placeholder="Company / brand (optional)" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
          <input style={input} placeholder="Instagram handle (optional)" value={form.instagram_handle} onChange={e => setForm({ ...form, instagram_handle: e.target.value })} />
          <select style={{ ...input, color: '#fff' }} value={form.audience_type} onChange={e => setForm({ ...form, audience_type: e.target.value })}>
            {AUDIENCES.map(([v, l]) => <option key={v} value={v} style={{ color: '#111' }}>{l}</option>)}
          </select>
          <input tabIndex={-1} autoComplete="off" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} style={{ position: 'absolute', left: '-9999px' }} aria-hidden />
          {error && <p style={{ color: '#EDB39A', fontSize: 14 }}>{error}</p>}
          <button type="submit" disabled={busy} style={{ background: BLUE, color: '#fff', border: 'none', padding: '14px', borderRadius: 999, fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: busy ? 0.5 : 1 }}>
            {busy ? 'Registering…' : 'Register my interest'}
          </button>
        </form>
      </div>
    </main>
  )
}
