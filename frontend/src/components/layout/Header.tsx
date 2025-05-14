// src/components/layout/Header.tsx

'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User as UserIcon, Bookmark as BookmarkIcon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import SearchBar from '@/components/common/SearchBar'
import HighlightedText from '@/components/common/HighlightedText'
import Dropdown from '@/components/common/Dropdown'

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
    await signOut()
    router.push('/')
  }

  const dropdownItems = [
    { label: 'Profile', onClick: () => router.push(`/profile/${user!.username}`) },
    { label: 'Settings', onClick: () => router.push('/settings') },
    { label: 'Logout', onClick: handleLogout },
  ]

  return (
    <header
      className={`fixed flex w-full p-4 z-50 text-white ${
        isScrollable ? 'bg-transparent' : 'bg-base-200'
      }`}
    >
      <div className="w-1/4 cursor-pointer" onClick={() => router.push('/')}>
        {!isLandingPage && (
          <span className="text-2xl font-bold">
            Open<HighlightedText>Galaxy</HighlightedText>
          </span>
        )}
      </div>
      <div className="flex-grow flex justify-center">
        {!isScrollable && <SearchBar placeholder="Search for media..." />}
      </div>
      <div className="w-1/4 flex justify-end items-center space-x-4">
        {isLoggedIn ? (
          <>
            <Dropdown
              trigger={
                <div className="flex items-center space-x-2 hover:opacity-80">
                  <span className="text-sm font-bold">{user?.username}</span>
                  <UserIcon size={32} />
                </div>
              }
              items={dropdownItems}
            />
            <button
              onClick={() => router.push(`/profile/${user?.username}/favourites`)}
              className="flex items-center space-x-2 hover:opacity-80"
            >
              <BookmarkIcon size={32} />
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
