// src/components/search/SearchBar.tsx

'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Search as SearchIcon } from 'lucide-react'
import { SEARCH_KEYS } from '@/constants/search'

type SearchKey = (typeof SEARCH_KEYS)[number]

interface SearchBarProps {
  placeholder: string
}

const SearchBar = ({ placeholder }: SearchBarProps) => {
  const router = useRouter()
  const params = useSearchParams()

  const searchBy: SearchKey = SEARCH_KEYS.find((key) => params.has(key)) ?? 'query'

  const [searchValue, setSearchValue] = useState(params.get(searchBy) ?? '')

  const handleSearch = async () => {
    if (!searchValue.trim()) return
    const qp = new URLSearchParams(params.toString())
    qp.set(searchBy, searchValue.trim())
    qp.set('page', '1')
    qp.set('page_size', '18')
    router.push(`/search?${qp.toString()}`)
  }

  return (
    <div className="join w-full min-w-3xs max-w-2xl justify-center">
      <input
        className="input input-bordered join-item w-4/5"
        type="text"
        placeholder={placeholder}
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            handleSearch()
          }
        }}
      />
      <button
        data-cy="search-button"
        className="btn btn-primary join-item px-2 shadow-none"
        onClick={handleSearch}
      >
        <SearchIcon size={24} strokeWidth={3} />
      </button>
    </div>
  )
}

export default SearchBar
