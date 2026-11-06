export interface JwtUser {
  id: number | null
  username: string
  email: string
}

interface JwtPayload {
  exp?: number
  [key: string]: unknown
}

const ID_CLAIMS = [
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier',
  'nameid',
  'sub',
  'userId',
  'id',
]
const NAME_CLAIMS = [
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name',
  'unique_name',
  'name',
  'username',
]
const EMAIL_CLAIMS = [
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress',
  'email',
  'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/email',
]

export function decodeJwt(token: string | null): JwtPayload | null {
  if (!token) return null
  try {
    const encoded = token.split('.')[1]
    if (!encoded) return null
    const base64 = encoded.replace(/-/g, '+').replace(/_/g, '/')
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=')
    return JSON.parse(atob(padded)) as JwtPayload
  } catch {
    return null
  }
}

function firstString(payload: JwtPayload | null, keys: string[]): string | null {
  if (!payload) return null
  for (const key of keys) {
    const value = payload[key]
    if (typeof value === 'string' && value.length > 0) return value
  }
  return null
}

export function getUserIdFromToken(token: string | null): number | null {
  const value = firstString(decodeJwt(token), ID_CLAIMS)
  const id = Number(value)
  return Number.isFinite(id) ? id : null
}

export function getJwtUser(token: string | null): JwtUser {
  const payload = decodeJwt(token)
  return {
    id: getUserIdFromToken(token),
    username: firstString(payload, NAME_CLAIMS) ?? 'Workspace user',
    email: firstString(payload, EMAIL_CLAIMS) ?? '',
  }
}
