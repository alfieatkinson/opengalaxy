// src/components/media/TagList.tsx

'use client'

import { useRouter } from 'next/navigation'
import { AlertTriangle as AlertIcon, CircleCheck as CheckIcon } from 'lucide-react'
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

  // Sort highest accuracy first, then by name
  const sorted = [...tags].sort((a, b) => b.accuracy - a.accuracy || a.name.localeCompare(b.name))

  const anyRed = sorted.some((tag) => tag.accuracy < 0.25)
  const anyOrange = sorted.some((tag) => tag.accuracy < 0.5)
  const anyYellow = sorted.some((tag) => tag.accuracy < 0.75)
  const allGreen = sorted.every((tag) => tag.accuracy >= 0.9)

  return (
    <div className="flex flex-wrap gap-2 mb-4 items-center">
      {sorted.map((tag) => (
        <MediaTag
          key={tag.name}
          tag={tag.name}
          accuracy={tag.accuracy}
          onClick={() => router.push(`/search?tags=${encodeURIComponent(tag.name)}`)}
        />
      ))}

      {anyRed && (
        <div className="flex items-center text-red-500 text-sm gap-1">
          <AlertIcon size={16} strokeWidth={2} />
          <span>Some tags are very inaccurate</span>
        </div>
      )}
      {!anyRed && anyOrange && (
        <div className="flex items-center text-orange-500 text-sm gap-1">
          <AlertIcon size={16} strokeWidth={2} />
          <span>Some tags are inaccurate</span>
        </div>
      )}
      {!anyOrange && anyYellow && (
        <div className="flex items-center text-yellow-500 text-sm gap-1">
          <AlertIcon size={16} strokeWidth={2} />
          <span>Some tags have low confidence</span>
        </div>
      )}
      {allGreen && (
        <div className="flex items-center text-green-500 text-sm gap-1">
          <CheckIcon size={16} strokeWidth={2} />
          <span>All tags are very accurate</span>
        </div>
      )}
    </div>
  )
}

export default TagList
