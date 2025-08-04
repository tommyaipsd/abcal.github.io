'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'

export default function Calendar({ events, profiles, selectedDate, onDateSelect, onEventClick }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear()
    const month = currentDate.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentDateObj = new Date(startDate)
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDateObj))
      currentDateObj.setDate(currentDateObj.getDate() + 1)
    }
    
    return days
  }, [currentDate])

  // Get events for a specific date
  const getEventsForDate = (date) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time)
      return eventDate.toDateString() === date.toDateString()
    })
  }

  // Get profile color for event creator
  const getEventColor = (event) => {
    if (event.color) return event.color
    const profile = profiles.find(p => p.id === event.created_by)
    return profile?.color || '#3b82f6'
  }

  const navigateMonth = (direction) => {
    const newDate = new Date(currentDate)
    newDate.setMonth(newDate.getMonth() + direction)
    setCurrentDate(newDate)
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentDate.getMonth()
  }

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Calendar Header */}
      <div className="flex items-center justify-between p-6 border-b">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <div className="flex space-x-1">
            <button
              onClick={() => navigateMonth(-1)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => navigateMonth(1)}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
        
        <button
          onClick={() => setCurrentDate(new Date())}
          className="px-4 py-2 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors"
        >
          Today
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="p-6">
        {/* Day Headers */}
        <div className="grid grid-cols-7 gap-px mb-2">
          {dayNames.map(day => (
            <div key={day} className="py-2 text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="calendar-grid">
          {calendarDays.map((date, index) => {
            const dayEvents = getEventsForDate(date)
            const isSelectedDate = selectedDate && date.toDateString() === selectedDate.toDateString()
            
            return (
              <div
                key={index}
                className={`calendar-cell cursor-pointer transition-colors ${
                  !isCurrentMonth(date) ? 'other-month' : ''
                } ${isToday(date) ? 'today' : ''} ${
                  isSelectedDate ? 'ring-2 ring-primary-500' : ''
                } hover:bg-gray-50`}
                onClick={() => onDateSelect(date)}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`text-sm ${
                    !isCurrentMonth(date) ? 'text-gray-400' : 'text-gray-900'
                  } ${isToday(date) ? 'font-bold text-primary-700' : ''}`}>
                    {date.getDate()}
                  </span>
                  {dayEvents.length > 0 && (
                    <span className="text-xs bg-primary-100 text-primary-700 px-1 rounded">
                      {dayEvents.length}
                    </span>
                  )}
                </div>
                
                {/* Events for this day */}
                <div className="space-y-1">
                  {dayEvents.slice(0, 3).map((event, eventIndex) => (
                    <div
                      key={event.id}
                      className="event-item text-white cursor-pointer hover:opacity-80"
                      style={{ backgroundColor: getEventColor(event) }}
                      onClick={(e) => {
                        e.stopPropagation()
                        onEventClick(event)
                      }}
                      title={`${event.title}${event.description ? ` - ${event.description}` : ''}`}
                    >
                      {event.title}
                    </div>
                  ))}
                  {dayEvents.length > 3 && (
                    <div className="text-xs text-gray-500 px-1">
                      +{dayEvents.length - 3} more
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}