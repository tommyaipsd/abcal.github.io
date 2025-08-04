'use client'

import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Calendar({ events, profiles, selectedDate, onDateSelect, onEventClick }) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate)

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ]

  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const startDate = new Date(firstDay)
    startDate.setDate(startDate.getDate() - firstDay.getDay())
    
    const days = []
    const currentDate = new Date(startDate)
    
    // Generate 42 days (6 weeks)
    for (let i = 0; i < 42; i++) {
      days.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }
    
    return days
  }, [currentMonth])

  const getEventsForDate = (date) => {
    const dateString = date.toISOString().split('T')[0]
    return events.filter(event => {
      const eventDate = new Date(event.start_time).toISOString().split('T')[0]
      return eventDate === dateString
    })
  }

  const isToday = (date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const isCurrentMonth = (date) => {
    return date.getMonth() === currentMonth.getMonth()
  }

  const isSelected = (date) => {
    return date.toDateString() === selectedDate.toDateString()
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))
  }

  const handleEventClick = (e, event) => {
    e.stopPropagation()
    onEventClick(event)
  }

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Calendar Header */}
      <div className="bg-primary-600 text-white p-4">
        <div className="flex items-center justify-between">
          <button
            onClick={previousMonth}
            className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          
          <h2 className="text-xl font-semibold">
            {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
          </h2>
          
          <button
            onClick={nextMonth}
            className="p-2 hover:bg-primary-700 rounded-lg transition-colors"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Day Names */}
      <div className="grid grid-cols-7 bg-gray-50 border-b">
        {dayNames.map(day => (
          <div key={day} className="p-3 text-center text-sm font-medium text-gray-700">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-0 border-r border-b border-gray-200">
        {calendarDays.map((date, index) => (
          <div
            key={index}
            onClick={() => onDateSelect(date)}
            className={`min-h-[120px] p-2 border-l border-t border-gray-200 cursor-pointer transition-colors relative ${
              !isCurrentMonth(date)
                ? 'bg-gray-50 text-gray-400'
                : isSelected(date)
                ? 'bg-primary-50'
                : isToday(date)
                ? 'bg-blue-50'
                : 'bg-white hover:bg-gray-50'
            }`}
          >
            {/* Date Number */}
            <div className={`text-sm font-medium mb-1 ${
              isToday(date) ? 'text-blue-600' : 
              isSelected(date) ? 'text-primary-600' :
              !isCurrentMonth(date) ? 'text-gray-400' : 'text-gray-900'
            }`}>
              {date.getDate()}
            </div>

            {/* Events */}
            <div className="space-y-1">
              {getEventsForDate(date).slice(0, 3).map(event => (
                <div
                  key={event.id}
                  onClick={(e) => handleEventClick(e, event)}
                  className="text-xs p-1 rounded cursor-pointer hover:opacity-80 transition-opacity"
                  style={{ 
                    backgroundColor: event.color || '#3b82f6',
                    color: 'white'
                  }}
                  title={`${event.title}${event.all_day ? ' (All day)' : ` at ${new Date(event.start_time).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })}`}`}
                >
                  <div className="truncate font-medium">
                    {event.title}
                  </div>
                  {!event.all_day && (
                    <div className="truncate opacity-90">
                      {new Date(event.start_time).toLocaleTimeString('en-US', { 
                        hour: 'numeric', 
                        minute: '2-digit', 
                        hour12: true 
                      })}
                    </div>
                  )}
                </div>
              ))}
              
              {/* Show "more" indicator if there are additional events */}
              {getEventsForDate(date).length > 3 && (
                <div className="text-xs text-gray-500 font-medium">
                  +{getEventsForDate(date).length - 3} more
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}