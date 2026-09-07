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

// A sample guest used for the dashboard "Preview invitation" link.
const PREVIEW_GUEST = {
  id: 'preview', invite_token: 'preview', first_name: 'Dorothee', last_name: '',
  status: 'invited', email: '', audience_type: 'influencer',
} as unknown as Guest

export default async function InvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params

  if (token === 'preview') {
    return <InviteClient guest={PREVIEW_GUEST} preview />
  }

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

  return <InviteClient guest={guest} />
}
