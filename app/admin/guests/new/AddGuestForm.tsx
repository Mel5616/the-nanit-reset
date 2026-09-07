'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { AudienceType } from '@/lib/supabase'
import { audienceLabels } from '@/lib/invite-content'

const NAVY = '#111D41'
const BLUE = '#6681AB'

const audienceDescriptions: Record<AudienceType, string> = {
  influencer: 'Parenting & lifestyle influencers',
  media: 'Journalists, editors, PR',
  wellness: 'Maternal health & wellbeing creators',
  hcp: 'Paediatricians & sleep consultants',
  retail: 'Baby Bunting, The Memo, etc.',
  celebrity: 'High-profile parents & personalities',
}


function Input({ label, name, value, onChange, type = 'text', required = false, placeholder = '' }: {
  label: string; name: string; value: string; onChange: (v: string) => void
  type?: string; required?: boolean; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}{required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        type={type} name={name} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-blue-400 bg-white"
      />
    </div>
  )
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="pt-2">
      <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: '#6681AB', fontFamily: 'NeuePlak, sans-serif', letterSpacing: '0.12em' }}>{children}</p>
    </div>
  )
}

export default function AddGuestForm() {
  const router = useRouter()
  const [form, setForm] = useState({
    first_name: '', last_name: '', email: '', phone: '',
    audience_type: '' as AudienceType | '',
    company: '', instagram_handle: '',
    dietary_requirements: '', goody_bag: '', speaker_session: false,
    notes: '', added_by: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function set(field: string) {
    return (v: string) => setForm(f => ({ ...f, [field]: v }))
  }

  function selectAudience(k: AudienceType) {
    setForm(f => ({ ...f, audience_type: k }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.audience_type) { setError('Please select an audience type.'); return }
    setLoading(true); setError('')
    const res = await fetch('/api/add-guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    if (res.ok) {
      router.push('/admin')
      router.refresh()
    } else {
      const data = await res.json()
      setError(data.error || 'Something went wrong.')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen" style={{ background: '#FAF7F3' }}>
      <header style={{ background: NAVY }} className="px-6 py-4 flex items-center justify-between">
        <div>
          <p className="text-white/40 text-xs uppercase tracking-widest">Admin</p>
          <h1 className="text-white text-xl font-light">Add guest</h1>
        </div>
        <Link href="/admin" className="text-white/50 text-sm hover:text-white/80">← Back to dashboard</Link>
      </header>

      <div className="max-w-2xl mx-auto px-6 py-10">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-8 space-y-6">

          {/* Contact details */}
          <SectionHeading>Contact details</SectionHeading>
          <div className="grid grid-cols-2 gap-4">
            <Input label="First name" name="first_name" value={form.first_name} onChange={set('first_name')} required />
            <Input label="Last name" name="last_name" value={form.last_name} onChange={set('last_name')} required />
          </div>
          <Input label="Email" name="email" type="email" value={form.email} onChange={set('email')} required placeholder="guest@example.com" />
          <Input label="Phone" name="phone" type="tel" value={form.phone} onChange={set('phone')} placeholder="+61 4xx xxx xxx" />

          {/* Audience type */}
          <SectionHeading>Audience type</SectionHeading>
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(audienceLabels) as AudienceType[]).map(k => (
              <button
                key={k} type="button"
                onClick={() => selectAudience(k)}
                className="text-left px-4 py-3 rounded-xl border-2 transition-all"
                style={form.audience_type === k
                  ? { borderColor: BLUE, background: '#EBF4FA' }
                  : { borderColor: '#E5E7EB', background: '#fff' }}
              >
                <p className="text-sm font-medium text-gray-900">{audienceLabels[k]}</p>
                <p className="text-xs text-gray-400 mt-0.5">{audienceDescriptions[k]}</p>
              </button>
            ))}
          </div>

          {/* Social / company */}
          <SectionHeading>Details</SectionHeading>
          <Input label="Company / Outlet" name="company" value={form.company} onChange={set('company')} placeholder="e.g. Mamamia, Baby Bunting" />
          <Input label="Instagram / Social handle" name="instagram_handle" value={form.instagram_handle} onChange={set('instagram_handle')} placeholder="@handle" />

          {/* Event logistics */}
          <SectionHeading>Event logistics</SectionHeading>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Dietary requirements</label>
            <input
              type="text"
              value={form.dietary_requirements}
              onChange={e => setForm(f => ({ ...f, dietary_requirements: e.target.value }))}
              placeholder="e.g. Gluten free, vegan, nut allergy"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-blue-400 bg-white"
            />
          </div>

          <div className="flex items-center gap-3 py-2 px-4 rounded-xl border-2 border-gray-100 bg-gray-50/50">
            <input
              type="checkbox"
              id="speaker_session"
              checked={form.speaker_session}
              onChange={e => setForm(f => ({ ...f, speaker_session: e.target.checked }))}
              className="w-4 h-4 rounded accent-blue-600"
            />
            <div>
              <label htmlFor="speaker_session" className="text-sm font-medium text-gray-900 cursor-pointer">
                One-on-one with Dr Natalie Barnett
              </label>
              <p className="text-xs text-gray-400">Flag this guest for individual time with the keynote speaker</p>
            </div>
          </div>

          {/* Notes / admin */}
          <SectionHeading>Notes</SectionHeading>
          <div>
            <textarea
              value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              rows={3} placeholder="Any relevant notes about this guest"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm text-gray-900 outline-none focus:border-blue-400 resize-none"
            />
          </div>
          <Input label="Added by (your name)" name="added_by" value={form.added_by} onChange={set('added_by')} placeholder="Your name" />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <div className="flex gap-3 pt-2">
            <button
              type="submit" disabled={loading}
              className="flex-1 py-3 rounded-full text-white text-sm font-medium disabled:opacity-50"
              style={{ background: BLUE }}>
              {loading ? 'Adding…' : 'Add guest'}
            </button>
            <Link href="/admin"
              className="px-6 py-3 rounded-full text-gray-500 text-sm border border-gray-200 hover:border-gray-300">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
