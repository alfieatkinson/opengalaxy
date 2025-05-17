// src/components/search/SearchInner.tsx

'use client'

import { useState, useEffect } from 'react'
import { useSearchParams, notFound } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import type { Media } from '@/lib/media/types'
import type { SearchAPIResponse } from '@/lib/search/types'
import { fetchSearchResults } from '@/lib/search/api'
import MediaCard from '@/components/media/MediaCard'
import PageNavigator from '@/components/shared/PageNavigator'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

const SearchInner = () => {
  const params = useSearchParams()
  const { prefs } = useAuth()

  const query = params.get('query')?.trim() ?? ''
  const page = Math.max(Number(params.get('page') ?? '1'), 1)
  const perPage = Math.max(Number(params.get('page_size') ?? '18'), 1)
  const showSensitive = prefs.show_sensitive

  const [data, setData] = useState<SearchAPIResponse | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!query) return
    setLoading(true)
    fetchSearchResults(query, page, perPage, showSensitive)
      .then(setData)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [query, page, perPage, showSensitive])

  if (!query) {
    return (
      <div className="p-8">
        <p className="text-lg text-center text-gray-500">Please enter a search term.</p>
      </div>
    )
  }

  if (error) return notFound()
  if (loading || !data) return <LoadingSpinner />

  const { results, total_pages } = data

  if (results.length === 0) {
    return (
      <div className="p-8">
        <p className="text-lg text-center text-gray-500">No results found for "{query}".</p>
      </div>
    )
  }

  return (
    <div className="w-full">
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Search results for "{query}"</h1>
      </div>

      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((media: Media) => (
          <MediaCard key={media.openverse_id} media={media} />
        ))}
      </div>

      {results.length < perPage && (
        <div className="p-8 text-center text-sm text-gray-500">
          There are currently no further results due to Openverse API limitations.
        </div>
      )}

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
