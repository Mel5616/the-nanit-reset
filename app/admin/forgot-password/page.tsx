'use client'

import { useState } from 'react'
import Link from 'next/link'

const inputStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.12)',
  fontFamily: 'BentonSans, sans-serif',
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    await fetch('/api/admin/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    })
    setSent(true)
    setLoading(false)
  }

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: '#111D41' }}>
      <div className="w-full max-w-sm px-8">
        <img src="/nanit-logo-light.png" alt="Nanit" className="mx-auto mb-8" style={{ height: 30, opacity: 0.8 }} />
        <h1 className="text-white text-3xl font-light text-center mb-4" style={{ fontFamily: 'Cotford, Georgia, serif' }}>
          Reset password
        </h1>
        {sent ? (
          <p className="text-white/60 text-sm text-center leading-relaxed">
            If an account exists for that email, a reset link is on its way. Check your inbox.
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <p className="text-white/50 text-sm text-center mb-2">Enter your email and we will send you a reset link.</p>
            <input
              type="email" required value={email} onChange={e => setEmail(e.target.value)}
              placeholder="Email" autoFocus
              className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 text-sm outline-none"
              style={inputStyle}
            />
            <button type="submit" disabled={loading}
              className="w-full py-3 rounded-full text-white text-sm font-medium tracking-wide disabled:opacity-50"
              style={{ background: '#6681AB', fontFamily: 'BentonSans, sans-serif' }}>
              {loading ? 'Sending…' : 'Send reset link'}
            </button>
          </form>
        )}
        <p className="text-center mt-6">
          <Link href="/admin/login" className="text-white/40 text-xs hover:text-white/70">← Back to login</Link>
        </p>
      </div>
    </main>
  )
}
