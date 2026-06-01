'use client'

import { useState, useEffect } from 'react'
import { Guest } from '@/lib/supabase'
import { inviteContent } from '@/lib/invite-content'
import RSVPButtons from './RSVPButtons'
import QRCode from './QRCode'

const NAVY = '#111D41'
const BLUE = '#6681AB'
const MIDNIGHT = '#204977'

export default function InviteClient({ guest }: { guest: Guest }) {
  const [phase, setPhase] = useState<'sealed' | 'opening' | 'open'>('sealed')
  const [mounted, setMounted] = useState(false)
  const content = inviteContent[guest.audience_type]

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80)
    return () => clearTimeout(t)
  }, [])

  function open() {
    setPhase('opening')
    setTimeout(() => setPhase('open'), 900)
  }

  return (
    <main style={{ background: NAVY, minHeight: '100vh', overflow: 'hidden' }}>

      {/* ── Sealed envelope ───────────────────────────────── */}
      {phase !== 'open' && (
        <div style={{
          position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: NAVY, zIndex: 50,
          opacity: phase === 'opening' ? 0 : mounted ? 1 : 0,
          transition: phase === 'opening' ? 'opacity 0.7s ease-in' : 'opacity 0.6s ease-out',
          pointerEvents: phase === 'opening' ? 'none' : 'auto',
        }}>
          <div
            onClick={open}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && open()}
            style={{
              position: 'relative',
              width: 'min(360px, 88vw)',
              height: 'min(420px, 85vw)',
              cursor: 'pointer',
              transform: mounted ? 'translateY(0)' : 'translateY(28px)',
              transition: 'transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
          >

            {/* ── Layer 1 (back): Card tucked inside ── */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 12,
              right: 12,
              bottom: '32%',  // card bottom is hidden behind envelope body
              zIndex: 1,
              background: '#172340',
              borderRadius: 6,
              border: '1px solid rgba(102,129,171,0.2)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'flex-start',
              paddingTop: 28,
              overflow: 'hidden',
            }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 9, letterSpacing: '0.22em', textTransform: 'uppercase', fontFamily: 'NeuePlak, sans-serif', marginBottom: 14 }}>
                You are cordially invited
              </p>
              <p style={{ color: 'rgba(255,255,255,0.88)', fontSize: 26, fontFamily: 'Cotford, Georgia, serif', fontWeight: 300, letterSpacing: '-0.01em', lineHeight: 1.2, marginBottom: 10, textAlign: 'center' }}>
                The Nanit Reset.
              </p>
              <div style={{ width: 32, height: 1, background: 'rgba(102,129,171,0.4)', marginBottom: 10 }} />
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 11, fontFamily: 'BentonSans, sans-serif', letterSpacing: '0.08em' }}>
                15 November 2026 · Sydney
              </p>
            </div>

            {/* ── Layer 2 (middle): Envelope body ── */}
            <svg
              viewBox="0 0 360 280"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '68%',
                zIndex: 2,
                filter: 'drop-shadow(0 24px 48px rgba(0,0,0,0.55))',
              }}
            >
              {/* Envelope body rectangle */}
              <rect x="0.75" y="0.75" width="358.5" height="278.5" rx="5" fill="#1A2E52" stroke="rgba(102,129,171,0.35)" strokeWidth="1.5"/>
              {/* Bottom-left crease */}
              <path d="M1 278 L180 158" stroke="rgba(102,129,171,0.18)" strokeWidth="1"/>
              {/* Bottom-right crease */}
              <path d="M359 278 L180 158" stroke="rgba(102,129,171,0.18)" strokeWidth="1"/>
              {/* Sealed flap — V pointing down from top */}
              <path d="M1 1 L180 110 L359 1 Z" fill="#152544" stroke="rgba(102,129,171,0.35)" strokeWidth="1.5"/>
            </svg>

            {/* ── Layer 3 (front): Wax seal on the flap ── */}
            <div style={{
              position: 'absolute',
              bottom: '37%',
              left: '50%',
              transform: 'translateX(-50%)',
              width: 68,
              height: 68,
              borderRadius: '50%',
              zIndex: 3,
              background: `radial-gradient(circle at 32% 32%, #7B9BC4, ${BLUE} 55%, ${MIDNIGHT})`,
              boxShadow: '0 6px 24px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <span style={{ color: 'rgba(255,255,255,0.88)', fontSize: 13, fontFamily: 'Cotford, Georgia, serif', letterSpacing: '0.05em', fontStyle: 'italic' }}>NR</span>
            </div>

            {/* Tap to open label */}
            <div style={{ position: 'absolute', bottom: -40, left: 0, right: 0, textAlign: 'center' }}>
              <p style={{
                color: 'rgba(255,255,255,0.32)',
                fontSize: 10,
                fontFamily: 'NeuePlak, sans-serif',
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                animation: 'breathe 2.4s ease-in-out infinite',
              }}>
                Tap to open
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ── Open invitation ─────────────────────────────── */}
      <div style={{
        opacity: phase === 'open' ? 1 : 0,
        transform: phase === 'open' ? 'translateY(0)' : 'translateY(32px)',
        transition: 'opacity 0.7s ease-out 0.1s, transform 0.8s cubic-bezier(0.16,1,0.3,1) 0.1s',
        pointerEvents: phase === 'open' ? 'auto' : 'none',
      }}>
        <div style={{ height: 4, background: BLUE }} />
        <div style={{ maxWidth: 640, margin: '0 auto', padding: '64px 24px' }}>

          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <img src="/nanit-logo-light.png" alt="Nanit" style={{ height: 32, margin: '0 auto 32px', display: 'block', opacity: 0.8 }} />
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.25em', textTransform: 'uppercase', fontFamily: 'NeuePlak, sans-serif', marginBottom: 20 }}>
              You are invited to
            </p>
            <h1 style={{ color: '#fff', fontFamily: 'Cotford, Georgia, serif', fontWeight: 300, fontSize: 'clamp(2.4rem, 7vw, 3.8rem)', letterSpacing: '-0.02em', marginBottom: 12, lineHeight: 1.1 }}>
              The Nanit Reset.
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, letterSpacing: '0.1em', fontFamily: 'BentonSans, sans-serif' }}>
              15 November 2026 · Sydney
            </p>
          </div>

          <div style={{ width: 48, height: 1, background: BLUE, margin: '0 auto 64px' }} />

          <div style={{ textAlign: 'center', marginBottom: 64, padding: '0 16px' }}>
            <p style={{ color: '#fff', fontFamily: 'Cotford, Georgia, serif', fontWeight: 300, fontSize: 'clamp(1.3rem, 3.5vw, 1.7rem)', lineHeight: 1.5, marginBottom: 16 }}>
              {content.hook}
            </p>
            <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 17, fontFamily: 'BentonSans, sans-serif', lineHeight: 1.6 }}>
              {content.sub}
            </p>
          </div>

          <div style={{ borderRadius: 16, marginBottom: 24, padding: 32, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
              {[
                { label: 'Date', value: 'Saturday, 15 November 2026' },
                { label: 'Time', value: '10:00am – 1:00pm' },
                { label: 'Location', value: 'Sydney, NSW — venue details to follow' },
                { label: 'Format', value: 'Expert panel · App experience · Gifting' },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'NeuePlak, sans-serif', marginBottom: 6 }}>{label}</p>
                  <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: 13, fontFamily: 'BentonSans, sans-serif', lineHeight: 1.5 }}>{value}</p>
                </div>
              ))}
            </div>
          </div>

          <div style={{ borderRadius: 12, marginBottom: 48, padding: '20px 24px', textAlign: 'center', background: 'rgba(102,129,171,0.12)', border: '1px solid rgba(102,129,171,0.22)' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'NeuePlak, sans-serif', marginBottom: 8 }}>Keynote Speaker</p>
            <p style={{ color: '#fff', fontSize: 16, fontFamily: 'BentonSans, sans-serif', fontWeight: 500, marginBottom: 4 }}>Dr Natalie Barnett</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, fontFamily: 'BentonSans, sans-serif' }}>VP of Clinical Research, Nanit (US)</p>
          </div>

          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 14, fontFamily: 'BentonSans, sans-serif', marginBottom: 28 }}>
              {guest.first_name}, we'd love to have you there.
            </p>
            <RSVPButtons token={guest.invite_token} guestId={guest.id} />
          </div>

          {/* QR code for door check-in */}
          <div style={{ textAlign: 'center', marginTop: 48, marginBottom: 32 }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', fontFamily: 'NeuePlak, sans-serif', marginBottom: 16 }}>
              Your check-in code
            </p>
            <div style={{ display: 'inline-block' }}>
              <QRCode value={`${process.env.NEXT_PUBLIC_BASE_URL || ''}/invite/${guest.invite_token}`} size={140} />
            </div>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: 11, fontFamily: 'BentonSans, sans-serif', marginTop: 12 }}>
              Show this at the door on 15 November
            </p>
          </div>

          <div style={{ width: 48, height: 1, background: BLUE, margin: '0 auto 32px' }} />
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: 11, fontFamily: 'BentonSans, sans-serif', lineHeight: 1.7 }}>
            This is a curated, intimate event for approximately 30 guests. Places are limited.<br />
            This invitation is personal and non-transferable.
          </p>
        </div>
        <div style={{ height: 4, background: BLUE }} />
      </div>

      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.32; }
          50% { opacity: 0.65; }
        }
      `}</style>
    </main>
  )
}
