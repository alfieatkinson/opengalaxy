// src/lib/auth/validation.ts

import { z } from 'zod'

export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

export const RegisterSchema = LoginSchema.extend({
  email_address: z.string().email('Invalid email address'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  confirm_password: z.string().min(1, 'Please confirm password'),
}).refine((data) => data.password === data.confirm_password, {
  message: 'Passwords must match',
  path: ['confirm_password'],
})

export const UpdateDetailsSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  email_address: z.string().email('Invalid email address'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
})

export const ChangePasswordSchema = z
  .object({
    old_password: z.string().min(1, 'Current password is required'),
    password: z.string().min(1, 'New password is required'),
    confirm_password: z.string().min(1, 'Please confirm new password'),
  })
  .refine((data) => data.password === data.confirm_password, {
    message: 'Passwords must match',
    path: ['confirm_password'],
  })

export type LoginForm = z.infer<typeof LoginSchema>
export type RegisterForm = z.infer<typeof RegisterSchema>
export type UpdateDetailsForm = z.infer<typeof UpdateDetailsSchema>
export type ChangePasswordForm = z.infer<typeof ChangePasswordSchema>
