// src/lib/auth/validation.ts

import { z } from 'zod'

export const LoginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
})

export const RegisterSchema = LoginSchema.extend({
  email: z.string().email('Invalid email address'),
  first_name: z.string().min(1, 'First name is required'),
  last_name: z.string().min(1, 'Last name is required'),
  passwordConfirm: z.string().min(1, 'Please confirm password'),
}).refine((data) => data.password === data.passwordConfirm, {
  message: 'Passwords must match',
  path: ['passwordConfirm'],
})

export type LoginForm = z.infer<typeof LoginSchema>
export type RegisterForm = z.infer<typeof RegisterSchema>
