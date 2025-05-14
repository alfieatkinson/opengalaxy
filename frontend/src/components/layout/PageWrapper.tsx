// src/components/layout/PageWrapper.tsx

'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const isLandingPage = pathname === '/'
  const isScrollable = !(pathname === '/' || pathname === '/login' || pathname === '/register')

  return (
    <div className={`flex flex-col ${!isScrollable ? 'h-screen' : 'min-h-screen items-center'}`}>
      <Header isScrollable={isScrollable} isLandingPage={isLandingPage} />
      <main
        className={[
          'flex flex-col flex-grow mt-18 p-4 h-full border-1',
          !isScrollable ? 'items-center justify-center overflow-hidden' : 'w-1/2 min-w-200',
        ].join(' ')}
      >
        {children}
      </main>
      <Footer isScrollable={isScrollable} />
    </div>
  )
}

export default PageWrapper
