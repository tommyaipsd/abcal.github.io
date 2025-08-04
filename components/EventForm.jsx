'use client'

import { useState } from 'react'
import { X, Calendar, Clock, Type, FileText, Palette } from 'lucide-react'

export default function EventForm({ selectedDate, onSubmit, onClose }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    start_time: selectedDate ? 
      new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate(), 9, 0)
        .toISOString().slice(0, 16) : 
      new Date().toISOString().slice(0, 16),
    all_day: false,
    color: '#3b82f6'
  })

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    const eventData = {
      title: formData.title,
      description: formData.description,
      start_time: formData.all_day 
        ? new Date(formData.start_time + 'T00:00:00').toISOString()
        : new Date(formData.start_time).toISOString(),
      end_time: formData.all_day
        ? new Date(formData.start_time + 'T23:59:59').toISOString()
        : new Date(new Date(formData.start_time).getTime() + 60 * 60 * 1000).toISOString(), // +1 hour
      all_day: formData.all_day,
      color: formData.color
    }

    await onSubmit(eventData)
  }

  const colors = [
    { name: 'Blue', value: '#3b82f6' },
    { name: 'Green', value: '#10b981' },
    { name: 'Yellow', value: '#f59e0b' },
    { name: 'Red', value: '#ef4444' },
    { name: 'Purple', value: '#8b5cf6' },
    { name: 'Pink', value: '#ec4899' }
  ]

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Add New Event</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Type className="inline h-4 w-4 mr-1" />
              Event Title
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

          {/* Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Calendar className="inline h-4 w-4 mr-1" />
              Date
            </label>
            <input
              type="date"
              required
              value={formData.start_time.split('T')[0]}
              onChange={(e) => {
                const currentTime = formData.start_time.split('T')[1] || '09:00'
                setFormData(prev => ({ 
                  ...prev, 
                  start_time: `${e.target.value}T${currentTime}`
                }))
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>

          {/* Time */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Clock className="inline h-4 w-4 mr-1" />
              Time
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={formData.all_day}
                  onChange={(e) => setFormData(prev => ({ ...prev, all_day: e.target.checked }))}
                  className="text-primary-600"
                />
                <span className="text-sm text-gray-700">All day event</span>
              </label>
              
              {!formData.all_day && (
                <input
                  type="time"
                  value={formData.start_time.split('T')[1] || '09:00'}
                  onChange={(e) => {
                    const currentDate = formData.start_time.split('T')[0]
                    setFormData(prev => ({ 
                      ...prev, 
                      start_time: `${currentDate}T${e.target.value}`
                    }))
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              )}
            </div>
          </div>

          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <Palette className="inline h-4 w-4 mr-1" />
              Event Color
            </label>
            <div className="flex space-x-2">
              {colors.map(color => (
                <button
                  key={color.value}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, color: color.value }))}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    formData.color === color.value 
                      ? 'border-gray-900 scale-110' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <FileText className="inline h-4 w-4 mr-1" />
              Description (optional)
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
              placeholder="Add event description..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
            >
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}