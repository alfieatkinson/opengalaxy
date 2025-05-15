// src/app/media/[uuid]/page.tsx

import { type Metadata } from 'next'
import { fetchMediaById } from '@/lib/media/api'
import { notFound } from 'next/navigation'
import FullSizeImage from '@/components/FullSizeImage'
import FavouriteButton from '@/components/common/FavouriteButton'

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

  return (
    <div className="p-8">
      <div className="card bg-base-100 shadow-lg">
        <FullSizeImage media={media} />
        <div className="card-body text-white">
          <div className="flex flex-row justify-between">
            <h1 className="text-4xl font-bold mb-2">{media.title}</h1>
            <FavouriteButton mediaId={media.openverse_id} size={32} />
          </div>
        </div>
        <div className="card-footer px-6">
          <p className="mb-4 text-xs">{media.attribution}</p>
        </div>
      </div>
    </div>
  )
}

export default MediaPage
