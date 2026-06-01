import { createClient } from '@supabase/supabase-js'

export type AudienceType = 'influencer' | 'media' | 'wellness' | 'hcp' | 'retail' | 'celebrity'
export type GuestStatus = 'pending' | 'invited' | 'confirmed' | 'declined' | 'waitlist'

export interface Guest {
  id: string
  created_at: string
  first_name: string
  last_name: string
  email: string
  audience_type: AudienceType
  company: string | null
  instagram_handle: string | null
  phone: string | null
  notes: string | null
  dietary_requirements: string | null
  goody_bag: string | null
  speaker_session: boolean
  status: GuestStatus
  invite_token: string
  invite_sent_at: string | null
  rsvp_confirmed_at: string | null
  added_by: string | null
  checked_in: boolean
  checked_in_at: string | null
  follower_count: number | null
  required_posts: string | null
  post_links: string | null
  content_status: string | null
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export function getServiceClient() {
  return createClient(supabaseUrl, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}
