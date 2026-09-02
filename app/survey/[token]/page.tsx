'use client'

import { useState, useEffect } from 'react'

const NAVY = '#111D41'
const BLUE = '#6681AB'
const CREAM = '#FAF7F3'

type Resolved = {
  found: boolean
  guest_id: string | null
  first_name: string
  email: string
  attended: boolean
  already_submitted?: boolean
  saved: null | { overall_rating: number | null; recommend: number | null; highlight: string | null; improve: string | null; topics_next: string | null; consent: boolean }
}

export default function SurveyPage({ params }: { params: Promise<{ token: string }> }) {
  const [token, setToken] = useState<string | null>(null)
  const [info, setInfo] = useState<Resolved | null>(null)
  const [stage, setStage] = useState<'loading' | 'ready' | 'notfound' | 'done'>('loading')
  const [email, setEmail] = useState('')
  const [rating, setRating] = useState(0)
  const [recommend, setRecommend] = useState<number | null>(null)
  const [highlight, setHighlight] = useState('')
  const [improve, setImprove] = useState('')
  const [topics, setTopics] = useState('')
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => { params.then(p => setToken(p.token)) }, [params])

  useEffect(() => {
    if (!token) return
    fetch(`/api/survey?token=${encodeURIComponent(token)}`)
      .then(r => r.json())
      .then((d: Resolved) => {
        if (!d.found) { setStage('notfound'); return }
        setInfo(d); setEmail(d.email || '')
        if (d.already_submitted) { setStage('done'); return }
        if (d.saved) {
          setRating(d.saved.overall_rating || 0)
          setRecommend(d.saved.recommend)
          setHighlight(d.saved.highlight || ''); setImprove(d.saved.improve || ''); setTopics(d.saved.topics_next || '')
          setConsent(d.saved.consent)
        }
        setStage('ready')
      })
      .catch(() => setStage('notfound'))
  }, [token])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!rating) { setError('Please give an overall rating.'); return }
    setBusy(true)
    const res = await fetch('/api/survey', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'submit', token, guest_id: info?.guest_id, first_name: info?.first_name,
        email, attended: info?.attended, overall_rating: rating, recommend,
        highlight, improve, topics_next: topics, consent,
      }),
    })
    if (res.ok) setStage('done')
    else { const d = await res.json().catch(() => ({})); setError(d.error || 'Something went wrong.') }
    setBusy(false)
  }

  if (stage === 'loading') return (
    <div style={{ minHeight: '100vh', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: `2px solid ${BLUE}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
  if (stage === 'notfound') return (
    <div style={{ minHeight: '100vh', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>This survey link isn&apos;t valid.</p>
    </div>
  )
  if (stage === 'done') return (
    <div style={{ minHeight: '100vh', background: NAVY, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 24, textAlign: 'center' }}>
      <div style={{ fontSize: 32, marginBottom: 10 }}>💙</div>
      <h1 style={{ color: '#fff', fontSize: 28, fontWeight: 300, fontFamily: 'Cotford, Georgia, serif' }}>Thank you.</h1>
      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginTop: 8, maxWidth: 360 }}>Your feedback means a lot and helps us make the next one even better.</p>
    </div>
  )

  const box: React.CSSProperties = { width: '100%', padding: '12px 14px', borderRadius: 12, border: '1px solid #e2ded8', fontSize: 15, outline: 'none', fontFamily: 'inherit', background: '#fff' }
  const label: React.CSSProperties = { display: 'block', fontSize: 14, fontWeight: 600, color: NAVY, marginBottom: 8 }

  return (
    <main style={{ minHeight: '100vh', background: CREAM, padding: '40px 20px' }}>
      <div style={{ maxWidth: 520, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <p style={{ color: BLUE, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase', marginBottom: 10 }}>The Nanit Reset</p>
          <h1 style={{ color: NAVY, fontSize: 30, fontWeight: 300, fontFamily: 'Cotford, Georgia, serif' }}>
            {info?.first_name ? `Thanks, ${info.first_name}` : 'Your feedback'}
          </h1>
          <p style={{ color: '#888', fontSize: 15, marginTop: 8 }}>Under two minutes — every answer helps.</p>
        </div>

        <form onSubmit={submit} style={{ background: '#fff', borderRadius: 20, padding: '28px 24px', boxShadow: '0 2px 20px rgba(17,29,65,0.06)', display: 'grid', gap: 22 }}>
          <div>
            <span style={label}>Overall, how was the event?</span>
            <div style={{ display: 'flex', gap: 8 }}>
              {[1, 2, 3, 4, 5].map(n => (
                <button type="button" key={n} onClick={() => setRating(n)}
                  style={{ fontSize: 30, background: 'none', border: 'none', cursor: 'pointer', color: n <= rating ? '#EDB39A' : '#E2DED8', lineHeight: 1 }}>★</button>
              ))}
            </div>
          </div>

          <div>
            <span style={label}>How likely are you to recommend it to a friend? (0–10)</span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {Array.from({ length: 11 }, (_, n) => (
                <button type="button" key={n} onClick={() => setRecommend(n)}
                  style={{ width: 34, height: 34, borderRadius: 8, cursor: 'pointer', fontSize: 13, border: '1px solid ' + (recommend === n ? NAVY : '#e2ded8'), background: recommend === n ? NAVY : '#fff', color: recommend === n ? '#fff' : '#666' }}>{n}</button>
              ))}
            </div>
          </div>

          <div>
            <span style={label}>What did you love most?</span>
            <textarea style={box} rows={3} value={highlight} onChange={e => setHighlight(e.target.value)} />
          </div>
          <div>
            <span style={label}>Anything we could do better?</span>
            <textarea style={box} rows={3} value={improve} onChange={e => setImprove(e.target.value)} />
          </div>
          <div>
            <span style={label}>Topics you&apos;d love next time?</span>
            <textarea style={box} rows={2} value={topics} onChange={e => setTopics(e.target.value)} />
          </div>
          <div>
            <span style={label}>Your email</span>
            <input type="email" style={box} value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 13, color: '#666', lineHeight: 1.5 }}>
            <input type="checkbox" checked={consent} onChange={e => setConsent(e.target.checked)} style={{ marginTop: 3 }} />
            <span>You can contact me about my feedback and future events.</span>
          </label>

          {error && <p style={{ color: '#DC2626', fontSize: 14 }}>{error}</p>}
          <button type="submit" disabled={busy} style={{ background: NAVY, color: '#fff', border: 'none', padding: '14px', borderRadius: 999, fontSize: 15, fontWeight: 600, cursor: 'pointer', opacity: busy ? 0.5 : 1 }}>
            {busy ? 'Sending…' : 'Submit feedback'}
          </button>
        </form>
      </div>
    </main>
  )
}
