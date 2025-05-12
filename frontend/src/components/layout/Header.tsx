// src/components/layout/Header.tsx

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User as UserIcon } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import SearchBar from '@/components/common/SearchBar'
import HighlightedText from '../common/HighlightedText'

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
        {!isLandingPage && <SearchBar placeholder="Search for media..." />}
      </div>

      {/* Right slot */}
      <div className="w-1/4 flex justify-end items-center space-x-4">
        {isLoggedIn ? (
          <>
            <button
              onClick={() => router.push('/profile')}
              className="flex items-center space-x-2 hover:opacity-80"
            >
              <UserIcon size={24} />
              <span className="hidden sm:inline">{user!.username}</span>
            </button>
            <button onClick={handleLogout} className="btn btn-ghost">
              Logout
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
