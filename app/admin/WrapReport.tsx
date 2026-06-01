'use client'

import { useState, useEffect } from 'react'
import { Guest } from '@/lib/supabase'
import { audienceLabels, TOTAL_CAPACITY } from '@/lib/invite-content'

const NAVY = '#111D41'
const BLUE = '#6681AB'
const CREAM = '#F3E8E0'

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100" style={{ background: CREAM }}>
        <h2 className="font-semibold text-sm uppercase tracking-widest" style={{ color: NAVY, fontFamily: 'NeuePlak, sans-serif', letterSpacing: '0.12em' }}>{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

function Textarea({ label, field, value, onChange, placeholder }: {
  label: string; field: string; value: string; onChange: (v: string) => void; placeholder?: string
}) {
  return (
    <div>
      <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: BLUE, fontFamily: 'NeuePlak, sans-serif' }}>{label}</label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        className="w-full text-sm px-4 py-3 rounded-xl border border-gray-200 outline-none resize-none focus:border-blue-300"
        style={{ fontFamily: 'BentonSans, sans-serif', color: NAVY }}
      />
    </div>
  )
}

interface WrapData {
  totalPosts: string
  totalReach: string
  mediaPlacementsCount: string
  mediaLinks: string
  keyHighlights: string
  challenges: string
  recommendations: string
  coverageLinks: string
  photographyNotes: string
}

const DEFAULT_WRAP: WrapData = {
  totalPosts: '', totalReach: '', mediaPlacementsCount: '', mediaLinks: '',
  keyHighlights: '', challenges: '', recommendations: '', coverageLinks: '', photographyNotes: '',
}

export default function WrapReport({ guests }: { guests: Guest[] }) {
  const [wrap, setWrap] = useState<WrapData>(DEFAULT_WRAP)

  useEffect(() => {
    const saved = localStorage.getItem('nanit-wrap')
    if (saved) setWrap(JSON.parse(saved))
  }, [])

  function update(field: keyof WrapData, value: string) {
    const next = { ...wrap, [field]: value }
    setWrap(next)
    localStorage.setItem('nanit-wrap', JSON.stringify(next))
  }

  const confirmed = guests.filter(g => g.status === 'confirmed')
  const checkedIn = guests.filter(g => g.checked_in)
  const declined = guests.filter(g => g.status === 'declined')
  const invited = guests.filter(g => g.invite_sent_at)
  const attendanceRate = confirmed.length > 0 ? Math.round((checkedIn.length / confirmed.length) * 100) : 0
  const rsvpRate = invited.length > 0 ? Math.round((confirmed.length / invited.length) * 100) : 0
  const creatorGuests = guests.filter(g => ['influencer', 'media', 'wellness', 'celebrity'].includes(g.audience_type))
  const contentSubmitted = creatorGuests.filter(g => ['submitted', 'approved'].includes(g.content_status || '')).length

  return (
    <div>
      {/* Auto-populated stats */}
      <SectionCard title="Event results — auto-populated">
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[
            { label: 'Invitations sent', value: invited.length },
            { label: 'RSVPs confirmed', value: confirmed.length },
            { label: 'RSVP rate', value: `${rsvpRate}%` },
            { label: 'Checked in on day', value: checkedIn.length },
            { label: 'Attendance rate', value: `${attendanceRate}%` },
            { label: 'RSVP declined', value: declined.length },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl px-4 py-3 text-center" style={{ background: CREAM }}>
              <p className="text-2xl font-light" style={{ color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}>{value}</p>
              <p className="text-xs uppercase tracking-widest mt-1" style={{ color: '#9CA3AF', fontFamily: 'NeuePlak, sans-serif' }}>{label}</p>
            </div>
          ))}
        </div>

        {/* Audience breakdown */}
        <div className="mt-4 overflow-hidden rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider bg-gray-50 border-b border-gray-100" style={{ color: BLUE, fontFamily: 'NeuePlak, sans-serif' }}>
                <th className="px-4 py-3">Audience</th>
                <th className="px-4 py-3 text-center">Invited</th>
                <th className="px-4 py-3 text-center">Confirmed</th>
                <th className="px-4 py-3 text-center">Attended</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(audienceLabels).map((k, i) => {
                const aud = guests.filter(g => g.audience_type === k)
                const conf = aud.filter(g => g.status === 'confirmed')
                const attended = aud.filter(g => g.checked_in)
                return (
                  <tr key={k} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-4 py-2.5 text-gray-700">{audienceLabels[k as keyof typeof audienceLabels]}</td>
                    <td className="px-4 py-2.5 text-center text-gray-500">{aud.length}</td>
                    <td className="px-4 py-2.5 text-center" style={{ color: BLUE }}>{conf.length}</td>
                    <td className="px-4 py-2.5 text-center font-medium" style={{ color: '#059669' }}>{attended.length}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </SectionCard>

      {/* Social & media */}
      <SectionCard title="Social & media results">
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { label: 'Total social posts', field: 'totalPosts' as keyof WrapData, placeholder: 'e.g. 42' },
            { label: 'Estimated total reach', field: 'totalReach' as keyof WrapData, placeholder: 'e.g. 850,000' },
            { label: 'Media placements', field: 'mediaPlacementsCount' as keyof WrapData, placeholder: 'e.g. 4' },
          ].map(({ label, field, placeholder }) => (
            <div key={field} className="rounded-xl px-4 py-3 text-center" style={{ background: CREAM }}>
              <input
                value={wrap[field]}
                onChange={e => update(field, e.target.value)}
                placeholder={placeholder}
                className="text-2xl font-light w-full text-center bg-transparent outline-none placeholder-gray-300"
                style={{ color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}
              />
              <p className="text-xs uppercase tracking-widest mt-1" style={{ color: '#9CA3AF', fontFamily: 'NeuePlak, sans-serif' }}>{label}</p>
            </div>
          ))}
        </div>
        <div className="space-y-4">
          <Textarea label="Media coverage links" field="mediaLinks" value={wrap.mediaLinks} onChange={v => update('mediaLinks', v)} placeholder="Paste article URLs, one per line…" />
          <Textarea label="Social post / coverage links" field="coverageLinks" value={wrap.coverageLinks} onChange={v => update('coverageLinks', v)} placeholder="Instagram, TikTok, editorial links…" />
        </div>
        <div className="mt-4 rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: CREAM }}>
          <div>
            <p className="text-xs uppercase tracking-widest mb-0.5" style={{ color: BLUE, fontFamily: 'NeuePlak, sans-serif' }}>Creator content</p>
            <p className="text-sm" style={{ color: NAVY }}>{contentSubmitted} of {creatorGuests.length} creator guests submitted content</p>
          </div>
        </div>
      </SectionCard>

      {/* Qualitative */}
      <SectionCard title="Debrief notes">
        <div className="space-y-5">
          <Textarea label="Key highlights" field="keyHighlights" value={wrap.keyHighlights} onChange={v => update('keyHighlights', v)} placeholder="What worked exceptionally well…" />
          <Textarea label="Challenges" field="challenges" value={wrap.challenges} onChange={v => update('challenges', v)} placeholder="What could have gone better…" />
          <Textarea label="Recommendations for next event" field="recommendations" value={wrap.recommendations} onChange={v => update('recommendations', v)} placeholder="What to do differently next time…" />
          <Textarea label="Photography & content notes" field="photographyNotes" value={wrap.photographyNotes} onChange={v => update('photographyNotes', v)} placeholder="Key shots captured, content gaps, photographer feedback…" />
        </div>
      </SectionCard>
    </div>
  )
}
