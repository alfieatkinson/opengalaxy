// src/components/search/SearchResults.tsx

'use client'

import { Media } from '@/lib/media/types'
import MediaCard from '@/components/media/MediaCard'
import { SEARCH_KEYS } from '@/constants/search'

interface SearchResultsProps {
  searchBy: (typeof SEARCH_KEYS)[number]
  searchValue: string
  results: Media[]
  perPage: number
}

const SearchResults = ({ searchBy, searchValue, results, perPage }: SearchResultsProps) => {
  if (results.length === 0) {
    return (
      <div className="p-8">
        <p className="text-lg text-center text-gray-500">{`No results found for "${searchValue}"${searchBy === 'query' ? '' : ` in '${searchBy}'s`}.`}</p>
      </div>
    )
  }

  return (
    <div className="h-full">
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
    </div>
  )
}

export default SearchResults
