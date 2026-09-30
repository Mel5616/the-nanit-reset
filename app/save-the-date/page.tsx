'use client'

import { useState } from 'react'

const NAVY = '#111D41'
const MIDNIGHT = '#2D4977'
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

  return (
    <main className="std">
      <style>{CSS}</style>
      <div className="std-card">
        <div className="std-head">
          <div className="std-seal" />
          <p className="std-eyebrow">By invitation only</p>
          <h1 className="std-title">Save the date</h1>
          <p className="std-when">The Nanit Reset · Monday 16 November 2026 · Sydney</p>
          <p className="std-intro">
            An intimate, education-led morning with Dr Natalie Barnett. A morning just for you, three hours to pause,
            listen and reset. Register your interest below, full details to come.
          </p>
        </div>

        {state === 'done' ? (
          <div className="std-done">
            <div className="std-seal std-seal-sm" />
            <p className="std-done-title">You&apos;re on the list.</p>
            <p className="std-done-copy">Please hold Monday 16 November. We&apos;ll be in touch with full details and your invitation soon.</p>
          </div>
        ) : (
          <form onSubmit={submit} className="std-form">
            <div className="std-row">
              <input className="std-input" required placeholder="First name" value={form.first_name} onChange={e => setForm({ ...form, first_name: e.target.value })} />
              <input className="std-input" placeholder="Last name" value={form.last_name} onChange={e => setForm({ ...form, last_name: e.target.value })} />
            </div>
            <input className="std-input" type="email" required placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
            <input className="std-input" type="tel" required placeholder="Mobile number" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
            <input className="std-input" placeholder="Instagram handle" value={form.instagram_handle} onChange={e => setForm({ ...form, instagram_handle: e.target.value })} />
            <input className="std-input" placeholder="Company / brand (optional)" value={form.company} onChange={e => setForm({ ...form, company: e.target.value })} />
            <select className="std-input std-select" value={form.audience_type} onChange={e => setForm({ ...form, audience_type: e.target.value })}>
              {AUDIENCES.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
            </select>
            <textarea className="std-input std-area" placeholder="Anything you'd like us to know? (optional)" value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} />
            <input tabIndex={-1} autoComplete="off" value={form.website} onChange={e => setForm({ ...form, website: e.target.value })} className="std-hp" aria-hidden />
            {error && <p className="std-error">{error}</p>}
            <button type="submit" disabled={state === 'sending'} className="std-btn">
              {state === 'sending' ? 'Registering…' : 'Register my interest'}
            </button>
            <p className="std-note">An expression of interest. Places are limited and by invitation.</p>
          </form>
        )}
      </div>
    </main>
  )
}

const CSS = `
.std{ position:relative; min-height:100vh; display:flex; align-items:center; justify-content:center; padding:44px 18px;
  background:radial-gradient(125% 90% at 50% 6%, #F0E9DE 0%, #E8E0D4 52%, #DED4C6 100%);
  font-family:NeuePlak, "Helvetica Neue", Arial, sans-serif; -webkit-font-smoothing:antialiased; }
.std::before{ content:""; position:absolute; inset:0; z-index:0; pointer-events:none;
  background:url("/invite-bg.jpg") left bottom / cover no-repeat; mix-blend-mode:multiply; opacity:.45; }
.std-card{ position:relative; z-index:1; width:100%; max-width:500px;
  background:radial-gradient(130% 80% at 50% 0%, #FBF6EF 0%, #F5EEE4 60%, #F0E8DB 100%);
  border-radius:22px; box-shadow:0 30px 70px -28px rgba(17,29,65,.4), 0 8px 22px rgba(17,29,65,.10);
  padding:38px 30px 32px; border:1px solid rgba(120,110,95,.10); }
.std-head{ text-align:center; }
.std-seal{ width:76px; height:76px; margin:0 auto 18px; background:url("/wax-seal.png") center/contain no-repeat;
  filter:drop-shadow(0 5px 9px rgba(17,29,65,.28)); }
.std-seal-sm{ width:56px; height:56px; margin-bottom:14px; }
.std-eyebrow{ color:#9AA7BD; font-size:11px; letter-spacing:.24em; text-transform:uppercase; margin:0 0 12px; }
.std-title{ color:${NAVY}; font-size:clamp(34px,8vw,44px); font-weight:300; font-family:Cotford, Georgia, serif; line-height:1.06; margin:0; }
.std-when{ color:${MIDNIGHT}; font-size:15px; margin:14px 0 0; font-family:Cotford, Georgia, serif; }
.std-intro{ color:rgba(45,73,119,.72); font-size:14.5px; line-height:1.6; margin:16px auto 26px; max-width:40ch; }

.std-form{ display:grid; gap:11px; }
.std-row{ display:flex; gap:11px; }
.std-input{ width:100%; padding:13px 15px; border-radius:12px; border:1px solid rgba(45,73,119,.18);
  background:rgba(255,255,255,.7); color:${NAVY}; font-size:15px; outline:none; font-family:NeuePlak, sans-serif;
  transition:border-color .18s ease, background .18s ease, box-shadow .18s ease; }
.std-input::placeholder{ color:rgba(45,73,119,.42); }
.std-input:focus{ border-color:${BLUE}; background:#fff; box-shadow:0 0 0 3px rgba(102,129,171,.14); }
.std-select{ appearance:none; -webkit-appearance:none;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%232D4977' stroke-width='1.6' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
  background-repeat:no-repeat; background-position:right 15px center; padding-right:38px; }
.std-area{ min-height:74px; resize:vertical; }
.std-hp{ position:absolute; left:-9999px; }
.std-error{ color:#C7734F; font-size:14px; margin:2px 0 0; }
.std-btn{ margin-top:4px; background:${NAVY}; color:#F3EBE0; border:0; padding:15px; border-radius:999px;
  font-size:15px; font-weight:600; cursor:pointer; font-family:NeuePlak, sans-serif; letter-spacing:.01em;
  box-shadow:0 8px 20px -8px rgba(17,29,65,.5); transition:background .18s ease, transform .12s ease; }
.std-btn:hover{ background:#0B1430; }
.std-btn:active{ transform:translateY(1px); }
.std-btn:disabled{ opacity:.55; cursor:default; }
.std-note{ color:rgba(45,73,119,.5); font-size:12px; text-align:center; margin:10px 0 0; }

.std-done{ text-align:center; padding:14px 6px 6px; }
.std-done-title{ color:${NAVY}; font-size:22px; font-family:Cotford, Georgia, serif; margin:0 0 8px; }
.std-done-copy{ color:rgba(45,73,119,.68); font-size:14.5px; line-height:1.6; max-width:34ch; margin:0 auto; }

@media (max-width:420px){ .std-row{ flex-direction:column; gap:11px; } }
`
