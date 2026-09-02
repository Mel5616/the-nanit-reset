'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'

const NAVY = '#111D41'
const BLUE = '#6681AB'
const CREAM = '#FAF7F3'

type Speaker = {
  name: string
  title: string | null
  organization: string | null
  specialty: string | null
  personalized_why: string | null
  why_involved: string | null
  proposed_topic: string | null
  involvement_note: string | null
  custom_provisions: string | null
  involved_as: string | null
  instagram_handle: string | null
  status: string
  agreement_status: string
}

const md = (t: string) => t.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>')

export default function SpeakerPortal({ params }: { params: Promise<{ token: string }> }) {
  const [token, setToken] = useState<string | null>(null)
  const [sp, setSp] = useState<Speaker | null>(null)
  const [stage, setStage] = useState<'loading' | 'open' | 'notfound'>('loading')
  const [rsvp, setRsvp] = useState<'accept' | 'decline' | null>(null)

  useEffect(() => { params.then(p => setToken(p.token)) }, [params])

  useEffect(() => {
    if (!token) return
    const urlRsvp = new URLSearchParams(window.location.search).get('rsvp') as 'accept' | 'decline' | null
    if (urlRsvp) setRsvp(urlRsvp)
    fetch(`/api/speaker/${token}`)
      .then(r => r.ok ? r.json() : null)
      .then((data: Speaker | null) => {
        if (!data || (data as { error?: string }).error) { setStage('notfound'); return }
        setSp(data)
        if (data.status === 'confirmed') setRsvp('accept')
        else if (data.status === 'declined') setRsvp('decline')
        setStage('open')
      })
      .catch(() => setStage('notfound'))
  }, [token])

  if (stage === 'loading') return (
    <div style={{ minHeight: '100vh', background: CREAM, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ width: 32, height: 32, border: `2px solid ${BLUE}`, borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )

  if (stage === 'notfound' || !sp) return (
    <div style={{ minHeight: '100vh', background: NAVY, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' }}>The Nanit Reset</p>
      <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15 }}>This link isn&apos;t valid.</p>
    </div>
  )

  const displayName = sp.title && /^(dr|prof|professor|mr|mrs|ms|mx)\.?$/i.test(sp.title.trim())
    ? `${sp.title} ${sp.name}` : sp.name
  const isHost = /host/i.test(sp.involved_as || '')
  const inviteVerb = isHost ? 'host' : 'speak'
  const handle = sp.instagram_handle ? (sp.instagram_handle.startsWith('@') ? sp.instagram_handle : `@${sp.instagram_handle}`) : null

  const DEFAULT_INVOLVEMENT = [
    'Delivering a 15–20 minute expert-led session on your area of expertise',
    'Participating in an expert panel and audience Q&A session',
    'Engaging with attendees during the networking portion of the event',
  ]
  const topic = sp.proposed_topic?.trim()
  const items = !topic ? DEFAULT_INVOLVEMENT
    : /[\n•]/.test(topic) ? [topic]
    : [topic, DEFAULT_INVOLVEMENT[1], DEFAULT_INVOLVEMENT[2]]

  const provides = sp.custom_provisions
    ? sp.custom_provisions.split('\n').filter(l => l.trim()).map(l => l.trim())
    : [
      `Exposure of ${displayName}${sp.organization ? ` — ${sp.organization}` : ''} across event advertising`,
      handle ? `Social media engagement with ${handle}` : 'Social media engagement and tagging',
      'Nanit / Coolkidz database exposure',
      'Full event support and briefing ahead of the day',
      'A Nanit product kit ahead of the event',
      'Professional photography and content assets from the event',
      'Opportunity for ongoing collaboration beyond the event',
    ]

  const chips = ['Expecting Parents', 'New Parents', 'Healthcare Professionals', 'Influencers & Creators', 'Media', 'Retail Partners']

  const lbl: React.CSSProperties = { fontSize: 10, fontWeight: 'bold', letterSpacing: 2, textTransform: 'uppercase', color: BLUE, marginBottom: 10, display: 'block', fontFamily: 'NeuePlak, sans-serif' }
  const para: React.CSSProperties = { fontSize: 14, lineHeight: 1.75, marginBottom: 14, color: '#333', fontFamily: 'BentonSans, Helvetica, sans-serif' }
  const rule = <hr style={{ border: 'none', borderTop: '1px solid #ececec', margin: '26px 0' }} />

  return (
    <div style={{ minHeight: '100vh', background: CREAM, padding: '0 0 60px' }}>
      <style>{`@media print{.no-print{display:none!important}body{background:#fff!important}@page{margin:15mm}} @keyframes su{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}`}</style>

      <div style={{ maxWidth: 760, margin: '0 auto', background: '#fff', boxShadow: '0 4px 40px rgba(17,29,65,0.08)', animation: 'su 0.6s ease' }}>
        <div style={{ height: 4, background: BLUE }} />
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '30px 40px 24px', borderBottom: '1px solid #ececec', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 22, fontWeight: 300, color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}>The Nanit Reset</div>
            <div style={{ fontSize: 9, letterSpacing: 2, color: '#aaa', textTransform: 'uppercase', marginTop: 4, fontFamily: 'NeuePlak, sans-serif' }}>Nanit in partnership with Coolkidz Australia</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 12, color: '#666' }}>Saturday, 15 November 2026</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>10:00am – 1:00pm</div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 2 }}>Sydney, NSW</div>
          </div>
        </div>

        <div style={{ padding: '36px 40px 0' }}>
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontWeight: 600, fontSize: 14, color: NAVY }}>{displayName}</div>
            {sp.organization && <div style={{ fontSize: 12, color: '#888' }}>{sp.organization}</div>}
          </div>
          {rule}

          <span style={lbl}>Invitation to {inviteVerb}</span>
          <div style={{ fontFamily: 'Cotford, Georgia, serif', fontSize: 17, color: NAVY, marginBottom: 20, lineHeight: 1.5 }}>
            An intimate, education-led event on infant sleep, early parenthood and wellbeing.
          </div>
          <p style={para}>Dear {displayName},</p>
          <p style={para}>
            We would love to invite you to be involved as {sp.involved_as || 'a featured speaker'} at
            {' '}<strong>The Nanit Reset</strong>, taking place on <strong>Saturday 15 November 2026</strong>,
            10:00am – 1:00pm, in Sydney.
          </p>
          {sp.personalized_why?.split('\n\n').filter(Boolean).map((p, i) => (
            <p key={i} style={para} dangerouslySetInnerHTML={{ __html: md(p.trim()) }} />
          ))}

          {rule}
          <span style={lbl}>— About the event</span>
          <p style={para}>
            The Nanit Reset is a considered, education-led gathering designed to create honest conversations
            about infant sleep, the early months of parenthood, and looking after yourself along the way.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, margin: '16px 0' }}>
            {chips.map(c => <span key={c} style={{ border: '1px solid #e5ded6', borderRadius: 20, padding: '5px 14px', fontSize: 11, color: '#666', background: '#FAF7F3' }}>{c}</span>)}
          </div>

          {rule}
          <span style={lbl}>— Why we&apos;d love you involved</span>
          {sp.why_involved
            ? sp.why_involved.split('\n\n').filter(Boolean).map((p, i) => <p key={i} style={para} dangerouslySetInnerHTML={{ __html: md(p.trim()) }} />)
            : <p style={para}>Your voice and expertise would bring real depth to the conversation, and resonate with the parents and professionals in the room.</p>
          }

          {rule}
          <span style={lbl}>— Proposed involvement</span>
          {items.flatMap(it => it.split(/[\n•]/).map(s => s.trim()).filter(Boolean)).map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10, alignItems: 'flex-start' }}>
              <span style={{ color: BLUE, fontSize: 16, flexShrink: 0 }}>•</span>
              <p style={{ ...para, margin: 0 }} dangerouslySetInnerHTML={{ __html: md(item) }} />
            </div>
          ))}
          {sp.involvement_note && <p style={{ ...para, marginTop: 14 }} dangerouslySetInnerHTML={{ __html: md(sp.involvement_note) }} />}

          {rule}
          <span style={lbl}>— What we&apos;d provide</span>
          <div style={{ margin: '14px 0' }}>
            {provides.map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', marginBottom: 10 }}>
                <span style={{ color: BLUE, fontSize: 14, flexShrink: 0 }}>✓</span>
                <span style={{ fontSize: 13, color: '#444', lineHeight: 1.5, fontFamily: 'BentonSans, sans-serif' }}>{item}</span>
              </div>
            ))}
          </div>

          <p style={{ ...para, marginTop: 20 }}>We would be honoured to have you involved, and we can&apos;t wait to share more.</p>
          <p style={para}>Warm regards,</p>
          <p style={{ fontFamily: 'Cotford, Georgia, serif', fontSize: 18, color: NAVY, margin: '0 0 2px' }}>Melanie Kingsford</p>
          <p style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Coolkidz Australia</p>
        </div>

        <div style={{ marginTop: 28, padding: '20px 40px', borderTop: '1px solid #ececec' }}>
          <span style={{ fontSize: 11, color: '#aaa' }}>hello@coolkidz.com.au · coolkidz.com.au</span>
        </div>
      </div>

      {/* RSVP */}
      {rsvp === 'accept' ? (
        <div style={{ maxWidth: 760, margin: '16px auto 0', background: '#EAF3EC', border: '1px solid #A9DFBF', borderRadius: 16, padding: '22px 32px', textAlign: 'center' }} className="no-print">
          <div style={{ fontSize: 26, marginBottom: 6 }}>✓</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: '#2F6B42', marginBottom: 4 }}>You&apos;re confirmed.</div>
          <div style={{ fontSize: 13, color: '#555', marginBottom: 16 }}>We&apos;ll be in touch with full briefing details ahead of 15 November.</div>
          <Link href={`/speaker/${token}/agreement`} style={{ display: 'inline-block', background: NAVY, color: '#fff', textDecoration: 'none', padding: '12px 26px', borderRadius: 999, fontSize: 14, fontWeight: 600 }}>
            {sp.agreement_status === 'fully_executed' ? 'View your agreement' : 'Review & sign your agreement'}
          </Link>
        </div>
      ) : rsvp === 'decline' ? (
        <div style={{ maxWidth: 760, margin: '16px auto 0', background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: 16, padding: '20px 32px', textAlign: 'center' }} className="no-print">
          <div style={{ fontSize: 13, color: '#666' }}>Thank you for letting us know. We hope to work together another time.</div>
        </div>
      ) : (
        <div style={{ maxWidth: 760, margin: '16px auto 0', background: '#fff', border: '1px solid #e8e0f0', borderRadius: 16, padding: '24px 32px', textAlign: 'center' }} className="no-print">
          <p style={{ fontSize: 11, letterSpacing: 2, color: BLUE, textTransform: 'uppercase', fontWeight: 'bold', marginBottom: 16, fontFamily: 'NeuePlak, sans-serif' }}>Are you available?</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={`/api/speaker/${token}/rsvp?action=accept`} style={{ background: BLUE, color: '#fff', textDecoration: 'none', padding: '14px 32px', borderRadius: 999, fontSize: 14, fontWeight: 600 }}>Yes, I&apos;m available</a>
            <a href={`/api/speaker/${token}/rsvp?action=decline`} style={{ background: '#fff', color: '#888', textDecoration: 'none', padding: '14px 32px', borderRadius: 999, fontSize: 14, border: '1px solid #e0e0e0' }}>I&apos;ll need to pass</a>
          </div>
        </div>
      )}

      <button className="no-print" onClick={() => window.print()} style={{ position: 'fixed', bottom: 24, right: 24, background: NAVY, color: '#fff', border: 'none', padding: '12px 24px', borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: 'pointer', boxShadow: '0 4px 16px rgba(17,29,65,0.3)' }}>
        Print / Save PDF
      </button>
    </div>
  )
}
