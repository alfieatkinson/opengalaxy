// src/components/QuickSettings.tsx

'use client'

import { useRouter } from 'next/navigation'

interface QuickSettingsProps {
  publicProfile: boolean
  showSensitive: boolean
  blurSensitive: boolean
}

const QuickSettings = ({ publicProfile, showSensitive, blurSensitive }: QuickSettingsProps) => {
  const router = useRouter()

  return (
    <div className="flex flex-col space-y-4 float-right">
      <ul className="space-y-2 text-sm">
        <li>Public profile: {publicProfile ? 'Enabled' : 'Disabled'}</li>
        <li>Show sensitive: {showSensitive ? 'Enabled' : 'Disabled'}</li>
        <li>Blur sensitive: {blurSensitive ? 'Enabled' : 'Disabled'}</li>
      </ul>
      <button
        className="btn btn-outline text-xs float-right h-8 w-fit"
        onClick={() => router.push('/settings')}
      >
        More settings →
      </button>
    </div>
  )
}

export default QuickSettings
