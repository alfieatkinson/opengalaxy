// src/app/layout.tsx

import type { Metadata } from 'next'
import '@/styles/globals.css'

import PageWrapper from '@/components/layout/PageWrapper'
import { AuthProvider } from '@/context/AuthContext'

export const metadata: Metadata = {
  title: 'OpenGalaxy',
  description: 'Browse the galaxy with OpenGalaxy',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="bg-base-300 text-white">
        <AuthProvider>
          <PageWrapper>{children}</PageWrapper>
        </AuthProvider>
      </body>
    </html>
  )
}

export default RootLayout
