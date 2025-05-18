// src/app/profile/[username]/page.tsx

import { Metadata } from 'next'
import ClientOnly from '@/components/shared/ClientOnly'
import ProfileInner from '@/components/profile/ProfileInner'

interface ProfilePageProps {
  params: { username: string }
}

export const generateMetadata = async ({ params }: ProfilePageProps): Promise<Metadata> => ({
  title: `${params.username}'s Profile | OpenGalaxy`,
  description: `View ${params.username}'s profile on OpenGalaxy.`,
})

const ProfilePage = ({ params }: ProfilePageProps) => {
  const { username } = params

  return (
    <ClientOnly>
      <ProfileInner username={username} />
    </ClientOnly>
  )
}

export default ProfilePage
