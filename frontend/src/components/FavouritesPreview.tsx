// src/components/FavouritesPreview.tsx

'use client'

import { useRouter } from 'next/navigation'
import { Media } from '@/lib/media/types'
import MediaCard from '@/components/common/MediaCard'

interface FavouritesPreviewProps {
  favs: Media[] | null
  isPrivate: boolean
}

const FavouritesPreview = ({ favs, isPrivate }: FavouritesPreviewProps) => {
  const router = useRouter()

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Favourites</h2>
      {isPrivate ? (
        <p>This profile is private. You cannot see the favourites.</p>
      ) : favs && favs.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {favs.map((media, index) => (
            <MediaCard key={index} media={media} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No favourites yet.</p>
      )}
      {!isPrivate && (
        <button className="btn btn-outline mt-4" onClick={() => router.push('/favourites')}>
          View all favourites →
        </button>
      )}
    </div>
  )
}

export default FavouritesPreview
