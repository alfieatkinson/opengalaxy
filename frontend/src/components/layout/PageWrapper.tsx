// src/components/layout/PageWrapper.tsx

import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

const PageWrapper = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className={'flex flex-col min-h-screen h-full items-center'}>
      <Header />
      <main
        className={
          'flex flex-col flex-grow items-center justify-center h-full flex-1 max-w-5xl w-11/12 sm:w-5/6 mx-auto mt-18 p-4 overflow-auto'
        }
      >
        {children}
      </main>
      <Footer />
    </div>
  )
}

export default PageWrapper
