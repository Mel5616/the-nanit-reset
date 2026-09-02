'use client'

import { useState } from 'react'

const NAVY = '#111D41'
const BLUE = '#6681AB'
const CREAM = '#FAF7F3'

export default function GiveawayPage() {
  const [form, setForm] = useState({ first_name: '', last_name: '', email: '', phone: '', postcode: '', answer: '', marketing_opt_in: false, eligibility: false, website: '' })
  const [state, setState] = useState<'idle' | 'sending' | 'done'>('idle')
  const [error, setError] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError(''); setState('sending')
    const res = await fetch('/api/giveaway', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form),
    })
    const d = await res.json().catch(() => ({}))
    if (res.ok) setState('done')
    else { setError(d.error || 'Something went wrong.'); setState('idle') }
  }

  const input: React.CSSProperties = { width: '100%', padding: '13px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.06)', color: '#fff', fontSize: 15, outline: 'none' }

  return (
    <main style={{ minHeight: '100vh', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 460 }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 12 }}>The Nanit Reset</p>
          <h1 style={{ color: '#fff', fontSize: 34, fontWeight: 300, fontFamily: 'Cotford, Georgia, serif', lineHeight: 1.2 }}>Win a Nanit bundle</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginTop: 12, lineHeight: 1.6 }}>Enter below. The winner will be drawn around our event on 15 November 2026.</p>
        </div>

        {state === 'done' ? (
          <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 16, padding: '32px 28px', textAlign: 'center' }}>
            <div style={{ fontSize: 30, marginBottom: 8 }}>✓</div>
            <p style={{ color: '#fff', fontSize: 18, fontFamily: 'Cotford, Georgia, serif', marginBottom: 6 }}>You&apos;re in the draw.</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 14 }}>Check your inbox for confirmation. Good luck!</p>
          </div>
        ) : (
          <form onSubmit={submit} style={{ display: 'grid', gap: 12 }}>
            <input style={input} required placeholder="First name" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
            <input style={input} placeholder="Last name" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
            <input style={input} type="email" required placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input style={input} placeholder="Phone (optional)" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <input style={input} placeholder="Postcode (optional)" value={form.postcode} onChange={e => setForm({ ...form, postcode: e.target.value })} />
            {/* honeypot */}
            <input tabIndex={-1} autoComplete="off" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} style={{ position: 'absolute', left: '-9999px' }} aria-hidden />
            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.5 }}>
              <input type="checkbox" checked={form.eligibility} onChange={e => setForm({ ...form, eligibility: e.target.checked })} style={{ marginTop: 3 }} />
              <span>I confirm I am 18 years or over and accept the giveaway terms.</span>
            </label>
            <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', color: 'rgba(255,255,255,0.7)', fontSize: 13, lineHeight: 1.5 }}>
              <input type="checkbox" checked={form.marketing_opt_in} onChange={e => setForm({ ...form, marketing_opt_in: e.target.checked })} style={{ marginTop: 3 }} />
              <span>Keep me updated from Nanit and Coolkidz Australia.</span>
            </label>
            {error && <p style={{ color: '#EDB39A', fontSize: 14 }}>{error}</p>}
            <button type="submit" disabled={state === 'sending'} style={{ background: BLUE, color: '#fff', border: 'none', padding: '14px', borderRadius: 999, fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: state === 'sending' ? 0.5 : 1 }}>
              {state === 'sending' ? 'Entering…' : 'Enter the draw'}
            </button>
          </form>
        )}
      </div>
    </main>
  )
}
