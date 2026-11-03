// Format error seragam dari backend: { status, message, errors? } (lihat ARCHITECTURE.md bagian 7)
export class ApiError extends Error {
  status: number
  // Hanya terisi pada 400 validasi: { NamaField: ['pesan', ...] }
  errors?: Record<string, string[]>

  constructor(status: number, message: string, errors?: Record<string, string[]>) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    this.errors = errors
  }

  // Helper agar UI tidak perlu menghafal angka status
  get isUnauthorized() { return this.status === 401 }
  get isForbidden() { return this.status === 403 }
  get isNotFound() { return this.status === 404 }
  get isConflict() { return this.status === 409 }
}

// Ratakan errors validasi menjadi satu daftar pesan untuk ditampilkan
export function flattenErrors(err: unknown): string[] {
  if (!(err instanceof ApiError)) return []
  if (!err.errors) return [err.message]
  return Object.values(err.errors).flat()
}
