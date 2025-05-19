// src/components/search/SearchSelector.tsx

'use client'

import { useState } from 'react'
import Dropdown from '@/components/shared/Dropdown'

interface SearchSelectorProps {
  initialSearchBy: 'query' | 'title' | 'tag' | 'creator'
  onSearchChange: (newSearchBy: 'query' | 'title' | 'tag' | 'creator') => void
}

const SearchSelector = ({ initialSearchBy, onSearchChange }: SearchSelectorProps) => {
  const [searchBy, setSearchBy] = useState(initialSearchBy)

  return (
    <Dropdown
      trigger={
        <button className="btn btn-outline btn-sm">
          Search by: {searchBy.charAt(0).toUpperCase() + searchBy.slice(1)}
        </button>
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
  )
}

export default SearchSelector
