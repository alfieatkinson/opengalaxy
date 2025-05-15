// src/components/common/MediaCard.tsx

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Bookmark as BookmarkIcon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { Media } from '@/lib/media/types'
import { isMediaFavourite, addMediaFavourite, removeMediaFavourite } from '@/lib/media/api'

interface MediaCardProps {
  media: Media
  mini?: boolean
}

const MediaCard = ({ media, mini = false }: MediaCardProps) => {
  const router = useRouter()
  const { authFetch: rawAuthFetch, user: me } = useAuth()
  const [isFav, setIsFav] = useState(false)

  const authFetch = (input: RequestInfo | URL, init?: RequestInit) =>
    rawAuthFetch(input.toString(), init)

  const fetcher = me ? authFetch : fetch

  // Check if media is favourited on mount
  useEffect(() => {
    let mounted = true
    ;(async () => {
      const fav = await isMediaFavourite(fetcher, media.openverse_id)
      if (mounted) setIsFav(fav)
    })()
    return () => {
      mounted = false
    }
  }, [media.openverse_id, me])

  const toggleFav = async () => {
    // If not authenticated, redirect to login
    if (!me) return router.push('/login')

    try {
      if (isFav) {
        await removeMediaFavourite(fetcher, media.openverse_id)
        setIsFav(false)
      } else {
        await addMediaFavourite(fetcher, media.openverse_id)
        setIsFav(true)
      }
    } catch (error) {
      console.error('Error toggling favourite:', error)
    }
  }

  return (
    <div
      className={`group relative overflow-hidden rounded-lg shadow-lg hover:shadow-2xl transition-shadow
        ${mini ? 'w-full h-40' : 'w-full h-56'}`}
    >
      {/* Image */}
      <Link href={`/media/${media.openverse_id}`}>
        <div className="block w-full h-full">
          <Image
            src={media.thumbnail_url}
            alt={media.title}
            width={mini ? 240 : 400}
            height={mini ? 192 : 225}
            className="object-cover w-full h-full"
          />
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
            <button onClick={toggleFav} style={{ pointerEvents: 'auto' }}>
              <BookmarkIcon
                size={24}
                fill={isFav ? 'currentColor' : 'none'}
                className={isFav ? 'text-primary' : 'text-white'}
              />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default MediaCard
