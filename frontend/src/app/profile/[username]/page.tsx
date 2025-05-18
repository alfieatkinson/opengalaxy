// src/app/profile/[username]/page.tsx

import { Metadata } from 'next'
import ClientOnly from '@/components/shared/ClientOnly'
import ProfileInner from '@/components/profile/ProfileInner'

interface ProfilePageProps {
  params: Promise<{ username: string }>
}

export const generateMetadata = async ({ params }: ProfilePageProps): Promise<Metadata> => {
  const { username } = await params

  return {
    title: `${username}'s Profile | OpenGalaxy`,
    description: `View ${username}'s profile on OpenGalaxy.`,
  }
}

const ProfilePage = async ({ params }: ProfilePageProps) => {
  const { username } = await params

  return (
    <ClientOnly>
      <ProfileInner username={username} />
    </ClientOnly>
  )
}

export default ProfilePage
