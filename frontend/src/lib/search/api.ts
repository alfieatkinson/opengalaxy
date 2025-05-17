// src/lib/search/types.ts

import type { SearchAPIResponse } from '@/lib/search/types'

export const fetchSearchResults = async (
  query: string,
  page: number = 1,
  pageSize: number = 18,
  mature: boolean = false,
  sortBy: 'relevance' | 'indexed_on' = 'relevance',
  sortOrder: 'desc' | 'asc' = 'desc',
): Promise<SearchAPIResponse> => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/search/?q=${encodeURIComponent(query)}&page=${page}&page_size=${pageSize}&mature=${mature.toString()}&sort_by=${sortBy}&sort_order=${sortOrder}`,
    { cache: 'no-store' },
  )
  if (!res.ok) throw new Error(`Search failed: ${res.statusText}`)
  return res.json() as Promise<SearchAPIResponse>
}
