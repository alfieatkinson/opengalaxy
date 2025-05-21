// src/lib/search/types.ts

import type { SearchAPIResponse } from '@/lib/search/types'
import { SEARCH_KEYS } from '@/constants/search'
import type { PaginatedSearchHistory } from '@/lib/search/types'

const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/search`

export const fetchSearchResults = async (
  fetcher: typeof fetch = fetch,
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

  const res = await fetcher(`${BASE_URL}/?${params.toString()}`, { cache: 'no-store' })
  if (!res.ok) throw new Error(`Search failed: ${res.statusText}`)
  return res.json()
}

export const fetchSearchHistoryPreview = async (
  fetcher: typeof fetch = fetch,
): Promise<{ id: number; search_key: string; search_value: string; searched_at: string }[]> => {
  const res = await fetcher(`${BASE_URL}/history/preview/`, { credentials: 'include' })
  if (!res.ok) throw new Error(`Failed to fetch history preview: ${res.statusText}`)
  return res.json()
}

export const fetchSearchHistoryList = async (
  fetcher: typeof fetch = fetch,
  page = 1,
  pageSize = 50,
): Promise<PaginatedSearchHistory> => {
  const params = new URLSearchParams({
    page: String(page),
    page_size: String(pageSize),
  })
  const res = await fetcher(`${BASE_URL}/history/?${params.toString()}`, { credentials: 'include' })
  if (!res.ok) throw new Error(`Failed to fetch history list: ${res.statusText}`)
  return res.json() as Promise<PaginatedSearchHistory>
}

export const deleteSearchHistoryEntry = async (
  fetcher: typeof fetch = fetch,
  id: number,
): Promise<void> => {
  const res = await fetcher(`${BASE_URL}/history/${id}/`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`Failed to delete history entry: ${res.statusText}`)
}

export const clearSearchHistory = async (fetcher: typeof fetch = fetch): Promise<void> => {
  const res = await fetcher(`${BASE_URL}/history/clear/`, {
    method: 'DELETE',
    credentials: 'include',
  })
  if (!res.ok) throw new Error(`Failed to clear history: ${res.statusText}`)
}
