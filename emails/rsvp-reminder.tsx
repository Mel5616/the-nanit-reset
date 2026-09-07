import { Html, Head, Body, Container, Section, Text, Button, Hr, Preview, Img } from '@react-email/components'
import { Guest } from '@/lib/supabase'
import { inviteContent } from '@/lib/invite-content'

const NAVY = '#111D41'
const BLUE = '#6681AB'
const WHITE = '#FFFFFF'

export default function RsvpReminderEmail({ guest, baseUrl }: { guest: Guest; baseUrl: string }) {
  const content = inviteContent[guest.audience_type]
  const inviteUrl = `${baseUrl}/invite/${guest.invite_token}`

  return (
    <Html>
      <Head />
      <Preview>A gentle reminder, The Nanit Reset, 16 November 2026</Preview>
      <Body style={{ backgroundColor: NAVY, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', margin: 0, padding: 0 }}>
        <Section style={{ backgroundColor: BLUE, height: '4px', padding: 0 }} />
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 32px' }}>
          <Section style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Img src={`${baseUrl}/nanit-logo-light.png`} alt="Nanit" width="120" style={{ margin: '0 auto', display: 'block' }} />
          </Section>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', textAlign: 'center', margin: '0 0 12px' }}>
            A gentle reminder
          </Text>
          <Text style={{ color: WHITE, fontSize: '36px', fontWeight: '300', textAlign: 'center', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            The Nanit Reset.
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textAlign: 'center', margin: '0 0 40px', letterSpacing: '1px' }}>
            16 November 2026 · Sydney
          </Text>

          <Hr style={{ borderColor: BLUE, borderWidth: '1px', margin: '0 auto 40px', width: '48px' }} />

          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', textAlign: 'center', lineHeight: '1.7', margin: '0 0 40px' }}>
            {guest.first_name}, we sent you an invitation a little while ago and wanted to follow up.{' '}
            We'd love to know if you can join us, places are limited and we're confirming final numbers.
          </Text>

          <Section style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '24px', marginBottom: '32px' }}>
            {[
              ['Date', 'Monday, 16 November 2026'],
              ['Time', '11:00am – 2:00pm'],
              ['Location', 'The Atrium, The Grounds of Alexandria, 7a / 2 Huntley Street, Alexandria NSW 2015'],
            ].map(([label, value]) => (
              <Section key={label} style={{ marginBottom: '14px' }}>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 4px' }}>{label}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', margin: 0 }}>{value}</Text>
              </Section>
            ))}
          </Section>

          <Section style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Button href={inviteUrl}
              style={{ backgroundColor: BLUE, color: WHITE, padding: '16px 40px', borderRadius: '100px', fontSize: '14px', fontWeight: '500', textDecoration: 'none', letterSpacing: '0.5px' }}>
              Open my invitation
            </Button>
          </Section>

          <Hr style={{ borderColor: BLUE, borderWidth: '1px', margin: '0 auto 32px', width: '48px' }} />

          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', textAlign: 'center', lineHeight: '1.7', margin: 0 }}>
            If you can't make it, simply open your invitation and let us know, no pressure at all.
          </Text>
        </Container>
        <Section style={{ backgroundColor: BLUE, height: '4px', padding: 0 }} />
      </Body>
    </Html>
  )
}
