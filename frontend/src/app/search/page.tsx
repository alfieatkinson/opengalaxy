// src/app/search/page.tsx

import type { Metadata } from 'next'
import ClientOnly from '@/components/shared/ClientOnly'
import SearchInner from '@/components/search/SearchInner'

export const metadata: Metadata = {
  title: 'Search | OpenGalaxy',
  description: 'Search for open-licensed media on OpenGalaxy',
}

const SearchPage = () => {
  return (
    <ClientOnly>
      <SearchInner />
    </ClientOnly>
  )
}

export default SearchPage
