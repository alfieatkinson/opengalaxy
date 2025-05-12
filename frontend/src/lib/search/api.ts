// src/lib/search/types.ts

import type { SearchAPIResponse } from '@/lib/search/types'

export const fetchSearchResults = async (
  query: string,
  page: number = 1,
  pageSize: number = 12,
): Promise<SearchAPIResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/search/?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}`,
    { cache: 'no-store' },
  )
  if (!res.ok) throw new Error(`Search failed: ${res.statusText}`)
  return res.json() as Promise<SearchAPIResponse>
}
