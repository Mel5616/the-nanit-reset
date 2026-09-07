import { Html, Head, Body, Container, Section, Text, Hr, Preview, Img } from '@react-email/components'
import { Guest } from '@/lib/supabase'

const NAVY = '#111D41'
const BLUE = '#6681AB'
const WHITE = '#FFFFFF'
const CREAM = '#FAF7F3'

export default function SaveTheDateEmail({ guest, baseUrl = '' }: { guest: Guest; baseUrl?: string }) {
  return (
    <Html>
      <Head />
      <Preview>Save the date, The Nanit Reset, 16 November 2026</Preview>
      <Body style={{ backgroundColor: NAVY, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', margin: 0, padding: 0 }}>
        <Section style={{ backgroundColor: BLUE, height: '4px', padding: 0 }} />
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 32px' }}>
          <Section style={{ textAlign: 'center', marginBottom: '36px' }}>
            <Img src={`${baseUrl}/nanit-logo-light.png`} alt="Nanit" width="110" style={{ margin: '0 auto', display: 'block' }} />
          </Section>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', textAlign: 'center', margin: '0 0 8px' }}>
            Save the date
          </Text>
          <Text style={{ color: WHITE, fontSize: '42px', fontWeight: '300', textAlign: 'center', margin: '0 0 8px', letterSpacing: '-0.5px', lineHeight: '1.2' }}>
            The Nanit Reset.
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', textAlign: 'center', margin: '0 0 48px', letterSpacing: '1px' }}>
            16 November 2026 · Sydney
          </Text>
          <Hr style={{ borderColor: BLUE, borderWidth: '1px', margin: '0 auto 48px', width: '48px' }} />
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', textAlign: 'center', lineHeight: '1.8', margin: '0 0 40px' }}>
            {guest.first_name}, we're holding a date for you.
          </Text>
          <Section style={{ backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: '14px', padding: '32px', marginBottom: '40px' }}>
            <Section style={{ marginBottom: '18px' }}>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 5px' }}>Date</Text>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', fontWeight: '500', margin: 0 }}>Monday, 16 November 2026</Text>
            </Section>
            <Section style={{ marginBottom: '18px' }}>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 5px' }}>Time</Text>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', margin: 0 }}>11:00am – 2:00pm</Text>
            </Section>
            <Section>
              <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 5px' }}>Location</Text>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '16px', margin: 0 }}>The Atrium, The Grounds of Alexandria, 7a / 2 Huntley Street, Alexandria NSW 2015</Text>
            </Section>
          </Section>
          <Text style={{ color: 'rgba(255,255,255,0.55)', fontSize: '14px', textAlign: 'center', lineHeight: '1.8', margin: '0 0 48px' }}>
            A formal invitation with full details will follow shortly.<br />
            In the meantime, please hold this date in your calendar.
          </Text>
          <Hr style={{ borderColor: BLUE, borderWidth: '1px', margin: '0 auto 32px', width: '48px' }} />
          <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', textAlign: 'center', lineHeight: '1.7', margin: 0 }}>
            Coolkidz Australia · events@coolkidz.com.au
          </Text>
        </Container>
        <Section style={{ backgroundColor: BLUE, height: '4px', padding: 0 }} />
      </Body>
    </Html>
  )
}
