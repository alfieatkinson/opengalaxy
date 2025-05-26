// src/components/media/TagList.tsx

'use client'

import { useRouter } from 'next/navigation'
import { AlertTriangle as AlertIcon } from 'lucide-react'
import type { Tag } from '@/lib/media/types'
import MediaTag from '@/components/media/MediaTag'

interface TagListProps {
  tags: Tag[] | undefined
}

const ACCURACY_THRESHOLD = 0.5 // Threshold for low confidence tags

const TagList = ({ tags }: TagListProps) => {
  const router = useRouter()

  if (!tags || tags.length === 0) {
    return <p className="text-sm text-gray-500">No tags available</p>
  }

  // Sort highest accuracy first, then by name
  const sorted = [...tags].sort((a, b) => b.accuracy - a.accuracy || a.name.localeCompare(b.name))

  // do we have any low-confidence tags?
  const hasLow = sorted.some((tag) => tag.accuracy < ACCURACY_THRESHOLD)

  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      {sorted.map((tag) => (
        <MediaTag
          key={tag.name}
          tag={tag.name}
          accuracy={tag.accuracy}
          onClick={() => router.push(`/search?query=${encodeURIComponent(tag.name)}`)}
        />
      ))}

      {hasLow && (
        <div className="flex items-center text-yellow-500 text-xs gap-1">
          <AlertIcon size={14} strokeWidth={2} />
          <span>Some tags may be inaccurate</span>
        </div>
      )}
    </div>
  )
}

export default TagList
