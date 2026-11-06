import { z } from 'zod'

export const registerSchema = z
  .object({
    username: z
      .string()
      .trim()
      .min(3, 'Username minimal 3 karakter')
      .max(100, 'Username maksimal 100 karakter'),
    email: z.string().trim().email('Format email tidak valid'),
    password: z
      .string()
      .min(8, 'Password minimal 8 karakter')
      .regex(/[A-Za-z]/, 'Password harus mengandung huruf')
      .regex(/\d/, 'Password harus mengandung angka'),
    confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
    acceptTerms: z
      .boolean()
      .refine((accepted) => accepted, 'Anda harus menyetujui kebijakan'),
  })
  .superRefine((values, ctx) => {
    if (values.password !== values.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Password tidak cocok',
        path: ['confirmPassword'],
      })
    }
  })

export type RegisterFormType = z.infer<typeof registerSchema>
