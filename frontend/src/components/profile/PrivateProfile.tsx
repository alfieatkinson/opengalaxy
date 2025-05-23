// src/components/profile/PrivateProfile.tsx

'use client'

import { User as UserIcon } from 'lucide-react'

interface PrivateProfileProps {
  username: string
}

const PrivateProfile = ({ username }: PrivateProfileProps) => {
  return (
    <div data-cy="private-profile" className="max-w-xl mx-auto p-6 text-center">
      <UserIcon size={64} className="mx-auto mb-4 text-gray-400" />
      <h2 className="text-2xl font-semibold">This profile is private</h2>
      <p className="text-gray-500 mt-2">{username} has chosen to keep their profile private.</p>
    </div>
  )
}

export default PrivateProfile
