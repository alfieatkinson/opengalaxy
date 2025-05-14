// src/app/profile/[username]/page.tsx

'use client'

import React, { useEffect, useState } from 'react'
import { notFound, useParams } from 'next/navigation'
import { User as UserIcon } from 'lucide-react'

import { useAuth } from '@/context/AuthContext'
import { User } from '@/lib/profile/types'
import { Media } from '@/lib/media/types'
import { getUserProfile, getUserFavs } from '@/lib/profile/api'
import UserInfo from '@/components/UserInfo'
import FavouritesPreview from '@/components/FavouritesPreview'
import QuickSettings from '@/components/QuickSettings'

const ProfilePage = () => {
  const params = useParams()
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

        // If it’s public, load the first few favourites
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
    <div className="max-w-4xl mx-auto p-6 space-y-8 w-full">
      <div className="flex flex-row">
        <UserInfo user={userProfile} />
        <div className="flex-grow" />
        {!isPrivate && <QuickSettings username={username} />}
      </div>

      <FavouritesPreview username={username} favs={favs} isPrivate={isPrivate} />
    </div>
  )
}

export default ProfilePage
