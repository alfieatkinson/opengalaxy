// src/components/search/SearchHistoryInner.tsx

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search as SearchIcon, Trash2 as TrashIcon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import {
  fetchSearchHistoryList,
  deleteSearchHistoryEntry,
  clearSearchHistory,
} from '@/lib/search/api'
import PageNavigator from '@/components/shared/PageNavigator'

interface HistoryItem {
  id: number
  search_key: string
  search_value: string
  searched_at: string
}

const SearchHistoryInner = () => {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  const searchParams = useSearchParams()
  const rawPage = searchParams.get('page')
  const rawPageSize = searchParams.get('page_size')

  const page = Math.max(Number(rawPage ?? '1'), 1)
  const pageSize = Math.max(Number(rawPageSize ?? '50'), 1)

  const { authFetch: rawAuthFetch, isLoggedIn } = useAuth()

  // Wrap authFetch so it matches the standard fetch signature
  const authFetch = (input: RequestInfo | URL, init?: RequestInit) =>
    rawAuthFetch(input.toString(), init)

  const load = (p: number) => {
    if (!isLoggedIn) return
    fetchSearchHistoryList(authFetch, p, pageSize)
      .then((data) => {
        setItems(data.results)
        setTotalPages(Math.ceil(data.count / pageSize))
      })
      .catch(console.error)
  }

  useEffect(() => {
    load(page)
  }, [page, isLoggedIn])

  const onDelete = (id: number) => {
    deleteSearchHistoryEntry(authFetch, id)
      .then(() => load(page))
      .catch(console.error)
  }

  const onClear = () => {
    clearSearchHistory(authFetch)
      .then(() => load(1))
      .catch(console.error)
  }

  if (!isLoggedIn) {
    return <p className="p-4 text-red-500">You must be signed in to view search history.</p>
  }

  return (
    <div className="flex flex-col gap-4 w-full max-w-200 p-4 bg-base-200 rounded-lg items-center justify-center">
      <div className="flex flex-row items-baseline justify-between w-full mb-4">
        <h2 className="text-lg font-semibold">Manage your search history:</h2>
        <button
          data-cy="clear-search-history"
          className="float-right btn btn-outline btn-error max-w-60"
          onClick={onClear}
          disabled={!items.length}
        >
          CLEAR SEARCH HISTORY
        </button>
      </div>
      {items.length ? (
        <div className="flex flex-col space-y-2 w-full">
          {items.map((item) => (
            <div
              data-cy={`search-history-item`}
              key={item.id}
              className="flex items-center btn-xs text-secondary "
              onClick={() =>
                router.push(
                  `/search?${item.search_key === 'q' ? 'query' : item.search_key}=${encodeURIComponent(item.search_value)}`,
                )
              }
            >
              <div className="flex items-center justify-between border-1 rounded-sm hover:text-primary hover:underline p-2 w-full">
                <div data-cy={`search-history-query`} className="flex items-center space-x-2">
                  <SearchIcon size={16} strokeWidth={3} />
                  <p className="text-sm">{`"${item.search_value}"${item.search_key === 'q' ? '' : `in '${item.search_key}s'`}`}</p>
                </div>
                <p data-cy={`search-history-date`} className="text-xs text-gray-500">
                  {new Date(item.searched_at).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <button
                data-cy={`search-history-delete`}
                className="btn btn-error ml-2 px-2"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(item.id)
                }}
              >
                <TrashIcon size={24} strokeWidth={2} />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No recent searches.</p>
      )}
      <PageNavigator
        basePath={'/search-history'}
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
      />
    </div>
  )
}

export default SearchHistoryInner
