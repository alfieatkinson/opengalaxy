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
    // always include credentials so cookies go with the request
    const opts: RequestInit = {
      ...init,
      credentials: 'include',
    }
    const res = await fetch(input, opts)
    if (res.status === 401 && retried < 1) {
      // try refresh
      await fetch('/api/accounts/token/refresh/', {
        method: 'POST',
        credentials: 'include',
      })
      return authFetch(input, init, retried + 1)
    }
    return res
  }, [])

  // Load user on mount if token exists
  useEffect(() => {
    const load = async () => {
      try {
        const res = await authFetch('/api/accounts/users/me/')
        if (!res.ok) throw new Error('Not authorised')
        const me = await res.json()
        setUser(me)
        setPrefs(me.preferences)
      } catch {
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
      credentials: 'include',
    })
    if (!res.ok) throw new Error('Login failed')
    // tokens are now in cookies—just fetch user
    const meRes = await authFetch('/api/accounts/users/me/')
    const me = await meRes.json()
    setUser(me)
    updateLocalPrefs(me.preferences)
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
    await fetch('/api/accounts/logout/', {
      method: 'POST',
      credentials: 'include',
    })
    setUser(null)
    updateLocalPrefs({
      public_profile: true,
      show_sensitive: false,
      blur_sensitive: true,
    })
  }

  return { user, setUser, prefs, isLoggedIn, signIn, signUp, signOut, authFetch, updateLocalPrefs }
}
