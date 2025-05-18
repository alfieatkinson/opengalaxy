// src/app/register/page.tsx

import ClientOnly from '@/components/shared/ClientOnly'
import RegisterForm from '@/components/auth/RegisterForm'

const RegisterPage = () => {
  return (
    <ClientOnly>
      <RegisterForm />
    </ClientOnly>
  )
}

export default RegisterPage
