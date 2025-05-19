// src/lib/search/types.ts

import type { SearchAPIResponse } from '@/lib/search/types'
import type { SearchFilters } from '@/lib/search/types'

export const fetchSearchResults = async (
  query: string,
  page = 1,
  pageSize = 18,
  mature = false,
  sortBy: 'relevance' | 'indexed_on' = 'relevance',
  sortOrder: 'desc' | 'asc' = 'desc',
  filters: SearchFilters = {},
): Promise<SearchAPIResponse> => {
  const params = new URLSearchParams({
    q: query,
    page: String(page),
    page_size: String(pageSize),
    mature: String(mature),
    sort_by: sortBy,
    sort_dir: sortOrder,
  })

  if (filters.collection) params.set('unstable__collection', filters.collection)
  if (filters.tag) params.set('unstable__tag', filters.tag)
  if (filters.source) params.set('source', filters.source)
  if (filters.creator) params.set('creator', filters.creator)

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/search/?${params.toString()}`,
    { cache: 'no-store' },
  )
  if (!res.ok) throw new Error(`Search failed: ${res.statusText}`)
  return res.json()
}
