// src/app/layout.tsx

import type { Metadata } from 'next'
import '@/styles/globals.css'

import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'

import PageWrapper from '@/components/layout/PageWrapper'
import { AuthProvider } from '@/context/AuthContext'
import { ThemeProvider } from '@/context/ThemeContext'

export const metadata: Metadata = {
  title: 'OpenGalaxy',
  description: 'Browse the galaxy with OpenGalaxy',
}

const RootLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en" data-theme="">
      <body className="bg-base-300 text-secondary">
        <ThemeProvider>
          <AuthProvider>
            <PageWrapper>{children}</PageWrapper>
          </AuthProvider>
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}

export default RootLayout
