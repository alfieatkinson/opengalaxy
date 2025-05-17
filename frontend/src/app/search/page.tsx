// src/app/search/page.tsx

import SearchClient from '@/components/search/SearchClient'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Search | OpenGalaxy',
  description: 'Search for open-licensed media on OpenGalaxy',
}

const SearchPage = () => {
  return <SearchClient />
}

export default SearchPage
