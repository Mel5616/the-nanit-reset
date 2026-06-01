'use client'

import { useState } from 'react'

const NAVY = '#111D41'
const BLUE = '#6681AB'

type VenueStatus = 'shortlisted' | 'inspecting' | 'confirmed' | 'not-selected'

const statusStyles: Record<VenueStatus, { bg: string; text: string; label: string }> = {
  shortlisted:   { bg: '#EFF6FF', text: '#3B82F6', label: 'Shortlisted' },
  inspecting:    { bg: '#FFF7ED', text: '#F59E0B', label: 'Inspecting' },
  confirmed:     { bg: '#ECFDF5', text: '#059669', label: 'Confirmed ✓' },
  'not-selected':{ bg: '#F9FAFB', text: '#9CA3AF', label: 'Not selected' },
}

const VENUES = [
  {
    name: 'Reset Studio, Double Bay',
    tag: '⭐ Hero recommendation',
    tagColor: NAVY,
    description: 'A boutique wellness sanctuary designed to feel more like a refined private residence than a commercial facility. Cedar saunas, a halotherapy salt cave built from blocks of Himalayan salt, vitamin C-infused showers, eucalyptus steam rooms and beautifully designed private contrast therapy rooms — all within a deliberately intimate, design-led space.',
    why: 'If the event is called The Nanit Reset, there is no better room to hold it in. The stone-and-salt aesthetic is perfectly on-brief, and Double Bay is exactly the right address for this guest list.',
    url: 'resetstudio.com.au',
    capacity: 'Intimate — private event hire',
    location: 'Double Bay, Sydney',
  },
  {
    name: 'Palm House, Royal Botanic Garden',
    tag: 'Heritage venue',
    tagColor: '#6B7280',
    description: "NSW's oldest glasshouse, built in 1876 and set within the Royal Botanic Garden at the edge of Sydney Harbour. Flooded with natural light through its Victorian-era glass structure. Available for exclusive private hire for up to 120 guests at cocktail capacity. Arrives as a bare site — bring your own furniture, styling and catering.",
    why: 'Low couches, trailing botanicals, warm lighting and a Nanit-branded wellness fitout would transform this into something genuinely extraordinary. One of Sydney\'s most beautiful and underused event spaces.',
    url: 'botanicgardens.org.au',
    capacity: 'Up to 120 cocktail',
    location: 'Royal Botanic Garden, Sydney CBD',
  },
  {
    name: 'The Atrium, The Grounds of Alexandria',
    tag: 'Highest content value',
    tagColor: '#6B7280',
    description: 'A Parisian-inspired indoor garden parlour at The Grounds of Alexandria. Enveloped in hanging greenery with antique flourishes, brass finishes, sage and cream wall panelling, warm timber and ambient light. Seated capacity 40–80, cocktail up to 150. Climate controlled, private bar, private amenities, outdoor laneway for arrivals.',
    why: 'Organically content-ready and naturally Instagram-friendly without feeling staged. The Grounds has extensive in-house catering.',
    url: 'thegrounds.com.au/venues/the-atrium',
    capacity: '40–80 seated, 150 cocktail',
    location: 'Alexandria, Sydney',
  },
  {
    name: 'The Atrium, West Hotel Sydney',
    tag: 'Strongest practical option',
    tagColor: '#6B7280',
    description: 'A hidden open-air atrium in the heart of the CBD beside Darling Harbour. Lush greenery, festoon lighting and bespoke botanical motifs. Connects directly with Solander Dining and Bar for seamless indoor/outdoor flow. AV included, in-house catering and setup, easy access from across Sydney.',
    why: 'A strong practical choice that also looks beautiful on camera. The Barangaroo/Darling Harbour location is easy for guests from across Sydney.',
    url: 'westhotelsydney.com.au',
    capacity: 'Flexible — CBD location',
    location: 'Darling Harbour, Sydney CBD',
  },
]

const RUN_SHEET = [
  { time: '10:00am', activity: 'Guest arrival', detail: 'Welcome refreshments — herbal teas, nourishing bites, soft wellness-inspired music. Guests settle in, mingle and explore the styled space.' },
  { time: '10:20am', activity: 'Welcome & introduction', detail: 'Welcome from the Coolkidz Australia team. Overview of Nanit in Australia and The Nanit Reset.' },
  { time: '10:35am', activity: "Expert Panel: 'On the Couch'", detail: 'Dr Natalie Barnett + guest panelist/s. Facilitated conversation covering sleep science, parenting tech, emotional wellbeing and the Nanit Effect. Q&A from the room.' },
  { time: '11:30am', activity: 'App Immersion Experience', detail: 'Guided walkthrough of the Nanit app and NextNap AI. Hands-on stations for guests to explore. One-on-one time with Natalie and experts built in here.' },
  { time: '12:00pm', activity: 'Open networking & content creation', detail: 'Individual time with panelists. Styled moments throughout venue encourage organic social content.' },
  { time: '12:40pm', activity: 'Gifting', detail: 'Curated gift bags presented to all guests. Includes Nanit product, wellness items and digital media kit access.' },
  { time: '1:00pm', activity: 'Close', detail: '' },
]

type ActionStatus = 'not-started' | 'in-progress' | 'done'

const actionStatusStyles: Record<ActionStatus, { bg: string; text: string; label: string }> = {
  'not-started': { bg: '#F9FAFB', text: '#9CA3AF', label: 'Not started' },
  'in-progress': { bg: '#FFF7ED', text: '#F59E0B', label: 'In progress' },
  'done':        { bg: '#ECFDF5', text: '#059669', label: 'Done ✓' },
}

// Diaper Cream used for overview card backgrounds
const DIAPER_CREAM = '#F3E8E0'

const ACTIONS_INITIAL = [
  { action: 'Confirm Dr Natalie Barnett\'s attendance', owner: 'Coolkidz Australia', deadline: 'ASAP', status: 'not-started' as ActionStatus },
  { action: 'Shortlist and inspect Sydney venues', owner: 'Coolkidz Australia / PR Agency', deadline: 'June 2026', status: 'not-started' as ActionStatus },
  { action: 'Confirm venue and date', owner: 'Coolkidz Australia', deadline: 'July 2026', status: 'not-started' as ActionStatus },
  { action: 'Identify and confirm additional panelist/s', owner: 'Coolkidz Australia / PR Agency', deadline: 'July 2026', status: 'not-started' as ActionStatus },
  { action: 'Develop guest list (30 names)', owner: 'Coolkidz Australia + PR Agency', deadline: 'August 2026', status: 'not-started' as ActionStatus },
  { action: 'Send save the dates to confirmed guests', owner: 'PR Agency', deadline: 'August 2026', status: 'not-started' as ActionStatus },
  { action: 'Confirm gifting, styling and photography briefs', owner: 'Coolkidz Australia', deadline: 'September 2026', status: 'not-started' as ActionStatus },
  { action: 'Finalise run sheet and event day logistics', owner: 'PR Agency', deadline: 'October 2026', status: 'not-started' as ActionStatus },
  { action: 'Distribute formal invitations', owner: 'PR Agency', deadline: 'October 2026', status: 'not-started' as ActionStatus },
  { action: 'Event day', owner: 'All', deadline: '15 November 2026', status: 'not-started' as ActionStatus },
  { action: 'Post-event wrap report', owner: 'PR Agency', deadline: '29 November 2026', status: 'not-started' as ActionStatus },
]

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100" style={{ background: '#F3E8E0' }}>
        <h2 className="font-semibold text-sm uppercase tracking-widest" style={{ color: NAVY, fontFamily: 'NeuePlak, sans-serif', letterSpacing: '0.12em' }}>{title}</h2>
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export default function EventPlanning() {
  const [venueStatuses, setVenueStatuses] = useState<Record<string, VenueStatus>>({
    'Reset Studio, Double Bay': 'shortlisted',
    'Palm House, Royal Botanic Garden': 'shortlisted',
    'The Atrium, The Grounds of Alexandria': 'shortlisted',
    'The Atrium, West Hotel Sydney': 'shortlisted',
  })
  const [actions, setActions] = useState(ACTIONS_INITIAL)

  function setVenueStatus(name: string, status: VenueStatus) {
    setVenueStatuses(s => ({ ...s, [name]: status }))
  }

  function setActionStatus(index: number, status: ActionStatus) {
    setActions(a => a.map((item, i) => i === index ? { ...item, status } : item))
  }

  const doneCount = actions.filter(a => a.status === 'done').length

  return (
    <div>
      {/* Key event details */}
      <SectionCard title="Event overview">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { label: 'Date', value: 'Saturday, 15 November 2026' },
            { label: 'Time', value: '10:00am – 1:00pm' },
            { label: 'Location', value: 'Sydney, NSW' },
            { label: 'Format', value: 'Expert panel · App experience · Gifting' },
            { label: 'Guest count', value: '~30 (curated, invite-only)' },
            { label: 'Keynote speaker', value: 'Dr Natalie Barnett, VP Clinical Research, Nanit US' },
            { label: 'Hosted by', value: 'Coolkidz Australia' },
            { label: 'Venue status', value: Object.values(venueStatuses).includes('confirmed') ? '✓ Confirmed' : 'TBC' },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-xl px-4 py-3" style={{ background: '#F3E8E0' }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#6681AB', fontFamily: 'NeuePlak, sans-serif' }}>{label}</p>
              <p className="text-sm font-medium leading-snug" style={{ color: '#111D41', fontFamily: 'BentonSans, sans-serif' }}>{value}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Venue shortlist */}
      <SectionCard title="Venue shortlist">
        <div className="space-y-4">
          {VENUES.map(v => {
            const status = venueStatuses[v.name] || 'shortlisted'
            const style = statusStyles[status]
            return (
              <div key={v.name} className="rounded-xl border border-gray-100 p-5">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <h3 className="font-semibold text-gray-900">{v.name}</h3>
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ background: v.tagColor }}>{v.tag}</span>
                    </div>
                    <p className="text-xs text-gray-400">{v.location} · {v.capacity}</p>
                  </div>
                  <select
                    value={status}
                    onChange={e => setVenueStatus(v.name, e.target.value as VenueStatus)}
                    className="text-xs border border-gray-200 rounded-lg px-3 py-1.5 font-medium shrink-0"
                    style={{ color: style.text, background: style.bg }}
                  >
                    <option value="shortlisted">Shortlisted</option>
                    <option value="inspecting">Inspecting</option>
                    <option value="confirmed">Confirmed ✓</option>
                    <option value="not-selected">Not selected</option>
                  </select>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed mb-2">{v.description}</p>
                <p className="text-sm text-gray-500 italic leading-relaxed mb-2">Why it works: {v.why}</p>
                <a href={`https://${v.url}`} target="_blank" rel="noopener noreferrer"
                  className="text-xs hover:underline" style={{ color: BLUE }}>{v.url}</a>
              </div>
            )
          })}
        </div>
      </SectionCard>

      {/* Run sheet */}
      <SectionCard title="Event run sheet">
        <div className="relative">
          <div className="absolute left-20 top-0 bottom-0 w-px bg-gray-100" />
          <div className="space-y-0">
            {RUN_SHEET.map(({ time, activity, detail }, i) => (
              <div key={i} className="flex gap-6 pb-6 last:pb-0">
                <div className="w-14 shrink-0 text-right">
                  <span className="text-xs font-semibold text-gray-400 whitespace-nowrap">{time}</span>
                </div>
                <div className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-2.5 h-2.5 rounded-full border-2 border-white ring-2" style={{ background: BLUE, ringColor: BLUE }} />
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">{activity}</p>
                  {detail && <p className="text-sm text-gray-500 leading-relaxed">{detail}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Action items */}
      <SectionCard title={`Action items — ${doneCount} of ${actions.length} complete`}>
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider border-b border-gray-100" style={{ background: '#F3E8E0', color: '#6681AB', fontFamily: 'NeuePlak, sans-serif' }}>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Deadline</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {actions.map((a, i) => {
                const style = actionStatusStyles[a.status]
                return (
                  <tr key={i} className={`border-b border-gray-50 last:border-0 ${a.status === 'done' ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3 text-gray-900">{a.action}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{a.owner}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{a.deadline}</td>
                    <td className="px-4 py-3">
                      <select
                        value={a.status}
                        onChange={e => setActionStatus(i, e.target.value as ActionStatus)}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 font-medium"
                        style={{ color: style.text, background: style.bg }}
                      >
                        <option value="not-started">Not started</option>
                        <option value="in-progress">In progress</option>
                        <option value="done">Done ✓</option>
                      </select>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all" style={{ width: `${Math.round((doneCount / actions.length) * 100)}%`, background: BLUE }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{Math.round((doneCount / actions.length) * 100)}% complete</p>
        </div>
      </SectionCard>
    </div>
  )
}
