// src/components/common/BlurOverlay.tsx

'use client'

import { useState } from 'react'
import { EyeOff as EyeOffIcon } from 'lucide-react'

interface BlurOverlayProps {
  active: boolean
  mini?: boolean
  children?: React.ReactNode
  className?: string
}

const BlurOverlay = ({ active, mini = false, children, className = '' }: BlurOverlayProps) => {
  const [cleared, setCleared] = useState(false)

  if (!active) {
    return <div className={`relative w-full h-full ${className}`}>{children}</div>
  }

  return (
    <div className={`relative w-full h-full ${className}`}>
      <div className="w-full h-full">{children}</div>

      {!cleared && (
        <div
          className="
          absolute inset-0 overflow-hidden
          bg-white/20 backdrop-blur-xl 
          flex flex-col items-center justify-center
          p-4
        "
        >
          <button
            onClick={!mini ? () => setCleared(true) : undefined}
            className={`
              flex flex-col items-center justify-center 
              bg-white/0 rounded-md py-2 px-4
              ${!mini ? 'hover:bg-white/20' : ''}
            `}
          >
            <EyeOffIcon size={32} className="mb-1" />
            {!mini && <span className="text-sm font-bold">Show content</span>}
          </button>
        </div>
      )}
    </div>
  )
}

export default BlurOverlay
