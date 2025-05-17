// src/components/media/FavouriteControl.tsx

'use client'

import { useState } from 'react'
import FavouriteButton from '@/components/media/FavouriteButton'

interface FavouriteControlProps {
  mediaId: string
  initialCount: number
  size?: number
  requireHover?: boolean
}

export const FavouriteControl = ({
  mediaId,
  initialCount,
  size = 24,
  requireHover = false,
}: FavouriteControlProps) => {
  const [count, setCount] = useState(initialCount)
  const [hovering, setHovering] = useState(false)

  const handleToggle = (nowFav: boolean) => {
    setCount((c) => c + (nowFav ? 1 : -1))
  }

  const formatCount = (n: number) => (n > 1000 ? `${(n / 1000).toFixed(1)}k` : n.toString())

  // Determine visibility: always show unless requireHover is true and not hovering
  const isVisible = !requireHover || hovering

  return (
    <div className="flex items-center space-x-2 ml-2">
      <p className={`font-bold transition-opacity ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        {formatCount(count)}
      </p>
      <div
        onMouseEnter={() => requireHover && setHovering(true)}
        onMouseLeave={() => requireHover && setHovering(false)}
      >
        <FavouriteButton mediaId={mediaId} size={size} onToggle={handleToggle} />
      </div>
    </div>
  )
}

export default FavouriteControl
