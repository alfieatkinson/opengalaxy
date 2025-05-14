// src/components/common/MediaCard.tsx

import Image from 'next/image'
import { Media } from '@/lib/media/types'

interface MediaCardProps {
  media: Media
}

const MediaCard = ({ media }: MediaCardProps) => {
  return (
    <div className="card card-compact bg-base-100 shadow hover:shadow-xl transition-shadow h-full">
      {media.thumbnail_url && (
        <figure>
          <Image
            src={media.thumbnail_url}
            alt={media.title}
            width={400}
            height={225}
            className="object-cover w-full h-56"
          />
        </figure>
      )}
      <div className="card-body">
        <h2 className="card-title">{media.title}</h2>
        {media.attribution && <p className="text-sm line-clamp-3">{media.attribution}</p>}
      </div>
    </div>
  )
}

export default MediaCard
