import { redirect } from 'next/navigation'
import { isAdminAuthenticated } from '@/lib/auth'
import AddGuestForm from './AddGuestForm'

export default async function AddGuestPage() {
  if (!(await isAdminAuthenticated())) {
    redirect('/admin/login')
  }
  return <AddGuestForm />
}
