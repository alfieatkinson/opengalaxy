// src/hooks/useTheme.ts

import { useState, useLayoutEffect, useCallback } from 'react'

type Theme = 'light' | 'dark'
const STORAGE_KEY = 'theme'

export const useProvideTheme = (): [Theme, () => void] => {
  const [theme, setTheme] = useState<Theme>('light')

  // Run before paint
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return

    const saved = localStorage.getItem(STORAGE_KEY) as Theme | null
    if (saved === 'light' || saved === 'dark') {
      setTheme(saved)
    } else {
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
    }
  }, [])

  // Apply immediately on theme change
  useLayoutEffect(() => {
    if (typeof window === 'undefined') return
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEY, theme)
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'))
  }, [])

  return [theme, toggle]
}
