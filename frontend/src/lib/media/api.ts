// src/lib/media/api.ts

import type { Media } from '@/lib/media/types'

export async function fetchMediaById(id: string): Promise<Media> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/media/${encodeURIComponent(id)}`, {
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`Failed to fetch media with id ${id}`)
  }
  return res.json()
}

// List endpoint here
// export async function fetchMediaList(): Promise<Media[]> { … }
