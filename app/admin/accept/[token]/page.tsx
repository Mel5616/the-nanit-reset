import SetPasswordForm from '../../SetPasswordForm'

export const dynamic = 'force-dynamic'

export default async function AcceptInvitePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  return <SetPasswordForm token={token} mode="accept" />
}
