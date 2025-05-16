// src/app/media/[uuid]/page.tsx

import { type Metadata } from 'next'
import { fetchMediaById } from '@/lib/media/api'
import { notFound } from 'next/navigation'
import FullSizeImage from '@/components/FullSizeImage'
import FavouriteControl from '@/components/common/FavouriteControl'
import AttributeCard from '@/components/common/AttributeCard'
import LinkButton from '@/components/common/LinkButton'
import AudioWaveform from '@/components/common/AudioWaveform'
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
} from 'lucide-react'

export const dynamic = 'force-dynamic'

interface MediaPageProps {
  params: Promise<{
    uuid: string
  }>
}

export const generateMetadata = async ({ params }: MediaPageProps): Promise<Metadata> => {
  const { uuid } = await params
  const media = await fetchMediaById(uuid)

  if (!media) {
    return {
      title: 'Media Not Found',
      description: 'The requested media could not be found.',
    }
  }

  return {
    title: media.title,
    description: media.attribution,
    openGraph: {
      images: [{ url: media.thumbnail_url }],
    },
  }
}

const MediaPage = async ({ params }: MediaPageProps) => {
  const { uuid } = await params
  const media = await fetchMediaById(uuid)

  if (!media) {
    notFound()
  }

  const formatDuration = (milliseconds: number): string => {
    const m = Math.floor(milliseconds / 60000)
    const s = Math.floor((milliseconds % 60000) / 1000)
    const ms = Math.floor((milliseconds % 1000) / 10)
    return `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
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
                text={`${(media.file_size / 1024).toFixed(2)} KB`}
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

export default MediaPage
