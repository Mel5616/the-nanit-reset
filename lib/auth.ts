import { cookies } from 'next/headers'
import { scryptSync, randomBytes, timingSafeEqual } from 'crypto'
import { getServiceClient } from '@/lib/supabase'

const COOKIE_NAME = 'nanit_admin'
// Value used when the master password (ADMIN_PASSWORD) is used to sign in.
const MASTER_COOKIE_VALUE = 'authenticated'

export type AdminRole = 'owner' | 'manager' | 'viewer' | 'door'

export interface CurrentAdmin {
  id: string | null
  email: string | null
  name: string | null
  role: AdminRole
}

export function getAdminCookieName() {
  return COOKIE_NAME
}

export function getMasterCookieValue() {
  return MASTER_COOKIE_VALUE
}

// ---- password hashing (scrypt, no external deps) ----

export function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex')
  const hash = scryptSync(password, salt, 64).toString('hex')
  return `${salt}:${hash}`
}

export function verifyPassword(password: string, stored: string | null): boolean {
  if (!stored) return false
  const [salt, key] = stored.split(':')
  if (!salt || !key) return false
  const hash = scryptSync(password, salt, 64)
  const keyBuf = Buffer.from(key, 'hex')
  return keyBuf.length === hash.length && timingSafeEqual(hash, keyBuf)
}

export function newToken(): string {
  return randomBytes(32).toString('hex')
}

// ---- session resolution ----

// Returns the signed-in admin, or null. Master password resolves to the owner.
export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const cookieStore = await cookies()
  const value = cookieStore.get(COOKIE_NAME)?.value
  if (!value) return null

  if (value === MASTER_COOKIE_VALUE) {
    return { id: null, email: null, name: 'Melanie', role: 'owner' }
  }

  const db = getServiceClient()
  const { data } = await db
    .from('admin_users')
    .select('id, email, name, role, invite_accepted_at')
    .eq('session_token', value)
    .single()

  if (!data || !data.invite_accepted_at) return null
  return {
    id: data.id,
    email: data.email,
    name: data.name,
    role: data.role as AdminRole,
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  return (await getCurrentAdmin()) !== null
}

export async function requireRole(action: AdminAction): Promise<CurrentAdmin | null> {
  const admin = await getCurrentAdmin()
  if (!admin) return null
  return canDo(admin.role, action) ? admin : null
}

// ---- role capabilities ----

export type AdminAction = 'manage_users' | 'write' | 'checkin' | 'read'

export function canDo(role: AdminRole, action: AdminAction): boolean {
  switch (action) {
    case 'manage_users': return role === 'owner'
    case 'write':        return role === 'owner' || role === 'manager'
    case 'checkin':      return role === 'owner' || role === 'manager' || role === 'door'
    case 'read':         return true
  }
}
