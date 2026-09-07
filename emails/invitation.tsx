import {
  Html, Head, Body, Container, Section, Text, Button, Hr, Preview, Img
} from '@react-email/components'
import { Guest } from '@/lib/supabase'

const NAVY = '#1C2B4A'
const BLUE = '#4A7FA5'
const WHITE = '#FFFFFF'

// One invitation for every guest.
const HOOK = 'A morning to pause, listen and reset.'
const SUB = 'Three hours of calm in the middle of a Sydney Monday, in conversation with Dr Natalie Barnett.'

export default function InvitationEmail({ guest, baseUrl }: { guest: Guest; baseUrl: string }) {
  const inviteUrl = `${baseUrl}/invite/${guest.invite_token}`

  return (
    <Html>
      <Head />
      <Preview>You're invited to The Nanit Reset, 16 November 2026, Sydney</Preview>
      <Body style={{ backgroundColor: NAVY, fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', margin: 0, padding: 0 }}>
        {/* Top bar */}
        <Section style={{ backgroundColor: BLUE, height: '4px', padding: 0 }} />

        <Container style={{ maxWidth: '600px', margin: '0 auto', padding: '48px 32px' }}>
          {/* Header */}
          <Section style={{ textAlign: 'center', marginBottom: '32px' }}>
            <Img src={`${baseUrl}/nanit-logo-light.png`} alt="Nanit" width="120" style={{ margin: '0 auto', display: 'block' }} />
          </Section>
          <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', textAlign: 'center', margin: '0 0 12px' }}>
            You are invited to
          </Text>
          <Text style={{ color: WHITE, fontSize: '40px', fontWeight: '300', textAlign: 'center', margin: '0 0 8px', letterSpacing: '-0.5px' }}>
            The Nanit Reset.
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', textAlign: 'center', margin: '0 0 40px', letterSpacing: '1px' }}>
            16 November 2026 · Sydney
          </Text>

          <Hr style={{ borderColor: BLUE, borderWidth: '1px', margin: '0 auto 40px', width: '48px' }} />

          {/* Hook */}
          <Text style={{ color: WHITE, fontSize: '22px', fontWeight: '300', textAlign: 'center', lineHeight: '1.5', margin: '0 0 16px' }}>
            {HOOK}
          </Text>
          <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', textAlign: 'center', lineHeight: '1.6', margin: '0 0 48px' }}>
            {SUB}
          </Text>

          {/* Event details */}
          <Section style={{ backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '32px', marginBottom: '32px' }}>
            {[
              ['Date', 'Monday, 16 November 2026'],
              ['Time', '11:00am – 2:00pm'],
              ['Location', 'The Atrium, The Grounds of Alexandria, 7a / 2 Huntley Street, Alexandria NSW 2015'],
              ['Format', 'Expert panel · App experience · Gifting'],
            ].map(([label, value]) => (
              <Section key={label} style={{ marginBottom: '16px' }}>
                <Text style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 4px' }}>
                  {label}
                </Text>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '14px', margin: 0, lineHeight: '1.4' }}>
                  {value}
                </Text>
              </Section>
            ))}
          </Section>

          {/* Speaker */}
          <Section style={{ backgroundColor: 'rgba(74,127,165,0.15)', border: '1px solid rgba(74,127,165,0.25)', borderRadius: '10px', padding: '20px 24px', marginBottom: '40px', textAlign: 'center' }}>
            <Text style={{ color: 'rgba(255,255,255,0.5)', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 6px' }}>
              Keynote Speaker
            </Text>
            <Text style={{ color: WHITE, fontSize: '16px', fontWeight: '500', margin: '0 0 4px' }}>
              Dr Natalie Barnett
            </Text>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '13px', margin: 0 }}>
              VP of Clinical Research, Nanit (US)
            </Text>
          </Section>

          {/* CTA */}
          <Section style={{ textAlign: 'center', marginBottom: '40px' }}>
            <Text style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', margin: '0 0 24px' }}>
              {guest.first_name}, we'd love to have you there.
            </Text>
            <Button
              href={inviteUrl}
              style={{ backgroundColor: BLUE, color: WHITE, padding: '16px 40px', borderRadius: '100px', fontSize: '14px', fontWeight: '500', textDecoration: 'none', letterSpacing: '0.5px' }}
            >
              RSVP now
            </Button>
          </Section>

          <Hr style={{ borderColor: BLUE, borderWidth: '1px', margin: '0 auto 32px', width: '48px' }} />

          <Text style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', textAlign: 'center', lineHeight: '1.7', margin: 0 }}>
            This is a curated, intimate event for approximately 30 guests. Places are limited.<br />
            This invitation is personal and non-transferable.
          </Text>
        </Container>

        {/* Bottom bar */}
        <Section style={{ backgroundColor: BLUE, height: '4px', padding: 0 }} />
      </Body>
    </Html>
  )
}
