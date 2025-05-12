// src/app/register/page.tsx

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { RegisterSchema, type RegisterForm } from '@/lib/auth/validation'
import { useAuth } from '@/hooks/useAuth'

const fields: Array<keyof RegisterForm> = [
  'username',
  'email_address',
  'first_name',
  'last_name',
  'password',
  'confirm_password',
]

const RegisterPage = () => {
  const router = useRouter()
  const { signUp } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      username: '',
      email_address: '',
      first_name: '',
      last_name: '',
      password: '',
      confirm_password: '',
    },
  })

  const onSubmit = async (data: RegisterForm) => {
    try {
      await signUp(
        data.username,
        data.email_address,
        data.first_name,
        data.last_name,
        data.password,
      )

      alert('Registration successful! Please log in.')
      router.push('/login')
    } catch (error) {
      alert(`Registration failed: ${error}`)
    }
  }

  return (
    <div className="card card-compact bg-base-100 shadow w-md mx-auto p-10">
      <h1 className="text-3xl text-center font-bold mb-4">Register</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        {fields.map((field) => (
          <div key={field} className="relative">
            <div className="grid grid-cols-2">
              <label className="block">{field.replace('_', ' ').toUpperCase()}</label>
              {errors[field] && (
                <p className="text-right text-xs text-red-500">{errors[field]?.message}</p>
              )}
            </div>
            <input
              type={field.includes('password') ? 'password' : 'text'}
              {...register(field)}
              className="input input-bordered w-full h-8"
            />
          </div>
        ))}
        <button type="submit" disabled={isSubmitting} className="btn btn-secondary w-full">
          {isSubmitting ? 'Registering user...' : 'Register'}
        </button>
      </form>
    </div>
  )
}

export default RegisterPage
