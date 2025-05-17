// src/components/common/PageNavigator.tsx

'use client'

import { useRouter } from 'next/navigation'
import React from 'react'

interface PageNavigatorProps {
  basePath: string
  queryParams?: Record<string, string>
  page: number
  totalPages: number
  pageSize: number
  hasMorePages?: boolean
}

const PageNavigator = ({
  basePath,
  queryParams = {},
  page,
  totalPages,
  pageSize,
  hasMorePages = true,
}: PageNavigatorProps) => {
  const router = useRouter()

  const changePage = (to: number) => {
    const params = new URLSearchParams(queryParams)
    params.set('page', String(to))
    params.set('page_size', String(pageSize))
    router.push(`${basePath}?${params.toString()}`)
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
        disabled={!hasMorePages || page >= totalPages}
        className="px-4 py-2 bg-gray-700 rounded disabled:opacity-50"
      >
        Next
      </button>
    </div>
  )
}

export default PageNavigator
