// src/components/search/SearchHistoryInner.tsx

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Search as SearchIcon, Trash2 as TrashIcon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import {
  fetchSearchHistoryList,
  deleteSearchHistoryEntry,
  clearSearchHistory,
} from '@/lib/search/api'

interface HistoryItem {
  id: number
  query: string
  searched_at: string
}

const SearchHistoryInner = () => {
  const [items, setItems] = useState<HistoryItem[]>([])
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()
  const { authFetch: rawAuthFetch, isLoggedIn } = useAuth()

  // Wrap authFetch so it matches the standard fetch signature
  const authFetch = (input: RequestInfo | URL, init?: RequestInit) =>
    rawAuthFetch(input.toString(), init)

  const load = (p: number) => {
    if (!isLoggedIn) return
    fetchSearchHistoryList(authFetch, p)
      .then((data) => {
        setItems(data.results)
        setTotalPages(data.total_pages)
        setPage(data.page)
      })
      .catch(console.error)
  }

  useEffect(() => {
    load(page)
  }, [page, authFetch, isLoggedIn])

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
              key={item.id}
              className="flex items-center btn-xs text-secondary "
              onClick={() => router.push(`/search?query=${encodeURIComponent(item.query)}`)}
            >
              <div className="flex items-center justify-between border-1 rounded-sm hover:text-primary hover:underline p-2 w-full">
                <div className="flex items-center space-x-2">
                  <SearchIcon size={16} strokeWidth={3} />
                  <p className="text-sm">"{item.query}"</p>
                </div>
                <p className="text-xs text-gray-500">
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

      <div className="flex items-center space-x-4">
        <button
          className="px-2 py-1 border rounded"
          onClick={() => setPage((p) => Math.max(p - 1, 1))}
          disabled={page <= 1}
        >
          Prev
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          className="px-2 py-1 border rounded"
          onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
          disabled={page >= totalPages}
        >
          Next
        </button>
      </div>
    </div>
  )
}

export default SearchHistoryInner
