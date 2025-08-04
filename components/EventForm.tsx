'use client'

import { useState } from 'react'
import { X, Calendar, Clock, Type, AlignLeft, Bell } from 'lucide-react'

export default function EventForm({ selectedDate, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: selectedDate ? selectedDate.toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
    all_day: false,
    color: '#3b82f6',
    reminder_15min: true,
    reminder_1hr: false,
    reminder_1day: false
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    const startTime = new Date(formData.start_time)
    let endTime = new Date(startTime)
    
    if (formData.all_day) {
      // For all-day events, set end time to end of day
      endTime.setHours(23, 59, 59)
    } else {
      // For timed events, default to 1 hour duration
      endTime.setHours(endTime.getHours() + 1)
    }

    const eventData = {
      ...formData,
      start_time: startTime.toISOString(),
      end_time: endTime.toISOString()
    }

    onSubmit(eventData)
  }

  const colorOptions = [
    { value: '#3b82f6', label: 'Blue' },
    { value: '#ec4899', label: 'Pink' },
    { value: '#22c55e', label: 'Green' },
    { value: '#f97316', label: 'Orange' },
    { value: '#a855f7', label: 'Purple' },
    { value: '#eab308', label: 'Yellow' },
    { value: '#ef4444', label: 'Red' },
    { value: '#6b7280', label: 'Gray' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Add New Event</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Type className="inline h-4 w-4 mr-1" />
              Event Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Enter event title"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <AlignLeft className="inline h-4 w-4 mr-1" />
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              placeholder="Add event details (optional)"
            />
          </div>

          {/* Date and Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={formData.start_time}
              onChange={(e) => setFormData(prev => ({ ...prev, start_time: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* All Day Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="all-day"
              checked={formData.all_day}
              onChange={(e) => setFormData(prev => ({ ...prev, all_day: e.target.checked }))}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label htmlFor="all-day" className="ml-2 text-sm text-gray-700">
              <Clock className="inline h-4 w-4 mr-1" />
              All day event
            </label>
          </div>

          {/* Color Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Color
            </label>
            <div className="flex flex-wrap gap-2">
              {colorOptions.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color.value 
                      ? 'border-gray-800 scale-110' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.label}
                />
              ))}
            </div>
          </div>

          {/* Reminders */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Bell className="inline h-4 w-4 mr-1" />
              Reminders
            </label>
            <div className="space-y-2">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.reminder_15min}
                  onChange={(e) => setFormData(prev => ({ ...prev, reminder_15min: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">15 minutes before</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.reminder_1hr}
                  onChange={(e) => setFormData(prev => ({ ...prev, reminder_1hr: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">1 hour before</span>
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.reminder_1day}
                  onChange={(e) => setFormData(prev => ({ ...prev, reminder_1day: e.target.checked }))}
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <span className="ml-2 text-sm text-gray-700">1 day before</span>
              </label>
            </div>
          </div>

          {/* Submit Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}