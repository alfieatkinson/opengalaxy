// src/components/common/AudioWaveform.tsx

'use client'

import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'
import { Play as PlayIcon, Pause as PauseIcon } from 'lucide-react'

interface AudioWaveformProps {
  src: string
  width?: number
  height?: number
  onReady?: () => void
  hideControls?: boolean
}

export const AudioWaveform = ({
  src,
  width,
  height = 240,
  onReady,
  hideControls = false,
}: AudioWaveformProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const waveSurferRef = useRef<WaveSurfer | null>(null)

  const [loading, setLoading] = useState(true)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)

  const formatDuration = (seconds: number): string => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    const ms = Math.floor((seconds % 1) * 100)
    return `${m}:${s.toString().padStart(2, '0')}.${ms.toString().padStart(2, '0')}`
  }

  const togglePlayback = () => {
    waveSurferRef.current?.playPause()
  }

  useEffect(() => {
    if (!containerRef.current) return

    const rootStyles = getComputedStyle(document.documentElement)
    const waveColor = rootStyles.getPropertyValue('--color-primary').trim()
    const progressColor = rootStyles.getPropertyValue('--color-secondary').trim()

    // Initialize WaveSurfer
    const ws = WaveSurfer.create({
      container: containerRef.current,
      url: src,
      waveColor,
      progressColor,
      cursorWidth: 1,
      width,
      height,
      barWidth: 2,
      normalize: false,
    })

    waveSurferRef.current = ws

    ws.on('ready', () => {
      setLoading(false)
      setDuration(ws.getDuration())
      onReady?.()
    })

    ws.on('play', () => setIsPlaying(true))
    ws.on('pause', () => setIsPlaying(false))
    ws.on('finish', () => {
      setIsPlaying(false)
      setCurrentTime(0)
    })

    ws.on('audioprocess', () => {
      setCurrentTime(ws.getCurrentTime())
    })

    return () => {
      ws.destroy()
    }
  }, [src])

  return (
    <div className={`${width ? `w-${width}` : 'w-full'} h-fit`}>
      {loading && (
        <div className="flex items-center justify-center w-full translate-y-24">
          <div className="loading loading-spinner loading-lg text-primary" />
        </div>
      )}
      <div
        ref={containerRef}
        className={`
          ${hideControls ? 'pointer-events-none' : ''}
          relative z-0  
        `}
      />
      {!hideControls && (
        <div className="flex flex-row items-center justify-between m-6 gap-4">
          <button
            onClick={() => togglePlayback()}
            className="btn btn-primary aspect-square h-fit w-fit rounded-lg p-2"
          >
            {isPlaying ? <PauseIcon size={32} /> : <PlayIcon size={32} />}
          </button>
          <p className="text-sm text-gray-600">
            {formatDuration(currentTime)} / {formatDuration(duration)}
          </p>
        </div>
      )}
    </div>
  )
}

export default AudioWaveform
