// src/components/search/FilterBar.tsx

'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import {
  TextSearch as TextSearchIcon,
  Funnel as FunnelIcon,
  Image as ImageIcon,
  Volume2 as AudioIcon,
  Flame as FlameIcon,
  EyeOff as EyeOffIcon,
} from 'lucide-react'
import SortSelector from '@/components/search/SortSelector'
import SearchSelector from '@/components/search/SearchSelector'
import FilterSelector from '@/components/search/FilterSelector'
import ToggleSelector from '@/components/search/ToggleSelector'
import { SEARCH_KEYS } from '@/constants/search'
import { SOURCE_FILTERS, LICENSE_FILTERS, EXTENSION_FILTERS } from '@/constants/filters'

type SearchKey = (typeof SEARCH_KEYS)[number]

interface ParamBarProps {
  defaultShowSensitive: boolean
}

const ParamBar = ({ defaultShowSensitive }: ParamBarProps) => {
  const router = useRouter()
  const params = useSearchParams()

  // Detect which search key is currently in the URL
  const searchBy: SearchKey = SEARCH_KEYS.find((key) => params.has(key)) ?? 'query'

  // Read current search value
  const searchValue = params.get(searchBy)?.trim() ?? ''

  // Read current sorting parameters
  const sortBy = (params.get('sort_by') as 'relevance' | 'indexed_on') || 'relevance'
  const sortDir = (params.get('sort_dir') as 'desc' | 'asc') || 'desc'

  // Read current filter parameters
  const mediaType = (params.get('media_type') as 'image' | 'audio') || 'image'

  // Update the URL parameters based on the selected filters
  const setParams = (updates: Record<string, string | undefined>) => {
    const qp = new URLSearchParams(params.toString())

    // Apply each update
    for (const [key, val] of Object.entries(updates)) {
      if (val == null) qp.delete(key)
      else qp.set(key, val)
    }

    // Push the new URL
    router.push(`/search?${qp.toString()}`)
  }

  return (
    <div className="flex flex-col gap-4 pt-4">
      <div className="flex flex-row items-center gap-4">
        <TextSearchIcon size={24} strokeWidth={2} />
        <SearchSelector
          initialSearchBy={searchBy}
          onSearchChange={(newSearchBy) => {
            setParams({
              [newSearchBy]: searchValue,
              [searchBy]: undefined,
              page: '1',
            })
          }}
        />
        <SortSelector
          initialSortBy={sortBy}
          initialSortDir={sortDir}
          onSortChange={(newSortBy, newSortDir) => {
            setParams({
              sort_by: newSortBy,
              sort_dir: newSortDir,
              page: '1',
            })
          }}
        />
      </div>
      <div className="flex flex-row items-center gap-4">
        <FunnelIcon size={24} strokeWidth={2} />
        <ToggleSelector
          paramKey="media_type"
          values={['audio', 'image']}
          icons={[<AudioIcon size={16} strokeWidth={3} />, <ImageIcon size={16} strokeWidth={3} />]}
        />
        <ToggleSelector
          paramKey="mature"
          values={['false', 'true']}
          icons={[
            <EyeOffIcon size={16} strokeWidth={3} />,
            <FlameIcon size={16} strokeWidth={3} />,
          ]}
          classNames={[
            'btn-outline',
            'btn-active text-orange-400 border-orange-400 hover:border-black',
          ]}
          defaultIndex={defaultShowSensitive ? 1 : 0}
        />
        <FilterSelector filterKey="source" options={SOURCE_FILTERS} activeGroup={mediaType} />
        <FilterSelector filterKey="license" options={LICENSE_FILTERS} activeGroup={mediaType} />
        <FilterSelector filterKey="extension" options={EXTENSION_FILTERS} activeGroup={mediaType} />
      </div>
    </div>
  )
}

export default ParamBar
