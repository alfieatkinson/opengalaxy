// src/components/search/SearchInner.tsx

'use client'

import { useState, useEffect, useMemo } from 'react'
import { useSearchParams, notFound } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import type { SearchAPIResponse } from '@/lib/search/types'
import { fetchSearchResults } from '@/lib/search/api'
import PageNavigator from '@/components/shared/PageNavigator'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import ParamBar from '@/components/search/ParamBar'
import SearchResults from '@/components/search/SearchResults'
import { SEARCH_KEYS } from '@/constants/search'
import { getCachedSearch, setCachedSearch } from '@/lib/search/cache'

const SearchInner = () => {
  const params = useSearchParams()
  const { prefs, authFetch, isLoggedIn } = useAuth()

  const [data, setData] = useState<SearchAPIResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  // Get the pagination parameters from the URL
  const page = Math.max(Number(params.get('page') ?? '1'), 1)
  const perPage = Math.max(Number(params.get('page_size') ?? '18'), 1)

  // Get the media type from the URL
  const mediaType = (params.get('media_type') as 'image' | 'audio') || 'image'

  // Get the mature flag from the URL or use user's preferences for sensitive content
  const showSensitive = params.get('mature')
    ? params.get('mature') === 'true'
    : prefs.show_sensitive

  // Get the search key from the URL
  const searchBy = SEARCH_KEYS.find((key) => params.has(key)) ?? 'query'
  const searchValue = params.get(searchBy)?.trim() ?? ''

  // Get sorting parameters from the URL
  const sortBy = (params.get('sort_by') as 'relevance' | 'indexed_on') || 'relevance'
  const sortDir = (params.get('sort_dir') as 'asc' | 'desc') || 'desc'

  // Get the filter parameters from the URL, stabilising to prevent unnecessary re-renders
  const paramString = params.toString()
  const sources = useMemo(
    () => (params.get('source') ?? '').split(',').filter(Boolean),
    [paramString],
  )
  const licenses = useMemo(
    () => (params.get('license') ?? '').split(',').filter(Boolean),
    [paramString],
  )
  const extensions = useMemo(
    () => (params.get('extension') ?? '').split(',').filter(Boolean),
    [paramString],
  )

  // Check if the search results are already cached
  const cacheKey = useMemo(() => {
    const stableParams = new URLSearchParams()

    stableParams.set(searchBy, searchValue)
    stableParams.set('page', page.toString())
    stableParams.set('page_size', perPage.toString())
    stableParams.set('media_type', mediaType)
    stableParams.set('mature', String(showSensitive))
    stableParams.set('sort_by', sortBy)
    stableParams.set('sort_dir', sortDir)
    if (sources.length) stableParams.set('source', sources.join(','))
    if (licenses.length) stableParams.set('license', licenses.join(','))
    if (extensions.length) stableParams.set('extension', extensions.join(','))

    return stableParams.toString()
  }, [
    searchBy,
    searchValue,
    page,
    perPage,
    mediaType,
    showSensitive,
    sortBy,
    sortDir,
    sources.join(','),
    licenses.join(','),
    extensions.join(','),
    prefs.show_sensitive,
  ])

  useEffect(() => {
    if (!searchValue) return

    const cached = getCachedSearch(cacheKey)
    if (cached) {
      setData(cached)
      return
    }

    const fetcher = isLoggedIn
      ? (input: RequestInfo | URL, init?: RequestInit) => authFetch(input.toString(), init)
      : fetch

    setLoading(true)
    fetchSearchResults(
      fetcher,
      searchBy,
      searchValue,
      page,
      perPage,
      mediaType,
      showSensitive,
      sortBy,
      sortDir,
      sources,
      licenses,
      extensions,
    )
      .then((res) => {
        setCachedSearch(cacheKey, res)
        setData(res)
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [cacheKey, searchValue, authFetch, isLoggedIn])

  if (!searchValue) return <p className="p-8 text-center">Enter a search term.</p>
  if (error) return notFound()

  const { results, total_pages } = data || {
    results: [],
    total_pages: 0,
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">{`Search results for "${searchValue}"${searchBy === 'query' ? '' : ` in '${searchBy}s'`}`}</h1>
        <ParamBar defaultShowSensitive={showSensitive} />
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
        page={page}
        totalPages={total_pages}
        pageSize={perPage}
        hasMorePages={results.length === perPage}
      />
    </div>
  )
}

export default SearchInner
