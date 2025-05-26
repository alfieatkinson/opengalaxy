// src/components/media/RelatedPreview.tsx

'use client'

import { useRouter } from 'next/navigation'
import MediaCard from '@/components/media/MediaCard'
import { MediaShort } from '@/lib/media/types'

interface RelatedPreviewProps {
  openverse_id: string
  related: MediaShort[]
}

const RelatedPreview = ({ openverse_id, related }: RelatedPreviewProps) => {
  const router = useRouter()

  if (!related || related.length === 0) return null

  // Cap amount to 6 items or less
  const preview = related.slice(0, 6)

  return (
    <div className="card bg-base-100 w-full shadow-lg p-4">
      <h2 className="text-xl font-bold mb-4">Related Media</h2>
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-3 gap-4">
        {preview.map((media) => (
          <MediaCard key={media.openverse_id} media={media} mini />
        ))}
      </div>
      <div className="flex items-center justify-center">
        <button
          className="btn btn-outline mt-4 max-w-40"
          onClick={() => router.push(`/media/${openverse_id}/related`)}
        >
          View all related →
        </button>
      </div>
    </div>
  )
}

export default RelatedPreview
