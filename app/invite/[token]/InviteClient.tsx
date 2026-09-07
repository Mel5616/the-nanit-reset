'use client'

import { useState } from 'react'
import { Guest } from '@/lib/supabase'

// Faithful port of the Nanit A5 invitation design.
// Newsreader / Archivo are the designer's stand-ins for Cotford Text / Neue Plak.

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
  min-height:100vh; margin:0; background:#E4DCD1; color:var(--midnight);
  font-family:var(--text); -webkit-font-smoothing:antialiased;
  display:flex; flex-direction:column; align-items:center; justify-content:center; padding:10px;
}
.nrinv *{ box-sizing:border-box; }
.nrinv .stagewrap{
  width:148mm; height:210mm; position:relative; overflow:hidden; border-radius:5mm;
  perspective:1400px; box-shadow:0 22px 58px rgba(17,29,65,.20);
}
.nrinv .sheet{
  position:relative; z-index:2; width:100%; height:100%;
  background:radial-gradient(125% 85% at 50% 0%, #F8F2EA 0%, #F3EBE0 52%, #EFE5D8 100%);
  display:flex; overflow:hidden; flex-direction:column; border-radius:5mm;
  box-shadow:0 16px 36px rgba(17,29,65,.22);
  transform:translateY(47%) scale(.62); animation:cardOut 1.5s linear 2.30s forwards;
}
@keyframes cardOut{
  0%{ transform:translateY(47%) scale(.62); animation-timing-function:cubic-bezier(.2,.72,.3,1); }
  48%{ transform:translateY(-17%) scale(.62); }
  57%{ transform:translateY(-17%) scale(.62); animation-timing-function:cubic-bezier(.42,0,.16,1); }
  100%{ transform:translateY(0) scale(1); }
}
.nrinv .sheet::after{
  content:""; position:absolute; inset:0; z-index:9; pointer-events:none; opacity:.05; mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='140' height='140' filter='url(%23n)'/%3E%3C/svg%3E");
}
.nrinv .body-area{ flex:1; padding:9mm 13mm 3mm; display:flex; flex-direction:column; }
.nrinv .masthead{ display:flex; flex-direction:column; align-items:center; gap:8px; }
.nrinv .mark{ width:24px; height:24px; display:block; }
.nrinv .wordmark{ font-family:var(--display); font-weight:300; font-size:20px; line-height:1; letter-spacing:-.005em; color:var(--lullaby); }
.nrinv .rule{ height:1px; background:var(--midnight); opacity:.22; margin:4mm 0 0; transform:scaleX(0); transform-origin:50% 50%; animation:lineIn .9s var(--ease) forwards; }
@keyframes lineIn{ to{ transform:scaleX(1); } }
.nrinv .opening{ padding-top:6mm; text-align:center; }
.nrinv .eyebrow{ font-weight:600; font-size:var(--x325); letter-spacing:.11em; color:var(--midnight); opacity:.5; margin:0 0 3mm; text-transform:uppercase; }
.nrinv h1{ font-family:var(--display); font-weight:200; font-size:var(--x1); line-height:1.12; letter-spacing:-.018em; text-wrap:balance; margin:0 auto; max-width:17ch; color:var(--bedtime); }
.nrinv h1 em{ font-style:italic; font-weight:200; }
.nrinv .event-name{ font-weight:400; font-size:var(--x2); line-height:1.3; margin:3mm 0 0; color:var(--lullaby); }
.nrinv .host{ text-align:center; margin:5mm auto 0; width:78%; padding:4mm 0 0; border-top:1px solid rgba(45,73,119,.22); }
.nrinv .host-intro{ font-size:var(--x325); letter-spacing:.06em; opacity:.55; margin:0 0 2.5mm; }
.nrinv .host-name{ font-family:var(--display); font-style:italic; font-weight:200; font-size:clamp(20px,4.7vw,24px); line-height:1.05; letter-spacing:-.01em; color:var(--bedtime); margin:0; }
.nrinv .host-role{ font-size:var(--x325); line-height:1.5; opacity:.68; margin:2mm 0 0; }
.nrinv .copy{ max-width:48ch; margin:5mm auto 6.5mm; text-align:center; }
.nrinv .copy p{ font-size:var(--x3); line-height:1.5; text-wrap:pretty; margin:0 0 .9em; }
.nrinv .copy p:last-child{ margin-bottom:0; }
.nrinv .details{ margin-top:auto; padding-top:6.5mm; text-align:center; border-top:1px solid rgba(45,73,119,.22); }
.nrinv .det-date{ font-family:var(--display); font-variant-numeric:oldstyle-nums; font-weight:300; font-size:clamp(18px,4.0vw,20px); line-height:1.15; letter-spacing:-.01em; color:var(--bedtime); margin:0; }
.nrinv .det-line{ font-size:var(--x3); line-height:1.55; margin:2.5mm 0 0; }
.nrinv .det-venue{ margin-top:2.5mm; }
.nrinv .det-addr{ font-size:var(--x325); opacity:.7; margin-top:1mm; }
.nrinv .rsvp{ margin-top:5mm; text-align:center; }
.nrinv .rsvp-main{ font-family:var(--display); font-variant-numeric:oldstyle-nums; font-weight:300; font-size:var(--x2); letter-spacing:-.01em; color:var(--bedtime); margin:0 0 3mm; }
.nrinv .btnrow{ display:flex; gap:8px; justify-content:center; flex-wrap:wrap; }
.nrinv .btn{ display:inline-block; background:var(--midnight); color:var(--cream); font-family:var(--text); font-weight:500; font-size:var(--x3); letter-spacing:.015em; text-decoration:none; padding:3.6mm 7mm; border:0; border-radius:999px; cursor:pointer; box-shadow:0 3px 12px rgba(17,29,65,.20); transition:background .25s var(--ease),transform .25s var(--ease); white-space:nowrap; }
.nrinv .btn:hover{ background:var(--bedtime); transform:translateY(-1px); }
.nrinv .btn.ghost{ background:transparent; color:var(--midnight); border:1px solid rgba(45,73,119,.35); box-shadow:none; }
.nrinv .btn:disabled{ opacity:.5; cursor:default; }
.nrinv .rsvp-sub{ font-size:var(--x325); line-height:1.45; opacity:.65; margin:2.5mm 0 0; }
.nrinv .rsvp-note{ font-family:var(--display); font-style:italic; font-size:var(--x2); color:var(--bedtime); margin:0 0 1.5mm; }
.nrinv .band{ background:var(--midnight); background-image:${SQUIRCLE('0.05')}; background-size:62px 62px; background-position:center; color:var(--cream); padding:5mm 13mm; position:relative; flex:0 0 auto; overflow:hidden; }
.nrinv .band-shapes{ position:absolute; inset:0; width:100%; height:100%; display:block; }
.nrinv .band-inner{ position:relative; display:flex; align-items:center; justify-content:space-between; gap:6mm; }
.nrinv .band-lockup{ display:flex; align-items:center; gap:8px; }
.nrinv .band-lockup .mark{ width:18px; height:18px; }
.nrinv .band-lockup .wordmark{ color:var(--cream); font-size:17px; }
.nrinv .band-note{ font-size:var(--x325); line-height:1.5; text-align:right; opacity:.8; margin:0; }

/* envelope */
.nrinv .env{ position:absolute; left:6%; right:6%; top:46%; height:43%; animation:envIn .55s var(--ease) both, envLeave .45s var(--ease) 2.72s forwards; }
.nrinv .env-behind{ z-index:1; transform-style:preserve-3d; }
.nrinv .env-above{ z-index:3; }
@keyframes envIn{ from{ opacity:0; transform:translateY(12px);} to{ opacity:1; transform:none;} }
@keyframes envLeave{ to{ opacity:0; transform:translateY(28px);} }
.nrinv .env-back{ position:absolute; inset:0; background:var(--midnight); border-radius:3mm; box-shadow:0 2px 7px rgba(17,29,65,.20); }
.nrinv .env-flap{ position:absolute; top:0; left:0; right:0; height:42%; background:#33538A; clip-path:polygon(0 0,100% 0,50% 100%); transform-origin:50% 0; transform:rotateX(0deg); animation:flapOpen .85s var(--ease) 1.72s forwards; display:flex; justify-content:center; align-items:center; }
@keyframes flapOpen{ to{ transform:rotateX(-172deg);} }
.nrinv .env-lockup{ display:flex; flex-direction:column; align-items:center; gap:7px; margin-top:-2%; animation:lockIn .55s var(--ease) .3s both, lockOut .3s ease 1.55s forwards; }
@keyframes lockIn{ from{ opacity:0; transform:translateY(7px);} to{ opacity:1; transform:none;} }
@keyframes lockOut{ to{ opacity:0;} }
.nrinv .env-mark{ width:31px; height:31px; display:block; }
.nrinv .env-word{ font-family:var(--display); font-weight:300; font-size:24px; line-height:1; letter-spacing:-.005em; color:var(--cream); }
.nrinv .env-skirt{ position:absolute; left:-100%; right:-100%; top:100%; height:130%; background-color:#E4DCD1; background-image:radial-gradient(258px 64px at 50% 0%, rgba(17,29,65,.32) 0%, rgba(17,29,65,0) 100%); background-repeat:no-repeat; }
.nrinv .env-front{ position:absolute; left:0; right:0; bottom:0; height:58%; background:var(--midnight); background-image:${SQUIRCLE('0.06')}; background-size:62px 62px; background-position:center; border-top:1px solid rgba(102,145,168,.5); border-radius:0 0 3mm 3mm; box-shadow:0 2px 7px rgba(17,29,65,.16), inset 0 7px 16px rgba(17,29,65,.34); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px; }
.nrinv .env-name{ font-family:var(--display); font-style:italic; font-weight:300; font-size:20px; color:#EDE4D6; }
.nrinv .env-tag{ font-size:9px; letter-spacing:.24em; text-transform:uppercase; color:rgba(237,228,214,.6); }

.nrinv .stage{ opacity:0; transform:translateY(12px); animation:settle .8s var(--ease) forwards; }
@keyframes settle{ to{ opacity:1; transform:none;} }
.nrinv .d1{animation-delay:3.85s}.nrinv .d2{animation-delay:3.96s}.nrinv .d3{animation-delay:4.07s}.nrinv .d4{animation-delay:4.18s}.nrinv .d5{animation-delay:4.29s}.nrinv .d6{animation-delay:4.4s}.nrinv .d7{animation-delay:4.51s}.nrinv .d8{animation-delay:4.62s}.nrinv .d9{animation-delay:4.73s}
.nrinv .replay{ margin-top:16px; background:none; border:0; color:var(--midnight); opacity:.55; font-family:var(--text); font-size:11px; letter-spacing:.12em; text-transform:uppercase; cursor:pointer; }

@media (prefers-reduced-motion: reduce){
  .nrinv .env{ display:none; }
  .nrinv .sheet,.nrinv .stage{ opacity:1!important; transform:none!important; animation:none!important; }
  .nrinv .rule{ transform:scaleX(1)!important; animation:none!important; }
}
@media screen and (max-width:620px){
  .nrinv{ padding:0; background:#F3EBE0; }
  .nrinv .stagewrap{ width:auto; height:auto; margin:0; box-shadow:none; overflow:visible; }
  .nrinv .sheet{ height:auto; transform:none; animation:none; border-radius:0; box-shadow:none; }
  .nrinv .env{ display:none; }
  .nrinv .body-area{ padding:34px 24px 28px; }
  .nrinv .band{ padding:28px 24px 30px; }
  .nrinv .opening,.nrinv .copy,.nrinv .host,.nrinv .details,.nrinv .rsvp{ text-align:center; }
  .nrinv .stage{ opacity:1; transform:none; animation:none; }
  .nrinv .rule{ transform:scaleX(1); animation:none; }
}
`

function Mark({ inv = false }: { inv?: boolean }) {
  return (
    <svg className={inv ? 'env-mark' : 'mark'} viewBox="0 0 100 100" role="img" aria-label="Nanit" style={{ color: inv ? undefined : 'var(--lullaby)' }}>
      <path d="M50 0C88 0 100 12 100 50C100 88 88 100 50 100C12 100 0 88 0 50C0 12 12 0 50 0Z" fill={inv ? '#F3EBE0' : 'currentColor'} />
      <path d="M50 30.25C65.01 30.25 69.75 34.99 69.75 50C69.75 65.01 65.01 69.75 50 69.75C34.99 69.75 30.25 65.01 30.25 50C30.25 34.99 34.99 30.25 50 30.25Z" fill="none" stroke={inv ? '#33538A' : 'var(--cream)'} strokeWidth="7.5" />
    </svg>
  )
}

export default function InviteClient({ guest, preview = false }: { guest: Guest; preview?: boolean }) {
  const guestName = `${guest.first_name} ${guest.last_name}`.trim()
  const firstName = guest.first_name
  const [replayKey, setReplayKey] = useState(0)
  const [reply, setReply] = useState<'idle' | 'confirmed' | 'declined'>(
    guest.status === 'confirmed' ? 'confirmed' : guest.status === 'declined' ? 'declined' : 'idle'
  )
  const [loading, setLoading] = useState<'confirm' | 'decline' | null>(null)
  const [error, setError] = useState(false)

  async function respond(action: 'confirm' | 'decline') {
    if (preview) { setReply(action === 'confirm' ? 'confirmed' : 'declined'); return }
    setLoading(action); setError(false)
    try {
      const res = await fetch('/api/confirm-rsvp', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: guest.invite_token, guestId: guest.id, action }),
      })
      if (!res.ok) throw new Error()
      setReply(action === 'confirm' ? 'confirmed' : 'declined')
    } catch { setError(true) }
    setLoading(null)
  }

  return (
    <div className="nrinv">
      <style>{CSS}</style>
      <div className="stagewrap" key={replayKey}>
        {/* envelope — behind */}
        <div className="env env-behind" aria-hidden="true">
          <div className="env-back" />
          <div className="env-flap">
            <div className="env-lockup"><Mark inv /><div className="env-word">nanit</div></div>
          </div>
        </div>

        <article className="sheet">
          <div className="body-area">
            <header className="masthead stage d1">
              <Mark /><div className="wordmark">nanit</div>
            </header>

            <div className="rule d2" />

            <section className="opening">
              <p className="eyebrow stage d3">By invitation only</p>
              <h1 className="stage d4">A morning to stop, breathe and <em>reset</em>.</h1>
              <p className="event-name stage d5">The Nanit Reset Event</p>
            </section>

            <section className="host stage d6">
              <p className="host-intro">in conversation with</p>
              <p className="host-name">Dr Natalie Barnett</p>
              <p className="host-role">PhD, Vice President of Clinical Research at Nanit</p>
            </section>

            <section className="copy stage d7">
              <p>A morning for you. Meet the Nanit range and see what it can tell you about your baby&apos;s sleep, settle into a guided breathwork session, and stay for lunch with other parents. And there are puppies to cuddle, because a morning with puppies is the ultimate reset.</p>
            </section>

            <section className="details stage d8">
              <p className="det-date">Monday 16 November</p>
              <p className="det-line">11am to 2pm, doors open at 10:30am</p>
              <p className="det-line det-venue">The Grounds of Alexandria</p>
              <p className="det-line det-addr">7a / 2 Huntley Street, Alexandria NSW 2015</p>
            </section>

            <div className="rsvp stage d9">
              {reply === 'idle' && (
                <>
                  <p className="rsvp-main">Will you join us{firstName ? `, ${firstName}` : ''}?</p>
                  <div className="btnrow">
                    <button className="btn" onClick={() => respond('confirm')} disabled={!!loading}>
                      {loading === 'confirm' ? 'Just a moment…' : "Delighted, I'll be there"}
                    </button>
                    <button className="btn ghost" onClick={() => respond('decline')} disabled={!!loading}>
                      Sadly can&apos;t make it
                    </button>
                  </div>
                  <p className="rsvp-sub">An intimate gathering with limited places. RSVP by Wednesday 4 November. Adults only.</p>
                  {error && <p className="rsvp-sub" style={{ color: '#C0392B', opacity: 1 }}>Something went wrong. Please try again.</p>}
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
              <div className="band-lockup stage d9"><Mark /><div className="wordmark">nanit</div></div>
              <p className="band-note stage d9">nanit.com.au</p>
            </div>
          </footer>
        </article>

        {/* envelope — front, carries the recipient's name */}
        <div className="env env-above" aria-hidden="true">
          <div className="env-skirt" />
          <div className="env-front">
            <div className="env-name">{guestName || 'Your invitation'}</div>
            <div className="env-tag">Private view</div>
          </div>
        </div>
      </div>

      <button className="replay" onClick={() => setReplayKey(k => k + 1)}>↺ Play the reveal again</button>
    </div>
  )
}
