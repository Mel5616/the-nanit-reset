'use client'

import { useState } from 'react'

export default function RSVPButtons({ token, guestId }: { token: string; guestId: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'confirmed' | 'declined' | 'error'>('idle')

  async function respond(action: 'confirm' | 'decline') {
    setState('loading')
    const res = await fetch('/api/confirm-rsvp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, guestId, action }),
    })
    if (res.ok) {
      setState(action === 'confirm' ? 'confirmed' : 'declined')
    } else {
      setState('error')
    }
  }

  if (state === 'confirmed') {
    return (
      <div className="text-center">
        <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(74,127,165,0.2)', border: '1px solid #6681AB' }}>
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-white text-xl font-light mb-2">You're confirmed.</p>
        <p className="text-white/50 text-sm">We'll be in touch with venue details closer to the date.</p>
      </div>
    )
  }

  if (state === 'declined') {
    return (
      <div className="text-center">
        <p className="text-white text-xl font-light mb-2">Thanks for letting us know.</p>
        <p className="text-white/50 text-sm">We hope to see you at a future Nanit event.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <button
        onClick={() => respond('confirm')}
        disabled={state === 'loading'}
        className="px-10 py-4 rounded-full text-white font-medium text-sm tracking-wide transition-all disabled:opacity-50"
        style={{ background: '#6681AB' }}
      >
        {state === 'loading' ? 'Saving…' : "Yes, I'll be there"}
      </button>
      <button
        onClick={() => respond('decline')}
        disabled={state === 'loading'}
        className="px-10 py-4 rounded-full text-white/60 text-sm tracking-wide transition-all border border-white/20 hover:border-white/40 disabled:opacity-50"
      >
        Can't make it this time
      </button>
      {state === 'error' && (
        <p className="text-red-400 text-sm mt-2 w-full text-center">Something went wrong — please try again.</p>
      )}
    </div>
  )
}
