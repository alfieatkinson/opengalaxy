// src/components/layout/PageWrapper.tsx

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={'flex flex-col min-h-screen h-full items-center'}>
      <Header />
      <main
        className={
          'flex flex-grow items-center justify-center mt-18 p-4 h-full overflow-hidden w-2/3 min-w-200'
        }
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default PageWrapper
