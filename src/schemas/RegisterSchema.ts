import { z } from 'zod'

export const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, 'First name is required'),
    lastName: z.string().trim().min(1, 'Last name is required'),
    countryCode: z
      .string()
      .trim()
      .min(1, 'Country code is required')
      .regex(/^\d{1,4}$/, 'Use digits only, for example 62'),
    phoneNumber: z
      .string()
      .trim()
      .min(7, 'Phone number must be at least 7 digits')
      .max(15, 'Phone number must be at most 15 digits')
      .regex(/^\d+$/, 'Use digits only'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .regex(/[a-z]/, 'Include at least one lowercase letter')
      .regex(/[A-Z]/, 'Include at least one uppercase letter')
      .regex(/\d/, 'Include at least one number'),
    confirmPassword: z.string().min(1, 'Confirm your password'),
    acceptTerms: z
      .boolean()
      .refine((accepted) => accepted, 'You must accept the terms to continue'),
  })
  .superRefine((values, ctx) => {
    if (values.password !== values.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'Passwords do not match',
        path: ['confirmPassword'],
      })
    }
  })

export type RegisterFormType = z.infer<typeof registerSchema>
