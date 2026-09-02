'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const inputStyle = {
  background: 'rgba(255,255,255,0.08)',
  border: '1px solid rgba(255,255,255,0.12)',
  fontFamily: 'BentonSans, sans-serif',
}

export default function SetPasswordForm({
  token, mode,
}: {
  token: string
  mode: 'accept' | 'reset'
}) {
  const router = useRouter()
  const [valid, setValid] = useState<boolean | null>(null)
  const [email, setEmail] = useState<string | null>(null)
  const [presetName, setPresetName] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [role, setRole] = useState<string | null>(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const endpoint = mode === 'accept' ? '/api/admin/accept-invite' : '/api/admin/reset-password'
  const heading = mode === 'accept' ? 'Welcome to the team' : 'Choose a new password'
  const cta = mode === 'accept' ? 'Set password & sign in' : 'Reset password & sign in'

  useEffect(() => {
    fetch(`${endpoint}?token=${encodeURIComponent(token)}`)
      .then(async r => {
        const data = await r.json()
        if (!r.ok) { setValid(false); setError(data.error || 'This link is not valid.'); return }
        setValid(true)
        setEmail(data.email || null)
        if (data.name) { setPresetName(data.name); setName(data.name) }
        if (data.role) setRole(data.role)
      })
      .catch(() => { setValid(false); setError('This link is not valid.') })
  }, [endpoint, token])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (password !== confirm) { setError('Passwords do not match.'); return }
    setLoading(true)
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(mode === 'accept' ? { token, name, password } : { token, password }),
    })
    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Something went wrong.')
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: '#111D41' }}>
      <div className="w-full max-w-sm px-8">
        <img src="/nanit-logo-light.png" alt="Nanit" className="mx-auto mb-8" style={{ height: 30, opacity: 0.8 }} />
        <h1 className="text-white text-3xl font-light text-center mb-2" style={{ fontFamily: 'Cotford, Georgia, serif' }}>
          {heading}
        </h1>

        {valid === null && <p className="text-white/40 text-sm text-center mt-6">Checking your link…</p>}

        {valid === false && (
          <p className="text-sm text-center mt-6" style={{ color: '#EDB39A' }}>{error}</p>
        )}

        {valid && (
          <>
            {email && <p className="text-white/50 text-sm text-center mb-6">{email}{role ? ` · ${role}` : ''}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              {mode === 'accept' && !presetName && (
                <input
                  type="text" value={name} onChange={e => setName(e.target.value)}
                  placeholder="Your name" required
                  className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 text-sm outline-none"
                  style={inputStyle}
                />
              )}
              <input
                type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="New password (min 8 characters)" required autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 text-sm outline-none"
                style={inputStyle}
              />
              <input
                type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="Confirm password" required autoComplete="new-password"
                className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 text-sm outline-none"
                style={inputStyle}
              />
              {error && <p className="text-sm" style={{ color: '#EDB39A' }}>{error}</p>}
              <button type="submit" disabled={loading}
                className="w-full py-3 rounded-full text-white text-sm font-medium tracking-wide disabled:opacity-50"
                style={{ background: '#6681AB', fontFamily: 'BentonSans, sans-serif' }}>
                {loading ? 'Saving…' : cta}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  )
}
