// src/hooks/useAuth.ts

'use client'

import { useState, useEffect, useCallback } from 'react'

export interface User {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  created_at: string
  updated_at: string
  is_active: boolean
  is_staff: boolean
}

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const isLoggedIn = Boolean(user)

  // Helper function to call API with auth header, refresh if needed
  const authFetch = useCallback(async (input: RequestInfo, init: RequestInit = {}) => {
    let token = localStorage.getItem(ACCESS_TOKEN_KEY)
    const headers = new Headers(init.headers)
    if (token) headers.set('Authorization', `Bearer ${token}`)

    let res = await fetch(input, { ...init, headers })

    if (res.status === 401) {
      // Try refreshing the token
      const refresh = localStorage.getItem(REFRESH_TOKEN_KEY)
      if (!refresh) throw new Error('No refresh token available')

      const tokenRes = await fetch('/api/auth/token/refresh', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      })
      if (!tokenRes.ok) throw new Error('Failed to refresh token')

      const data = await tokenRes.json()
      token = data.access
      if (!token) throw new Error('No access token received after refresh')

      localStorage.setItem(ACCESS_TOKEN_KEY, token)
      headers.set('Authorization', `Bearer ${token}`)

      res = await fetch(input, { ...init, headers })
    }
    return res
  }, [])


}
