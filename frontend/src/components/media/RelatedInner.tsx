// src/components/media/RelatedInner.tsx

'use client'

import { useEffect, useState } from 'react'
import { notFound } from 'next/navigation'

import type { MediaShort } from '@/lib/media/types'
import { fetchMediaById } from '@/lib/media/api'
import MediaCard from '@/components/media/MediaCard'
import PageNavigator from '@/components/shared/PageNavigator'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

export interface RelatedInnerProps {
  openverse_id: string
  page: number
  pageSize: number
}

const RelatedInner = ({ openverse_id, page, pageSize }: RelatedInnerProps) => {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [originTitle, setOriginTitle] = useState('')
  const [mediaList, setMediaList] = useState<MediaShort[]>([])
  const [totalPages, setTotalPages] = useState(1)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)

    fetchMediaById(openverse_id)
      .then((data) => {
        if (!cancelled) {
          const relatedMedia = data?.related_media
          if (!relatedMedia) {
            setError(true)
            setLoading(false)
          } else {
            setOriginTitle(data.title)
            setTotalPages(Math.ceil(relatedMedia.length / pageSize))
            setMediaList(relatedMedia.slice((page - 1) * pageSize, page * pageSize))
            setLoading(false)
          }
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(true)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [openverse_id, page, pageSize])

  if (loading) return <LoadingSpinner />
  if (error || !mediaList) notFound()

  if (mediaList.length === 0) {
    return <div className="p-8 text-center text-gray-500">No related media found.</div>
  }

  return (
    <>
      <div className="w-full p-8">
        <h1 className="text-3xl font-bold mb-4">Media related to "{originTitle}":</h1>
      </div>
      <div className="card h-full bg-base-100 shadow-lg p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaList.map((media) => (
          <MediaCard key={media.openverse_id} media={media} />
        ))}
      </div>
      <PageNavigator
        basePath={`/media/${openverse_id}/related`}
        page={page}
        totalPages={totalPages}
        pageSize={pageSize}
      />
    </>
  )
}

export default RelatedInner
