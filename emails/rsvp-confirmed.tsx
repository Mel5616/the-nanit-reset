import { Html, Head, Body, Container, Section, Text, Hr, Preview, Img } from '@react-email/components'
import { Guest } from '@/lib/supabase'

const NAVY = '#111D41'
const BLUE = '#6681AB'
const WHITE = '#FFFFFF'

export default function RsvpConfirmedEmail({ guest, baseUrl = '' }: { guest: Guest; baseUrl?: string }) {
  return (
    <Html>
      <Head />
      <Preview>You're confirmed for The Nanit Reset — 15 November 2026</Preview>
      <Body style={{ backgroundColor: NAVY, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', margin: 0, padding: 0 }}>
        <Section style={{ backgroundColor: BLUE, height: '4px', padding: 0 }} />
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 32px' }}>
          <Section style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Img src={`${baseUrl}/nanit-logo-light.png`} alt="Nanit" width="120" style={{ margin: '0 auto', display: 'block' }} />
          </Section>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', textAlign: 'center', margin: '0 0 12px' }}>
            The Nanit Reset
          </Text>
          <Text style={{ color: WHITE, fontSize: '36px', fontWeight: '300', textAlign: 'center', margin: '0 0 32px' }}>
            You're confirmed.
          </Text>
          <Hr style={{ borderColor: BLUE, borderWidth: '1px', margin: '0 auto 40px', width: '48px' }} />
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', textAlign: 'center', lineHeight: '1.7', margin: '0 0 40px' }}>
            {guest.first_name}, we have you down for The Nanit Reset.<br />
            We're looking forward to seeing you there.
          </Text>
          <Section style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '32px', marginBottom: '32px' }}>
            {[
              ['Date', 'Saturday, 15 November 2026'],
              ['Time', '10:00am – 1:00pm'],
              ['Location', 'Sydney, NSW — venue details to follow'],
            ].map(([label, value]) => (
              <Section key={label} style={{ marginBottom: '16px' }}>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 4px' }}>{label}</Text>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', margin: 0 }}>{value}</Text>
              </Section>
            ))}
          </Section>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', textAlign: 'center', margin: 0 }}>
            Questions? Contact us at events@coolkidz.com.au
          </Text>
        </Container>
        <Section style={{ backgroundColor: BLUE, height: '4px', padding: 0 }} />
      </Body>
    </Html>
  )
}
