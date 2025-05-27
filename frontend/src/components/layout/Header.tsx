// src/components/layout/Header.tsx

'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { User as UserIcon, Star as StarIcon, Menu as MenuIcon } from 'lucide-react'
import { useAuth } from '@/context/AuthContext'
import SearchBar from '@/components/search/SearchBar'
import HighlightedText from '@/components/shared/HighlightedText'
import Dropdown from '@/components/shared/Dropdown'
import ClientOnly from '@/components/shared/ClientOnly'
import ThemeSwitcher from '@/components/shared/ThemeSwitcher'
import ThemeSwitchButton from '@/components/shared/ThemeSwitchButton'

const Header = () => {
  const router = useRouter()
  const pathname = usePathname()
  const { user, isLoggedIn, signOut } = useAuth()

  const isLandingPage = pathname === '/'

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  const dropdownItems = [
    { label: 'Profile', onClick: () => router.push(`/profile/${user!.username}`) },
    { label: 'Settings', onClick: () => router.push('/settings') },
    { label: 'Logout', onClick: handleLogout },
    { label: <ThemeSwitcher />, onClick: () => {} },
  ]

  const dropdownItemsMobile = []

  if (isLoggedIn) {
    dropdownItemsMobile.push(
      { label: 'Profile', onClick: () => router.push(`/profile/${user!.username}`) },
      { label: 'Favourites', onClick: () => router.push(`/profile/${user?.username}/favourites`) },
      { label: 'Settings', onClick: () => router.push('/settings') },
      { label: 'Logout', onClick: handleLogout },
      { label: <ThemeSwitcher />, onClick: () => {} },
    )
  } else {
    dropdownItemsMobile.push(
      { label: 'Login', onClick: () => router.push('/login') },
      { label: 'Register', onClick: () => router.push('/register') },
      { label: <ThemeSwitcher />, onClick: () => {} },
    )
  }

  return (
    <header
      className={`fixed w-screen p-4 z-50 text-secondary ${
        isLandingPage ? 'bg-transparent' : 'bg-base-200'
      }`}
    >
      <div className="relative flex items-center justify-between">
        {!isLandingPage && (
          <div className="cursor-pointer" onClick={() => router.push('/')}>
            <span className="hidden sm:inline text-2xl font-bold">
              Open<HighlightedText>Galaxy</HighlightedText>
            </span>

            <div className="block sm:hidden text-3xl font-bold">
              O<HighlightedText>G</HighlightedText>
            </div>
          </div>
        )}

        {!isLandingPage && (
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1/2 lg:w-2/3 max-w-xs md:max-w-sm lg:max-w-lg">
            <ClientOnly>
              <SearchBar placeholder="Search for media..." />
            </ClientOnly>
          </div>
        )}

        <div className="flex justify-end items-center">
          <div className="hidden md:flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <Dropdown
                  trigger={
                    <div className="flex items-center space-x-2 hover:text-primary">
                      <span className="text-sm font-bold">{user?.username}</span>
                      <UserIcon size={32} />
                    </div>
                  }
                  items={dropdownItems}
                />
                <button
                  onClick={() => router.push(`/profile/${user?.username}/favourites`)}
                  className="flex items-center space-x-2 hover:text-primary"
                >
                  <StarIcon size={32} />
                </button>
              </>
            ) : (
              <>
                <ThemeSwitchButton />
                <Link href="/login">
                  <button className="btn btn-primary">Login</button>
                </Link>
                <Link href="/register">
                  <button className="btn btn-secondary">Register</button>
                </Link>
              </>
            )}
          </div>
          <div className="block md:hidden">
            <Dropdown
              trigger={<MenuIcon size={32} className="cursor-pointer hover:opacity-80" />}
              items={dropdownItemsMobile}
            />
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header
