export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function validateRequired(value: string | null | undefined): boolean {
  return !!(value && value.trim().length > 0)
}
