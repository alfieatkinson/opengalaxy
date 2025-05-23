// src/components/Hero.tsx

import HighlightedText from '@/components/shared/HighlightedText'
import SearchBar from '@/components/search/SearchBar'
import ClientOnly from '@/components/shared/ClientOnly'

const Hero = () => {
  return (
    <div className="w-3/5 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-4">
        Open<HighlightedText>Galaxy</HighlightedText>
      </h1>
      <p className="text-lg mb-8">Explore a universe of open-license media, free for all.</p>
      <ClientOnly>
        <SearchBar placeholder="Search for open-license media..." />
      </ClientOnly>
    </div>
  )
}

export default Hero
