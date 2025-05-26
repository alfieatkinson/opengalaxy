// src/components/media/MediaTag.tsx

import { TriangleAlert as AlertIcon } from 'lucide-react'

interface MediaTagProps {
  tag: string
  accuracy?: number
  onClick?: (tag: string) => void
}

const ACCURACY_THRESHOLD = 0.5 // Threshold for low confidence tags
const MIN_OPACITY = 0.3 // Minimum opacity for tags with low accuracy

const MediaTag = ({ tag, accuracy = 1, onClick }: MediaTagProps) => {
  const inaccurate = accuracy < ACCURACY_THRESHOLD
  const opacity = Math.max(accuracy, MIN_OPACITY)

  const handleClick = () => {
    if (onClick) {
      onClick(tag)
    }
  }

  return (
    <div
      onClick={handleClick}
      style={{ opacity }}
      className={`
        flex items-center cursor-pointer px-2 py-0.5 rounded-sm h-6 gap-1
        bg-primary hover:underline text-xs font-medium
      `}
    >
      <p>{tag.toUpperCase()}</p>
      {inaccurate && <AlertIcon className="text-yellow-500" size={14} strokeWidth={3} />}
    </div>
  )
}

export default MediaTag
