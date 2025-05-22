// src/components/media/MediaInner.tsx

'use client'

import { useState, useEffect } from 'react'
import { fetchMediaById } from '@/lib/media/api'
import { notFound } from 'next/navigation'
import FullSizeImage from '@/components/media/FullSizeImage'
import FavouriteControl from '@/components/media/FavouriteControl'
import AttributeCard from '@/components/media/AttributeCard'
import LinkButton from '@/components/shared/LinkButton'
import AudioWaveform from '@/components/media/AudioWaveform'
import type { Media } from '@/lib/media/types'
import {
  User as UserIcon,
  Maximize2 as MaxIcon,
  CalendarSearch as CalendarIcon,
  Music as MusicIcon,
  Scale as ScaleIcon,
  Tag as TagIcon,
  Paperclip as PaperclipIcon,
  Flame as FlameIcon,
  Database as DatabaseIcon,
  Globe as GlobeIcon,
} from 'lucide-react'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

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
            // You cannot call notFound() client-side; handle differently (redirect or show message)
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

  const formatDuration = (milliseconds: number): string => {
    const m = Math.floor(milliseconds / 60000)
    const s = Math.floor((milliseconds % 60000) / 1000)
    const ms = Math.floor((milliseconds % 1000) / 10)
    return `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  const formatFileSize = (bytes: number): string => {
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    if (bytes === 0) return '0 Bytes'
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`
  }

  return (
    <div className="">
      <div className="card h-full bg-base-100 shadow-lg">
        <div className="card-header w-full h-full">
          {media.media_type === 'audio' ? (
            <div className="flex flex-col items-center justify-center w-full h-fit my-6 py-8">
              <AudioWaveform src={media.url} />
            </div>
          ) : (
            <FullSizeImage media={media} />
          )}
        </div>
        <div className="card-body text-secondary">
          <div className="flex flex-row justify-between">
            <h1 className="text-2xl font-bold mb-2">{media.title}</h1>
            <div className="flex flex-row items-center ml-4 mb-4">
              <FavouriteControl
                mediaId={media.openverse_id}
                initialCount={media.favourites_count ?? 0}
                size={32}
              />
              <LinkButton href={media.foreign_landing_url} />
            </div>
          </div>
          <div className="flex gap-4 items-center justify-center flex-wrap">
            {media.creator && (
              <AttributeCard
                title="Creator"
                icon={<UserIcon size={24} />}
                text={media.creator}
                href={media.creator_url}
              />
            )}

            {media.source && (
              <AttributeCard
                title="Source"
                icon={<GlobeIcon size={24} />}
                text={media.source}
                href={
                  media.foreign_landing_url ? new URL(media.foreign_landing_url).origin : undefined
                }
              />
            )}

            {media.license && (
              <AttributeCard
                title="License"
                icon={<ScaleIcon size={24} />}
                text={`${media.license} ${media.license_version ?? ''}`}
                href={media.license_url}
              />
            )}

            {media.indexed_on && (
              <AttributeCard
                title="Indexed On"
                icon={<CalendarIcon size={24} />}
                text={new Date(media.indexed_on).toLocaleDateString()}
              />
            )}

            {media.category && (
              <AttributeCard title="Category" icon={<TagIcon size={24} />} text={media.category} />
            )}

            {media.mature && (
              <AttributeCard
                title="Mature"
                icon={<FlameIcon size={24} />}
                text="Sensitive content"
              />
            )}

            {media.file_type && (
              <AttributeCard
                title="File Type"
                icon={<PaperclipIcon size={24} />}
                text={media.file_type}
              />
            )}

            {media.file_size && (
              <AttributeCard
                title="File Size"
                icon={<DatabaseIcon size={24} />}
                text={formatFileSize(media.file_size)}
              />
            )}

            {media.media_type === 'image' && media.width && media.height && (
              <AttributeCard
                title="Dimensions"
                icon={<MaxIcon size={24} />}
                text={`${media.width}x${media.height}px`}
              />
            )}

            {media.media_type === 'audio' && media.duration && (
              <AttributeCard
                title="Duration"
                icon={<MusicIcon size={24} />}
                text={formatDuration(media.duration)}
              />
            )}
          </div>
        </div>
        <div className="card-footer flex flex-row justify-between px-6">
          <p className="mb-4 text-xs">{media.attribution}</p>
        </div>
      </div>
    </div>
  )
}

export default MediaInner
