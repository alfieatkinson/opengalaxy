// src/components/search/FilterBar.tsx

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import FilterDropdown from '@/components/search/FilterDropdown'

interface Option {
  label: string
  value: string
}

const FilterBar = () => {
  const router = useRouter()
  const params = useSearchParams()

  // Read current filter state
  const tag = params.get('tag') || undefined
  const source = params.get('source') || undefined
  const sortBy = (params.get('sort_by') as 'relevance' | 'indexed_on') || 'relevance'
  const sortDir = (params.get('sort_dir') as 'desc' | 'asc') || 'desc'

  // State for the drop-down options
  const [tagOptions, setTagOptions] = useState<Option[]>([])
  const [sourceOptions, setSourceOptions] = useState<Option[]>([])

  const sortOptions = [
    { label: 'Relevance ↑', value: 'relevance,asc' },
    { label: 'Relevance ↓', value: 'relevance,desc' },
    { label: 'Date ↑', value: 'indexed_on,asc' },
    { label: 'Date ↓', value: 'indexed_on,desc' },
  ]

  // Fetch real lists on mount
  const BASE_URL = `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/media/filters`
  useEffect(() => {
    fetch(`${BASE_URL}/tags/`)
      .then((r) => r.json())
      .then((names: string[]) => setTagOptions(names.map((n) => ({ label: n, value: n }))))
    fetch(`${BASE_URL}/sources/`)
      .then((r) => r.json())
      .then((srcs: string[]) => setSourceOptions(srcs.map((s) => ({ label: s, value: s }))))
  }, [])

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
    <div className="flex flex-wrap gap-4 py-8">
      <FilterDropdown
        title="Tag"
        options={tagOptions}
        selected={params.get('collection') === 'tag' ? tag : undefined}
        onSelect={(val) => {
          setParams({
            collection: 'tag',
            tag: val,
            source: undefined,
          })
        }}
      />

      <FilterDropdown
        title="Source"
        options={sourceOptions}
        selected={params.get('collection') === 'source' ? source : undefined}
        onSelect={(val) => {
          setParams({
            collection: 'source',
            source: val,
            tag: undefined,
          })
        }}
      />

      <FilterDropdown
        title="Sort"
        options={sortOptions}
        selected={`${sortBy},${sortDir}`}
        onSelect={(val) => {
          const [sb, sd] = val.split(',') as ['relevance' | 'indexed_on', 'asc' | 'desc']
          setParams({
            sort_by: sb,
            sort_dir: sd,
          })
        }}
      />
    </div>
  )
}

export default FilterBar
