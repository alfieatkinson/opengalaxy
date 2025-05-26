// src/components/shared/ThemeSwitcher.tsx

import { useTheme } from '@/context/ThemeContext'

const ThemeSwitcher = () => {
  const [theme, toggleTheme] = useTheme()

  return (
    <label
      data-cy="theme-switcher"
      className="flex items-center justify-between"
      onClick={(e) => e.stopPropagation()}
    >
      <span className="text-sm mr-4">Theme</span>
      <input
        type="checkbox"
        className="toggle toggle-primary"
        checked={theme === 'dark'}
        onChange={toggleTheme}
      />
    </label>
  )
}

export default ThemeSwitcher
