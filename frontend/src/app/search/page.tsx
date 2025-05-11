// src/app/search/page.tsx

import Link from 'next/link'
import { notFound } from 'next/navigation'
import type { Media } from '@/lib/media/types'
import type { SearchAPIResponse } from '@/lib/search/types'
import { fetchSearchResults } from '@/lib/search/api'
import MediaCard from '@/components/common/MediaCard'
import PageNavigator from '@/components/PageNavigator'

interface SearchPageProps {
  searchParams: Promise<{
    query?: string
    page?: string
    page_size?: string
  }>
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const params = await searchParams
  const query = params.query?.trim() ?? ''
  const page = Math.max(parseInt(params.page ?? '1', 10), 1)
  const perPage = Math.max(parseInt(params.page_size ?? '12', 10), 1)

  if (!query) {
    return (
      <div className="p-8">
        <p className="text-lg text-center text-gray-500">Please enter a search term.</p>
      </div>
    )
  }

  let data: SearchAPIResponse
  try {
    data = await fetchSearchResults(query, page, perPage)
  } catch (err) {
    console.error(err)
    return notFound()
  }

  const { results, total_pages } = data

  if (results.length === 0) {
    return (
      <div className="p-8">
        <p className="text-lg text-center text-gray-500">No results found for “{query}”.</p>
      </div>
    )
  }

  return (
    <div>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Search results for “{query}”</h1>
      </div>

      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((r: Media) => (
          <Link key={r.openverse_id} href={`/media/${r.openverse_id}`}>
            <MediaCard title={r.title} description={r.attribution} imageUrl={r.thumbnail_url} />
          </Link>
        ))}
      </div>

      <PageNavigator query={query} page={page} totalPages={total_pages} pageSize={perPage} />
    </div>
  )
}

export default SearchPage
