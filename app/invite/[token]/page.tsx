import { supabase, Guest } from '@/lib/supabase'
import InviteClient from './InviteClient'

export const dynamic = 'force-dynamic'

async function getGuest(token: string): Promise<Guest | null> {
  const { data } = await supabase
    .from('guests')
    .select('*')
    .eq('invite_token', token)
    .single()
  return data
}

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const guest = await getGuest(token)

  if (!guest) {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#111D41' }}>
        <div className="text-center px-8 py-16 max-w-md">
          <p className="text-white/40 text-sm uppercase tracking-widest mb-4" style={{ fontFamily: 'NeuePlak, sans-serif' }}>The Nanit Reset</p>
          <h1 className="text-white text-2xl font-light mb-4" style={{ fontFamily: 'Cotford, Georgia, serif' }}>This invitation link isn't valid.</h1>
          <p className="text-white/50 text-sm leading-relaxed" style={{ fontFamily: 'BentonSans, sans-serif' }}>
            If you believe this is an error, please contact the Coolkidz team.
          </p>
        </div>
      </main>
    )
  }

  if (guest.status === 'confirmed') {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#111D41' }}>
        <div className="text-center px-8 py-16 max-w-lg">
          <div className="w-12 h-px mx-auto mb-8" style={{ background: '#6681AB' }} />
          <p className="text-white/40 text-sm uppercase tracking-widest mb-6" style={{ fontFamily: 'NeuePlak, sans-serif' }}>The Nanit Reset</p>
          <h1 className="text-white text-3xl font-light mb-4" style={{ fontFamily: 'Cotford, Georgia, serif' }}>You're already confirmed.</h1>
          <p className="text-white/60 leading-relaxed" style={{ fontFamily: 'BentonSans, sans-serif' }}>
            We have you down for 15 November 2026. We'll be in touch with venue details closer to the date.
          </p>
          <div className="w-12 h-px mx-auto mt-8" style={{ background: '#6681AB' }} />
        </div>
      </main>
    )
  }

  if (guest.status === 'declined') {
    return (
      <main className="min-h-screen flex items-center justify-center" style={{ background: '#111D41' }}>
        <div className="text-center px-8 py-16 max-w-lg">
          <p className="text-white/40 text-sm uppercase tracking-widest mb-6" style={{ fontFamily: 'NeuePlak, sans-serif' }}>The Nanit Reset</p>
          <h1 className="text-white text-3xl font-light mb-4" style={{ fontFamily: 'Cotford, Georgia, serif' }}>Thanks for letting us know.</h1>
          <p className="text-white/60 leading-relaxed" style={{ fontFamily: 'BentonSans, sans-serif' }}>
            We're sorry you can't make it. We hope to see you at a future Nanit event.
          </p>
        </div>
      </main>
    )
  }

  return <InviteClient guest={guest} />
}
