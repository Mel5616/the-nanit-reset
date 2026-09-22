import { Html, Head, Body, Container, Text, Hr, Preview } from '@react-email/components'
import { EVENT } from '@/lib/event'

const NAVY = '#111D41'
const BLUE = '#6681AB'

export default function EoiConfirmedEmail({ firstName }: { firstName: string }) {
  return (
    <Html>
      <Head />
      <Preview>Save the date, {EVENT.name}, {EVENT.dateShort}</Preview>
      <Body style={{ backgroundColor: '#FAF7F3', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 16px rgba(17,29,65,0.08)' }}>
            <div style={{ height: '4px', background: BLUE }} />
            <div style={{ padding: '38px 36px' }}>
              <Text style={{ color: BLUE, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 10px' }}>{EVENT.name}</Text>
              <Text style={{ color: NAVY, fontSize: '26px', fontWeight: '300', fontFamily: 'Georgia, serif', margin: '0 0 6px' }}>Save the date.</Text>
              <Text style={{ color: BLUE, fontSize: '14px', margin: '0 0 20px' }}>{EVENT.dateLong} · {EVENT.city}</Text>
              <Text style={{ color: '#333', fontSize: '15px', lineHeight: '1.7', margin: '0 0 14px' }}>Hi {firstName},</Text>
              <Text style={{ color: '#333', fontSize: '15px', lineHeight: '1.7', margin: '0 0 14px' }}>
                Thank you for registering your interest in {EVENT.name}, an intimate, education-led morning with Dr Natalie Barnett in {EVENT.city}.
              </Text>
              <Text style={{ color: '#333', fontSize: '15px', lineHeight: '1.7', margin: '0 0 14px' }}>
                Please hold {EVENT.dayDate} in your diary. Full details, including the venue and the running order, are to come, and we will be in touch with your formal invitation as places are confirmed.
              </Text>
              <Hr style={{ borderColor: '#E5E7EB', margin: '24px 0 16px' }} />
              <Text style={{ color: '#9CA3AF', fontSize: '12px', margin: 0 }}>{EVENT.organiser} · {EVENT.contactEmail}</Text>
            </div>
          </div>
        </Container>
      </Body>
    </Html>
  )
}
