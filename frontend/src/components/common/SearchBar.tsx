// src/components/common/SearchBar.tsx

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface SearchBarProps {
  placeholder: string
}

const SearchBar = ({ placeholder }: SearchBarProps) => {
  const [query, setQuery] = useState('')
  const router = useRouter()

  const handleSearch = async () => {
    if (!query.trim()) return
    console.log(`Search clicked with query: ${query}`)
    router.push(`/search?query=${encodeURIComponent(query)}`)
  }

  return (
    <div className="join w-full max-w-xl justify-center">
      <input
        className="input input-bordered join-item w-4/5"
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
          if (e.key === 'Enter') {
            handleSearch()
          }
        }}
      />
      <button className="btn btn-primary join-item w-1/5 ml-2" onClick={handleSearch}>
        Search
      </button>
    </div>
  )
}

export default SearchBar
