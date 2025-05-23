// src/lib/media/api.ts

import type { Media } from '@/lib/media/types'

// GET /api/media/:id/
export const fetchMediaById = async (id: string): Promise<Media | null> => {
  const res = await fetch(`/api/media/${encodeURIComponent(id)}`, {
    cache: 'no-store',
  })
  if (!res.ok) {
    console.error(`Failed to fetch media with id ${id}:`, res.statusText)
    return null
  }
  return res.json()
}

// List endpoint here
// export async function fetchMediaList(): Promise<Media[]> { … }

// GET /api/media/:id/favourite/
export const isMediaFavourite = async (
  fetcher: typeof fetch = fetch,
  id: string,
): Promise<boolean> => {
  const res = await fetcher(`/api/media/${id}/favourite/`)
  if (!res.ok) return false
  const { is_favourite } = await res.json()
  return is_favourite
}

// POST /api/media/:id/favourite/
export const addMediaFavourite = async (
  fetcher: typeof fetch = fetch,
  id: string,
): Promise<void> => {
  const res = await fetcher(`/api/media/${id}/favourite/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  })
  if (res.status === 401) {
    throw new Error('Unauthorised')
  }
  if (!res.ok) throw new Error('Failed to add favourite')
}

// DELETE /api/media/:id/favourite/
export const removeMediaFavourite = async (
  fetcher: typeof fetch = fetch,
  id: string,
): Promise<void> => {
  const res = await fetcher(`/api/media/${id}/favourite/`, {
    method: 'DELETE',
  })
  if (res.status === 401) {
    throw new Error('Unauthorised')
  }
  if (!res.ok) throw new Error('Failed to remove favourite')
}
