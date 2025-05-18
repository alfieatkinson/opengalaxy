// src/components/profile/FavouritesInner.tsx

'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

import { useAuth } from '@/context/AuthContext'
import type { User } from '@/lib/profile/types'
import type { Media } from '@/lib/media/types'
import { getUserProfile, getUserFavs } from '@/lib/profile/api'
import MediaCard from '@/components/media/MediaCard'
import PageNavigator from '@/components/shared/PageNavigator'
import PrivateProfile from '@/components/profile/PrivateProfile'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export interface FavouritesInnerProps {
  username: string
  page: number
  pageSize: number
}

const FavouritesInner = ({ username, page, pageSize }: FavouritesInnerProps) => {
  const [loading, setLoading] = useState(true)
  const [isPrivate, setIsPrivate] = useState(false)
  const [profile, setProfile] = useState<User | null>(null)
  const [mediaList, setMediaList] = useState<Media[]>([])
  const [totalPages, setTotalPages] = useState(1)

  const { authFetch: rawAuthFetch, user: me } = useAuth()

  useEffect(() => {
    let cancelled = false
    const fetchData = async () => {
      try {
        const fetcher = me
          ? (i: RequestInfo | URL, init?: RequestInit) => rawAuthFetch(i.toString(), init)
          : fetch

        const { private: privateFlag, profile: prof } = await getUserProfile(fetcher, username)
        if (!prof && !privateFlag) return notFound()

        if (!cancelled) {
          setIsPrivate(privateFlag)
          setProfile(prof)
        }
        if (privateFlag) {
          setLoading(false)
          return
        }

        const favs = await getUserFavs(fetcher, username, page, pageSize)
        if (!cancelled) {
          setMediaList(favs.results.map((r) => r.media))
          setTotalPages(Math.ceil(favs.count / pageSize))
        }
      } catch {
        notFound()
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    fetchData()
    return () => {
      cancelled = true
    }
  }, [username, page, pageSize, rawAuthFetch, me])

  if (loading) {
    return <LoadingSpinner />
  }

  if (isPrivate && !profile) {
    return <PrivateProfile username={username} />
  }

  if (mediaList.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">No favourites found for "{username}".</div>
    )
  }

  return (
    <>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">{username}'s Favourites</h1>
      </div>
      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaList.map((media) => (
          <MediaCard key={media.openverse_id} media={media} />
        ))}
      </div>
      <PageNavigator
        basePath={`/profile/${username}/favourites`}
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
      />
    </>
  )
}

export default FavouritesInner
