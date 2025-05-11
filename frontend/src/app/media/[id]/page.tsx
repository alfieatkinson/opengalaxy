// src/app/media/[id]/page.tsx

import { type Metadata } from 'next'
import { fetchMediaById } from '@/lib/media/api'
import Image from 'next/image'
import { notFound } from 'next/navigation'

export const dynamic = 'force-dynamic'

interface MediaPageProps {
  params: {
    id: string
  }
}

export const generateMetadata = async ({ params }: MediaPageProps): Promise<Metadata> => {
  const { id } = params
  const media = await fetchMediaById(id)

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
  const { id } = params
  const media = await fetchMediaById(id)

  if (!media) {
    notFound()
  }

  return (
    <div className="p-8">
      <div className="card bg-base-100 shadow-lg">
        {media.url && (
          <figure>
            <Image
              src={media.url} // full-size
              alt={media.title}
              width={800}
              height={450}
              className="object-cover w-full h-60"
            />
          </figure>
        )}
        <div className="card-body text-white">
          <h1 className="text-4xl font-bold mb-2">{media.title}</h1>
          <p className="mb-4">{media.attribution}</p> {/* your “description” */}
          <dl className="text-sm">
            <dt>Creator</dt>
            <dd>{media.creator ?? 'Unknown'}</dd>
            <dt>License</dt>
            <dd>
              <a href={media.license_url} target="_blank" rel="noopener">
                {media.license} {media.license_version || ''}
              </a>
            </dd>
            <dt>Dimensions</dt>
            <dd>
              {media.width}x{media.height}
              {media.media_type === 'audio' && `, ${media.duration}s`}
            </dd>
          </dl>
        </div>
      </div>
    </div>
  )
}

export default MediaPage
