// src/app/login/page.tsx

'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { LoginSchema, type LoginForm } from '@/lib/auth/validation'

export const LoginPage = () => {
  const { signIn } = useAuth()
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      username: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginForm) => {
    try {
      await signIn(data.username, data.password)
      router.push('/') // Re-direct to home page after successful login
    } catch (error) {
      alert(`Login failed: ${error}`)
      // TODO: Show error animation
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block">Username</label>
          <input {...register('username')} className="input input-bordered w-full" />
          {errors.username && <p className="text-sm text-red-500">{errors.username.message}</p>}
        </div>
        <div>
          <label className="block">Password</label>
          <input
            type="password"
            {...register('password')}
            className="input input-bordered w-full"
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </div>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
          {isSubmitting ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  )
}
