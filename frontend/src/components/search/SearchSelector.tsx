// src/components/search/SearchSelector.tsx

'use client'

import { useState } from 'react'
import { Search as SearchIcon } from 'lucide-react'
import Dropdown from '@/components/shared/Dropdown'

interface SearchSelectorProps {
  initialSearchBy: 'query' | 'title' | 'tag' | 'creator'
  onSearchChange: (newSearchBy: 'query' | 'title' | 'tag' | 'creator') => void
}

const SearchSelector = ({ initialSearchBy, onSearchChange }: SearchSelectorProps) => {
  const [searchBy, setSearchBy] = useState(initialSearchBy)

  return (
    <div data-cy="search-selector">
      <Dropdown
        trigger={
          <div className="btn btn-outline btn-sm px-2">
            <SearchIcon size={14} strokeWidth={3} />{' '}
            {searchBy.charAt(0).toUpperCase() + searchBy.slice(1)}
          </div>
        }
        items={[
          {
            label: 'Query',
            onClick: () => {
              setSearchBy('query')
              onSearchChange('query')
            },
          },
          {
            label: 'Title',
            onClick: () => {
              setSearchBy('title')
              onSearchChange('title')
            },
          },
          {
            label: 'Tag',
            onClick: () => {
              setSearchBy('tag')
              onSearchChange('tag')
            },
          },
          {
            label: 'Creator',
            onClick: () => {
              setSearchBy('creator')
              onSearchChange('creator')
            },
          },
        ]}
      />
    </div>
  )
}

export default SearchSelector
