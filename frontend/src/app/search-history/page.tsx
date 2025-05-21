// src/app/search-history/page.tsx
import ClientOnly from '@/components/shared/ClientOnly'
import SearchHistoryInner from '@/components/search/SearchHistoryInner'

export const metadata = {
  title: 'Your Search History | OpenGalaxy',
  description: 'Review and manage your past search queries.',
}

export default function SearchHistoryPage() {
  return (
    <div className="flex flex-col items-center w-full mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Search History</h1>
      <ClientOnly>
        <SearchHistoryInner />
      </ClientOnly>
    </div>
  )
}
