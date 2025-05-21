// src/components/settings/SearchHistoryPreview.tsx

'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/context/AuthContext'
import { fetchSearchHistoryPreview } from '@/lib/search/api'
import { useRouter } from 'next/navigation'

interface HistoryItem {
  id: number
  query: string
  searched_at: string
}

const SearchHistoryPreview = () => {
  const router = useRouter()
  const [items, setItems] = useState<HistoryItem[]>([])
  const { authFetch: rawAuthFetch, isLoggedIn } = useAuth()

  // Wrap authFetch so it matches the standard fetch signature
  const authFetch = useCallback(
    (input: RequestInfo | URL, init?: RequestInit) => rawAuthFetch(input.toString(), init),
    [rawAuthFetch],
  )

  useEffect(() => {
    if (!isLoggedIn) return
    fetchSearchHistoryPreview(authFetch).then(setItems).catch(console.error)
  }, [authFetch, isLoggedIn])

  return (
    <div className="flex flex-col space-y-1 w-full rounded-lg border-1 p-4">
      <h2 className="text-lg font-semibold mb-3">Recent Searches</h2>
      {items.length ? (
        <div className="flex flex-col">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between btn-xs text-primary hover:underline"
              onClick={() => router.push(`/search?query=${encodeURIComponent(item.query)}`)}
            >
              <p className="text-sm">"{item.query}"</p>
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
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No recent searches.</p>
      )}
      <div className="flex-grow" />
      <button
        className="mt-2 btn btn-xs max-w-20 btn-outline hover:underline"
        onClick={() => router.push('/search-history')}
      >
        View all →
      </button>
    </div>
  )
}

export default SearchHistoryPreview
