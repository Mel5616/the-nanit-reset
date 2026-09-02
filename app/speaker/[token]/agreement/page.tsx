'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const NAVY = '#111D41'
const BLUE = '#6681AB'
const CREAM = '#FAF7F3'

type Agreement = {
  name: string
  title: string | null
  organization: string | null
  involved_as: string | null
  agreement_fee: string | null
  agreement_body: string | null
  agreement_status: string
  agreement_speaker_signature: string | null
  agreement_speaker_signed_at: string | null
  agreement_org_signature: string | null
  agreement_org_signed_at: string | null
}

function renderClauses(body: string) {
  return body.split('\n').map((line, i) => {
    const t = line.trim()
    if (t.startsWith('## ')) return <h3 key={i} style={{ fontFamily: 'Cotford, Georgia, serif', fontSize: 15, color: NAVY, margin: '22px 0 10px' }}>{t.slice(3)}</h3>
    if (t.startsWith('- ')) return <li key={i} style={{ fontSize: 13.5, lineHeight: 1.7, color: '#333', marginBottom: 4, marginLeft: 18 }}>{t.slice(2)}</li>
    if (!t) return null
    return <p key={i} style={{ fontSize: 13.5, lineHeight: 1.75, color: '#333', marginBottom: 12 }}>{t}</p>
  })
}

export default function AgreementPage({ params }: { params: Promise<{ token: string }> }) {
  const [token, setToken] = useState<string | null>(null)
  const [a, setA] = useState<Agreement | null>(null)
  const [stage, setStage] = useState<'loading' | 'ready' | 'notfound'>('loading')
  const [signature, setSignature] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)

  useEffect(() => { params.then(p => setToken(p.token)) }, [params])

  useEffect(() => {
    if (!token) return
    fetch(`/api/speaker/${token}/agreement`)
      .then(r => r.ok ? r.json() : null)
      .then((data: Agreement | null) => {
        if (!data || (data as { error?: string }).error) { setStage('notfound'); return }
        setA(data); setStage('ready')
      })
      .catch(() => setStage('notfound'))
  }, [token])

  async function sign(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (!agreed) { setError('Please tick the box to confirm you agree.'); return }
    if (!signature.trim()) { setError('Please type your full name to sign.'); return }
    setBusy(true)
    const res = await fetch(`/api/speaker/${token}/agreement`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ signature }),
    })
    if (res.ok) { setDone(true) }
    else { const d = await res.json().catch(() => ({})); setError(d.error || 'Something went wrong.') }
    setBusy(false)
  }

  if (stage === 'loading') return (
    <div style={{ minHeight: '100vh', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: `2px solid ${BLUE}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
  if (stage === 'notfound' || !a) return (
    <div style={{ minHeight: '100vh', background: NAVY, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>This agreement link isn&apos;t valid.</p>
    </div>
  )

  const displayName = a.title ? `${a.title} ${a.name}` : a.name
  const executed = a.agreement_status === 'fully_executed'
  const signed = a.agreement_status === 'signed_by_speaker' || executed || done

  return (
    <div style={{ minHeight: '100vh', background: CREAM, padding: '0 0 60px' }}>
      <style>{`@media print{.no-print{display:none!important}}`}</style>
      <div style={{ maxWidth: 720, margin: '0 auto', background: '#fff', boxShadow: '0 4px 40px rgba(17,29,65,0.08)' }}>
        <div style={{ height: 4, background: BLUE }} />
        <div style={{ padding: '30px 40px 20px', borderBottom: '1px solid #ececec' }}>
          <div style={{ fontSize: 9, letterSpacing: 2, color: '#aaa', textTransform: 'uppercase', fontFamily: 'NeuePlak, sans-serif' }}>The Nanit Reset · Speaker Talent Agreement</div>
          <div style={{ fontSize: 22, fontWeight: 300, color: NAVY, fontFamily: 'Cotford, Georgia, serif', marginTop: 6 }}>Speaker Agreement</div>
        </div>

        <div style={{ padding: '28px 40px' }}>
          {/* Section 1 — parties */}
          <h3 style={{ fontFamily: 'Cotford, Georgia, serif', fontSize: 15, color: NAVY, margin: '0 0 10px' }}>1 · Parties &amp; event</h3>
          <p style={{ fontSize: 13.5, lineHeight: 1.75, color: '#333', marginBottom: 12 }}>
            This Agreement is made between <strong>Coolkidz Australia</strong> (the &quot;Organiser&quot;) and
            {' '}<strong>{displayName}</strong>{a.organization ? `, ${a.organization}` : ''} (the &quot;Speaker&quot;)
            in relation to <strong>The Nanit Reset</strong>, taking place on <strong>Saturday, 15 November 2026</strong> in Sydney, NSW.
          </p>

          {a.agreement_body && renderClauses(a.agreement_body)}

          {/* Signatures */}
          <div style={{ marginTop: 32, borderTop: '1px solid #ececec', paddingTop: 24 }}>
            <h3 style={{ fontFamily: 'Cotford, Georgia, serif', fontSize: 15, color: NAVY, margin: '0 0 16px' }}>9 · Signatures</h3>

            {signed ? (
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: BLUE, marginBottom: 6 }}>Speaker</div>
                  <div style={{ fontFamily: 'Cotford, Georgia, serif', fontSize: 20, color: NAVY }}>{a.agreement_speaker_signature || signature}</div>
                  <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Signed {new Date(a.agreement_speaker_signed_at || Date.now()).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                </div>
                <div style={{ flex: 1, minWidth: 220 }}>
                  <div style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: BLUE, marginBottom: 6 }}>Organiser</div>
                  {executed ? (
                    <>
                      <div style={{ fontFamily: 'Cotford, Georgia, serif', fontSize: 20, color: NAVY }}>{a.agreement_org_signature}</div>
                      <div style={{ fontSize: 11, color: '#999', marginTop: 4 }}>Countersigned {new Date(a.agreement_org_signed_at || Date.now()).toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}</div>
                    </>
                  ) : (
                    <div style={{ fontSize: 13, color: '#999', fontStyle: 'italic' }}>Awaiting countersignature</div>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={sign} className="no-print">
                <label style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 16, cursor: 'pointer' }}>
                  <input type="checkbox" checked={agreed} onChange={e => setAgreed(e.target.checked)} style={{ marginTop: 3 }} />
                  <span style={{ fontSize: 13, color: '#444', lineHeight: 1.5 }}>
                    I have read and agree to the terms of this Speaker Talent Agreement.
                  </span>
                </label>
                <div style={{ fontSize: 10, letterSpacing: 1, textTransform: 'uppercase', color: BLUE, marginBottom: 6 }}>Type your full name to sign</div>
                <input
                  value={signature} onChange={e => setSignature(e.target.value)}
                  placeholder="Full name"
                  style={{ width: '100%', maxWidth: 360, padding: '12px 16px', borderRadius: 12, border: '1px solid #ddd', fontFamily: 'Cotford, Georgia, serif', fontSize: 18, color: NAVY, outline: 'none' }}
                />
                {error && <p style={{ color: '#DC2626', fontSize: 13, marginTop: 10 }}>{error}</p>}
                <div>
                  <button type="submit" disabled={busy}
                    style={{ marginTop: 18, background: NAVY, color: '#fff', border: 'none', padding: '13px 30px', borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: 'pointer', opacity: busy ? 0.5 : 1 }}>
                    {busy ? 'Signing…' : 'Sign agreement'}
                  </button>
                </div>
              </form>
            )}

            {done && !executed && (
              <p style={{ marginTop: 18, fontSize: 13, color: '#2F6B42' }}>
                Thank you — your agreement is signed. We&apos;ll countersign and send you the executed copy.
              </p>
            )}
          </div>
        </div>
      </div>

      <div style={{ textAlign: 'center', marginTop: 20 }} className="no-print">
        <Link href={`/speaker/${token}`} style={{ color: BLUE, fontSize: 13 }}>← Back to your invitation</Link>
      </div>
    </div>
  )
}
