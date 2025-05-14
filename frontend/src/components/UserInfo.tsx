// src/components/UserInfo.tsx

'use client'

import { User as UserIcon } from 'lucide-react'
import { User } from '@/lib/profile/types'

interface UserInfoProps {
  user: User
}

const UserInfo = ({ user }: UserInfoProps) => {
  return (
    <div className="flex absolute items-center space-x-4 mt-4">
      <UserIcon size={64} />
      <div>
        <h1 className="text-4xl font-bold">{user.username}</h1>
        <p>
          {user.first_name} {user.last_name}
        </p>
      </div>
    </div>
  )
}

export default UserInfo
