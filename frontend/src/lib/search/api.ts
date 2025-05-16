// src/lib/search/types.ts

import type { SearchAPIResponse } from '@/lib/search/types'

export const fetchSearchResults = async (
  query: string,
  page: number = 1,
  pageSize: number = 36,
  mature: boolean = true,
): Promise<SearchAPIResponse> => {
  const res = await fetch(
    `${process.env.BACKEND_API_URL}/api/search/?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}&mature=${mature.toString()}`,
    { cache: 'no-store' },
  )
  if (!res.ok) throw new Error(`Search failed: ${res.statusText}`)
  return res.json() as Promise<SearchAPIResponse>
}
