import { z } from 'zod'

export const workspaceNameSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Nama workspace wajib diisi')
    .max(150, 'Nama workspace maksimal 150 karakter'),
})

export const createWorkspaceSchema = workspaceNameSchema
export const renameWorkspaceSchema = workspaceNameSchema

export const documentTitleSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Judul dokumen wajib diisi')
    .max(255, 'Judul dokumen maksimal 255 karakter'),
})

export const createDocumentSchema = documentTitleSchema

export const updateDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, 'Judul dokumen wajib diisi')
    .max(255, 'Judul dokumen maksimal 255 karakter'),
  content: z.string().nullable(),
})

export const memberEmailSchema = z.object({
  email: z.string().trim().email('Format email tidak valid'),
  role: z.enum(['Editor', 'Viewer']),
})

export const shareSettingsSchema = z.object({
  isEnabled: z.boolean(),
  role: z.enum(['Viewer', 'Editor']),
  expiresAt: z.string(),
}).superRefine((values, ctx) => {
  if (!values.expiresAt) return
  const expiry = new Date(values.expiresAt).getTime()
  if (!Number.isFinite(expiry)) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Format tanggal kedaluwarsa tidak valid',
      path: ['expiresAt'],
    })
    return
  }
  if (expiry <= Date.now()) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Batas waktu harus di masa depan',
      path: ['expiresAt'],
    })
  }
})

export const searchSchema = z.object({
  query: z.string(),
})

export type WorkspaceNameForm = z.infer<typeof workspaceNameSchema>
export type CreateDocumentForm = z.infer<typeof createDocumentSchema>
export type UpdateDocumentForm = z.infer<typeof updateDocumentSchema>
export type MemberEmailForm = z.infer<typeof memberEmailSchema>
export type ShareSettingsForm = z.infer<typeof shareSettingsSchema>
export type SearchForm = z.infer<typeof searchSchema>
