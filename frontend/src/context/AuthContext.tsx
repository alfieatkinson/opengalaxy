// src/context/AuthContext.tsx

'use client'

import { createContext, useContext } from 'react'
import { useProvideAuth } from '@/hooks/useProvideAuth'

type Auth = ReturnType<typeof useProvideAuth>
const AuthContext = createContext<Auth | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const auth = useProvideAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

// A nicer way to use the context
export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
