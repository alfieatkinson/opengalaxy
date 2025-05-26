// src/components/media/MediaTag.tsx

import { TriangleAlert as AlertIcon } from 'lucide-react'

interface MediaTagProps {
  tag: string
  accuracy?: number
  onClick?: (tag: string) => void
}

const MIN_OPACITY = 0.3 // Minimum opacity for tags with low accuracy
const COLOURS = {
  red: 'text-red-500',
  orange: 'text-orange-500',
  yellow: 'text-yellow-500',
  green: 'text-green-500',
}

const MediaTag = ({ tag, accuracy = 1, onClick }: MediaTagProps) => {
  const opacity = Math.max(accuracy, MIN_OPACITY)

  // Pick icon colour band
  let iconClass = ''
  if (accuracy < 0.25) {
    iconClass = COLOURS.red
  } else if (accuracy < 0.5) {
    iconClass = COLOURS.orange
  } else if (accuracy < 0.75) {
    iconClass = COLOURS.yellow
  } else {
    iconClass = COLOURS.green
  }

  const showIcon = accuracy < 0.75

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
        bg-primary text-primary-content/100 hover:underline text-xs font-medium
      `}
    >
      <p>{tag.toUpperCase()}</p>
      {showIcon && <AlertIcon className={iconClass} size={14} strokeWidth={3} />}
    </div>
  )
}

export default MediaTag
