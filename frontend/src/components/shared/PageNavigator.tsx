// src/components/shared/PageNavigator.tsx

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

interface PageNavigatorProps {
  basePath: string
  page: number
  totalPages: number
  pageSize: number
  hasMorePages?: boolean
}

const PageNavigator = ({
  basePath,
  page,
  totalPages,
  pageSize,
  hasMorePages = true,
}: PageNavigatorProps) => {
  const router = useRouter()
  const params = useSearchParams()

  const changePage = (to: number) => {
    const qp = new URLSearchParams(params.toString())
    qp.set('page', String(to))
    qp.set('page_size', String(pageSize))
    router.push(`${basePath}?${qp.toString()}`)
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
