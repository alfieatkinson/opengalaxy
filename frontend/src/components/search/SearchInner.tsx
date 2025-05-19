// src/components/search/SearchInner.tsx

'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, notFound } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import type { SearchAPIResponse } from '@/lib/search/types'
import { fetchSearchResults } from '@/lib/search/api'
import PageNavigator from '@/components/shared/PageNavigator'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import ParamBar from '@/components/search/ParamBar'
import SearchResults from '@/components/search/SearchResults'
import { SEARCH_KEYS } from '@/constants/search'

const SearchInner = () => {
  const params = useSearchParams()
  const { prefs } = useAuth()

  const [data, setData] = useState<SearchAPIResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  // Get the pagination parameters from the URL
  const page = Math.max(Number(params.get('page') ?? '1'), 1)
  const perPage = Math.max(Number(params.get('page_size') ?? '18'), 1)

  // Get the user's preferences for sensitive content
  const showSensitive = prefs.show_sensitive

  // Get the search key from the URL
  const searchBy = SEARCH_KEYS.find((key) => params.has(key)) ?? 'query'
  const searchValue = params.get(searchBy)?.trim() ?? ''

  // Get the filters from the URL
  const sortBy = (params.get('sort_by') as 'relevance' | 'indexed_on') || 'relevance'
  const sortDir = (params.get('sort_dir') as 'asc' | 'desc') || 'desc'

  useEffect(() => {
    if (!searchValue) return
    setLoading(true)
    fetchSearchResults(searchBy, searchValue, page, perPage, showSensitive, sortBy, sortDir)
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [searchValue, page, perPage, showSensitive, sortBy, sortDir, searchBy])

  if (!searchValue) return <p className="p-8 text-center">Enter a search term.</p>
  if (error) return notFound()

  const { results, total_pages } = data || {
    results: [],
    total_pages: 0,
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Search results for "{searchValue}"</h1>
        <ParamBar />
      </div>

      <div className="flex-grow" />

      {!(loading || !data) ? (
        <SearchResults
          searchBy={searchBy}
          searchValue={searchValue}
          results={results}
          perPage={perPage}
        />
      ) : (
        <LoadingSpinner />
      )}

      <div className="flex-grow" />

      <PageNavigator
        basePath="/search"
        queryParams={{ [searchBy]: searchValue }}
        page={page}
        totalPages={total_pages}
        pageSize={perPage}
        hasMorePages={results.length === perPage}
      />
    </div>
  )
}

export default SearchInner
