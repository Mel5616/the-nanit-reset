import { Html, Head, Body, Container, Text, Button, Section, Hr, Preview } from '@react-email/components'
import { EVENT } from '@/lib/event'

const NAVY = '#111D41'
const BLUE = '#6681AB'
const PEACH = '#EDB39A'

export default function SpeakerInviteEmail({
  displayName, firstName, organization, personalizedWhy, involvedAs, letterUrl, acceptUrl, declineUrl,
}: {
  displayName: string
  firstName: string
  organization: string | null
  personalizedWhy: string | null
  involvedAs: string | null
  letterUrl: string
  acceptUrl: string
  declineUrl: string
}) {
  return (
    <Html>
      <Head />
      <Preview>An invitation to speak at {EVENT.name}, {EVENT.dateShort}</Preview>
      <Body style={{ backgroundColor: '#FAF7F3', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '540px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 16px rgba(17,29,65,0.08)' }}>
            <div style={{ height: '4px', background: BLUE }} />
            <div style={{ padding: '38px 36px' }}>
              <Text style={{ color: BLUE, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 6px' }}>
                {EVENT.name} · {EVENT.dateShort}
              </Text>
              <Text style={{ color: NAVY, fontSize: '22px', fontWeight: '600', fontFamily: 'Georgia, serif', margin: '0 0 20px' }}>
                An invitation to speak
              </Text>
              <Text style={{ color: '#333', fontSize: '15px', lineHeight: '1.7', margin: '0 0 14px' }}>
                Dear {displayName},
              </Text>
              <Text style={{ color: '#333', fontSize: '15px', lineHeight: '1.7', margin: '0 0 14px' }}>
                We would love to invite you to be involved as {involvedAs || 'a featured speaker'} at
                {' '}<strong>{EVENT.name}</strong>, an intimate, education-led event taking place on
                {' '}<strong>{EVENT.dateLong}</strong> in {EVENT.city}.
              </Text>
              {personalizedWhy && personalizedWhy.split('\n\n').filter(Boolean).map((p, i) => (
                <Text key={i} style={{ color: '#333', fontSize: '15px', lineHeight: '1.7', margin: '0 0 14px' }}>{p.trim()}</Text>
              ))}
              <Text style={{ color: '#333', fontSize: '15px', lineHeight: '1.7', margin: '0 0 24px' }}>
                We have prepared a personal invitation with the full details. You can read it and let us know if you are available below.
              </Text>

              <Section style={{ textAlign: 'center', margin: '0 0 20px' }}>
                <Button href={letterUrl}
                  style={{ background: NAVY, color: '#fff', fontSize: '15px', fontWeight: '600', padding: '14px 30px', borderRadius: '999px', textDecoration: 'none', display: 'inline-block' }}>
                  Read your invitation
                </Button>
              </Section>

              <Section style={{ textAlign: 'center' }}>
                <a href={acceptUrl} style={{ display: 'inline-block', background: BLUE, color: '#fff', fontSize: '14px', fontWeight: '600', padding: '11px 22px', borderRadius: '999px', textDecoration: 'none', margin: '0 6px' }}>
                  Yes, I&apos;m available
                </a>
                <a href={declineUrl} style={{ display: 'inline-block', background: '#fff', color: '#888', fontSize: '14px', padding: '11px 22px', borderRadius: '999px', textDecoration: 'none', border: '1px solid #e0e0e0', margin: '0 6px' }}>
                  I&apos;ll need to pass
                </a>
              </Section>

              <Hr style={{ borderColor: '#E5E7EB', margin: '28px 0 16px' }} />
              <Text style={{ color: '#9CA3AF', fontSize: '12px', margin: 0 }}>
                {EVENT.signerName} · {EVENT.organiser} · {EVENT.contactEmail}
              </Text>
            </div>
          </div>
        </Container>
      </Body>
    </Html>
  )
}
