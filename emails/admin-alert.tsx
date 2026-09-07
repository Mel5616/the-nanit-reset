import { Html, Head, Body, Container, Section, Text, Hr, Preview } from '@react-email/components'
import { Guest } from '@/lib/supabase'
import { audienceLabels } from '@/lib/invite-content'

const NAVY = '#111D41'
const BLUE = '#6681AB'

export default function AdminAlertEmail({ guest, action }: { guest: Guest; action: 'confirmed' | 'declined' }) {
  const isConfirmed = action === 'confirmed'
  return (
    <Html>
      <Head />
      <Preview>{guest.first_name} {guest.last_name} has {isConfirmed ? 'confirmed' : 'declined'}, The Nanit Reset</Preview>
      <Body style={{ backgroundColor: '#FAF7F3', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 16px rgba(17,29,65,0.08)' }}>
            <div style={{ height: '4px', background: isConfirmed ? '#059669' : '#DC2626' }} />
            <div style={{ padding: '32px' }}>
              <Text style={{ color: NAVY, fontSize: '20px', fontWeight: '600', margin: '0 0 4px' }}>
                {guest.first_name} {guest.last_name} has {isConfirmed ? '✓ confirmed' : '✗ declined'}
              </Text>
              <Text style={{ color: '#6B7280', fontSize: '13px', margin: '0 0 24px' }}>
                The Nanit Reset · {new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
              </Text>
              <Hr style={{ borderColor: '#E5E7EB', margin: '0 0 24px' }} />
              {([
                ['Audience', audienceLabels[guest.audience_type]],
                ['Company', guest.company || guest.instagram_handle || '—'],
                ['Email', guest.email],
                guest.dietary_requirements ? ['Dietary', guest.dietary_requirements] : null,
                guest.goody_bag ? ['Goody bag', guest.goody_bag] : null,
                guest.speaker_session ? ['Speaker session', 'One-on-one with Dr Natalie'] : null,
              ].filter((x): x is string[] => x !== null)).map(([label, value]) => (
                <Section key={label as string} style={{ marginBottom: '12px', display: 'flex' }}>
                  <Text style={{ color: '#9CA3AF', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 2px' }}>{label}</Text>
                  <Text style={{ color: NAVY, fontSize: '14px', margin: 0 }}>{value}</Text>
                </Section>
              ))}
              <Hr style={{ borderColor: '#E5E7EB', margin: '24px 0 16px' }} />
              <Text style={{ color: '#9CA3AF', fontSize: '12px', textAlign: 'center', margin: 0 }}>
                View the full guest list at your admin dashboard.
              </Text>
            </div>
          </div>
        </Container>
      </Body>
    </Html>
  )
}
