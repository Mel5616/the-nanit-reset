import { Html, Head, Body, Container, Section, Text, Button, Hr, Preview } from '@react-email/components'

const NAVY = '#111D41'
const BLUE = '#6681AB'

export default function AdminInviteEmail({
  name, role, acceptUrl, invitedBy,
}: {
  name: string | null
  role: string
  acceptUrl: string
  invitedBy: string | null
}) {
  return (
    <Html>
      <Head />
      <Preview>You have been invited to the The Nanit Reset admin team</Preview>
      <Body style={{ backgroundColor: '#FAF7F3', fontFamily: 'Helvetica Neue, Helvetica, Arial, sans-serif', margin: 0, padding: 0 }}>
        <Container style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 24px' }}>
          <div style={{ borderRadius: '16px', overflow: 'hidden', background: '#fff', boxShadow: '0 2px 16px rgba(17,29,65,0.08)' }}>
            <div style={{ height: '4px', background: BLUE }} />
            <div style={{ padding: '36px 32px' }}>
              <Text style={{ color: BLUE, fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 12px' }}>
                The Nanit Reset
              </Text>
              <Text style={{ color: NAVY, fontSize: '22px', fontWeight: '600', margin: '0 0 8px' }}>
                {name ? `Hi ${name},` : 'You have been invited'}
              </Text>
              <Text style={{ color: '#4B5563', fontSize: '15px', lineHeight: '1.6', margin: '0 0 24px' }}>
                {invitedBy || 'The team'} has invited you to help run The Nanit Reset as a
                {' '}<strong style={{ color: NAVY }}>{role}</strong>. Set your password to get started.
              </Text>
              <Button
                href={acceptUrl}
                style={{ background: NAVY, color: '#fff', fontSize: '15px', fontWeight: '600', padding: '14px 28px', borderRadius: '999px', textDecoration: 'none', display: 'inline-block' }}>
                Accept invitation
              </Button>
              <Hr style={{ borderColor: '#E5E7EB', margin: '28px 0 16px' }} />
              <Text style={{ color: '#9CA3AF', fontSize: '12px', margin: 0 }}>
                If the button does not work, copy this link into your browser:<br />
                <span style={{ color: BLUE, wordBreak: 'break-all' }}>{acceptUrl}</span>
              </Text>
            </div>
          </div>
        </Container>
      </Body>
    </Html>
  )
}
