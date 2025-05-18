// src/app/login/page.tsx

import ClientOnly from '@/components/shared/ClientOnly'
import LoginForm from '@/components/auth/LoginForm'

const LoginPage = () => {
  return (
    <ClientOnly>
      <LoginForm />
    </ClientOnly>
  )
}

export default LoginPage
