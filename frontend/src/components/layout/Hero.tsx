// src/components/Hero.tsx

import HighlightedText from '@/components/shared/HighlightedText'
import SearchBar from '@/components/search/SearchBar'
import ClientOnly from '@/components/shared/ClientOnly'

const Hero = () => {
  return (
    <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
      <h1 className="text-5xl font-bold mb-6 sm:mb-2">
        Open<HighlightedText>Galaxy</HighlightedText>
      </h1>
      <p className="hidden sm:flex text-center text-lg mb-2">
        Explore a universe of open-licence media, free for all.
      </p>
      <ClientOnly>
        <SearchBar placeholder="Search for open-licence media..." />
      </ClientOnly>
    </div>
  )
}

export default Hero
