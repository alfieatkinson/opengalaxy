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
    <div className="card card-compact bg-base-100 shadow w-lg w-md mx-auto p-10">
      <h1 className="text-3xl text-center font-bold mb-4">Login</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 p-4">
        <div>
          <div className="grid grid-cols-2">
            <label className="block">USERNAME</label>
            {errors.username && (
              <p className="text-right text-xs text-red-500">{errors.username.message}</p>
            )}
          </div>
          <input {...register('username')} className="input input-bordered w-full h-8" />
        </div>
        <div>
          <div className="grid grid-cols-2">
            <label className="block">PASSWORD</label>
            {errors.password && (
              <p className="text-right text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>
          <input
            type="password"
            {...register('password')}
            className="input input-bordered w-full h-8"
          />
        </div>
        <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full">
          {isSubmitting ? 'Logging in…' : 'Login'}
        </button>
      </form>
    </div>
  )
}

export default LoginPage
