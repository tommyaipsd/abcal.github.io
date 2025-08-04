'use client'

import { createContext, useContext, useState, useEffect } from 'react'

const ThemeContext = createContext()

export const themes = {
  blue: {
    name: 'Ocean Blue',
    primary: '#3b82f6',
    secondary: '#1e40af', 
    accent: '#60a5fa',
    gradient: 'from-blue-400 to-blue-600'
  },
  purple: {
    name: 'Royal Purple',
    primary: '#8b5cf6',
    secondary: '#7c3aed',
    accent: '#a78bfa', 
    gradient: 'from-purple-400 to-purple-600'
  },
  green: {
    name: 'Forest Green',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#34d399',
    gradient: 'from-emerald-400 to-emerald-600'
  },
  pink: {
    name: 'Rose Pink',
    primary: '#ec4899',
    secondary: '#db2777',
    accent: '#f472b6',
    gradient: 'from-pink-400 to-pink-600'
  },
  orange: {
    name: 'Sunset Orange',
    primary: '#f97316',
    secondary: '#ea580c',
    accent: '#fb923c',
    gradient: 'from-orange-400 to-orange-600'
  },
  teal: {
    name: 'Teal Wave',
    primary: '#14b8a6',
    secondary: '#0f766e',
    accent: '#5eead4',
    gradient: 'from-teal-400 to-teal-600'
  }
}

export function ThemeProvider({ children }) {
  const [currentTheme, setCurrentTheme] = useState('blue')

  useEffect(() => {
    // Load saved theme from localStorage
    const savedTheme = localStorage.getItem('abcal-theme')
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme)
    }
  }, [])

  useEffect(() => {
    // Apply theme to CSS variables
    const theme = themes[currentTheme]
    if (theme) {
      const root = document.documentElement
      root.style.setProperty('--color-primary-500', theme.primary)
      root.style.setProperty('--color-primary-600', theme.secondary)
      root.style.setProperty('--color-primary-700', theme.secondary)
      
      // Save to localStorage
      localStorage.setItem('abcal-theme', currentTheme)
    }
  }, [currentTheme])

  const setTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName)
    }
  }

  const themeConfig = themes[currentTheme]

  return (
    <ThemeContext.Provider value={{
      currentTheme,
      setTheme,
      themes,
      themeConfig
    }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }
  return context
}