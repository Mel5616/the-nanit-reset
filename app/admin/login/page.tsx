'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
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
      body: JSON.stringify({ password }),
    })
    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      setError('Incorrect password.')
      setLoading(false)
    }
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
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full px-4 py-3 rounded-xl text-white placeholder-white/30 text-sm outline-none"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', fontFamily: 'BentonSans, sans-serif' }}
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
      </div>
    </main>
  )
}
