// src/components/shared/ClientOnly.tsx

'use client'

import { Suspense } from 'react'
import LoadingSpinner from '@/components/shared/LoadingSpinner'

interface ClientOnlyProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

const ClientOnly = ({ children, fallback }: ClientOnlyProps) => {
  return <Suspense fallback={fallback || <LoadingSpinner />}>{children}</Suspense>
}

export default ClientOnly
