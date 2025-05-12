// src/components/PageNavigator.tsx

'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

interface PageNavigatorProps {
  query: string
  page: number
  totalPages: number
  pageSize: number
}

const PageNavigator = ({ query, page, totalPages, pageSize }: PageNavigatorProps) => {
  const router = useRouter()

  const changePage = (to: number) => {
    const params = new URLSearchParams()
    params.set('query', query)
    params.set('page', String(to))
    params.set('page_size', String(pageSize))
    router.push(`/search?${params.toString()}`)
  }

  return (
    <div className="flex justify-center items-center space-x-4 my-8">
      <button
        onClick={() => changePage(page - 1)}
        disabled={page <= 1}
        className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
      >
        Previous
      </button>
      <span>
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => changePage(page + 1)}
        disabled={page >= totalPages}
        className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}

export default PageNavigator
