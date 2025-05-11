// src/app/search/page.tsx

'use client'

import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import type { Media } from '@/lib/media/types'
import type { SearchAPIResponse } from '@/lib/search/types'
import { fetchSearchResults } from '@/lib/search/api'
import MediaCard from '@/components/common/MediaCard'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const query = searchParams.get('query')?.trim() ?? ''
  const page = parseInt(searchParams.get('page') ?? '1', 10)
  const perPage = parseInt(searchParams.get('page_size') ?? '20', 10)

  // Kick off the data fetch
  const { results, total_pages } = fetchSearchResults(
    query,
    page,
    perPage,
  ) as unknown as SearchAPIResponse

  if (!query) {
    return (
      <div className="p-8">
        <p className="text-lg text-center text-gray-500">Please enter a search term.</p>
      </div>
    )
  }

  if (results.length === 0) {
    return (
      <div className="p-8">
        <p className="text-lg text-center text-gray-500">
          No results found for &quot;{query}&quot;.
        </p>
      </div>
    )
  }

  function changePage(to: number) {
    router.push(`?query=${encodeURIComponent(query)}&page=${to}&page_size=${perPage}`)
  }

  return (
    <div>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">Search: “{query}”</h1>
      </div>

      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((r: Media) => (
          <Link key={r.openverse_id} href={`/media/${r.openverse_id}`}>
            <MediaCard title={r.title} description={r.attribution} imageUrl={r.thumbnail_url} />
          </Link>
        ))}
      </div>

      <div className="flex justify-center items-center space-x-4 my-8">
        <button
          onClick={() => changePage(page - 1)}
          disabled={page <= 1}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <span>
          Page {page} of {total_pages}
        </span>
        <button
          onClick={() => changePage(page + 1)}
          disabled={page >= total_pages}
          className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  )
}
