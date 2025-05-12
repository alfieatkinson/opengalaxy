// src/components/layout/PageWrapper.tsx

'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const isLandingPage = pathname === '/'

  return (
    <div className={`flex flex-col ${isLandingPage ? 'h-screen' : 'min-h-screen items-center'}`}>
      <Header isLandingPage={isLandingPage} />
      <main
        className={[
          'flex flex-col flex-grow pt-20 pb-4',
          isLandingPage ? 'items-center justify-center overflow-hidden' : 'max-w-300',
        ].join(' ')}
      >
        {children}
      </main>
      <Footer isLandingPage={isLandingPage} />
    </div>
  )
}

export default PageWrapper
