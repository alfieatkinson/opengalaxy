// src/components/search/FilterBar.tsx

'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import FilterDropdown from '@/components/search/FilterDropdown'
import type { SearchFilters } from '@/lib/search/types'

type Collection = SearchFilters['collection']

interface Option {
  label: string
  value: string
}

const FilterBar = () => {
  const router = useRouter()
  const params = useSearchParams()

  // Read current filter state
  const collection = params.get('unstable__collection') as Collection | null
  const tag = params.get('unstable__tag') || undefined
  const source = params.get('source') || undefined
  const creator = params.get('creator') || undefined
  const sortBy = (params.get('sort_by') as 'relevance' | 'indexed_on') || 'relevance'
  const sortOrder = (params.get('sort_order') as 'desc' | 'asc') || 'desc'

  // State for the drop-down options
  const [tagOptions, setTagOptions] = useState<Option[]>([])
  const [sourceOptions, setSourceOptions] = useState<Option[]>([])
  const [creatorOptions, setCreatorOptions] = useState<Option[]>([])

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
    fetch(`${BASE_URL}/creators/`)
      .then((r) => r.json())
      .then((crs: string[]) => setCreatorOptions(crs.map((c) => ({ label: c, value: c }))))
  }, [])

  // Update the URL parameters based on the selected filter
  const updateParam = (key: string, value: string) => {
    const qp = new URLSearchParams(Array.from(params.entries()))
    if (value) qp.set(key, value)
    else qp.delete(key)
    router.push(`/search?${qp.toString()}`)
  }

  return (
    <div className="flex flex-wrap gap-4 py-8">
      <FilterDropdown
        title="Tag"
        options={tagOptions}
        selected={collection === 'tag' ? tag : undefined}
        onSelect={(val) => {
          updateParam('unstable__collection', 'tag')
          updateParam('unstable__tag', val)
        }}
      />
      <FilterDropdown
        title="Source"
        options={sourceOptions}
        selected={collection === 'source' ? source : undefined}
        onSelect={(val) => {
          updateParam('unstable__collection', 'source')
          updateParam('source', val)
        }}
      />
      <FilterDropdown
        title="Creator"
        options={creatorOptions}
        selected={collection === 'creator' ? creator : undefined}
        onSelect={(val) => {
          updateParam('unstable__collection', 'creator')
          updateParam('creator', val)
        }}
      />
      <FilterDropdown
        title="Sort"
        options={sortOptions}
        selected={`${sortBy},${sortOrder}`}
        onSelect={(val) => {
          const [sb, sd] = val.split(',') as ['relevance' | 'indexed_on', 'asc' | 'desc']
          updateParam('sort_by', sb)
          updateParam('sort_dir', sd)
        }}
      />
    </div>
  )
}

export default FilterBar
