// src/app/search/page.tsx

import Link from 'next/link'
import type { SearchResult } from '@/lib/search/types'
import { fetchSearchResults } from '@/lib/search/api'
import MediaCard from '@/components/common/MediaCard'

interface SearchPageProps {
  searchParams: Promise<{
    query?: string
  }>
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { query } = await searchParams

  const queryTrimmed = query?.trim() ?? ''

  if (!queryTrimmed) {
    return (
      <div className="p-8">
        <p className="text-lg text-center text-gray-500">Please enter a search term.</p>
      </div>
    )
  }

  const results: SearchResult[] = await fetchSearchResults(queryTrimmed)

  if (results.length === 0) {
    return (
      <div className="p-8">
        <p className="text-lg text-center text-gray-500">
          No results found for &quot;{queryTrimmed}&quot;.
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Search results for &quot;{queryTrimmed}&quot;</h1>
      </div>
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((result) => (
          <Link key={result.id} href={`/media/${result.id}`}>
            <MediaCard
              title={result.title}
              description={result.description}
              imageUrl={result.imageUrl}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}

export default SearchPage
