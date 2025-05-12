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

  // Load user on mount if token exists
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY)
      if (!token) return

      try {
        const res = await authFetch('/api/auth/users/me/')
        if (!res.ok) throw new Error('Not authorised')

        const me = await res.json()
        setUser(me)
      } catch (error) {
        console.error('Failed to load user:', error)
        localStorage.removeItem(ACCESS_TOKEN_KEY)
        localStorage.removeItem(REFRESH_TOKEN_KEY)
        setUser(null)
      }
    }
    load()
  }, [authFetch])

  // Sign in: Exchange credentials for tokens and fetch user
  const signIn = async (username: string, password: string) => {
    const res = await fetch('/api/auth/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.detail || 'Login failed')
    }

    const { access, refresh } = await res.json()
    localStorage.setItem(ACCESS_TOKEN_KEY, access)
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh)

    // Fetch the user
    const meRes = await authFetch('/api/auth/users/me/')
    const me = await meRes.json()
    setUser(me)
  }

  // Sign up: Register a new user and log them in
  const signUp = async (
    username: string,
    email: string,
    first_name: string,
    last_name: string,
    password: string,
  ) => {
    const res = await fetch('/api/accounts/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, first_name, last_name, password }),
    })

    if (!res.ok) {
      const errorText = await res.text()
      throw new Error(errorText || 'Registration failed')
    }

    return true
  }

  // Sign out: Clear tokens and user
  const signOut = async () => {
    await fetch('/api/auth/logout/', { method: 'POST' })
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    setUser(null)
  }

  return { user, isLoggedIn, signIn, signUp, signOut, authFetch }
}
