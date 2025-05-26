// src/app/media/[uuid]/related/page.tsx

import ClientOnly from '@/components/shared/ClientOnly'
import RelatedInner from '@/components/media/RelatedInner'

interface RelatedPageProps {
  params: Promise<{ uuid: string }>
  searchParams: Promise<{ page?: string; page_size?: string }>
}

const RelatedPage = async ({ params, searchParams }: RelatedPageProps) => {
  const { uuid } = await params
  const { page: rawPage, page_size: rawPageSize } = await searchParams

  const page = Math.max(Number(rawPage ?? '1'), 1)
  const pageSize = Math.max(Number(rawPageSize ?? '18'), 1)

  return (
    <ClientOnly>
      <RelatedInner openverse_id={uuid} page={page} pageSize={pageSize} />
    </ClientOnly>
  )
}

export default RelatedPage
