// src/app/register/page.tsx

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { RegisterSchema, type RegisterForm } from '@/lib/auth/validation'

const fields: Array<keyof RegisterForm> = [
  'username',
  'email',
  'first_name',
  'last_name',
  'password',
  'confirm_password',
]

const RegisterPage = () => {
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: '',
      email: '',
      first_name: '',
      last_name: '',
      password: '',
      confirm_password: '',
    },
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      // Call registration endpoint
      const res = await fetch('/api/accounts/register/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: data.username,
          email: data.email,
          first_name: data.first_name,
          last_name: data.last_name,
          password: data.password,
        }),
      })

      if (!res.ok) throw new Error('Registration failed')

      alert('Registration successful! Please log in.')
      router.push('/login') // Redirect to login page
    } catch (error) {
      alert(`Registration failed: ${error}`)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl mb-4">Sign Up</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {fields.map((field) => (
          <div key={field}>
            <label className="block">{field.replace('_', ' ').toUpperCase()}</label>
            <input
              type={field.includes('password') ? 'password' : 'text'}
              {...register(field)}
              className="input input-bordered w-full"
            />
            {errors[field] && <p className="text-sm text-red-500">{errors[field]?.message}</p>}
          </div>
        ))}
        <button type="submit" disabled={isSubmitting} className="btn btn-secondary w-full">
          {isSubmitting ? 'Signing up…' : 'Sign Up'}
        </button>
      </form>
    </div>
  )
}

export default RegisterPage
