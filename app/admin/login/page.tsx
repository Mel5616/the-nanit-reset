'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim() || undefined, password }),
    })
    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Incorrect email or password.')
      setLoading(false)
    }
  }

  const inputStyle = {
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.12)',
    fontFamily: 'BentonSans, sans-serif',
  }

  return (
    <main className="min-h-screen flex items-center justify-center" style={{ background: '#111D41' }}>
      <div className="w-full max-w-sm px-8">
        <img src="/nanit-logo-light.png" alt="Nanit" className="mx-auto mb-8" style={{ height: 30, opacity: 0.8 }} />
        <h1 className="text-white text-3xl font-light text-center mb-10"
          style={{ fontFamily: 'Cotford, Georgia, serif' }}>
          Admin access
        </h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="Email (team members)"
            autoComplete="username"
            className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 text-sm outline-none"
            style={inputStyle}
          />
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete="current-password"
            className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 text-sm outline-none"
            style={inputStyle}
            autoFocus
          />
          {error && <p className="text-sm" style={{ color: '#EDB39A' }}>{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-full text-white text-sm font-medium tracking-wide disabled:opacity-50"
            style={{ background: '#6681AB', fontFamily: 'BentonSans, sans-serif' }}
          >
            {loading ? 'Checking…' : 'Enter'}
          </button>
        </form>
        <p className="text-center mt-6">
          <Link href="/admin/forgot-password" className="text-white/40 text-xs hover:text-white/70">
            Forgot your password?
          </Link>
        </p>
      </div>
    </main>
  )
}
