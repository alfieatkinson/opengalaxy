// src/app/media/[uuid]/page.tsx

import MediaInner from '@/components/media/MediaInner'

interface MediaPageProps {
  params: Promise<{
    uuid: string
  }>
}

const MediaPage = async ({ params }: MediaPageProps) => {
  const { uuid } = await params

  return <MediaInner uuid={uuid} />
}

export default MediaPage
