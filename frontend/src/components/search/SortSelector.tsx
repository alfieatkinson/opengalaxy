// src/components/search/SortButton.tsx

'use client'

import { useState } from 'react'
import { ChevronUp as ChevronUpIcon, ChevronDown as ChevronDownIcon } from 'lucide-react'
import Dropdown from '@/components/shared/Dropdown'

interface SortButtonProps {
  initialSortBy: 'relevance' | 'indexed_on'
  initialSortDir: 'asc' | 'desc'
  onSortChange: (newSortBy: 'relevance' | 'indexed_on', newSortDir: 'asc' | 'desc') => void
}

const SortButton = ({ initialSortBy, initialSortDir, onSortChange }: SortButtonProps) => {
  const [sortBy, setSortBy] = useState(initialSortBy)
  const [sortDir, setSortDir] = useState(initialSortDir)

  return (
    <div className="flex flex-row gap-2">
      <Dropdown
        trigger={
          <button className="btn btn-outline btn-sm">
            Sort by: {sortBy === 'relevance' ? 'Relevance' : 'Date Added'}
          </button>
        }
        items={[
          {
            label: 'Relevance',
            onClick: () => {
              setSortBy('relevance')
              onSortChange('relevance', sortDir)
            },
          },
          {
            label: 'Date Added',
            onClick: () => {
              setSortBy('indexed_on')
              onSortChange('indexed_on', sortDir)
            },
          },
        ]}
      />
      <button
        className="btn btn-outline btn-sm"
        onClick={() => {
          setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
          onSortChange(sortBy, sortDir === 'asc' ? 'desc' : 'asc')
        }}
      >
        {sortDir === 'asc' ? (
          <ChevronUpIcon className="w-4 h-4" />
        ) : (
          <ChevronDownIcon className="w-4 h-4" />
        )}
      </button>
    </div>
  )
}

export default SortButton
