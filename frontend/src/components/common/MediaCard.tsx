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
}

const MediaCard = ({ media }: MediaCardProps) => {
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
    <div className="card card-compact bg-base-100 shadow hover:shadow-xl transition-shadow h-full">
      <Link key={media.openverse_id} href={`/media/${media.openverse_id}`}>
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
      </Link>
      <div className="card-body flex flex-row">
        <Link key={media.openverse_id} href={`/media/${media.openverse_id}`}>
          <h2 className="card-title hover:underline">{media.title}</h2>
        </Link>
        <div className="flex-grow" />
        <button onClick={toggleFav} className="flex items-center space-x-2 hover:opacity-80">
          <BookmarkIcon size={24} fill={isFav ? '#fff' : 'none'} />
        </button>
      </div>
    </div>
  )
}

export default MediaCard
