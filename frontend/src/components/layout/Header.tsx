// src/components/layout/Header.tsx

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User as UserIcon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import SearchBar from '@/components/common/SearchBar'
import HighlightedText from '@/components/common/HighlightedText'

const Header = ({
  isScrollable,
  isLandingPage,
}: {
  isScrollable: boolean
  isLandingPage: boolean
}) => {
  const router = useRouter()
  const { user, isLoggedIn, signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      router.push('/') // send them back home
    } catch (err) {
      console.error('Logout failed', err)
    }
  }

  return (
    <header
      className={`fixed flex items-center justify-between max-h-32 w-screen z-50 ${
        isScrollable ? 'p-4 bg-transparent' : 'p-4 bg-base-200'
      } text-white`}
    >
      {/* Left slot */}
      <div className="w-1/4 cursor-pointer" onClick={() => router.push('/')}>
        {!isLandingPage && (
          <span className="text-2xl font-bold">
            Open<HighlightedText>Galaxy</HighlightedText>
          </span>
        )}
      </div>

      {/* Centre slot */}
      <div className="flex-grow flex justify-center">
        {!isScrollable && <SearchBar placeholder="Search for media..." />}
      </div>

      {/* Right slot */}
      <div className="w-1/4 flex justify-end items-center space-x-4">
        {isLoggedIn ? (
          <>
            <button
              onClick={() => router.push('/profile')}
              className="flex items-center space-x-2 hover:opacity-80"
            >
              <span className="text-sm font-bold">{user?.username}</span>
              <UserIcon size={32} />
            </button>
            <button
              onClick={handleLogout}
              className="btn btn-error font-bold text-xl aspect-square"
            >
              X
            </button>
          </>
        ) : (
          <>
            <Link href="/login">
              <button className="btn btn-primary">Login</button>
            </Link>
            <Link href="/register">
              <button className="btn btn-secondary">Register</button>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Header
