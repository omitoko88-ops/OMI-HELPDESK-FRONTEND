import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .trim()
    .min(1, { message: 'Developer alias or email is required' }),
  password: z
    .string()
    .min(6, { message: 'Password must be at least 6 characters' }),
})

export type LoginFormType = z.infer<typeof loginSchema>
