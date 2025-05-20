// src/components/search/SortButton.tsx

'use client'

import { useState } from 'react'
import {
  ChevronUp as ChevronUpIcon,
  ChevronDown as ChevronDownIcon,
  ArrowUpDown as SortIcon,
} from 'lucide-react'
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
    <div className="flex flex-row gap-0 min-w-60 max-w-80">
      <Dropdown
        trigger={
          <div className="btn btn-outline btn-sm px-2 rounded-r-none">
            <SortIcon size={14} strokeWidth={3} />{' '}
            {sortBy === 'relevance' ? 'Relevance' : 'Date Added'}
          </div>
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
        className="btn btn-outline btn-sm px-2 rounded-l-none border-l-0"
        onClick={() => {
          setSortDir(sortDir === 'asc' ? 'desc' : 'asc')
          onSortChange(sortBy, sortDir === 'asc' ? 'desc' : 'asc')
        }}
      >
        {sortDir === 'asc' ? (
          <ChevronUpIcon size={16} strokeWidth={3} />
        ) : (
          <ChevronDownIcon size={16} strokeWidth={3} />
        )}
      </button>
    </div>
  )
}

export default SortButton
