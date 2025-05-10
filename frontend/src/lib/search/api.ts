// src/lib/search/types.ts

import type { SearchResult } from '@/lib/search/types'

import { mockData } from '@/lib/search/mockData'


export const fetchSearchResults = async (
  query: string
): Promise<SearchResult[]> => {
  return mockData

  const res = await fetch(
    `https://api.opengalaxy.alfieatkinson.dev/search?query=${encodeURIComponent(query)}`,
    { cache: 'no-store' }
  )
  
  if (!res.ok) {
    throw new Error('Failed to fetch search results')
  }
  return res.json()
}
