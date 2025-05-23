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

export interface Prefs {
  public_profile: boolean
  show_sensitive: boolean
  blur_sensitive: boolean
}

const ACCESS_TOKEN_KEY = 'accessToken'
const REFRESH_TOKEN_KEY = 'refreshToken'

export const useProvideAuth = () => {
  const [user, setUser] = useState<User | null>(null)
  const isLoggedIn = Boolean(user)
  const [prefs, setPrefs] = useState<Prefs>({
    public_profile: true,
    show_sensitive: false,
    blur_sensitive: true,
  })

  // Helper function to update user preferences
  const updateLocalPrefs = (updates: Partial<Prefs>) => {
    setPrefs((prev) => ({ ...prev, ...updates }))
  }

  // Helper function to call API with auth header, refresh if needed
  const authFetch = useCallback(async (input: RequestInfo, init: RequestInit = {}, retried = 0) => {
    let token = localStorage.getItem(ACCESS_TOKEN_KEY)
    const headers = new Headers(init.headers)
    if (token) headers.set('Authorization', `Bearer ${token}`)

    let res = await fetch(input, { ...init, headers })

    if (res.status === 401 && retried < 5) {
      // Try refreshing the token
      const refresh = localStorage.getItem(REFRESH_TOKEN_KEY)
      if (!refresh) throw new Error('No refresh token available')

      const tokenRes = await fetch('/api/accounts/token/refresh/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh }),
      })
      if (!tokenRes.ok) throw new Error('Failed to refresh token')

      const data = await tokenRes.json()
      token = data.access
      if (!token) throw new Error('No access token received after refresh')

      if (data.refresh) {
        localStorage.setItem(REFRESH_TOKEN_KEY, data.refresh)
      }

      localStorage.setItem(ACCESS_TOKEN_KEY, token)
      headers.set('Authorization', `Bearer ${token}`)

      res = await authFetch(input, { ...init, headers }, retried + 1)
    }
    return res
  }, [])

  // Load user on mount if token exists
  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN_KEY)
      if (!token) return

      try {
        const res = await authFetch('/api/accounts/users/me/')
        if (!res.ok) throw new Error('Not authorised')

        const me = await res.json()
        setUser(me)
        setPrefs(
          me.preferences ?? {
            public_profile: true,
            show_sensitive: false,
            blur_sensitive: true,
          },
        )
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
    const res = await fetch('/api/accounts/token/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })

    let payload
    const contentType = res.headers.get('content-type') ?? ''
    if (contentType.includes('application/json')) {
      payload = await res.json()
    } else {
      const text = await res.text()
      console.warn('Non-JSON login error:', text)
      throw new Error(text || 'Login failed')
    }

    if (!res.ok) {
      // e.g. 401 => { detail: 'No active account found' }
      throw new Error(payload.detail || 'Login failed')
    }

    const { access, refresh } = payload
    localStorage.setItem(ACCESS_TOKEN_KEY, access)
    localStorage.setItem(REFRESH_TOKEN_KEY, refresh)

    const meRes = await authFetch('/api/accounts/users/me/')
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
    const refresh = localStorage.getItem(REFRESH_TOKEN_KEY)
    try {
      if (refresh) {
        await fetch('/api/accounts/logout/', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refresh }),
        })
      }
    } catch (err) {
      console.warn('Logout endpoint failed, clearing local tokens anyway', err)
    }
    localStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
    setUser(null)
  }

  return { user, setUser, prefs, isLoggedIn, signIn, signUp, signOut, authFetch, updateLocalPrefs }
}
