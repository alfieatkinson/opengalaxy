// src/components/layout/PageWrapper.tsx

'use client'

import { usePathname } from 'next/navigation'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname()
  const isLandingPage = pathname === '/'
  const isScrollable = !(
    pathname === '/' ||
    pathname === '/login' ||
    pathname === '/register' ||
    (pathname.startsWith('/profile/') && !pathname.endsWith('/favourites'))
  )

  return (
    <div
      className={[
        'flex flex-col',
        isScrollable ? 'min-h-screen h-full' : 'h-screen',
        isLandingPage ? '' : 'items-center',
      ].join(' ')}
    >
      <Header isScrollable={isScrollable} isLandingPage={isLandingPage} />
      <main
        className={[
          'flex flex-col items-center justify-center mt-18 p-4 h-full',
          isScrollable ? 'overflow-hidden' : '',
          isLandingPage ? '' : 'w-2/3 min-w-200',
        ].join(' ')}
      >
        {children}
      </main>
      <div className="flex-grow" />
      <Footer isScrollable={isScrollable} />
    </div>
  )
}

export default PageWrapper
