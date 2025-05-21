// src/lib/search/types.ts

import type { Media } from '@/lib/media/types'

export interface SearchAPIResponse {
  results: Media[]
  page: number
  page_size: number
  total_count: number
  total_pages: number
}

export interface SearchFilters {
  collection?: 'tag' | 'source' | 'creator'
  tag?: string
  source?: string
  creator?: string
}

export interface PaginatedSearchHistory {
  results: { id: number; query: string; searched_at: string }[]
  page: number
  page_size: number
  total_count: number
  total_pages: number
}
