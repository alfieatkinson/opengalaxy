// src/lib/search/types.ts

import type { SearchAPIResponse } from '@/lib/search/types'
import { SEARCH_KEYS } from '@/constants/search'

export const fetchSearchResults = async (
  searchBy: (typeof SEARCH_KEYS)[number],
  searchValue: string,
  page: number = 1,
  pageSize: number = 18,
  mediaType: 'image' | 'audio' = 'image',
  mature: boolean = false,
  sortBy: 'relevance' | 'indexed_on' = 'relevance',
  sortDir: 'desc' | 'asc' = 'desc',
  sources: string[] = [],
  licenses: string[] = [],
  extensions: string[] = [],
): Promise<SearchAPIResponse> => {
  const params = new URLSearchParams({
    [searchBy === 'query' ? 'q' : searchBy]: searchValue,
    page: String(page),
    page_size: String(pageSize),
    media_type: mediaType,
    mature: String(mature),
    sort_by: sortBy,
    sort_dir: sortDir,
  })

  if (sources.length) params.set('source', sources.join(','))
  if (licenses.length) params.set('license', licenses.join(','))
  if (extensions.length) params.set('extension', extensions.join(','))

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/search/?${params.toString()}`,
    { cache: 'no-store' },
  )
  if (!res.ok) throw new Error(`Search failed: ${res.statusText}`)
  return res.json()
}
