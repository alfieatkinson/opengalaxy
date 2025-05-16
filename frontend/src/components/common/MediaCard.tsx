// src/components/common/MediaCard.tsx

'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Media } from '@/lib/media/types'
import FavouriteControl from '@/components/common/FavouriteControl'
import AudioWaveform from '@/components/common/AudioWaveform'

interface MediaCardProps {
  media: Media
  mini?: boolean
}

const MediaCard = ({ media, mini = false }: MediaCardProps) => {
  return (
    <div
      className={`group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow
        ${mini ? 'w-full h-40' : 'w-full h-56'}`}
    >
      <Link href={`/media/${media.openverse_id}`}>
        <div className="block w-full h-full">
          {media.media_type === 'audio' ? (
            <AudioWaveform src={media.url} height={mini ? 192 : 225} hideControls={true} />
          ) : media.thumbnail_url ? (
            <Image
              src={media.thumbnail_url}
              alt={media.title}
              width={mini ? 240 : 400}
              height={mini ? 192 : 225}
              className="object-cover w-full h-full"
            />
          ) : (
            <div className="w-full h-full bg-base-300 flex items-center justify-center">
              <p className="text-base-content text-opacity-50">No thumbnail available</p>
            </div>
          )}
        </div>
      </Link>

      <div
        className={`
          absolute flex items-end inset-0 bottom-0 left-0 w-full h-full
          bg-gradient-to-t from-base-100 via-transparent to-transparent
          p-2
          opacity-0 group-hover:opacity-100
          transition-opacity
        `}
        style={{ pointerEvents: 'none' }}
      >
        <div
          className={`w-full h-1/3 p-2 flex justify-between items-center
            ${mini ? 'text-xs' : 'text-sm'} text-white
+         `}
          style={{ pointerEvents: 'auto' }}
        >
          <Link href={`/media/${media.openverse_id}`}>
            <h3
              className={`font-semibold text-wrap truncate hover:underline ${mini ? 'text-sm' : 'text-base'}`}
            >
              {media.title}
            </h3>
          </Link>
          <div className="flex flex-grow" />
          {!mini && (
            <FavouriteControl
              mediaId={media.openverse_id}
              initialCount={media.favourites_count ?? 0}
              size={24}
              requireHover={true}
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default MediaCard
