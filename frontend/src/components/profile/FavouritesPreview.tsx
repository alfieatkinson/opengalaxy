// src/components/profile/FavouritesPreview.tsx

'use client'

import { useRouter } from 'next/navigation'
import MediaCard from '@/components/media/MediaCard'
import { Media } from '@/lib/media/types'

interface FavouritesPreviewProps {
  username: string
  media: Media[]
}

const FavouritesPreview = ({ username, media }: FavouritesPreviewProps) => {
  const router = useRouter()

  return (
    <div className="max-w-180 w-full">
      <h2 className="text-2xl font-bold mb-4">Favourites</h2>
      {media && media.length > 0 ? (
        <div className="grid grid-cols-3 gap-4">
          {media.map((media, index) => (
            <MediaCard key={index} media={media} mini={true} />
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No favourites yet.</p>
      )}
      <button
        data-cy="view-all-favourites"
        className="btn btn-outline mt-4"
        onClick={() => router.push(`/profile/${username}/favourites`)}
      >
        View all favourites →
      </button>
    </div>
  )
}

export default FavouritesPreview
