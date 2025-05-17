// src/app/profile/[username]/favourites/page.tsx

'use client'

import React, { useEffect, useState } from 'react'
import { notFound, useParams, useSearchParams } from 'next/navigation'
import { User as UserIcon } from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import type { User } from '@/lib/profile/types'
import type { Media } from '@/lib/media/types'
import { getUserProfile, getUserFavs } from '@/lib/profile/api'
import MediaCard from '@/components/media/MediaCard'
import PageNavigator from '@/components/PageNavigator'

const FavouritesPage = () => {
  const { username } = useParams() as { username: string }
  const searchParams = useSearchParams()
  const page = Math.max(Number(searchParams.get('page') ?? '1'), 1)
  const pageSize = Math.max(Number(searchParams.get('page_size') ?? '12'), 1)

  const { authFetch: rawAuthFetch, user: me } = useAuth()

  const [loading, setLoading] = useState(true)
  const [isPrivate, setIsPrivate] = useState(false)
  const [profile, setProfile] = useState<User | null>(null)
  const [mediaList, setMediaList] = useState<Media[]>([])
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    if (!username) return
    ;(async () => {
      const fetcher = me
        ? (i: RequestInfo | URL, init?: RequestInit) => rawAuthFetch(i.toString(), init)
        : fetch

      try {
        // Check privacy & load profile
        const { private: privateFlag, profile: prof } = await getUserProfile(fetcher, username)
        if (!prof && !privateFlag) return notFound()

        setIsPrivate(privateFlag)
        setProfile(prof)
        if (privateFlag) {
          setLoading(false)
          return
        }

        // Fetch paginated favourites
        const favs = await getUserFavs(fetcher, username, page, pageSize)
        // extract raw Media[]
        setMediaList(favs.results.map((r) => r.media))
        setTotalPages(Math.ceil(favs.count / pageSize))
        setLoading(false)
      } catch (err) {
        console.error(err)
        notFound()
      }
    })()
  }, [username, page, pageSize])

  if (loading) {
    return <div className="p-6">Loading…</div>
  }

  // private profile fallback
  if (isPrivate && !profile) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <UserIcon size={64} className="mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-semibold">This profile is private</h2>
        <p className="text-gray-500 mt-2">
          {me?.username === username
            ? 'You can change this in Settings.'
            : 'The user has chosen to keep their favourites private.'}
        </p>
      </div>
    )
  }

  // no favourites at all
  if (mediaList.length === 0) {
    return (
      <div className="p-8">
        <p className="text-lg text-center text-gray-500">
          {`No favourites found for “${username}”.`}
        </p>
      </div>
    )
  }

  return (
    <div>
      <div className="p-8">
        <h1 className="text-3xl font-bold mb-4">{username}&rsquo;s Favourites</h1>
      </div>

      <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaList.map((media, i) => (
          <MediaCard key={i} media={media} />
        ))}
      </div>

      <PageNavigator
        basePath={`/profile/${username}/favourites`}
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
      />
    </div>
  )
}

export default FavouritesPage
