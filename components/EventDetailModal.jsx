'use client'

import { useState } from 'react'
import { X, Calendar, Clock, User, Edit, Trash2, Save, X as Cancel } from 'lucide-react'

export default function EventDetailModal({ event, currentUser, profiles, onClose, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    title: event.title || '',
    description: event.description || '',
    start_time: event.start_time ? new Date(event.start_time).toISOString().slice(0, 16) : '',
    all_day: event.all_day || false,
    color: event.color || '#3b82f6'
  })

  const creator = event.profiles || profiles.find(p => p.id === event.created_by)
  const canEdit = currentUser.id === event.created_by
  
  const startTime = new Date(event.start_time)
  const endTime = new Date(event.end_time)

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }

  const handleSave = async () => {
    try {
      const updates = {
        title: editData.title,
        description: editData.description,
        start_time: editData.all_day 
          ? new Date(editData.start_time + 'T00:00:00').toISOString()
          : new Date(editData.start_time).toISOString(),
        end_time: editData.all_day
          ? new Date(editData.start_time + 'T23:59:59').toISOString()
          : new Date(new Date(editData.start_time).getTime() + 60 * 60 * 1000).toISOString(), // +1 hour
        all_day: editData.all_day,
        color: editData.color
      }

      await onUpdate(event.id, updates)
      setIsEditing(false)
    } catch (error) {
      console.error('Error saving event:', error)
      alert('Failed to save changes. Please try again.')
    }
  }

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      await onDelete(event.id)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-3">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: event.color }}
            />
            <h2 className="text-xl font-semibold text-gray-900">
              {isEditing ? 'Edit Event' : 'Event Details'}
            </h2>
          </div>
          
          <div className="flex items-center space-x-2">
            {canEdit && !isEditing && (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  title="Edit Event"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={handleDelete}
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  title="Delete Event"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </>
            )}
            
            {isEditing && (
              <>
                <button
                  onClick={handleSave}
                  className="p-2 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                  title="Save Changes"
                >
                  <Save className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  className="p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                  title="Cancel"
                >
                  <Cancel className="h-4 w-4" />
                </button>
              </>
            )}
            
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Event Title
            </label>
            {isEditing ? (
              <input
                type="text"
                value={editData.title}
                onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Enter event title"
              />
            ) : (
              <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
            )}
          </div>

          {/* Date and Time */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">Date</p>
                {isEditing ? (
                  <input
                    type="date"
                    value={editData.start_time.split('T')[0]}
                    onChange={(e) => {
                      const currentTime = editData.start_time.split('T')[1] || '09:00'
                      setEditData(prev => ({ 
                        ...prev, 
                        start_time: `${e.target.value}T${currentTime}`
                      }))
                    }}
                    className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1"
                  />
                ) : (
                  <p className="text-sm font-medium text-gray-900">{formatDate(startTime)}</p>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
              <Clock className="h-5 w-5 text-primary-600" />
              <div>
                <p className="text-sm text-gray-600">Time</p>
                {isEditing ? (
                  <div className="space-y-1">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={editData.all_day}
                        onChange={(e) => setEditData(prev => ({ ...prev, all_day: e.target.checked }))}
                        className="text-primary-600"
                      />
                      <span className="text-xs text-gray-600">All day</span>
                    </label>
                    {!editData.all_day && (
                      <input
                        type="time"
                        value={editData.start_time.split('T')[1] || '09:00'}
                        onChange={(e) => {
                          const currentDate = editData.start_time.split('T')[0]
                          setEditData(prev => ({ 
                            ...prev, 
                            start_time: `${currentDate}T${e.target.value}`
                          }))
                        }}
                        className="text-sm font-medium text-gray-900 border border-gray-300 rounded px-2 py-1"
                      />
                    )}
                  </div>
                ) : (
                  <p className="text-sm font-medium text-gray-900">
                    {event.all_day ? 'All day' : `${formatTime(startTime)} - ${formatTime(endTime)}`}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Color */}
          {isEditing && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Event Color
              </label>
              <div className="flex space-x-2">
                {['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'].map(color => (
                  <button
                    key={color}
                    onClick={() => setEditData(prev => ({ ...prev, color }))}
                    className={`w-8 h-8 rounded-full border-2 ${
                      editData.color === color ? 'border-gray-900' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            {isEditing ? (
              <textarea
                value={editData.description}
                onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent resize-none"
                placeholder="Add event description..."
              />
            ) : (
              <div className="bg-gray-50 rounded-lg p-4">
                {event.description ? (
                  <p className="text-gray-700 whitespace-pre-wrap">{event.description}</p>
                ) : (
                  <p className="text-gray-400 italic">No description provided</p>
                )}
              </div>
            )}
          </div>

          {/* Creator Info */}
          <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
            <User className="h-5 w-5 text-blue-600" />
            <div>
              <p className="text-sm text-blue-600">Created by</p>
              <p className="text-sm font-medium text-blue-900">
                {creator?.name || creator?.email || 'Unknown'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          {isEditing && (
            <div className="flex justify-end space-x-3 pt-4 border-t">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}