// src/components/media/FullSizeImage.tsx

'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAuth } from '@/context/AuthContext'
import type { Media } from '@/lib/media/types'
import BlurOverlay from '@/components/media/BlurOverlay'

interface FullSizeImageProps {
  media: Media
}

const FullSizeImage = ({ media }: FullSizeImageProps) => {
  const [loaded, setLoaded] = useState(false)
  const { prefs } = useAuth()

  const blurSensitive = prefs.blur_sensitive

  useEffect(() => {
    const img = new window.Image()
    img.src = media.url
    img.onload = () => setLoaded(true)
  }, [media.url])

  return (
    <figure
      data-cy={`image-${media.openverse_id}`}
      className="relative w-full overflow-hidden aspect-[16/9] rounded-t-lg"
    >
      <BlurOverlay active={media.mature && blurSensitive}>
        <div className="relative w-full h-full">
          {media.thumbnail_url && (
            <Image
              src={media.thumbnail_url}
              alt={media.title}
              fill
              className={`object-contain transition-opacity duration-300 ${
                loaded ? 'opacity-0' : 'opacity-100'
              }`}
            />
          )}
          {loaded && (
            <img
              src={media.url}
              alt={media.title}
              className="absolute top-0 left-0 w-full h-full object-contain"
            />
          )}
        </div>
      </BlurOverlay>
    </figure>
  )
}

export default FullSizeImage
