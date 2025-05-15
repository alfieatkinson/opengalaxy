// src/components/common/FavouriteButton.tsx

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Bookmark as BookmarkIcon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import { isMediaFavourite, addMediaFavourite, removeMediaFavourite } from '@/lib/media/api'

interface FavouriteButtonProps {
  mediaId: string
  size?: number
  onToggle?: (nowFavourite: boolean) => void
}

const FavouriteButton = ({ mediaId, size = 24, onToggle }: FavouriteButtonProps) => {
  const router = useRouter()
  const { authFetch: rawAuthFetch, user: me } = useAuth()
  const [isFav, setIsFav] = useState(false)

  // Wrap authFetch for fetcher
  const authFetch = (input: RequestInfo | URL, init?: RequestInit) =>
    rawAuthFetch(input.toString(), init)
  const fetcher = me ? authFetch : fetch

  // Check if media is favourited on mount or when user changes
  useEffect(() => {
    let mounted = true
    ;(async () => {
      try {
        const fav = await isMediaFavourite(fetcher, mediaId)
        if (mounted) setIsFav(fav)
      } catch (err) {
        console.error('Failed to fetch favourite status', err)
      }
    })()
    return () => {
      mounted = false
    }
  }, [mediaId, me])

  const toggleFav = async () => {
    if (!me) {
      router.push('/login')
      return
    }

    try {
      const next = !isFav
      if (next) {
        await addMediaFavourite(fetcher, mediaId)
      } else {
        await removeMediaFavourite(fetcher, mediaId)
      }
      setIsFav(next)
      onToggle?.(next)
    } catch (error) {
      console.error('Error toggling favourite:', error)
    }
  }

  return (
    <button onClick={toggleFav} aria-pressed={isFav} style={{ pointerEvents: 'auto' }}>
      <BookmarkIcon
        size={size}
        fill={isFav ? 'currentColor' : 'none'}
        className={
          isFav ? 'text-primary hover:text-secondary' : 'text-secondary hover:text-primary'
        }
      />
    </button>
  )
}

export default FavouriteButton
