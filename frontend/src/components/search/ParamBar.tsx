// src/components/search/FilterBar.tsx

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import SortSelector from '@/components/search/SortSelector'

const ParamBar = () => {
  const router = useRouter()
  const params = useSearchParams()

  // Read current filter state
  const sortBy = (params.get('sort_by') as 'relevance' | 'indexed_on') || 'relevance'
  const sortDir = (params.get('sort_dir') as 'desc' | 'asc') || 'desc'

  // Update the URL parameters based on the selected filters
  const setParams = (updates: Record<string, string | undefined>) => {
    const qp = new URLSearchParams(params.toString())

    // Apply each update
    for (const [key, val] of Object.entries(updates)) {
      if (val == null) qp.delete(key)
      else qp.set(key, val)
    }

    // If collection cleared, wipe its siblings
    if (updates.collection === undefined) {
      qp.delete('tag')
      qp.delete('source')
    }

    // Push the new URL
    router.push(`/search?${qp.toString()}`)
  }

  return (
    <div className="flex flex-row gap-4">
      <SortSelector
        initialSortBy={sortBy}
        initialSortDir={sortDir}
        onSortChange={(newSortBy, newSortDir) => {
          setParams({
            sort_by: newSortBy,
            sort_dir: newSortDir,
          })
        }}
      />
    </div>
  )
}

export default ParamBar
