// src/components/Hero.tsx

import Image from 'next/image'
import HighlightedText from '@/components/shared/HighlightedText'
import SearchBar from '@/components/search/SearchBar'
import ClientOnly from '@/components/shared/ClientOnly'

const Hero = () => {
  return (
    <div className="w-full lg:w-3/5 flex flex-col items-center justify-center">
      <div className="flex items-center mb-2">
        <h1 className="text-4xl xs:text-5xl font-bold">
          Open<HighlightedText>Galaxy</HighlightedText>
        </h1>
        <Image src="/icon0.svg" alt="Icon" width={80} height={80} />
      </div>
      <p className="hidden sm:flex text-center text-lg mb-4">
        Explore a universe of open-licence media, free for all.
      </p>
      <ClientOnly>
        <SearchBar placeholder="Search for open-licence media..." />
      </ClientOnly>
    </div>
  )
}

export default Hero
