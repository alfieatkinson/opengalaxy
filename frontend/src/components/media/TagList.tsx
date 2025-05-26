// src/components/media/TagList.tsx

'use client'

import { useRouter } from 'next/navigation'
import type { Tag } from '@/lib/media/types'
import MediaTag from '@/components/media/MediaTag'

interface TagListProps {
  tags: Tag[] | undefined
}

const TagList = ({ tags }: TagListProps) => {
  const router = useRouter()

  if (!tags || tags.length === 0) {
    return <p className="text-sm text-gray-500">No tags available</p>
  }

  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tags
        .sort((a, b) => b.accuracy - a.accuracy || a.name.localeCompare(b.name))
        .map((tag) => (
          <MediaTag
            key={tag.name}
            tag={tag.name}
            accuracy={tag.accuracy}
            onClick={() => {
              router.push(`/search?query=${encodeURIComponent(tag.name)}`)
            }}
          />
        ))}
    </div>
  )
}

export default TagList
