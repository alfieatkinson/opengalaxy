// src/components/search/SearchClient.tsx

'use client'

import { Suspense } from 'react'
import SearchInner from '@/components/search/SearchInner'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

const SearchClient = () => {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <SearchInner />
    </Suspense>
  )
}

export default SearchClient
