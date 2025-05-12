// src/components/FullSizeImage.tsx

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import type { Media } from '@/lib/media/types'

interface FullSizeImageProps {
  media: Media
}

const FullSizeImage = ({ media }: FullSizeImageProps) => {
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    const img = new window.Image()
    img.src = media.url
    img.onload = () => setLoaded(true)
  }, [media.url])

  return (
    <figure className="relative w-full overflow-hidden">
      <div className="relative w-full aspect-[16/9]">
        {/* Thumbnail */}
        <Image
          src={media.thumbnail_url}
          alt={media.title}
          fill
          className={`object-contain transition-opacity duration-300 ${
            loaded ? 'opacity-0' : 'opacity-100'
          }`}
        />

        {/* Full image */}
        {loaded && (
          <img
            src={media.url}
            alt={media.title}
            className="absolute top-0 left-0 w-full h-full object-contain"
          />
        )}
      </div>
    </figure>
  )
}

export default FullSizeImage
