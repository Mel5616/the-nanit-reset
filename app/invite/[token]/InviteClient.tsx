'use client'

import { useState, useEffect, useCallback } from 'react'
import { Guest } from '@/lib/supabase'

const ENV_NAVY = '#2D4977'   // envelope
const NAVY = '#111D41'       // deep text
const BLUE = '#6681AB'
const SOFT = '#BDD4E7'
const CREAM = '#F3EBE0'
const PAPER = '#FBF8F3'

// Rounded-square Nanit motif, tiled — used as the envelope texture.
const dotPattern =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(
    `<svg xmlns='http://www.w3.org/2000/svg' width='54' height='54' viewBox='0 0 54 54'>
      <rect x='9' y='9' width='36' height='36' rx='14' fill='none' stroke='%23ffffff' stroke-width='2' opacity='0.10'/>
     </svg>`
  )

export default function InviteClient({ guest }: { guest: Guest }) {
  const guestName = `${guest.first_name} ${guest.last_name}`.trim()
  const firstName = guest.first_name

  const [opened, setOpened] = useState(false)
  const [reply, setReply] = useState<'idle' | 'confirmed' | 'declined'>(
    guest.status === 'confirmed' ? 'confirmed' : guest.status === 'declined' ? 'declined' : 'idle'
  )
  const [loading, setLoading] = useState<'confirm' | 'decline' | null>(null)
  const [error, setError] = useState(false)

  // Auto-play the reveal on load.
  useEffect(() => {
    const t = setTimeout(() => setOpened(true), 2400)
    return () => clearTimeout(t)
  }, [])

  const replay = useCallback(() => {
    setOpened(false)
    const t = setTimeout(() => setOpened(true), 2400)
    return () => clearTimeout(t)
  }, [])

  async function respond(action: 'confirm' | 'decline') {
    setLoading(action); setError(false)
    try {
      const res = await fetch('/api/confirm-rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: guest.invite_token, guestId: guest.id, action }),
      })
      if (!res.ok) throw new Error()
      setReply(action === 'confirm' ? 'confirmed' : 'declined')
    } catch {
      setError(true)
    }
    setLoading(null)
  }

  const label: React.CSSProperties = { fontFamily: 'NeuePlak, BentonSans, sans-serif', letterSpacing: '0.22em', textTransform: 'uppercase' }
  const serif: React.CSSProperties = { fontFamily: 'Cotford, Georgia, serif' }
  const body: React.CSSProperties = { fontFamily: 'BentonSans, Helvetica, sans-serif' }

  return (
    <main style={{ minHeight: '100vh', background: CREAM, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 18px', overflowX: 'hidden' }}>
      <style>{`
        @keyframes flapOpen { 0%{transform:rotateX(0)} 100%{transform:rotateX(-180deg)} }
        @keyframes cardRise { 0%{transform:translateY(38%);opacity:.4} 55%{transform:translateY(-64%);opacity:1} 100%{transform:translateY(-64%);opacity:1} }
        @keyframes fadeUp { from{opacity:0;transform:translateY(26px)} to{opacity:1;transform:translateY(0)} }
        @keyframes softIn { from{opacity:0} to{opacity:1} }
        .reveal-flap.play { animation: flapOpen 0.9s ease .5s forwards; transform-origin: top center; }
        .reveal-card.play { animation: cardRise 1.5s cubic-bezier(.2,.7,.2,1) .6s forwards; }
      `}</style>

      {/* ---------- REVEAL ---------- */}
      {!opened && (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', animation: 'softIn .5s ease' }}>
          <img src="/nanit-logo-light.png" alt="Nanit" style={{ height: 22, opacity: 0, position: 'absolute' }} />
          <div style={{ position: 'relative', width: 'min(520px, 92vw)', height: 'min(340px, 62vw)', perspective: 1200 }}>
            {/* card tucked inside */}
            <div className="reveal-card play" style={{ position: 'absolute', left: '6%', right: '6%', top: 0, height: '150%', background: PAPER, borderRadius: 10, boxShadow: '0 14px 40px rgba(17,29,65,0.18)', zIndex: 1 }} />
            {/* envelope body */}
            <div style={{ position: 'absolute', inset: 0, top: '38%', background: ENV_NAVY, borderRadius: '4px 4px 10px 10px', zIndex: 2, overflow: 'hidden', boxShadow: '0 18px 50px rgba(17,29,65,0.28)' }}>
              <div style={{ position: 'absolute', inset: 0, backgroundImage: `url("${dotPattern}")`, backgroundSize: '54px 54px' }} />
              <div style={{ position: 'absolute', left: 0, right: 0, bottom: '18%', textAlign: 'center' }}>
                <p style={{ ...serif, fontStyle: 'italic', color: '#EDE4D6', fontSize: 'clamp(20px,5vw,28px)', margin: 0 }}>{guestName}</p>
                <div style={{ width: 34, height: 1, background: 'rgba(237,228,214,0.5)', margin: '12px auto' }} />
                <p style={{ ...label, color: 'rgba(237,228,214,0.7)', fontSize: 10 }}>Private view</p>
              </div>
            </div>
            {/* top flap */}
            <div className="reveal-flap play" style={{ position: 'absolute', left: 0, right: 0, top: '38%', height: 0, zIndex: 3 }}>
              <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 130, clipPath: 'polygon(0 0, 100% 0, 50% 100%)', background: '#26406B', backfaceVisibility: 'hidden' }} />
            </div>
          </div>
          <p style={{ ...label, color: BLUE, fontSize: 10, marginTop: 30 }}>Opening your invitation…</p>
        </div>
      )}

      {/* ---------- LETTER ---------- */}
      {opened && (
        <div style={{ width: 'min(640px, 100%)', animation: 'fadeUp .7s ease' }}>
          <article style={{ background: PAPER, borderRadius: 18, boxShadow: '0 10px 50px rgba(17,29,65,0.10)', overflow: 'hidden' }}>
            <div style={{ height: 4, background: BLUE }} />
            <div style={{ padding: 'clamp(30px,6vw,52px)' }}>
              <div style={{ textAlign: 'center', marginBottom: 30 }}>
                <img src="/nanit-logo-dark.png" alt="Nanit" style={{ height: 24, opacity: 0.9 }} />
                <p style={{ ...label, color: BLUE, fontSize: 10, marginTop: 18 }}>By invitation only</p>
              </div>

              <p style={{ ...serif, fontStyle: 'italic', color: NAVY, fontSize: 'clamp(26px,6vw,34px)', textAlign: 'center', margin: '0 0 28px', lineHeight: 1.1 }}>
                {guestName}
              </p>

              <h1 style={{ ...serif, color: NAVY, fontSize: 'clamp(22px,5vw,28px)', fontWeight: 400, textAlign: 'center', lineHeight: 1.35, margin: '0 0 10px' }}>
                A morning to pause, listen and reset.
              </h1>
              <p style={{ ...label, color: BLUE, fontSize: 11, textAlign: 'center', margin: '0 0 6px' }}>The Nanit Reset</p>
              <p style={{ ...body, color: '#55606F', fontSize: 15, textAlign: 'center', margin: '0 0 30px' }}>
                in conversation with Dr Natalie Barnett PhD
                <br /><span style={{ color: '#8894A4', fontSize: 13 }}>Vice President of Clinical Research, Nanit</span>
              </p>

              <div style={{ width: 40, height: 1, background: '#E3D9CC', margin: '0 auto 30px' }} />

              <p style={{ ...body, color: '#3F4A5A', fontSize: 15.5, lineHeight: 1.75, margin: '0 0 18px' }}>
                Dr Barnett leads clinical research at Nanit in New York, where her team has analysed hundreds of thousands of nights of infant sleep. She joins us in Sydney for one morning only.
              </p>
              <p style={{ ...body, color: '#3F4A5A', fontSize: 15.5, lineHeight: 1.75, margin: '0 0 18px' }}>
                The morning opens with conversation: what Nanit&apos;s sleep data reveals, and the questions you are asked most often. You will then have time with the Nanit range and see what it can tell you about your own baby&apos;s sleep. A guided breathwork class, cuddle time with the puppies, and a beautiful lunch.
              </p>

              {/* Details */}
              <div style={{ background: '#fff', border: '1px solid #EEE6DA', borderRadius: 14, padding: '24px 26px', margin: '28px 0' }}>
                {[
                  ['When', 'Monday 16 November'],
                  ['Time', '11am to 2pm, doors open at 10:30am'],
                  ['Where', 'The Atrium, The Grounds of Alexandria'],
                  ['Address', '7a / 2 Huntley Street, Alexandria NSW 2015'],
                ].map(([k, v], i) => (
                  <div key={k} style={{ display: 'flex', gap: 16, padding: '9px 0', borderTop: i ? '1px solid #F1EADF' : 'none' }}>
                    <span style={{ ...label, color: BLUE, fontSize: 9.5, width: 74, flexShrink: 0, paddingTop: 3 }}>{k}</span>
                    <span style={{ ...body, color: NAVY, fontSize: 15 }}>{v}</span>
                  </div>
                ))}
              </div>

              <p style={{ ...body, color: '#55606F', fontSize: 14.5, textAlign: 'center', lineHeight: 1.7, margin: '0 0 6px' }}>
                This is a morning just for you. We kindly ask that children do not attend.
              </p>
              <p style={{ ...label, color: BLUE, fontSize: 10, textAlign: 'center', margin: '18px 0 0' }}>RSVP by Wednesday 4 November</p>

              {/* RSVP */}
              <div style={{ marginTop: 34, paddingTop: 30, borderTop: '1px solid #EEE6DA', textAlign: 'center' }}>
                {reply === 'idle' && (
                  <>
                    <p style={{ ...serif, color: NAVY, fontSize: 21, margin: '0 0 20px' }}>Will you join us, {firstName}?</p>
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button onClick={() => respond('confirm')} disabled={!!loading}
                        style={{ ...body, background: NAVY, color: '#fff', border: 'none', padding: '14px 28px', borderRadius: 999, fontSize: 14.5, fontWeight: 600, cursor: 'pointer', opacity: loading === 'confirm' ? 0.6 : 1 }}>
                        {loading === 'confirm' ? 'Just a moment…' : "Delighted, I'll be there"}
                      </button>
                      <button onClick={() => respond('decline')} disabled={!!loading}
                        style={{ ...body, background: 'transparent', color: '#8894A4', border: '1px solid #DDD3C6', padding: '14px 28px', borderRadius: 999, fontSize: 14.5, cursor: 'pointer' }}>
                        Sadly can&apos;t make it
                      </button>
                    </div>
                    {error && <p style={{ color: '#C0392B', fontSize: 13, marginTop: 14 }}>Something went wrong. Please try again.</p>}
                  </>
                )}

                {reply === 'confirmed' && (
                  <>
                    <div style={{ width: 46, height: 46, borderRadius: '50%', background: 'rgba(102,129,171,0.14)', border: `1px solid ${BLUE}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: NAVY, fontSize: 20 }}>✓</div>
                    <p style={{ ...serif, color: NAVY, fontSize: 22, margin: '0 0 8px' }}>You&apos;re on the list, {firstName}.</p>
                    <p style={{ ...body, color: '#55606F', fontSize: 14.5, lineHeight: 1.7, maxWidth: 380, margin: '0 auto' }}>
                      A confirmation is on its way, with the running order and parking details closer to the day.
                    </p>
                    <button onClick={() => setReply('idle')} style={{ ...label, background: 'none', border: 'none', color: BLUE, fontSize: 10, cursor: 'pointer', marginTop: 18 }}>Change my reply</button>
                  </>
                )}

                {reply === 'declined' && (
                  <>
                    <p style={{ ...serif, color: NAVY, fontSize: 21, margin: '0 0 8px' }}>Thank you for letting us know.</p>
                    <p style={{ ...body, color: '#55606F', fontSize: 14.5, lineHeight: 1.7 }}>We&apos;ll keep you in mind for the next one.</p>
                    <button onClick={() => setReply('idle')} style={{ ...label, background: 'none', border: 'none', color: BLUE, fontSize: 10, cursor: 'pointer', marginTop: 18 }}>Change my reply</button>
                  </>
                )}
              </div>
            </div>

            <div style={{ textAlign: 'center', padding: '22px 0 26px', borderTop: '1px solid #EEE6DA' }}>
              <img src="/nanit-logo-dark.png" alt="Nanit" style={{ height: 16, opacity: 0.55 }} />
              <p style={{ ...label, color: '#A6AEBC', fontSize: 9, marginTop: 10 }}>nanit.com.au</p>
            </div>
          </article>

          <div style={{ textAlign: 'center', marginTop: 22 }}>
            <button onClick={replay} style={{ ...label, background: 'none', border: 'none', color: BLUE, fontSize: 10, cursor: 'pointer' }}>↺ Play the reveal again</button>
          </div>
        </div>
      )}
    </main>
  )
}
