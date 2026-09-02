import { Html, Head, Body, Container, Text, Button, Section, Hr, Preview } from '@react-email/components'
import { EVENT } from '@/lib/event'

const NAVY = '#111D41'
const BLUE = '#6681AB'

export default function SurveyInviteEmail({
  firstName, surveyUrl, attended,
}: {
  firstName: string
  surveyUrl: string
  attended: boolean
}) {
  return (
    <Html>
      <Head />
      <Preview>Tell us how we did — {EVENT.name}</Preview>
      <Body style={{ backgroundColor: '#FAF7F3', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 16px rgba(17,29,65,0.08)' }}>
            <div style={{ height: '4px', background: BLUE }} />
            <div style={{ padding: '38px 36px' }}>
              <Text style={{ color: BLUE, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 10px' }}>{EVENT.name}</Text>
              <Text style={{ color: NAVY, fontSize: '24px', fontWeight: '300', fontFamily: 'Georgia, serif', margin: '0 0 18px' }}>
                {attended ? 'How was your morning with us?' : 'We missed you — tell us anyway?'}
              </Text>
              <Text style={{ color: '#333', fontSize: '15px', lineHeight: '1.7', margin: '0 0 14px' }}>Hi {firstName},</Text>
              <Text style={{ color: '#333', fontSize: '15px', lineHeight: '1.7', margin: '0 0 24px' }}>
                {attended
                  ? 'Thank you for joining us. We would love a moment of your time to hear what you thought — it takes under two minutes.'
                  : 'We are sorry we missed you. If you have a moment, we would still love your thoughts — it takes under two minutes.'}
              </Text>
              <Section style={{ textAlign: 'center', margin: '0 0 8px' }}>
                <Button href={surveyUrl} style={{ background: NAVY, color: '#fff', fontSize: '15px', fontWeight: '600', padding: '14px 30px', borderRadius: '999px', textDecoration: 'none', display: 'inline-block' }}>
                  Share your feedback
                </Button>
              </Section>
              <Hr style={{ borderColor: '#E5E7EB', margin: '28px 0 16px' }} />
              <Text style={{ color: '#9CA3AF', fontSize: '12px', margin: 0 }}>{EVENT.organiser} · {EVENT.contactEmail}</Text>
            </div>
          </div>
        </Container>
      </Body>
    </Html>
  )
}
