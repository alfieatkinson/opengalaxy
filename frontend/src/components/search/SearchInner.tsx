// src/components/search/SearchInner.tsx

'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, notFound } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import type { SearchAPIResponse, SearchFilters } from '@/lib/search/types'
import { fetchSearchResults } from '@/lib/search/api'
import PageNavigator from '@/components/shared/PageNavigator'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import FilterBar from '@/components/search/ParamBar'
import SearchResults from '@/components/search/SearchResults'

const SearchInner = () => {
  const params = useSearchParams()
  const { prefs } = useAuth()

  const [data, setData] = useState<SearchAPIResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  // Get the search query and pagination parameters from the URL
  const query = params.get('query')?.trim() ?? ''
  const page = Math.max(Number(params.get('page') ?? '1'), 1)
  const perPage = Math.max(Number(params.get('page_size') ?? '18'), 1)

  // Get the user's preferences for sensitive content
  const showSensitive = prefs.show_sensitive

  // re-derive filters from URL
  const filters: SearchFilters = {
    collection: params.get('collection') as SearchFilters['collection'] | undefined,
    tag: params.get('tag') || undefined,
    source: params.get('source') || undefined,
    creator: params.get('creator') || undefined,
  }
  const sortBy = (params.get('sort_by') as 'relevance' | 'indexed_on') || 'relevance'
  const sortDir = (params.get('sort_dir') as 'asc' | 'desc') || 'desc'

  useEffect(() => {
    if (!query) return
    setLoading(true)
    fetchSearchResults(query, page, perPage, showSensitive, sortBy, sortDir, filters)
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [
    query,
    page,
    perPage,
    showSensitive,
    sortBy,
    sortDir,
    filters.collection,
    filters.tag,
    filters.source,
  ])

  if (!query) return <p className="p-8 text-center">Enter a search term.</p>
  if (error) return notFound()

  const { results, total_pages } = data || {
    results: [],
    total_pages: 0,
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Search results for "{query}"</h1>
        <FilterBar />
      </div>

      <div className="flex-grow" />

      {!(loading || !data) ? (
        <SearchResults query={query} results={results} perPage={perPage} />
      ) : (
        <LoadingSpinner />
      )}

      <div className="flex-grow" />

      <PageNavigator
        basePath="/search"
        queryParams={{ query }}
        page={page}
        totalPages={total_pages}
        pageSize={perPage}
        hasMorePages={results.length === perPage}
      />
    </div>
  )
}

export default SearchInner
