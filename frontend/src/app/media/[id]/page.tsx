// src/app/media/[id]/page.tsx

import { type Metadata } from 'next'
import type { Media } from '@/lib/media/types'
import { fetchMediaById } from '@/lib/media/api'
import Image from 'next/image'

type MediaPageProps = {
  params: Promise<{
    id: string
  }>
}

export const generateMetadata = async ({ params }: MediaPageProps): Promise<Metadata> => {
  const { id } = await params
  const media: Media = await fetchMediaById(id)
  return {
    title: media.title,
    description: media.description,
  }
}

const MediaPage = async ({ params }: MediaPageProps) => {
  const { id } = await params
  const media: Media = await fetchMediaById(id)

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
        </div>
      </div>
    </div>
  )
}

export default MediaPage
