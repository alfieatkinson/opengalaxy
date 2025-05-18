// src/components/profile/ProfileInner.tsx

'use client'

import React, { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { User } from '@/lib/profile/types'
import { Media } from '@/lib/media/types'
import { getUserProfile, getUserFavs } from '@/lib/profile/api'
import UserInfo from '@/components/profile/UserInfo'
import FavouritesPreview from '@/components/profile/FavouritesPreview'
import QuickSettings from '@/components/profile/QuickSettings'
import PrivateProfile from '@/components/profile/PrivateProfile'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

interface ProfileInnerProps {
  username: string
}

const ProfileInner = ({ username }: ProfileInnerProps) => {
  const { authFetch: rawAuthFetch, user: me } = useAuth()

  const [loading, setLoading] = useState(true)
  const [isPrivate, setIsPrivate] = useState(false)
  const [profile, setProfile] = useState<User | null>(null)
  const [mediaList, setMediaList] = useState<Media[]>([])

  useEffect(() => {
    if (!username) return
    ;(async () => {
      const fetcher = me
        ? (i: RequestInfo | URL, init?: RequestInit) => rawAuthFetch(i.toString(), init)
        : fetch

      try {
        const { private: privateFlag, profile: prof } = await getUserProfile(fetcher, username)

        if (!prof && !privateFlag) return notFound()

        if (!privateFlag) {
          const firstPage = await getUserFavs(fetcher, username, 1, 6)
          setMediaList(firstPage.results.map((item) => item.media))
        }

        setIsPrivate(privateFlag)
        setProfile(prof)
        setLoading(false)
      } catch {
        notFound()
      }
    })()
  }, [username])

  if (loading) return <LoadingSpinner />
  if (isPrivate && profile === null) return <PrivateProfile username={username} />

  const userProfile = profile!

  return (
    <div className="flex flex-col flex-grow mx-auto p-6 space-y-8 w-full">
      <div className="flex flex-row">
        <div>
          <UserInfo user={userProfile} />
          <div className="flex-grow" />
        </div>
        <div className="flex-grow" />
        {me?.username === username && <QuickSettings username={username} />}
      </div>
      <div className="flex-grow" />
      <div className="flex w-full items-center justify-center">
        <FavouritesPreview username={username} media={mediaList} />
      </div>
    </div>
  )
}

export default ProfileInner
