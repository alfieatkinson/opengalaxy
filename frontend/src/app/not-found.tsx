// src/app/not-found.tsx

import Link from 'next/link'

const NotFoundPage = () => {
  return (
    <div className="flex-grow">
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold mb-4">404</h1>
        <p className="text-xl mb-8 text-center">Sorry, the page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="btn btn-primary">
          Go home
        </Link>
      </div>
    </div>
  )
}

export default NotFoundPage
