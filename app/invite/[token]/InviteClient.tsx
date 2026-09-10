'use client'

import { useState } from 'react'
import { Guest } from '@/lib/supabase'

// Nanit A5 invitation, with a Paperless-Post-style tap-to-open envelope.
// Cotford / Neue Plak are the licensed Nanit fonts (declared in globals.css).

const SQUIRCLE = (op: string) =>
  `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='62' height='62'%3E%3Cpath transform='translate(4,4)' d='M27 0C47.5 0 54 6.5 54 27C54 47.5 47.5 54 27 54C6.5 54 0 47.5 0 27C0 6.5 6.5 0 27 0Z' fill='%23F3EBE0' fill-opacity='${op}'/%3E%3C/svg%3E")`

const CSS = `
.nrinv{
  --lullaby:#6691A8; --midnight:#2D4977; --bedtime:#111D41; --cream:#F3EBE0;
  --display:"Cotford",Georgia,serif;
  --text:"NeuePlak","Helvetica Neue",Arial,sans-serif;
  --x1:clamp(25px,5.8vw,29px); --x2:clamp(15px,3.3vw,17px);
  --x3:clamp(12.5px,2.4vw,13.5px); --x325:clamp(11px,2.2vw,12.5px);
  --ease:cubic-bezier(.22,.61,.36,1);
  min-height:100vh; margin:0; background:radial-gradient(125% 90% at 50% 8%, #ECE4D8 0%, #E4DCD1 52%, #D9D0C3 100%); color:var(--midnight);
  font-family:var(--text); -webkit-font-smoothing:antialiased;
  display:flex; flex-direction:column; align-items:center; justify-content:center; padding:24px 14px;
}
.nrinv *{ box-sizing:border-box; }

/* ---------------- envelope (tap to open) ---------------- */
.nrinv .scene{ display:flex; flex-direction:column; align-items:center; gap:26px; animation:fadeIn .6s ease; }
.nrinv .env{ position:relative; width:min(430px,86vw); height:calc(min(430px,86vw)*0.66); cursor:pointer; animation:envIn .8s var(--ease) both; }
@keyframes envIn{ from{ opacity:0; transform:translateY(20px) scale(.955); } to{ opacity:1; transform:none; } }
.nrinv .env.opening{ cursor:default; animation:envOut .45s ease .55s both; }
@keyframes envOut{ from{ opacity:1; } to{ opacity:0; transform:scale(.985); } }
.nrinv .env-back{ position:absolute; inset:0; background:linear-gradient(180deg,#2C4874,#22385F); border-radius:11px; box-shadow:0 34px 64px -18px rgba(17,29,65,.46), 0 10px 22px rgba(17,29,65,.20); }
.nrinv .env-front{ position:absolute; left:0; right:0; bottom:0; height:55%; background-color:var(--midnight); background-image:${SQUIRCLE('0.06')}; background-size:62px 62px; background-position:center; border-radius:0 0 11px 11px; box-shadow:inset 0 15px 24px -8px rgba(17,29,65,.55); z-index:3; display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; padding-top:22px; transition:opacity .5s ease; }
.nrinv .env-name{ position:relative; z-index:1; font-family:var(--display); font-style:italic; font-weight:300; font-size:clamp(19px,5vw,24px); color:#EFE7DA; padding:0 12px; text-align:center; text-shadow:0 1px 2px rgba(17,29,65,.35); }
.nrinv .env-tag{ position:relative; z-index:1; font-size:9.5px; letter-spacing:.24em; text-transform:uppercase; color:rgba(239,231,218,.62); }
/* Static liner revealed as the flap lifts (no fragile double-sided 3D). */
.nrinv .env-liner{ position:absolute; top:0; left:0; right:0; height:56%; clip-path:polygon(0 0,100% 0,50% 100%); background:linear-gradient(180deg,#CBDDEC,#AECADF); z-index:4; }
.nrinv .env-flap{ position:absolute; top:0; left:0; right:0; height:56%; background:linear-gradient(180deg,#38598F,#2A4880); clip-path:polygon(0 0,100% 0,50% 100%); transform-origin:top center; transform:scaleY(1); z-index:5; box-shadow:0 6px 10px -4px rgba(17,29,65,.35); }
@keyframes flapUp{ from{ transform:scaleY(1); opacity:1; } to{ transform:scaleY(0); opacity:0; } }
.nrinv .env-seal{ position:absolute; top:calc(48% - 22px); left:50%; transform:translateX(-50%); width:44px; height:44px; border-radius:50%; background:radial-gradient(circle at 34% 28%, #86A9BC 0%, #6691A8 55%, #547E96 100%); display:flex; align-items:center; justify-content:center; z-index:6; box-shadow:0 4px 10px rgba(17,29,65,.4), inset 0 1px 2px rgba(255,255,255,.4), inset 0 -2px 4px rgba(17,29,65,.35); transition:opacity .3s ease, transform .5s var(--ease); }
.nrinv .env-seal svg{ width:22px; height:22px; filter:drop-shadow(0 1px 1px rgba(17,29,65,.3)); }
.nrinv .env.opening .env-flap{ animation:flapUp .5s var(--ease) forwards; }
.nrinv .env.opening .env-seal{ animation:sealOut .4s ease forwards; }
@keyframes sealOut{ to{ opacity:0; transform:translateX(-50%) translateY(-7px) scale(.7); } }
.nrinv .openhint{ display:inline-flex; align-items:center; gap:8px; background:var(--midnight); color:var(--cream); font-family:var(--text); font-weight:500; font-size:13px; letter-spacing:.02em; border:0; border-radius:999px; padding:12px 24px; cursor:pointer; box-shadow:0 4px 14px rgba(17,29,65,.22); animation:bob 2.4s ease-in-out infinite; }
.nrinv .openhint:hover{ background:var(--bedtime); }
@keyframes bob{ 0%,100%{ transform:translateY(0);} 50%{ transform:translateY(-3px);} }
@keyframes fadeIn{ from{opacity:0;} to{opacity:1;} }
@keyframes fadeUp{ from{opacity:0; transform:translateY(20px);} to{opacity:1; transform:none;} }

/* ---------------- letter card ---------------- */
.nrinv .sheet{
  position:relative; width:min(460px,100%);
  background:radial-gradient(125% 85% at 50% 0%, #F8F2EA 0%, #F3EBE0 52%, #EFE5D8 100%);
  display:flex; flex-direction:column; overflow:hidden; border-radius:16px;
  box-shadow:0 18px 55px rgba(17,29,65,.20); animation:fadeUp .7s var(--ease);
}
.nrinv .sheet::after{
  content:""; position:absolute; inset:0; z-index:9; pointer-events:none; opacity:.05; mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
}
.nrinv .body-area{ padding:34px 26px 28px; display:flex; flex-direction:column; }
.nrinv .masthead{ display:flex; flex-direction:column; align-items:center; gap:8px; }
.nrinv .mark{ width:24px; height:24px; display:block; }
.nrinv .wordmark{ font-family:var(--display); font-weight:300; font-size:20px; line-height:1; letter-spacing:-.005em; color:var(--lullaby); }
.nrinv .rule{ height:1px; background:var(--midnight); opacity:.22; margin:20px 0 0; }
.nrinv .opening{ padding-top:22px; text-align:center; }
.nrinv .eyebrow{ font-weight:600; font-size:var(--x325); letter-spacing:.11em; color:var(--midnight); opacity:.5; margin:0 0 12px; text-transform:uppercase; }
.nrinv h1{ font-family:var(--display); font-weight:200; font-size:var(--x1); line-height:1.12; letter-spacing:-.018em; text-wrap:balance; margin:0 auto; max-width:17ch; color:var(--bedtime); }
.nrinv h1 em{ font-style:italic; font-weight:200; }
.nrinv .event-name{ font-weight:400; font-size:var(--x2); line-height:1.3; margin:12px 0 0; color:var(--lullaby); }
.nrinv .host{ text-align:center; margin:22px auto 0; width:80%; padding:18px 0 0; border-top:1px solid rgba(45,73,119,.22); }
.nrinv .host-intro{ font-size:var(--x325); letter-spacing:.06em; opacity:.55; margin:0 0 10px; }
.nrinv .host-name{ font-family:var(--display); font-style:italic; font-weight:200; font-size:clamp(20px,4.7vw,24px); line-height:1.05; letter-spacing:-.01em; color:var(--bedtime); margin:0; }
.nrinv .host-role{ font-size:var(--x325); line-height:1.5; opacity:.68; margin:9px 0 0; }
.nrinv .copy{ max-width:48ch; margin:22px auto 26px; text-align:center; }
.nrinv .copy p{ font-size:var(--x3); line-height:1.55; text-wrap:pretty; margin:0; }
.nrinv .details{ padding-top:26px; text-align:center; border-top:1px solid rgba(45,73,119,.22); }
.nrinv .det-date{ font-family:var(--display); font-variant-numeric:oldstyle-nums; font-weight:300; font-size:clamp(18px,4.0vw,20px); line-height:1.15; letter-spacing:-.01em; color:var(--bedtime); margin:0; }
.nrinv .det-line{ font-size:var(--x3); line-height:1.55; margin:10px 0 0; }
.nrinv .det-addr{ font-size:var(--x325); opacity:.7; margin-top:4px; }
.nrinv .rsvp{ margin-top:22px; text-align:center; }
.nrinv .rsvp-main{ font-family:var(--display); font-variant-numeric:oldstyle-nums; font-weight:300; font-size:var(--x2); letter-spacing:-.01em; color:var(--bedtime); margin:0 0 14px; }
.nrinv .btnrow{ display:flex; gap:8px; justify-content:center; flex-wrap:wrap; }
.nrinv .btn{ display:inline-block; background:var(--midnight); color:var(--cream); font-family:var(--text); font-weight:500; font-size:var(--x3); letter-spacing:.015em; text-decoration:none; padding:13px 26px; border:0; border-radius:999px; cursor:pointer; box-shadow:0 3px 12px rgba(17,29,65,.20); transition:background .25s var(--ease), transform .25s var(--ease); white-space:nowrap; }
.nrinv .btn:hover{ background:var(--bedtime); transform:translateY(-1px); }
.nrinv .btn.ghost{ background:transparent; color:var(--midnight); border:1px solid rgba(45,73,119,.35); box-shadow:none; }
.nrinv .btn:disabled{ opacity:.5; cursor:default; }
.nrinv .rsvp-sub{ font-size:var(--x325); line-height:1.45; opacity:.65; margin:10px 0 0; }
.nrinv .rsvp-note{ font-family:var(--display); font-style:italic; font-size:var(--x2); color:var(--bedtime); margin:0 0 6px; }
.nrinv .rform{ max-width:340px; margin:0 auto; display:flex; flex-direction:column; gap:8px; text-align:left; }
.nrinv .rform input{ width:100%; font-family:var(--text); font-size:var(--x3); color:var(--bedtime); background:rgba(255,255,255,.55); border:1px solid rgba(45,73,119,.22); border-radius:10px; padding:10px 13px; outline:none; }
.nrinv .rform input:focus{ border-color:var(--lullaby); background:#fff; }
.nrinv .rform input::placeholder{ color:rgba(45,73,119,.45); }
.nrinv .rform .row{ display:flex; gap:8px; }
.nrinv .rform .row input{ flex:1; min-width:0; }
.nrinv .rform .actions{ display:flex; gap:8px; margin-top:4px; }
.nrinv .rform .actions .btn{ flex:1; text-align:center; }
.nrinv .band{ background:var(--midnight); background-image:${SQUIRCLE('0.05')}; background-size:62px 62px; background-position:center; color:var(--cream); padding:24px 26px; position:relative; flex:0 0 auto; overflow:hidden; }
.nrinv .band-inner{ position:relative; display:flex; align-items:center; justify-content:space-between; gap:20px; }
.nrinv .band-lockup{ display:flex; align-items:center; gap:8px; }
.nrinv .band-lockup .mark{ width:18px; height:18px; }
.nrinv .band-lockup .wordmark{ color:var(--cream); font-size:17px; }
.nrinv .band-note{ font-size:var(--x325); line-height:1.5; text-align:right; opacity:.8; margin:0; }
.nrinv .replay{ margin-top:6px; background:none; border:0; color:var(--midnight); opacity:.55; font-family:var(--text); font-size:11px; letter-spacing:.12em; text-transform:uppercase; cursor:pointer; }
`

function Mark({ cream = false }: { cream?: boolean }) {
  return (
    <svg className="mark" viewBox="0 0 100 100" role="img" aria-label="Nanit" style={{ color: 'var(--lullaby)' }}>
      <path d="M50 0C88 0 100 12 100 50C100 88 88 100 50 100C12 100 0 88 0 50C0 12 12 0 50 0Z" fill={cream ? '#F3EBE0' : 'currentColor'} />
      <path d="M50 30.25C65.01 30.25 69.75 34.99 69.75 50C69.75 65.01 65.01 69.75 50 69.75C34.99 69.75 30.25 65.01 30.25 50C30.25 34.99 34.99 30.25 50 30.25Z" fill="none" stroke={cream ? '#33538A' : 'var(--cream)'} strokeWidth="7.5" />
    </svg>
  )
}

export default function InviteClient({ guest, preview = false }: { guest: Guest; preview?: boolean }) {
  const guestName = `${guest.first_name} ${guest.last_name}`.trim()
  const firstName = guest.first_name

  const [phase, setPhase] = useState<'sealed' | 'opening' | 'open'>('sealed')
  const [reply, setReply] = useState<'idle' | 'form' | 'confirmed' | 'declined'>(
    guest.status === 'confirmed' ? 'confirmed' : guest.status === 'declined' ? 'declined' : 'idle'
  )
  const [loading, setLoading] = useState<'confirm' | 'decline' | null>(null)
  const [error, setError] = useState<string | null>(null)

  const [fName, setFName] = useState(guest.first_name || '')
  const [lName, setLName] = useState(guest.last_name || '')
  const [fEmail, setFEmail] = useState(guest.email || '')
  const [fInsta, setFInsta] = useState(guest.instagram_handle || '')
  const [fPhone, setFPhone] = useState(guest.phone || '')

  function open() {
    if (phase !== 'sealed') return
    setPhase('opening')
    setTimeout(() => setPhase("open"), 950)
  }

  async function respond(action: 'confirm' | 'decline', details?: Record<string, string>) {
    if (preview) { setReply(action === 'confirm' ? 'confirmed' : 'declined'); return }
    setLoading(action); setError(null)
    try {
      const res = await fetch('/api/confirm-rsvp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: guest.invite_token, guestId: guest.id, action, details }),
      })
      if (!res.ok) throw new Error()
      setReply(action === 'confirm' ? 'confirmed' : 'declined')
    } catch { setError('Something went wrong. Please try again.') }
    setLoading(null)
  }

  function submitDetails(e: React.FormEvent) {
    e.preventDefault()
    if (!fName.trim()) { setError('Please enter your name.'); return }
    if (!fEmail.trim() || !fEmail.includes('@')) { setError('Please enter a valid email.'); return }
    respond('confirm', {
      first_name: fName.trim(), last_name: lName.trim(),
      email: fEmail.trim(), instagram_handle: fInsta.trim(), phone: fPhone.trim(),
    })
  }

  return (
    <div className="nrinv">
      <style>{CSS}</style>

      {phase !== 'open' ? (
        <div className="scene">
          <div className={`env ${phase === 'opening' ? 'opening' : ''}`} onClick={open} role="button" aria-label="Open your invitation">
            <div className="env-back" />
            <div className="env-front">
              <div className="env-name">{guestName || 'Your invitation'}</div>
              <div className="env-tag">The Nanit Reset · 16 Nov</div>
            </div>
            <div className="env-liner" />
            <div className="env-flap" />
            <div className="env-seal"><Mark cream /></div>
          </div>
          {phase === 'sealed' && <button className="openhint" onClick={open}>Tap to open your invitation</button>}
        </div>
      ) : (
        <>
          <article className="sheet">
            <div className="body-area">
              <header className="masthead"><Mark /><div className="wordmark">nanit</div></header>
              <div className="rule" />
              <section className="opening">
                <p className="eyebrow">By invitation only</p>
                <h1>A morning to stop, breathe and <em>reset</em>.</h1>
                <p className="event-name">The Nanit Reset Event</p>
              </section>
              <section className="host">
                <p className="host-intro">in conversation with</p>
                <p className="host-name">Dr Natalie Barnett</p>
                <p className="host-role">PhD, Vice President of Clinical Research at Nanit</p>
              </section>
              <section className="copy">
                <p>A morning for you. Meet the Nanit range and see what it can tell you about your baby&apos;s sleep, settle into a guided breathwork session, and stay for lunch with other parents. And there are puppies to cuddle, because a morning with puppies is the ultimate reset.</p>
              </section>
              <section className="details">
                <p className="det-date">Monday 16 November</p>
                <p className="det-line">11am to 2pm, doors open at 10:30am</p>
                <p className="det-line">The Grounds of Alexandria</p>
                <p className="det-line det-addr">7a / 2 Huntley Street, Alexandria NSW 2015</p>
              </section>

              <div className="rsvp">
                {reply === 'idle' && (
                  <>
                    <p className="rsvp-main">Will you join us{firstName ? `, ${firstName}` : ''}?</p>
                    <div className="btnrow">
                      <button className="btn" onClick={() => { setError(null); setReply('form') }} disabled={!!loading}>Delighted, I&apos;ll be there</button>
                      <button className="btn ghost" onClick={() => respond('decline')} disabled={!!loading}>{loading === 'decline' ? 'One moment…' : "Sadly can't make it"}</button>
                    </div>
                    <p className="rsvp-sub">An intimate gathering with limited places. RSVP by Wednesday 4 November. Adults only.</p>
                    {error && <p className="rsvp-sub" style={{ color: '#C0392B', opacity: 1 }}>{error}</p>}
                  </>
                )}
                {reply === 'form' && (
                  <>
                    <p className="rsvp-main">Wonderful. Just your details.</p>
                    <form className="rform" onSubmit={submitDetails}>
                      <div className="row">
                        <input placeholder="First name" value={fName} onChange={e => setFName(e.target.value)} autoComplete="given-name" />
                        <input placeholder="Last name" value={lName} onChange={e => setLName(e.target.value)} autoComplete="family-name" />
                      </div>
                      <input type="email" placeholder="Email" value={fEmail} onChange={e => setFEmail(e.target.value)} autoComplete="email" />
                      <input placeholder="Instagram handle" value={fInsta} onChange={e => setFInsta(e.target.value)} />
                      <input type="tel" placeholder="Phone number" value={fPhone} onChange={e => setFPhone(e.target.value)} autoComplete="tel" />
                      {error && <p className="rsvp-sub" style={{ color: '#C0392B', opacity: 1, margin: 0 }}>{error}</p>}
                      <div className="actions">
                        <button type="button" className="btn ghost" onClick={() => { setError(null); setReply('idle') }}>Back</button>
                        <button type="submit" className="btn" disabled={!!loading}>{loading === 'confirm' ? 'Confirming…' : 'Confirm my place'}</button>
                      </div>
                    </form>
                  </>
                )}
                {reply === 'confirmed' && (
                  <>
                    <p className="rsvp-note">You&apos;re on the list{firstName ? `, ${firstName}` : ''}.</p>
                    <p className="rsvp-sub">A confirmation is on its way, with the running order and parking details closer to the day.</p>
                    <button className="replay" onClick={() => setReply('idle')}>Change my reply</button>
                  </>
                )}
                {reply === 'declined' && (
                  <>
                    <p className="rsvp-note">Thank you for letting us know.</p>
                    <p className="rsvp-sub">We&apos;ll keep you in mind for the next one.</p>
                    <button className="replay" onClick={() => setReply('idle')}>Change my reply</button>
                  </>
                )}
              </div>
            </div>

            <footer className="band">
              <div className="band-inner">
                <div className="band-lockup"><Mark /><div className="wordmark">nanit</div></div>
                <p className="band-note">nanit.com.au</p>
              </div>
            </footer>
          </article>

          <button className="replay" onClick={() => { setPhase('sealed') }}>↺ Close the envelope</button>
        </>
      )}
    </div>
  )
}
