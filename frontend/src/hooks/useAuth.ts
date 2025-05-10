// src/hooks/useAuth.ts

'use client'

import { useState, useEffect } from 'react'

interface User {
  username: string
  profilePicture: string
}

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const isLoggedIn = Boolean(user)

  useEffect(() => {
    // load from localStorage if present
    const raw = localStorage.getItem('mockUser')
    if (raw) setUser(JSON.parse(raw))
  }, [])

  const signIn = () => {
    const mock = {
      username: 'Admin',
      profilePicture: '/globe.svg',
    }
    localStorage.setItem('mockUser', JSON.stringify(mock))
    setUser(mock)
  }

  const signOut = () => {
    localStorage.removeItem('mockUser')
    setUser(null)
  }

  return { user, isLoggedIn, signIn, signOut }
}
