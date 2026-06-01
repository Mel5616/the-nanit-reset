import { Html, Head, Body, Container, Section, Text, Hr, Preview, Img } from '@react-email/components'
import { Guest } from '@/lib/supabase'

const NAVY = '#111D41'
const BLUE = '#6681AB'
const WHITE = '#FFFFFF'

export default function ThankYouEmail({ guest, baseUrl = '' }: { guest: Guest; baseUrl?: string }) {
  return (
    <Html>
      <Head />
      <Preview>Thank you for joining us — The Nanit Reset</Preview>
      <Body style={{ backgroundColor: NAVY, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', margin: 0, padding: 0 }}>
        <Section style={{ backgroundColor: BLUE, height: '4px', padding: 0 }} />
        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 32px' }}>
          <Section style={{ textAlign: 'center', marginBottom: '36px' }}>
            <Img src={`${baseUrl}/nanit-logo-light.png`} alt="Nanit" width="110" style={{ margin: '0 auto', display: 'block' }} />
          </Section>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', textAlign: 'center', margin: '0 0 12px' }}>
            The Nanit Reset · 15 November 2026
          </Text>
          <Text style={{ color: WHITE, fontSize: '38px', fontWeight: '300', textAlign: 'center', margin: '0 0 32px', lineHeight: '1.2' }}>
            Thank you for being there.
          </Text>
          <Hr style={{ borderColor: BLUE, borderWidth: '1px', margin: '0 auto 40px', width: '48px' }} />
          <Text style={{ color: 'rgba(255,255,255,0.8)', fontSize: '16px', textAlign: 'center', lineHeight: '1.8', margin: '0 0 24px' }}>
            {guest.first_name}, it was genuinely wonderful to have you with us.
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '15px', textAlign: 'center', lineHeight: '1.8', margin: '0 0 40px' }}>
            We hope the conversations with Dr Natalie and the team gave you something real to take home — and that the morning felt like the kind of event worth making time for.
          </Text>
          <Section style={{ backgroundColor: 'rgba(102,129,171,0.12)', border: '1px solid rgba(102,129,171,0.22)', borderRadius: '12px', padding: '24px', marginBottom: '40px', textAlign: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 8px' }}>Stay connected</Text>
            <Text style={{ color: WHITE, fontSize: '14px', margin: 0, lineHeight: '1.7' }}>
              Follow Nanit Australia for updates, research and what's next.<br />
              <span style={{ color: BLUE }}>@nanitaustralia</span>
            </Text>
          </Section>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px', textAlign: 'center', lineHeight: '1.8', margin: '0 0 40px' }}>
            We'd love to see what you share — tag us and use <span style={{ color: BLUE }}>#TheNanitReset</span>
          </Text>
          <Hr style={{ borderColor: BLUE, borderWidth: '1px', margin: '0 auto 32px', width: '48px' }} />
          <Text style={{ color: 'rgba(255,255,255,0.25)', fontSize: '11px', textAlign: 'center', lineHeight: '1.7', margin: 0 }}>
            With warmth, the Coolkidz Australia team · events@coolkidz.com.au
          </Text>
        </Container>
        <Section style={{ backgroundColor: BLUE, height: '4px', padding: 0 }} />
      </Body>
    </Html>
  )
}
