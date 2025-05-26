// src/components/shared/ThemeSwitcher.tsx

import { Sun as SunIcon, Moon as MoonIcon } from 'lucide-react'
import { useTheme } from '@/context/ThemeContext'

const ThemeSwitcher = () => {
  const [theme, toggleTheme] = useTheme()

  return (
    <div
      data-cy="theme-switcher"
      className="flex min-w-20 items-center justify-between"
      onClick={(e) => e.stopPropagation()}
    >
      {theme === 'dark' ? <MoonIcon size={22} /> : <SunIcon size={22} />}
      <input
        type="checkbox"
        className="toggle toggle-primary"
        checked={theme === 'dark'}
        onChange={toggleTheme}
      />
    </div>
  )
}

export default ThemeSwitcher
