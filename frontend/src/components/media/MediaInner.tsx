// src/components/media/MediaInner.tsx

'use client'

import { notFound } from 'next/navigation'
import { useState, useEffect } from 'react'
import { fetchMediaById } from '@/lib/media/api'
import type { Media } from '@/lib/media/types'
import LoadingSpinner from '@/components/shared/LoadingSpinner'
import MediaDetail from '@/components/media/MediaDetail'
import RelatedPreview from '@/components/media/RelatedPreview'

interface MediaInnerProps {
  uuid: string
}

const MediaInner = ({ uuid }: MediaInnerProps) => {
  const [media, setMedia] = useState<Media | undefined>(undefined)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(false)

    fetchMediaById(uuid)
      .then((data) => {
        if (!cancelled) {
          if (!data) {
            setError(true)
            setLoading(false)
          } else {
            setMedia(data)
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
  }, [uuid])

  if (loading) return <LoadingSpinner />
  if (error || !media) notFound()

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <MediaDetail media={media} />
      <RelatedPreview
        openverse_id={media.openverse_id}
        related={media.related_media || []} // Ensure related is defined
      />
    </div>
  )
}

export default MediaInner
