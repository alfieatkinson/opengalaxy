// src/app/layout.tsx

import type { Metadata } from 'next'
import '@/styles/globals.css'

import PageWrapper from '@/components/layout/PageWrapper'

export const metadata: Metadata = {
  title: 'OpenGalaxy',
  description: 'Browse the galaxy with OpenGalaxy',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="bg-base-300 text-white">
        <PageWrapper>{children}</PageWrapper>
      </body>
    </html>
  )
}

export default RootLayout