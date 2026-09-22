'use client'

import { useEffect, useRef, useState } from 'react'

/**
 * Refined, on-brand envelope open — hand-built to feel like Paperless Post but
 * in Nanit's palette. Thin ivory envelope, patterned liner, wax seal, one smooth
 * flap rotation, and the card glides up before handing off to the letter.
 *
 * Palette: navy #111D41 / #2D4977, blue #6681AB, soft blue #BDD4E7,
 * peach #EDB39A, cream #F3EBE0, ivory #FBF7F0.
 */
export default function SvgEnvelope({
  guestName,
  onRevealStart,
}: {
  guestName: string
  onRevealStart: () => void
}) {
  const [open, setOpen] = useState(false)
  const [rising, setRising] = useState(false)
  const [gone, setGone] = useState(false)
  const firedRef = useRef(false)
  const timers = useRef<number[]>([])

  function run() {
    if (open) return
    setOpen(true)
    // flap lifts first, then the card rises, then we hand off to the letter
    timers.current.push(window.setTimeout(() => setRising(true), 620))
    timers.current.push(
      window.setTimeout(() => {
        if (firedRef.current) return
        firedRef.current = true
        setGone(true)
        onRevealStart()
      }, 2050),
    )
  }

  useEffect(() => {
    // reduced motion → open gently on its own
    const rm = window.matchMedia?.('(prefers-reduced-motion: reduce)')
    const t = window.setTimeout(() => { if (rm?.matches) run() }, 400)
    timers.current.push(t)
    return () => { timers.current.forEach(clearTimeout) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className={`nvenv ${open ? 'is-open' : ''} ${rising ? 'is-rising' : ''} ${gone ? 'is-gone' : ''}`}>
      <style>{CSS}</style>

      <div className="nvenv-stage">
        <button className="nvenv-scene" onClick={run} aria-label="Open your invitation" type="button">
          <div className="nvenv-shadow" />

          {/* back wall of the pocket */}
          <div className="nvenv-back" />

          {/* patterned liner, revealed as the flap lifts */}
          <div className="nvenv-liner" />

          {/* the card that glides up */}
          <div className="nvenv-card">
            <div className="nvenv-card-crest">
              <span className="nvenv-o" />
              <span className="nvenv-brand">nanit</span>
            </div>
            <div className="nvenv-card-rule" />
            <p className="nvenv-card-kicker">You’re invited</p>
            <p className="nvenv-card-name">{guestName}</p>
          </div>

          {/* front pocket, card slides out from behind it */}
          <div className="nvenv-front" />

          {/* the flap */}
          <div className="nvenv-flap" />

          {/* wax seal */}
          <div className="nvenv-seal">
            <span className="nvenv-seal-o" />
          </div>
        </button>

        <p className="nvenv-name">{guestName}</p>
        <button className="nvenv-hint" onClick={run} type="button">Tap to open</button>
      </div>
    </div>
  )
}

const CSS = `
.nvenv{
  min-height:100vh; display:flex; align-items:center; justify-content:center;
  padding:24px 16px;
  background:radial-gradient(130% 100% at 50% 6%, #F3EBE0 0%, #ECE3D6 55%, #E2D8C9 100%);
}
.nvenv-stage{ display:flex; flex-direction:column; align-items:center; }

/* ---- envelope scene ---- */
.nvenv-scene{
  position:relative;
  width:min(560px, 92vw);
  height:calc(min(560px, 92vw) * 0.66);
  border:0; background:none; padding:0; cursor:pointer;
  transform-style:preserve-3d;
  perspective:1400px;
  animation:nvFloat 6s ease-in-out infinite;
  transition:opacity .7s ease, transform .7s cubic-bezier(.4,0,.2,1);
}
.nvenv.is-open .nvenv-scene{ animation:none; }
.nvenv.is-gone .nvenv-scene{ opacity:0; transform:translateY(-10px) scale(1.03); }
@keyframes nvFloat{ 0%,100%{ transform:translateY(0) } 50%{ transform:translateY(-7px) } }

.nvenv-scene > div{ position:absolute; }

.nvenv-shadow{
  left:8%; right:8%; bottom:-4%; height:14%;
  background:radial-gradient(60% 100% at 50% 50%, rgba(45,60,90,.22), rgba(45,60,90,0) 70%);
  filter:blur(6px);
  transition:opacity .6s ease, transform .6s ease;
}
.nvenv.is-rising .nvenv-shadow{ opacity:.5; }

/* back wall */
.nvenv-back{
  inset:0; border-radius:12px;
  background:
    linear-gradient(180deg, #FBF7F0 0%, #F3EBE0 100%);
  box-shadow:0 24px 60px -28px rgba(30,42,70,.5), inset 0 0 0 1px rgba(120,110,95,.10);
}

/* patterned liner (only the top triangle shows) */
.nvenv-liner{
  inset:0; border-radius:12px 12px 0 0;
  clip-path:polygon(0 0, 100% 0, 50% 74%);
  background:
    linear-gradient(180deg, #BDD4E7 0%, #A9C4DC 100%);
  opacity:.9;
}
.nvenv-liner::after{
  content:""; position:absolute; inset:0;
  clip-path:polygon(0 0, 100% 0, 50% 74%);
  background-image:radial-gradient(rgba(255,255,255,.5) 1.1px, transparent 1.2px);
  background-size:14px 14px; opacity:.5;
}

/* the card */
.nvenv-card{
  left:9%; right:9%; top:11%; height:82%;
  border-radius:8px;
  background:linear-gradient(180deg, #FFFFFF 0%, #FCF8F1 100%);
  box-shadow:0 10px 26px -14px rgba(30,42,70,.4), inset 0 0 0 1px rgba(120,110,95,.08);
  display:flex; flex-direction:column; align-items:center; justify-content:flex-start;
  padding:8% 8% 0;
  transform:translateY(6%);
  transition:transform 1.15s cubic-bezier(.22,.61,.25,1);
  z-index:2;
}
.nvenv.is-rising .nvenv-card{ transform:translateY(-58%); }
.nvenv-card-crest{ display:flex; flex-direction:column; align-items:center; gap:8px; margin-top:2%; }
.nvenv-o{
  width:30px; height:30px; border-radius:9px; background:#6681AB;
  position:relative; box-shadow:0 4px 10px -4px rgba(45,73,119,.6);
}
.nvenv-o::after{ content:""; position:absolute; inset:0; margin:auto; width:11px; height:11px; border-radius:50%; background:#FBF7F0; }
.nvenv-brand{ font-family:Cotford, Georgia, serif; font-size:20px; color:#6681AB; letter-spacing:.02em; }
.nvenv-card-rule{ width:38px; height:1px; background:#D8C9B4; margin:12px 0; }
.nvenv-card-kicker{ font-family:NeuePlak, sans-serif; text-transform:uppercase; letter-spacing:.24em; font-size:10px; color:#9AA7BD; margin:0; }
.nvenv-card-name{ font-family:Cotford, Georgia, serif; font-style:italic; font-size:22px; color:#2D4977; margin:6px 0 0; }

/* front pocket */
.nvenv-front{
  inset:0; border-radius:12px;
  clip-path:polygon(0 30%, 50% 66%, 100% 30%, 100% 100%, 0 100%);
  background:
    linear-gradient(180deg, #F7F0E5 0%, #EFE6D7 100%);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.6);
  z-index:3;
}
/* seams on the pocket */
.nvenv-front::before{
  content:""; position:absolute; inset:0;
  clip-path:polygon(0 30%, 50% 66%, 100% 30%, 100% 100%, 0 100%);
  background:
    linear-gradient(-27deg, transparent calc(50% - 0.6px), rgba(120,110,95,.14) 50%, transparent calc(50% + 0.6px)) left/50% 100% no-repeat,
    linear-gradient(27deg, transparent calc(50% - 0.6px), rgba(120,110,95,.14) 50%, transparent calc(50% + 0.6px)) right/50% 100% no-repeat;
}

/* the flap */
.nvenv-flap{
  top:0; left:0; right:0; height:76%;
  clip-path:polygon(0 0, 100% 0, 50% 97%);
  background:linear-gradient(180deg, #FBF7F0 0%, #F1E8DA 100%);
  transform-origin:50% 0; transform:rotateX(0deg);
  transform-style:preserve-3d; backface-visibility:hidden;
  box-shadow:0 2px 4px rgba(120,110,95,.10);
  transition:transform 1s cubic-bezier(.5,0,.2,1);
  z-index:5;
}
.nvenv.is-open .nvenv-flap{ transform:rotateX(178deg); z-index:1; transition:transform .95s cubic-bezier(.62,0,.28,1); }

/* wax seal — pressed, embossed terracotta wax */
.nvenv-seal{
  inset:auto; left:50%; top:62%; width:70px; height:70px;
  transform:translate(-50%,-50%);
  /* subtly organic wax edge */
  border-radius:47% 53% 49% 51% / 51% 47% 53% 49%;
  background:radial-gradient(circle at 36% 30%, #F4CDB8 0%, #ECB295 30%, #DA9575 62%, #C4795C 100%);
  box-shadow:
    0 10px 20px -8px rgba(150,80,55,.6),
    inset 0 3px 6px rgba(255,232,220,.55),
    inset 0 -6px 10px rgba(120,55,35,.5);
  display:flex; align-items:center; justify-content:center;
  z-index:6;
  transition:opacity .35s ease, transform .45s cubic-bezier(.4,0,.2,1);
}
/* pressed groove ring */
.nvenv-seal::before{
  content:""; position:absolute; inset:8px; border-radius:inherit;
  box-shadow:
    inset 0 2px 3px rgba(120,55,35,.5),
    inset 0 -2px 3px rgba(255,226,212,.5);
}
/* embossed nanit mark */
.nvenv-seal-o{
  width:24px; height:24px; border-radius:8px; position:relative; z-index:1;
  background:linear-gradient(155deg, #E4A588 0%, #D28C6C 100%);
  box-shadow:
    inset 1px 2px 2px rgba(120,55,35,.55),
    inset -1px -1px 2px rgba(255,228,214,.6);
}
.nvenv-seal-o::after{
  content:""; position:absolute; inset:0; margin:auto; width:9px; height:9px; border-radius:50%;
  background:#CD8567; box-shadow:inset 0 1px 2px rgba(110,50,30,.7);
}
.nvenv.is-open .nvenv-seal{ opacity:0; transform:translate(-50%,-50%) scale(.55) rotate(-8deg); }

/* caption + hint */
.nvenv-name{
  font-family:Cotford, Georgia, serif; font-style:italic; font-size:22px;
  color:#2D4977; margin:26px 0 0; opacity:.92;
  transition:opacity .4s ease;
}
.nvenv-hint{
  margin-top:10px; background:none; border:0; cursor:pointer;
  font-family:NeuePlak, sans-serif; font-size:11px; letter-spacing:.22em;
  text-transform:uppercase; color:#8C9AB0;
  animation:nvPulse 2.6s ease-in-out infinite;
  transition:opacity .35s ease;
}
@keyframes nvPulse{ 0%,100%{ opacity:.55 } 50%{ opacity:.95 } }
.nvenv.is-open .nvenv-hint{ opacity:0; pointer-events:none; }
.nvenv.is-gone .nvenv-name{ opacity:0; }

@media (prefers-reduced-motion: reduce){
  .nvenv-scene{ animation:none; }
  .nvenv-hint{ animation:none; }
}
`
