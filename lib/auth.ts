import { cookies } from 'next/headers'

const COOKIE_NAME = 'nanit_admin'
const COOKIE_VALUE = 'authenticated'

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return cookieStore.get(COOKIE_NAME)?.value === COOKIE_VALUE
}

export function getAdminCookieName() {
  return COOKIE_NAME
}

export function getAdminCookieValue() {
  return COOKIE_VALUE
}
