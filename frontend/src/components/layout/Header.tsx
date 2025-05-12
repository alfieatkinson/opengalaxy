// src/components/layout/Header.tsx

'use client'

import Image from 'next/image'
import { useAuth } from '@/hooks/useAuth'
import SearchBar from '@/components/common/SearchBar'
import HighlightedText from '../common/HighlightedText'

const Header = ({ isLandingPage }: { isLandingPage: boolean }) => {
  const { user, isLoggedIn, signIn, signOut } = useAuth()

  return (
    <header
      className={`fixed flex items-center justify-between max-h-32 w-screen z-50 ${
        isLandingPage ? 'p-4 bg-transparent' : 'p-4 bg-base-200'
      } text-white`}
    >
      {/* Left slot: logo on inner pages, empty on landing */}
      <div
        className="w-1/4"
        onClick={() => {
          window.location.href = '/'
        }}
      >
        {!isLandingPage && (
          <span className="text-2xl font-bold">
            Open<HighlightedText>Galaxy</HighlightedText>
          </span>
        )}
      </div>

      {/* Centre slot: search on inner pages, empty on landing */}
      <div className="flex-grow flex justify-center">
        {!isLandingPage && <SearchBar placeholder="Search for media..." />}
      </div>

      {/* Right slot: auth */}
      <div className="w-1/4 flex justify-end">
        {isLoggedIn ? (
          <button onClick={signOut} className="flex items-center">
            <Image
              src={user!.profilePicture}
              alt="User Profile"
              width={32}
              height={32}
              className="rounded-full"
            />
          </button>
        ) : (
          <div className="flex space-x-4">
            <button onClick={signIn} className="btn btn-primary">
              Login
            </button>
            <button onClick={signIn} className="btn btn-secondary">
              Sign Up
            </button>
          </div>
        )}
      </div>
    </header>
  )
}

export default Header
