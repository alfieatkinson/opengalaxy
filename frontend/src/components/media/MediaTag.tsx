// src/components/media/MediaTag.tsx

import { TriangleAlert as AlertIcon } from 'lucide-react'

interface MediaTagProps {
  tag: string
  accuracy?: number
  onClick?: (tag: string) => void
}

const MediaTag = ({ tag, accuracy = 1, onClick }: MediaTagProps) => {
  const inaccurate = accuracy < 0.5

  const handleClick = () => {
    if (onClick) {
      onClick(tag)
    }
  }

  return (
    <div
      onClick={handleClick}
      className={`
        flex items-center cursor-pointer px-2 py-0 rounded-sm w-fit h-6
        ${inaccurate ? 'bg-primary/20 hover:bg-primary/60 text-primary-content/60' : 'bg-primary hover:bg-primary/60'} gap-1 text-xs align-middle
      `}
    >
      <p>{tag}</p>
      {inaccurate && <AlertIcon className="text-yellow-500" size={14} strokeWidth={2} />}
    </div>
  )
}

export default MediaTag
