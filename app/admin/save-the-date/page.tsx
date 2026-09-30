import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import ShareQR from './ShareQR'

export const dynamic = 'force-dynamic'

export default async function SaveTheDateQRPage() {
  const admin = await getCurrentAdmin()
  if (!admin) redirect('/admin/login')
  // Canonical public domain for the event, so the QR is always correct
  // regardless of the build-time NEXT_PUBLIC_BASE_URL on the deploy.
  const baseUrl = 'https://reset.nanit.au'
  return <ShareQR url={`${baseUrl}/save-the-date`} />
}
