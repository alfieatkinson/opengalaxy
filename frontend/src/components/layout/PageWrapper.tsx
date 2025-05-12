// src/components/layout/PageWrapper.tsx

'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const isScrollable = pathname === '/' || pathname === '/login' || pathname === '/register'

  return (
    <div className={`flex flex-col ${isScrollable ? 'h-screen' : 'min-h-screen items-center'}`}>
      <Header isScrollable={isScrollable} />
      <main
        className={[
          'flex flex-col flex-grow pt-20 pb-4',
          isScrollable ? 'items-center justify-center overflow-hidden' : 'max-w-300',
        ].join(' ')}
      >
        {children}
      </main>
      <Footer isScrollable={isScrollable} />
    </div>
  )
}

export default PageWrapper
