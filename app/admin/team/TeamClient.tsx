'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

const NAVY = '#111D41'
const BLUE = '#6681AB'

export interface TeamMember {
  id: string
  email: string
  name: string | null
  role: 'owner' | 'manager' | 'viewer' | 'door'
  invite_sent_at: string | null
  invite_accepted_at: string | null
  last_login_at: string | null
  created_at: string
}

const ROLES = ['owner', 'manager', 'viewer', 'door'] as const
const roleHelp: Record<string, string> = {
  owner: 'Full access, incl. team',
  manager: 'Everything except team',
  viewer: 'Read only',
  door: 'Check-in only',
}

export default function TeamClient({
  initialMembers, currentEmail,
}: {
  initialMembers: TeamMember[]
  currentEmail: string | null
}) {
  const router = useRouter()
  const [members, setMembers] = useState(initialMembers)
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [role, setRole] = useState<typeof ROLES[number]>('viewer')
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState<string | null>(null)

  async function refresh() {
    const res = await fetch('/api/admin/users')
    if (res.ok) setMembers(await res.json())
  }

  async function invite(e: React.FormEvent) {
    e.preventDefault()
    setBusy(true); setMsg(null)
    const res = await fetch('/api/admin/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, name, role }),
    })
    const data = await res.json().catch(() => ({}))
    if (res.ok) {
      setMsg(data.warning || `Invitation sent to ${email}.`)
      setEmail(''); setName(''); setRole('viewer')
      await refresh()
    } else {
      setMsg(data.error || 'Could not send invitation.')
    }
    setBusy(false)
  }

  async function changeRole(id: string, role: string) {
    await fetch('/api/admin/users', {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, role }),
    })
    await refresh()
  }

  async function remove(id: string, label: string) {
    if (!confirm(`Remove ${label} from the team?`)) return
    await fetch('/api/admin/users', {
      method: 'DELETE', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await refresh()
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAF7F3' }}>
      <header style={{ background: NAVY }} className="px-4 md:px-6 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <img src="/nanit-logo-light.png" alt="Nanit" style={{ height: 28, opacity: 0.9 }} />
          <div className="w-px h-8 bg-white/10" />
          <div>
            <p className="text-white/40 text-xs uppercase tracking-widest" style={{ fontFamily: 'NeuePlak, sans-serif', letterSpacing: '0.12em' }}>Admin</p>
            <h1 className="text-white text-xl font-light" style={{ fontFamily: 'Cotford, Georgia, serif' }}>Team</h1>
          </div>
        </div>
        <Link href="/admin" className="text-white/60 text-sm hover:text-white border border-white/20 hover:border-white/40 rounded-full px-4 py-2">
          ← Dashboard
        </Link>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Invite */}
        <div className="bg-white rounded-2xl p-6 shadow-sm mb-8">
          <p className="text-xs uppercase tracking-widest mb-4" style={{ color: BLUE, fontFamily: 'NeuePlak, sans-serif', letterSpacing: '0.1em' }}>Invite a team member</p>
          <form onSubmit={invite} className="grid gap-3 sm:grid-cols-[1.4fr_1fr_0.9fr_auto]">
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
              className="px-4 py-2.5 rounded-xl text-sm outline-none border border-gray-200 focus:border-blue-300" />
            <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Name (optional)"
              className="px-4 py-2.5 rounded-xl text-sm outline-none border border-gray-200 focus:border-blue-300" />
            <select value={role} onChange={e => setRole(e.target.value as typeof ROLES[number])}
              className="px-4 py-2.5 rounded-xl text-sm outline-none border border-gray-200 focus:border-blue-300 bg-white">
              {ROLES.map(r => <option key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</option>)}
            </select>
            <button type="submit" disabled={busy}
              className="px-5 py-2.5 rounded-xl text-white text-sm font-medium disabled:opacity-50"
              style={{ background: BLUE }}>
              {busy ? 'Sending…' : 'Invite'}
            </button>
          </form>
          <p className="text-xs text-gray-400 mt-3">{roleHelp[role]}</p>
          {msg && <p className="text-sm mt-3" style={{ color: NAVY }}>{msg}</p>}
        </div>

        {/* Members */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-xs uppercase tracking-widest" style={{ color: BLUE, fontFamily: 'NeuePlak, sans-serif', letterSpacing: '0.1em' }}>
              Team members · {members.length}
            </p>
          </div>
          {members.length === 0 ? (
            <p className="px-6 py-10 text-center text-gray-400 text-sm">No team members yet. Invite someone above.</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {members.map(m => {
                const isSelf = m.email === currentEmail
                const pending = !m.invite_accepted_at
                return (
                  <li key={m.id} className="px-6 py-4 flex items-center gap-4 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium" style={{ color: NAVY }}>
                        {m.name || m.email.split('@')[0]}
                        {isSelf && <span className="text-xs text-gray-400 ml-2">(you)</span>}
                      </p>
                      <p className="text-sm text-gray-400 truncate">{m.email}</p>
                    </div>
                    {pending ? (
                      <span className="text-xs px-2.5 py-1 rounded-full font-medium bg-amber-50 text-amber-700 border border-amber-100">
                        Invite pending
                      </span>
                    ) : (
                      <span className="text-xs text-gray-400">
                        {m.last_login_at ? `Active` : 'Joined'}
                      </span>
                    )}
                    <select
                      value={m.role}
                      onChange={e => changeRole(m.id, e.target.value)}
                      disabled={isSelf}
                      className="px-3 py-1.5 rounded-lg text-sm outline-none border border-gray-200 bg-white disabled:opacity-50"
                      style={{ color: NAVY }}>
                      {ROLES.map(r => <option key={r} value={r}>{r[0].toUpperCase() + r.slice(1)}</option>)}
                    </select>
                    <button
                      onClick={() => remove(m.id, m.name || m.email)}
                      disabled={isSelf}
                      className="text-xs text-gray-400 hover:text-red-500 disabled:opacity-30 disabled:hover:text-gray-400">
                      Remove
                    </button>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <p className="text-xs text-gray-400 mt-6 leading-relaxed">
          Roles · <strong>Owner</strong> full access including team · <strong>Manager</strong> everything except team ·
          {' '}<strong>Viewer</strong> read only · <strong>Door</strong> check-in only.
        </p>
      </div>
    </div>
  )
}
