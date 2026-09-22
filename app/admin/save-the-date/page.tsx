import { redirect } from 'next/navigation'
import { getCurrentAdmin } from '@/lib/auth'
import ShareQR from './ShareQR'

export const dynamic = 'force-dynamic'

export default async function SaveTheDateQRPage() {
  const admin = await getCurrentAdmin()
  if (!admin) redirect('/admin/login')
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || ''
  return <ShareQR url={`${baseUrl}/save-the-date`} />
}
