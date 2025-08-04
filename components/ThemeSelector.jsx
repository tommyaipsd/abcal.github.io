'use client'

import { useState } from 'react'
import { useTheme } from '../lib/themeContext'
import { Palette, Check } from 'lucide-react'

export default function ThemeSelector() {
  const [isOpen, setIsOpen] = useState(false)
  const { currentTheme, setTheme, themes } = useTheme()

  const handleThemeChange = (themeKey) => {
    setTheme(themeKey)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        title="Change Theme"
      >
        <Palette className="h-5 w-5" />
      </button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Theme Menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border z-20 p-3">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Choose Theme</h3>
            
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(themes).map(([key, theme]) => (
                <button
                  key={key}
                  onClick={() => handleThemeChange(key)}
                  className={`relative p-3 rounded-lg border-2 transition-all hover:scale-105 ${
                    currentTheme === key 
                      ? 'border-primary-500 bg-primary-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {/* Theme Preview */}
                  <div className="flex space-x-1 mb-2">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.primary }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.secondary }}
                    />
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: theme.accent }}
                    />
                  </div>
                  
                  <span className="text-xs text-gray-700 font-medium">{theme.name}</span>
                  
                  {currentTheme === key && (
                    <Check className="absolute top-1 right-1 h-3 w-3 text-primary-600" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}