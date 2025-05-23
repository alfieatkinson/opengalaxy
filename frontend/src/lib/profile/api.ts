// src/lib/profile/api.ts

import { User, UserPreferences, PaginatedFavourites } from '@/lib/profile/types'

// GET /api/accounts/users/:username/
export const getUserProfile = async (
  fetcher: typeof fetch = fetch,
  username: string,
): Promise<{ private: boolean; profile: User | null }> => {
  const res = await fetcher(`/api/accounts/users/${username}/`)
  if (res.status === 401 || res.status === 403) {
    return { private: true, profile: null } as const
  }
  if (res.status === 404) throw new Error(`User not found: ${res.status} - ${res.statusText}`)
  if (!res.ok) throw new Error(`Unexpected error: ${res.status} - ${res.statusText}`)

  const data: User = await res.json()
  return { private: false, profile: data } as const
}

// GET /api/accounts/users/:username/favourites/
export const getUserFavs = async (
  fetcher: typeof fetch = fetch,
  username: string,
  page = 1,
  pageSize = 24,
): Promise<PaginatedFavourites> => {
  const res = await fetcher(
    `/api/accounts/users/${username}/favourites/?page=${page}&page_size=${pageSize}`,
  )
  if (res.status === 401 || res.status === 403) {
    throw new Error('Private account - cannot fetch favourites')
  }
  if (!res.ok) throw new Error('Failed to load favourites')
  return res.json() as Promise<PaginatedFavourites>
}

// GET /api/accounts/users/:username/preferences/
export const getUserPreferences = async (
  fetcher: typeof fetch = fetch,
  username: string,
): Promise<UserPreferences> => {
  const res = await fetcher(`/api/accounts/users/${username}/preferences/`)
  if (res.status === 404) {
    // Preferences should exist via signal in RegisterView
    throw new Error('Preferences not found')
  }
  if (!res.ok) {
    throw new Error(`Failed to load preferences: ${res.status}`)
  }
  return (await res.json()) as UserPreferences
}

// PATCH /api/accounts/users/:username/preferences/
export const updateUserPreferences = async (
  fetcher: typeof fetch = fetch,
  username: string,
  updates: Partial<UserPreferences>,
): Promise<UserPreferences> => {
  const res = await fetcher(`/api/accounts/users/${username}/preferences/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!res.ok) {
    throw new Error(`Failed to update preferences: ${res.status}`)
  }
  return (await res.json()) as UserPreferences
}

// PATCH /api/accounts/users/:username/
export const updateUserDetails = async (
  fetcher: typeof fetch,
  username: string,
  updates: Partial<Pick<User, 'first_name' | 'last_name' | 'email' | 'username'>> & {
    password: string
  },
): Promise<User> => {
  const res = await fetcher(`/api/accounts/users/${username}/`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates),
  })
  if (!res.ok) throw new Error(`Failed to update user: ${res.status}`)
  return res.json()
}

// DELETE /api/accounts/users/:username/
export const deleteUser = async (
  fetcher: typeof fetch,
  username: string,
  password: string,
): Promise<void> => {
  const res = await fetcher(`/api/accounts/users/${username}/`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  if (!res.ok) throw new Error(`Failed to delete user: ${res.status}`)
}

// POST /api/accounts/users/:username/password/
export const changePassword = async (
  fetcher: typeof fetch,
  username: string,
  oldPassword: string,
  newPassword: string,
): Promise<void> => {
  const res = await fetcher(`/api/accounts/users/${username}/password/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ old_password: oldPassword, password: newPassword }),
  })
  if (!res.ok) throw new Error(`Failed to change password: ${res.status}`)
}
