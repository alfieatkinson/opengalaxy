// src/app/profile/[username]/favourites/page.tsx

import type { Metadata } from 'next'
import ClientOnly from '@/components/shared/ClientOnly'
import FavouritesInner from '@/components/profile/FavouritesInner'

export const generateMetadata = async ({
  params,
}: {
  params: { username: string }
}): Promise<Metadata> => ({
  title: `${params.username}'s Favourites | OpenGalaxy`,
  description: `View ${params.username}'s favourited open-license media.`,
})

const FavouritesPage = ({
  params,
  searchParams,
}: {
  params: { username: string }
  searchParams: { page?: string; page_size?: string }
}) => {
  const { username } = params
  const page = Math.max(Number(searchParams.page ?? '1'), 1)
  const pageSize = Math.max(Number(searchParams.page_size ?? '18'), 1)

  return (
    <ClientOnly>
      <FavouritesInner username={username} page={page} pageSize={pageSize} />
    </ClientOnly>
  )
}

export default FavouritesPage
