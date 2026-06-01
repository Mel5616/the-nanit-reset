import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/auth'
import { getServiceClient } from '@/lib/supabase'
import { audienceLabels } from '@/lib/invite-content'
import { AudienceType } from '@/lib/supabase'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

const AUDIENCE_COLORS: Record<AudienceType, string> = {
  influencer: '#6681AB',
  media:      '#204977',
  wellness:   '#BDD4E7',
  hcp:        '#EDB39A',
  retail:     '#EFC973',
  celebrity:  '#111D41',
}

const AUDIENCE_TEXT: Record<AudienceType, string> = {
  influencer: '#FFFFFF',
  media:      '#FFFFFF',
  wellness:   '#111D41',
  hcp:        '#111D41',
  retail:     '#111D41',
  celebrity:  '#FFFFFF',
}

export default async function BadgesPage() {
  if (!(await isAdminAuthenticated())) redirect('/admin/login')

  const db = getServiceClient()
  const { data: guests } = await db
    .from('guests')
    .select('*')
    .eq('status', 'confirmed')
    .order('last_name', { ascending: true })

  const byAudience = (Object.keys(audienceLabels) as AudienceType[]).map(k => ({
    key: k,
    label: audienceLabels[k],
    guests: (guests || []).filter(g => g.audience_type === k),
  })).filter(g => g.guests.length > 0)

  return (
    <>
      {/* Print controls — hidden when printing */}
      <div className="no-print fixed top-0 left-0 right-0 z-50 flex items-center gap-4 px-6 py-3 bg-white border-b border-gray-200 shadow-sm">
        <Link href="/admin" className="text-sm text-gray-500 hover:text-gray-700">← Admin</Link>
        <div className="flex-1">
          <p className="text-sm font-medium" style={{ color: '#111D41' }}>Name badges — {guests?.length || 0} confirmed guests</p>
          <p className="text-xs text-gray-400">Sorted by audience type · Print to PDF at 100% scale · A6 / postcard size</p>
        </div>
        <button
          onClick={() => typeof window !== 'undefined' && window.print()}
          className="px-5 py-2 rounded-full text-white text-sm font-medium"
          style={{ background: '#6681AB' }}>
          Print / Save PDF
        </button>
      </div>

      <div className="no-print" style={{ height: 64 }} />

      {/* Badge grid */}
      <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
        {(guests || []).length === 0 ? (
          <div className="no-print text-center py-20 text-gray-400">
            <p>No confirmed guests yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '16px', maxWidth: 1200, margin: '0 auto' }}>
            {byAudience.flatMap(({ key, label, guests: g }) =>
              g.map(guest => {
                const color = AUDIENCE_COLORS[key]
                const textColor = AUDIENCE_TEXT[key]
                return (
                  <div key={guest.id} style={{
                    width: '240px',
                    height: '150px',
                    background: '#FAF7F3',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
                    display: 'flex',
                    flexDirection: 'column',
                    pageBreakInside: 'avoid',
                    breakInside: 'avoid',
                  }}>
                    {/* Colour bar top */}
                    <div style={{ height: 6, background: color, flexShrink: 0 }} />

                    {/* Content */}
                    <div style={{ flex: 1, padding: '14px 16px 10px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                      <div>
                        <p style={{ fontFamily: 'Cotford, Georgia, serif', fontSize: 22, fontWeight: 300, color: '#111D41', margin: 0, lineHeight: 1.2 }}>
                          {guest.first_name}
                        </p>
                        <p style={{ fontFamily: 'BentonSans, Helvetica, sans-serif', fontSize: 14, fontWeight: 500, color: '#111D41', margin: '2px 0 0', letterSpacing: '0.01em' }}>
                          {guest.last_name}
                        </p>
                        {guest.company && (
                          <p style={{ fontFamily: 'BentonSans, Helvetica, sans-serif', fontSize: 11, color: '#9CA3AF', margin: '4px 0 0' }}>
                            {guest.company}
                          </p>
                        )}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        {/* Nanit logo mark (just the wordmark text since we can't embed image easily) */}
                        <span style={{ fontFamily: 'NeuePlak, Helvetica, sans-serif', fontSize: 9, color: '#9CA3AF', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                          nanit
                        </span>
                        <div style={{ flex: 1 }} />
                        {/* Audience pill */}
                        <span style={{
                          background: color, color: textColor,
                          fontSize: 9, padding: '3px 8px', borderRadius: 20,
                          fontFamily: 'NeuePlak, Helvetica, sans-serif',
                          letterSpacing: '0.08em', textTransform: 'uppercase',
                        }}>
                          {label}
                        </span>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>
        )}
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
          @page { size: A4; margin: 10mm; }
        }
      `}</style>
    </>
  )
}
