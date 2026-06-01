'use client'

import { useState } from 'react'
import { Guest, AudienceType } from '@/lib/supabase'
import { audienceLabels } from '@/lib/invite-content'

const NAVY = '#111D41'
const BLUE = '#6681AB'
const CREAM = '#F3E8E0'

const CONTENT_STATUS: Record<string, { bg: string; text: string; label: string }> = {
  pending:   { bg: '#FFF7ED', text: '#D97706', label: 'Pending' },
  submitted: { bg: '#EFF6FF', text: '#3B82F6', label: 'Submitted' },
  approved:  { bg: '#ECFDF5', text: '#059669', label: 'Approved ✓' },
  waived:    { bg: '#F9FAFB', text: '#9CA3AF', label: 'Waived' },
}

const CREATOR_AUDIENCES: AudienceType[] = ['influencer', 'media', 'wellness', 'celebrity']

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

export default function InfluencerTracking({ guests }: { guests: Guest[] }) {
  const [updating, setUpdating] = useState<string | null>(null)
  const [localGuests, setLocalGuests] = useState(guests)

  const creators = localGuests.filter(g => CREATOR_AUDIENCES.includes(g.audience_type))
  const confirmed = creators.filter(g => g.status === 'confirmed')
  const totalReach = creators.reduce((s, g) => s + (g.follower_count || 0), 0)
  const submitted = creators.filter(g => g.content_status === 'submitted' || g.content_status === 'approved')

  async function updateField(id: string, field: string, value: string | number | null) {
    setUpdating(id)
    setLocalGuests(gs => gs.map(g => g.id === id ? { ...g, [field]: value } : g))
    await fetch('/api/admin/update-guest', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, field, value }),
    })
    setUpdating(null)
  }

  return (
    <div>
      {/* Stats */}
      <SectionCard title="Creator overview">
        <div className="grid grid-cols-4 gap-4">
          {[
            { label: 'Creators invited', value: creators.length },
            { label: 'Confirmed attending', value: confirmed.length },
            { label: 'Estimated reach', value: totalReach > 0 ? `${(totalReach / 1000).toFixed(0)}k` : '—' },
            { label: 'Content submitted', value: `${submitted.length}/${creators.length}` },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl px-4 py-4 text-center" style={{ background: CREAM }}>
              <p className="text-3xl font-light mb-1" style={{ color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}>{value}</p>
              <p className="text-xs uppercase tracking-widest" style={{ color: '#9CA3AF', fontFamily: 'NeuePlak, sans-serif' }}>{label}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Creator table */}
      <SectionCard title={`Creator & media guests (${creators.length})`}>
        {creators.length === 0 ? (
          <p className="text-sm text-gray-400 italic">No influencer, media, wellness or celebrity guests added yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead>
                <tr className="text-left text-xs uppercase tracking-wider border-b border-gray-100" style={{ color: BLUE, fontFamily: 'NeuePlak, sans-serif' }}>
                  <th className="pb-3 pr-4">Guest</th>
                  <th className="pb-3 pr-4">Type</th>
                  <th className="pb-3 pr-4">Handle</th>
                  <th className="pb-3 pr-4 text-right">Followers</th>
                  <th className="pb-3 pr-4">Required posts</th>
                  <th className="pb-3 pr-4">Content status</th>
                  <th className="pb-3">Post links</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {creators.map(g => {
                  const status = CONTENT_STATUS[g.content_status || 'pending']
                  return (
                    <tr key={g.id} className="group">
                      <td className="py-3 pr-4">
                        <p className="font-medium" style={{ color: NAVY }}>{g.first_name} {g.last_name}</p>
                        <p className="text-xs text-gray-400">{g.company || '—'}</p>
                      </td>
                      <td className="py-3 pr-4 text-gray-500 whitespace-nowrap">{audienceLabels[g.audience_type]}</td>
                      <td className="py-3 pr-4">
                        <span className="text-xs" style={{ color: BLUE }}>{g.instagram_handle || '—'}</span>
                      </td>
                      <td className="py-3 pr-4 text-right">
                        <input
                          type="number"
                          defaultValue={g.follower_count || ''}
                          onBlur={e => updateField(g.id, 'follower_count', e.target.value ? parseInt(e.target.value) : null)}
                          placeholder="0"
                          className="w-24 text-right text-sm px-2 py-1 rounded border border-transparent hover:border-gray-200 focus:border-blue-300 outline-none"
                          style={{ color: NAVY }}
                        />
                      </td>
                      <td className="py-3 pr-4">
                        <input
                          type="text"
                          defaultValue={g.required_posts || ''}
                          onBlur={e => updateField(g.id, 'required_posts', e.target.value || null)}
                          placeholder="e.g. 1 feed + 3 stories"
                          className="w-full text-sm px-2 py-1 rounded border border-transparent hover:border-gray-200 focus:border-blue-300 outline-none"
                          style={{ color: NAVY }}
                        />
                      </td>
                      <td className="py-3 pr-4">
                        <select
                          value={g.content_status || 'pending'}
                          onChange={e => updateField(g.id, 'content_status', e.target.value)}
                          className="text-xs px-2 py-1.5 rounded-lg border border-gray-100 outline-none font-medium"
                          style={{ color: status.text, background: status.bg }}
                        >
                          {Object.entries(CONTENT_STATUS).map(([v, s]) => (
                            <option key={v} value={v}>{s.label}</option>
                          ))}
                        </select>
                      </td>
                      <td className="py-3">
                        <input
                          type="text"
                          defaultValue={g.post_links || ''}
                          onBlur={e => updateField(g.id, 'post_links', e.target.value || null)}
                          placeholder="Paste post URLs…"
                          className="w-full text-xs px-2 py-1 rounded border border-transparent hover:border-gray-200 focus:border-blue-300 outline-none text-gray-500"
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>

      {/* Post tracking note */}
      <SectionCard title="Posting requirements">
        <p className="text-sm text-gray-500 mb-4 leading-relaxed">
          Minimum posting requirements should be agreed with each creator prior to attendance. Update the fields above as content is received and approved.
        </p>
        <div className="grid grid-cols-3 gap-4">
          {Object.entries(CONTENT_STATUS).map(([key, style]) => {
            const count = creators.filter(g => (g.content_status || 'pending') === key).length
            return (
              <div key={key} className="rounded-xl px-4 py-3 flex items-center gap-3" style={{ background: style.bg }}>
                <p className="text-2xl font-light" style={{ color: style.text, fontFamily: 'Cotford, Georgia, serif' }}>{count}</p>
                <p className="text-xs font-medium" style={{ color: style.text }}>{style.label}</p>
              </div>
            )
          })}
        </div>
      </SectionCard>
    </div>
  )
}
