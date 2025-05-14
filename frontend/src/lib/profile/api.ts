// src/lib/profile/api.ts

import { User } from '@/lib/profile/types'
import { Media } from '@/lib/media/types'

export const getUserProfile = async (
  fetcher: typeof fetch = fetch,
  username: string,
): Promise<{ private: boolean; profile: User | null }> => {
  const res = await fetcher(
    `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/api/accounts/users/${username}/`,
  )
  if (res.status === 403) {
    return { private: true, profile: null } as const
  }
  if (res.status === 404) throw new Error(`User not found: ${res.status} - ${res.statusText}`)
  if (!res.ok) throw new Error(`Unexpected error: ${res.status} - ${res.statusText}`)

  const data: User = await res.json()
  return { private: false, profile: data } as const
}

export const getUserFavs = async (
  fetcher: typeof fetch = fetch,
  username: string,
  limit = 12,
): Promise<Media[]> => {
  const res = await fetcher(
    `${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/api/accounts/users/${username}/favourites/?limit=${limit}/`,
  )
  if (!res.ok) return [] as Media[]
  return (await res.json()) as Media[]
}
