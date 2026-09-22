'use client'

import { useState } from 'react'

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

export default function SaveTheDatePage() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', instagram_handle: '', company: '', audience_type: 'influencer', notes: '', website: '' })
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setState('sending')
    const res = await fetch('/api/eoi', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) })
    const d = await res.json().catch(() => ({}))
    if (res.ok) setState('done')
    else { setError(d.error || 'Something went wrong.'); setState('idle') }
  }

  const input: React.CSSProperties = { width: '100%', padding: '13px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 15, outline: 'none', fontFamily: 'BentonSans, sans-serif' }

  return (
    <main style={{ minHeight: '100vh', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '44px 20px' }}>
      <div style={{ width: '100%', maxWidth: 480 }}>
        <div style={{ textAlign: 'center', marginBottom: 30 }}>
          <img src="/nanit-logo-light.png" alt="Nanit" style={{ height: 24, opacity: 0.85, marginBottom: 22 }} />
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 14 }}>By invitation only</p>
          <h1 style={{ color: '#fff', fontSize: 40, fontWeight: 300, fontFamily: 'Cotford, Georgia, serif', lineHeight: 1.1 }}>Save the date</h1>
          <p style={{ color: '#BDD4E7', fontSize: 16, marginTop: 12, fontFamily: 'Cotford, Georgia, serif' }}>The Nanit Reset · Monday 16 November 2026 · Sydney</p>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginTop: 14, lineHeight: 1.6 }}>
            An intimate, education-led morning with Dr Natalie Barnett. Register your interest below, full details to come.
          </p>
        </div>

        {state === 'done' ? (
          <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '32px 28px', textAlign: 'center' }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>💙</div>
            <p style={{ color: '#fff', fontSize: 20, fontFamily: 'Cotford, Georgia, serif', marginBottom: 6 }}>You&apos;re on the list.</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14, lineHeight: 1.6 }}>Please hold Monday 16 November. We&apos;ll be in touch with full details and your invitation soon.</p>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
            <div style={{ display: 'flex', gap: 12 }}>
              <input style={input} required placeholder="First name" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
              <input style={input} placeholder="Last name" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
            </div>
            <input style={input} type="email" required placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input style={input} type="tel" required placeholder="Mobile number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <input style={input} placeholder="Instagram handle" value={form.instagram_handle} onChange={e => setForm({ ...form, instagram_handle: e.target.value })} />
            <input style={input} placeholder="Company / brand (optional)" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            <select style={{ ...input, color: '#fff' }} value={form.audience_type} onChange={e => setForm({ ...form, audience_type: e.target.value })}>
              {AUDIENCES.map(([v, l]) => <option key={v} value={v} style={{ color: '#111' }}>{l}</option>)}
            </select>
            <textarea style={{ ...input, minHeight: 70, resize: 'vertical' }} placeholder="Anything you'd like us to know? (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            <input tabIndex={-1} autoComplete="off" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} style={{ position: 'absolute', left: '-9999px' }} aria-hidden />
            {error && <p style={{ color: '#EDB39A', fontSize: 14 }}>{error}</p>}
            <button type="submit" disabled={state === 'sending'} style={{ background: BLUE, color: '#fff', border: 'none', padding: '14px', borderRadius: 999, fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: state === 'sending' ? 0.5 : 1, fontFamily: 'BentonSans, sans-serif' }}>
              {state === 'sending' ? 'Registering…' : 'Register my interest'}
            </button>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 12, textAlign: 'center', marginTop: 4 }}>An expression of interest. Places are limited and by invitation.</p>
          </form>
        )}
      </div>
    </main>
  )
}
