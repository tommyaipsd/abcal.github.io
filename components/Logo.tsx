'use client'

import { Calendar } from 'lucide-react'

export default function Logo({ size = 'normal', showText = true }) {
  const sizes = {
    small: {
      container: 'h-8 w-8',
      icon: 'h-4 w-4',
      text: 'text-lg font-bold'
    },
    normal: {
      container: 'h-12 w-12',
      icon: 'h-6 w-6',
      text: 'text-2xl font-bold'
    },
    large: {
      container: 'h-16 w-16',
      icon: 'h-8 w-8',
      text: 'text-3xl font-bold'
    }
  }

  const currentSize = sizes[size]

  return (
    <div className="flex items-center space-x-3">
      {/* Logo Icon */}
      <div className={`${currentSize.container} bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden`}>
        {/* Background pattern */}
        <div className="absolute inset-0 bg-white opacity-10">
          <div className="absolute top-2 left-2 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute top-2 right-2 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute bottom-2 left-2 w-1 h-1 bg-white rounded-full"></div>
          <div className="absolute bottom-2 right-2 w-1 h-1 bg-white rounded-full"></div>
        </div>
        
        {/* Calendar icon */}
        <Calendar className={`${currentSize.icon} text-white relative z-10`} />
        
        {/* Small "AB" overlay */}
        <div className="absolute bottom-0 right-0 bg-white text-primary-600 text-xs font-bold px-1 rounded-tl transform scale-75">
          AB
        </div>
      </div>

      {/* App Name */}
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${currentSize.text} text-gray-900 leading-none`}>
            AB<span className="text-primary-500">Cal</span>
          </h1>
          {size === 'large' && (
            <p className="text-sm text-gray-500 mt-1">Household Calendar</p>
          )}
        </div>
      )}
    </div>
  )
}