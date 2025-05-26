// src/context/ThemeContext.tsx

'use client'

import { createContext, useContext } from 'react'
import { useProvideTheme } from '@/hooks/useProvideTheme'

type Theme = ReturnType<typeof useProvideTheme>
const ThemeContext = createContext<Theme | null>(null)

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const theme = useProvideTheme()
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}

// A nicer way to use the context
export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used within a ThemeProvider')
  return context
}
