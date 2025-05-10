// src/app/media/[id]/page.tsx

import type { Metadata } from 'next'
import { fetchMediaById } from '@/lib/media/api'
import Image from 'next/image'
import type { Media } from '@/lib/media/types'

interface MediaPageProps {
  params: {
    id: string
  }
}

export const generateMetadata = async ({
  params,
}: {
  params: { id: string }
}): Promise<Metadata> => {
  const media: Media = await fetchMediaById(params.id)
  return {
    title: media.title,
    description: media.description,
  }
}

const MediaPage = async ({ params }: MediaPageProps) => {
  const media: Media = await fetchMediaById(params.id)

  return (
    <div className="p-8">
      <div className="card bg-base-100 shadow-lg">
        {media.imageUrl && (
          <figure>
            <Image
              src={media.imageUrl}
              alt={media.title}
              width={800}
              height={450}
              className="object-cover w-full h-60"
            />
          </figure>
        )}
        <div className="card-body text-white">
          <h1 className="text-4xl font-bold mb-2">{media.title}</h1>
          <p className="mb-4">{media.description}</p>
          {/* additional fields here */}
        </div>
      </div>
    </div>
  )
}

export default MediaPage
