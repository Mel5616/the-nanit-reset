import { Html, Head, Body, Container, Section, Text, Hr, Preview, Img } from '@react-email/components'
import { Guest } from '@/lib/supabase'

const NAVY = '#111D41'
const BLUE = '#6681AB'
const WHITE = '#FFFFFF'

export default function RsvpDeclinedEmail({ guest, baseUrl = '' }: { guest: Guest; baseUrl?: string }) {
  return (
    <Html>
      <Head />
      <Preview>Thank you, The Nanit Reset</Preview>
      <Body style={{ backgroundColor: NAVY, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', margin: 0, padding: 0 }}>
        <Section style={{ backgroundColor: BLUE, height: '4px', padding: 0 }} />
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 32px' }}>
          <Section style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Img src={`${baseUrl}/nanit-logo-light.png`} alt="Nanit" width="120" style={{ margin: '0 auto', display: 'block' }} />
          </Section>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', textAlign: 'center', margin: '0 0 12px' }}>
            The Nanit Reset
          </Text>
          <Text style={{ color: WHITE, fontSize: '32px', fontWeight: '300', textAlign: 'center', margin: '0 0 32px' }}>
            Thanks for letting us know.
          </Text>
          <Hr style={{ borderColor: BLUE, borderWidth: '1px', margin: '0 auto 40px', width: '48px' }} />
          <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '16px', textAlign: 'center', lineHeight: '1.7', margin: 0 }}>
            {guest.first_name}, we're sorry you can't make it this time.<br />
            We hope to see you at a future Nanit event.
          </Text>
        </Container>
        <Section style={{ backgroundColor: BLUE, height: '4px', padding: 0 }} />
      </Body>
    </Html>
  )
}
