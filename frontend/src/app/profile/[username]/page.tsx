// src/app/profile/[username]/page.tsx

'use client'

import React, { useEffect, useState } from 'react'
import { notFound, useRouter, useParams } from 'next/navigation'
import { User as UserIcon } from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import MediaCard from '@/components/common/MediaCard'
import { User } from '@/lib/profile/types'
import { Media } from '@/lib/media/types'
import { getUserProfile, getUserFavs } from '@/lib/profile/api'

const ProfilePage = () => {
  const params = useParams()
  const router = useRouter()
  const { authFetch: rawAuthFetch, user: me } = useAuth()

  const username = params.username as string

  // wrap authFetch so it matches the standard fetch signature
  const authFetch = (input: RequestInfo | URL, init?: RequestInit) =>
    rawAuthFetch(input.toString(), init)

  const fetcher = me ? authFetch : fetch

  const [loading, setLoading] = useState(true)
  const [isPrivate, setIsPrivate] = useState(false)
  const [profile, setProfile] = useState<User | null>(null)
  const [favs, setFavs] = useState<Media[] | null>(null)

  useEffect(() => {
    if (!username) return
    ;(async () => {
      try {
        // Load the profile
        const { private: privateFlag, profile: prof } = await getUserProfile(fetcher, username)

        if (!prof && !privateFlag) return notFound()

        // 2) If it’s public, load the first few favourites
        let favList: Media[] = []
        if (!privateFlag) {
          favList = await getUserFavs(fetcher, username, 6)
        }

        setIsPrivate(privateFlag)
        setProfile(prof)
        setFavs(favList)
        setLoading(false)
      } catch {
        notFound()
      }
    })()
  }, [username, fetcher])

  if (loading) {
    return <div className="p-6">Loading…</div>
  }

  // Private and no profile data, show privacy fallback
  if (isPrivate && profile === null) {
    return (
      <div className="max-w-xl mx-auto p-6 text-center">
        <UserIcon size={64} className="mx-auto mb-4 text-gray-400" />
        <h2 className="text-2xl font-semibold">This profile is private</h2>
        <p className="text-gray-500 mt-2">
          {me?.username === username
            ? 'You can change this in Settings.'
            : 'The user has chosen to keep their details private.'}
        </p>
      </div>
    )
  }

  // We know profile is non-null from above
  const userProfile = profile!

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      {/* Basic info */}
      <div className="flex items-center space-x-4">
        <UserIcon size={48} />
        <div>
          <h1 className="text-3xl font-bold">{userProfile.username}</h1>
          <p>
            {userProfile.first_name} {userProfile.last_name}
          </p>
          <p className="text-sm text-gray-400">{userProfile.email}</p>
        </div>
      </div>

      {/* Favourites preview */}
      <section>
        <h2 className="text-2xl font-semibold mb-4">Favourites</h2>
        {favs && favs.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {favs.map((media, index) => (
              <MediaCard key={index} media={media} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            {isPrivate ? 'Favourites are hidden for private profiles.' : 'No favourites yet.'}
          </p>
        )}
        {!isPrivate && (
          <button className="btn btn-link mt-4" onClick={() => router.push('/favourites')}>
            View all favourites →
          </button>
        )}
      </section>

      {/* Quick settings shortcut */}
      {me?.username === username && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Quick Settings</h2>
          <ul className="space-y-2">
            <li>Public profile: {/* TODO: show real value */}</li>
            <li>Show sensitive: {/* TODO */}</li>
            <li>Blur sensitive: {/* TODO */}</li>
          </ul>
          <button className="btn btn-outline mt-2" onClick={() => router.push('/settings')}>
            Advanced settings →
          </button>
        </section>
      )}
    </div>
  )
}

export default ProfilePage
