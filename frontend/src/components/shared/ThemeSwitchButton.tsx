// src/components/shared/ThemeSwitcher.tsx

import { Sun as SunIcon, Moon as MoonIcon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

const ThemeSwitcher = () => {
  const [theme, toggleTheme] = useTheme()

  return (
    <button
      data-cy="theme-switcher"
      className="btn btn-circle btn-ghost hover:btn-outline btn-secondary btn-sm aspect-square p-0"
      onClick={(e) => {
        e.stopPropagation()
        toggleTheme()
      }}
    >
      {theme === 'dark' ? <MoonIcon size={20} /> : <SunIcon size={20} />}
    </button>
  )
}

export default ThemeSwitcher
