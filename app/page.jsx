'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useTheme } from '../lib/themeContext'
import Calendar from '../components/Calendar'
import EventForm from '../components/EventForm'
import EventDetailModal from '../components/EventDetailModal'
import ProfileModal from '../components/ProfileModal'
import ThemeSelector from '../components/ThemeSelector'
import Logo from '../components/Logo'
import Login from '../components/Login'
import { Plus, LogOut, Users, Settings } from 'lucide-react'
import { showNotification, scheduleReminder } from '../lib/notifications'

export default function Home() {
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([])
  const [profiles, setProfiles] = useState([])
  const [showEventForm, setShowEventForm] = useState(false)
  const [showEventDetail, setShowEventDetail] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [showProfileModal, setShowProfileModal] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [loading, setLoading] = useState(true)
  const { themeConfig } = useTheme()

  useEffect(() => {
    console.log('Home: Setting up auth listener...')
    
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Home: Initial session:', session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('Home: Auth state changed:', event, session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    if (user) {
      console.log('Home: User found, fetching data...')
      fetchEvents()
      fetchProfiles()
      setupRealtimeSubscription()
    }
  }, [user])

  const fetchEvents = async () => {
    try {
      console.log('Fetching events...')
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          profiles!created_by(name, email)
        `)
        .order('start_time', { ascending: true })

      if (error) throw error
      
      console.log('Events fetched:', data)
      setEvents(data || [])
      
      // Schedule reminders for upcoming events
      data?.forEach(event => {
        scheduleReminder(event)
      })
    } catch (error) {
      console.error('Error fetching events:', error)
    }
  }

  const fetchProfiles = async () => {
    try {
      console.log('Fetching profiles...')
      const { data, error } = await supabase
        .from('profiles')
        .select('*')

      if (error) throw error
      console.log('Profiles fetched:', data)
      setProfiles(data || [])
    } catch (error) {
      console.error('Error fetching profiles:', error)
    }
  }

  const setupRealtimeSubscription = () => {
    const channel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'events'
        },
        (payload) => {
          console.log('Realtime event:', payload)
          if (payload.eventType === 'INSERT') {
            // Fetch the complete event with profile data
            fetchEvents()
            
            // Show notification for new events
            if (payload.new.created_by !== user.id) {
              const creator = profiles.find(p => p.id === payload.new.created_by)
              showNotification('New Event Added', {
                body: `${creator?.name || 'Someone'} added "${payload.new.title}"`,
                tag: `event-${payload.new.id}`
              })
            }
            
            // Schedule reminders
            scheduleReminder(payload.new)
          } else if (payload.eventType === 'UPDATE') {
            fetchEvents()
          } else if (payload.eventType === 'DELETE') {
            setEvents(prev => prev.filter(event => event.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }

  const handleSignOut = async () => {
    console.log('Signing out...')
    await supabase.auth.signOut()
    setUser(null)
    setEvents([])
    setProfiles([])
  }

  const handleEventSubmit = async (eventData) => {
    try {
      console.log('Creating event:', eventData)
      const { error } = await supabase
        .from('events')
        .insert([{
          ...eventData,
          created_by: user.id
        }])

      if (error) throw error
      
      setShowEventForm(false)
      
      // Send email notification to all household members
      await sendEventNotificationEmail(eventData)
    } catch (error) {
      console.error('Error creating event:', error)
      alert('Error creating event. Please try again.')
    }
  }

  const handleEventClick = (event) => {
    console.log('Event clicked:', event)
    setSelectedEvent(event)
    setShowEventDetail(true)
  }

  const handleEventUpdate = async (eventId, updates) => {
    try {
      const { error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId)

      if (error) throw error
      
      // Close modal and refresh events
      setShowEventDetail(false)
      setSelectedEvent(null)
      
    } catch (error) {
      console.error('Error updating event:', error)
      alert('Error updating event. Please try again.')
    }
  }

  const handleEventDelete = async (eventId) => {
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)

      if (error) throw error
      
      // Close modal
      setShowEventDetail(false)
      setSelectedEvent(null)
      
    } catch (error) {
      console.error('Error deleting event:', error)
      alert('Error deleting event. Please try again.')
    }
  }

  const sendEventNotificationEmail = async (eventData) => {
    try {
      // Get all profiles for email notifications
      const { data: allProfiles } = await supabase
        .from('profiles')
        .select('email, name')

      const currentProfile = profiles.find(p => p.id === user.id)
      
      // In a real app, you'd use a service like Resend, SendGrid, or Supabase Edge Functions
      // For now, we'll just log what would be sent
      console.log('Would send email notification:', {
        to: allProfiles?.map(p => p.email),
        subject: `New Event: ${eventData.title}`,
        body: `
          ${currentProfile?.name || user.email} has added a new event to the ABCal calendar:
          
          Event: ${eventData.title}
          ${eventData.description ? `Description: ${eventData.description}` : ''}
          Date: ${new Date(eventData.start_time).toLocaleDateString()}
          ${!eventData.all_day ? `Time: ${new Date(eventData.start_time).toLocaleTimeString()}` : 'All day event'}
          
          Check ABCal to see more details.
        `
      })
    } catch (error) {
      console.error('Error sending email notification:', error)
    }
  }

  const handleProfileUpdate = () => {
    fetchProfiles() // Refresh profiles after update
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!user) {
    console.log('No user, showing login')
    return <Login />
  }

  console.log('User authenticated, showing main app')
  const currentProfile = profiles.find(p => p.id === user.id)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Logo size="normal" />
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Users className="h-4 w-4" />
                <span>{profiles.length} members</span>
              </div>
              
              <ThemeSelector />
              
              <button
                onClick={() => setShowEventForm(true)}
                className="bg-primary-500 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-primary-600 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span>Add Event</span>
              </button>
              
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  {currentProfile?.avatar_url && (
                    <img 
                      src={currentProfile.avatar_url} 
                      alt="Profile" 
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  )}
                  <span className="text-sm text-gray-700">
                    {currentProfile?.name || user.email}
                  </span>
                </div>
                
                <button
                  onClick={() => setShowProfileModal(true)}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title="Edit Profile"
                >
                  <Settings className="h-5 w-5" />
                </button>
                
                <button
                  onClick={handleSignOut}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Calendar 
          events={events}
          profiles={profiles}
          selectedDate={selectedDate}
          onDateSelect={setSelectedDate}
          onEventClick={handleEventClick}
        />
      </main>

      {/* Event Form Modal */}
      {showEventForm && (
        <EventForm
          selectedDate={selectedDate}
          onSubmit={handleEventSubmit}
          onClose={() => setShowEventForm(false)}
        />
      )}

      {/* Event Detail Modal */}
      {showEventDetail && selectedEvent && (
        <EventDetailModal
          event={selectedEvent}
          currentUser={user}
          profiles={profiles}
          onClose={() => {
            setShowEventDetail(false)
            setSelectedEvent(null)
          }}
          onUpdate={handleEventUpdate}
          onDelete={handleEventDelete}
        />
      )}

      {/* Profile Modal */}
      {showProfileModal && (
        <ProfileModal
          user={user}
          onClose={() => setShowProfileModal(false)}
          onUpdate={handleProfileUpdate}
        />
      )}
    </div>
  )
}