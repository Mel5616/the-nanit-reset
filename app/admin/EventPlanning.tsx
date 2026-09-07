'use client'

import { useState, useEffect } from 'react'

const NAVY = '#111D41'
const BLUE = '#6681AB'
const CREAM = '#F3E8E0'

// ---------------------------------------------------------------------------
// Event data — from the V5.0 event deck. Venue is LOCKED.
// ---------------------------------------------------------------------------

const OVERVIEW: [string, string][] = [
  ['Date', 'Monday, 16 November 2026'],
  ['Time', '11:00am – 2:00pm'],
  ['Doors', '10:30am'],
  ['Venue', 'The Atrium, The Grounds of Alexandria'],
  ['Address', '7a / 2 Huntley Street, Alexandria NSW 2015'],
  ['Guests', '30–40 · invite only · adults only'],
  ['Format', 'Conversation + app + reset + gifting'],
  ['Keynote', 'Dr Natalie Barnett, VP Clinical Research, Nanit US'],
  ['Produced by', 'Coolkidz Australia'],
  ['RSVP by', 'Wednesday 4 November'],
]

const RUN_SHEET = [
  { time: '11:00', tag: 'Arrival · 20 min', activity: 'Arrival & welcome refreshments', detail: 'Herbal teas, coffee, soft wellness-led music. Guests settle into the styled space.' },
  { time: '11:20', tag: 'Welcome · 10 min', activity: 'Welcome & introduction', detail: 'Nanit in Australia, and what the next three hours are for.' },
  { time: '11:30', tag: 'Keynote · 40 min', activity: 'In conversation with Dr Natalie Barnett', detail: 'Hosted conversation, no panel. Sleep science, NextNap AI, the parental mental load, open questions.' },
  { time: '12:10', tag: 'Immersion · 30 min', activity: 'App immersion & one-on-one time', detail: 'Self-paced app stations, with real one-on-one time with Natalie built in here.' },
  { time: '12:40', tag: 'Lunch · 35 min', activity: 'Lunch & networking', detail: 'Sandwiches, fresh fruit, wraps and salad. The floor is reset for the wellness session in this window.' },
  { time: '13:15', tag: 'Reset · 40 min', activity: 'The Reset · puppy cuddles & breathwork with Paws & Me', detail: 'Puppies roaming the room, finishing as a puppy social. Breathwork session not confirmed.' },
  { time: '13:55', tag: 'Close · 2:00pm', activity: 'Gifting & close', detail: 'Bags handed over at the door. Creator wrap-up and content collection for anyone staying on.' },
]

type ActionStatus = 'not-started' | 'in-progress' | 'done'
const actionStatusStyles: Record<ActionStatus, { bg: string; text: string; label: string }> = {
  'not-started': { bg: '#F9FAFB', text: '#9CA3AF', label: 'Not started' },
  'in-progress': { bg: '#FFF7ED', text: '#F59E0B', label: 'In progress' },
  'done':        { bg: '#ECFDF5', text: '#059669', label: 'Done ✓' },
}

// All milestones owned by Coolkidz Australia.
const MILESTONES: { action: string; deadline: string; status: ActionStatus }[] = [
  { action: "Confirm Dr Natalie Barnett's attendance", deadline: 'Immediate', status: 'in-progress' },
  { action: 'Hold The Atrium, resolve minimums', deadline: 'Immediate', status: 'in-progress' },
  { action: 'Build and launch the event dashboard', deadline: 'Sept 2026', status: 'done' },
  { action: 'Confirm gifting, styling and photography briefs', deadline: 'Sept 2026', status: 'not-started' },
  { action: 'Confirm Paws & Me and venue dog approval', deadline: 'Sept 2026', status: 'not-started' },
  { action: 'Artwork the print suite and invitation', deadline: 'Sept 2026', status: 'not-started' },
  { action: 'Confirm host for the conversation', deadline: 'Sept 2026', status: 'not-started' },
  { action: 'Lock catering, dietaries and final quote', deadline: 'Sept 2026', status: 'not-started' },
  { action: 'Guest list (30–40 names) and save the dates', deadline: 'Sept 2026', status: 'not-started' },
  { action: 'Distribute formal invitations, open RSVPs', deadline: 'Oct 2026', status: 'not-started' },
  { action: 'Finalise run sheet and event day logistics', deadline: 'Oct 2026', status: 'not-started' },
  { action: 'Final numbers, name tags, bag assembly', deadline: 'Nov 2026', status: 'not-started' },
  { action: 'Post-event wrap report', deadline: '30 Nov 2026', status: 'not-started' },
]

const OPEN_ITEMS: { group: string; items: string[] }[] = [
  { group: 'People', items: [
    'Dr Natalie Barnett available Mon 16 Nov 2026',
    'Host for the conversation, not yet identified',
    'Photographer and social creator bookings',
    'Named media, creator and retail invite lists',
    'Stylist and florist confirmed against the zone spec',
  ]},
  { group: 'Venue & catering', items: [
    'Minimums: packages 50, food stations 80, we are 30–40',
    'November pricing (published rates expire 30 June 2026)',
    'Written approval for dogs on site, and food zoning',
    'Bump-in window and floor changeover during lunch',
  ]},
  { group: 'Activation & commercial', items: [
    'Paws & Me availability, cost, ratio, session length',
    'Public liability, waivers and allergy disclosure wording',
    'Total event budget and Nanit contribution',
    'Gift bag contents, quantities and partner inclusions',
    'Nanit product allocation for gifting, and logo files for print',
  ]},
]

const SUCCESS = [
  { value: '30', label: 'Confirmed guests', note: '90% attendance target' },
  { value: '20+', label: 'Social posts', note: 'Stories + feed, all guests' },
  { value: '3+', label: 'Editorial placements', note: 'Parenting / lifestyle / wellness' },
  { value: '3+', label: 'Retail accounts', note: 'Key partners in the room' },
]

// ---------------------------------------------------------------------------

function useLocalState<T>(key: string, initial: T): [T, (v: T | ((p: T) => T)) => void] {
  const [state, setState] = useState<T>(initial)
  useEffect(() => {
    try { const raw = localStorage.getItem(key); if (raw) setState(JSON.parse(raw)) } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    try { localStorage.setItem(key, JSON.stringify(state)) } catch {}
  }, [key, state])
  return [state, setState]
}

function SectionCard({ title, note, children }: { title: string; note?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-6">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-3" style={{ background: CREAM }}>
        <h2 className="font-semibold text-sm uppercase tracking-widest" style={{ color: NAVY, fontFamily: 'NeuePlak, sans-serif', letterSpacing: '0.12em' }}>{title}</h2>
        {note && <span className="text-xs" style={{ color: BLUE }}>{note}</span>}
      </div>
      <div className="p-6">{children}</div>
    </div>
  )
}

export default function EventPlanning() {
  const [statuses, setStatuses] = useLocalState<ActionStatus[]>('nanit_milestones', MILESTONES.map(m => m.status))
  const [checked, setChecked] = useLocalState<Record<string, boolean>>('nanit_open_items', {})

  const doneCount = statuses.filter(s => s === 'done').length
  const pct = Math.round((doneCount / statuses.length) * 100)

  return (
    <div>
      {/* Overview */}
      <SectionCard title="Event overview" note="Venue locked">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          {OVERVIEW.map(([label, value]) => (
            <div key={label} className="rounded-xl px-4 py-3" style={{ background: CREAM }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: BLUE, fontFamily: 'NeuePlak, sans-serif' }}>{label}</p>
              <p className="text-sm font-medium leading-snug" style={{ color: NAVY, fontFamily: 'BentonSans, sans-serif' }}>{value}</p>
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Venue (locked) */}
      <SectionCard title="Venue" note="Hold confirmed ✓">
        <div className="rounded-xl border border-gray-100 p-5">
          <div className="flex items-center gap-2 flex-wrap mb-2">
            <h3 className="font-semibold text-gray-900">The Atrium, The Grounds of Alexandria</h3>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium text-white" style={{ background: '#059669' }}>Locked</span>
          </div>
          <p className="text-xs text-gray-400 mb-3">Alexandria, Sydney · garden parlour, private laneway · 50–110 seated</p>
          <p className="text-sm text-gray-600 leading-relaxed mb-2">
            A garden parlour at The Grounds of Alexandria, accessed by its own private laneway. Hanging greenery, festoon lighting, brass finishes, sage and cream panelling, warm timber. Climate controlled, private bar, private amenities. 30–40 guests sit inside with room to breathe and to reconfigure the floor mid-event.
          </p>
          <p className="text-sm italic text-gray-500 mb-2">Still to resolve: minimum numbers, dogs on site, November pricing.</p>
          <a href="https://thegrounds.com.au" target="_blank" rel="noopener noreferrer" className="text-xs hover:underline" style={{ color: BLUE }}>thegrounds.com.au</a>
        </div>
      </SectionCard>

      {/* Run of show */}
      <SectionCard title="Run of show" note="Three hours, two rooms, one reset">
        <div className="relative">
          <div className="space-y-0">
            {RUN_SHEET.map(({ time, tag, activity, detail }, i) => (
              <div key={i} className="flex gap-5 pb-6 last:pb-0">
                <div className="w-12 shrink-0 text-right">
                  <span className="text-sm font-semibold whitespace-nowrap" style={{ color: NAVY }}>{time}</span>
                </div>
                <div className="relative pl-5 border-l border-gray-100">
                  <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full" style={{ background: BLUE }} />
                  <div className="flex items-center gap-2 flex-wrap mb-0.5">
                    <p className="text-sm font-semibold text-gray-900">{activity}</p>
                    <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: CREAM, color: BLUE }}>{tag}</span>
                  </div>
                  {detail && <p className="text-sm text-gray-500 leading-relaxed">{detail}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* Timeline & milestones */}
      <SectionCard title={`Timeline & next steps — ${doneCount} of ${statuses.length} done`} note="Owned by Coolkidz Australia">
        <div className="overflow-hidden rounded-xl border border-gray-100">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wider border-b border-gray-100" style={{ background: CREAM, color: BLUE, fontFamily: 'NeuePlak, sans-serif' }}>
                <th className="px-4 py-3">Milestone</th>
                <th className="px-4 py-3">Target</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {MILESTONES.map((m, i) => {
                const style = actionStatusStyles[statuses[i]]
                return (
                  <tr key={i} className={`border-b border-gray-50 last:border-0 ${statuses[i] === 'done' ? 'opacity-60' : ''}`}>
                    <td className="px-4 py-3 text-gray-900">{m.action}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{m.deadline}</td>
                    <td className="px-4 py-3">
                      <select value={statuses[i]} onChange={e => setStatuses(s => s.map((v, j) => j === i ? e.target.value as ActionStatus : v))}
                        className="text-xs border border-gray-200 rounded-lg px-2 py-1 font-medium" style={{ color: style.text, background: style.bg }}>
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
            <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: BLUE }} />
          </div>
          <p className="text-xs text-gray-400 mt-1">{pct}% complete</p>
        </div>
      </SectionCard>

      {/* Open items */}
      <SectionCard title="Open items · to confirm" note="Nothing here is invented — it has to land before final">
        <div className="grid gap-5 md:grid-cols-3">
          {OPEN_ITEMS.map(group => (
            <div key={group.group}>
              <p className="text-xs uppercase tracking-widest mb-3" style={{ color: BLUE, fontFamily: 'NeuePlak, sans-serif' }}>{group.group}</p>
              <ul className="space-y-2">
                {group.items.map(item => {
                  const key = `${group.group}:${item}`
                  const on = !!checked[key]
                  return (
                    <li key={item}>
                      <label className="flex gap-2.5 items-start cursor-pointer">
                        <input type="checkbox" checked={on} onChange={e => setChecked(c => ({ ...c, [key]: e.target.checked }))} className="mt-0.5" />
                        <span className={`text-sm leading-snug ${on ? 'line-through text-gray-300' : 'text-gray-600'}`}>{item}</span>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-5 rounded-xl p-4" style={{ background: '#FFF7ED', border: '1px solid #FCE7C8' }}>
          <p className="text-xs uppercase tracking-widest mb-1" style={{ color: '#B45309', fontFamily: 'NeuePlak, sans-serif' }}>Production flag</p>
          <p className="text-sm text-gray-700 leading-relaxed">
            Puppy cuddles and a food station in the same room on the same afternoon is the biggest logistical question. Recommendation: food service inside The Atrium, the reset session in the laneway or a separated zone, with a clean changeover. If the venue will not approve dogs, the fallback is a massage or stretch session in the same window.
          </p>
        </div>
      </SectionCard>

      {/* Success measures */}
      <SectionCard title="What great looks like" note="The floor, not the ceiling">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {SUCCESS.map(s => (
            <div key={s.label} className="rounded-xl px-4 py-5 text-center" style={{ background: CREAM }}>
              <p className="text-3xl font-light mb-1" style={{ color: NAVY, fontFamily: 'Cotford, Georgia, serif' }}>{s.value}</p>
              <p className="text-sm font-medium" style={{ color: NAVY }}>{s.label}</p>
              <p className="text-xs text-gray-400 mt-1">{s.note}</p>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  )
}
