// Notification management
let notificationPermission = 'default'

export const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    notificationPermission = await Notification.requestPermission()
    console.log('Notification permission:', notificationPermission)
  }
}

export const showNotification = (title, options = {}) => {
  if (notificationPermission === 'granted') {
    new Notification(title, {
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      ...options
    })
  }
}

export const scheduleReminder = (event) => {
  if (notificationPermission !== 'granted') return

  const eventTime = new Date(event.start_time)
  const now = new Date()
  
  // Schedule notifications based on event settings
  const scheduleNotification = (minutes, message) => {
    const notificationTime = new Date(eventTime.getTime() - minutes * 60000)
    
    if (notificationTime > now) {
      const timeout = notificationTime.getTime() - now.getTime()
      
      setTimeout(() => {
        showNotification(`Upcoming Event: ${event.title}`, {
          body: message,
          tag: `reminder-${event.id}-${minutes}`,
          requireInteraction: true
        })
      }, timeout)
    }
  }

  // Schedule based on event reminder settings
  if (event.reminder_1day) {
    scheduleNotification(24 * 60, 'Tomorrow')
  }
  
  if (event.reminder_1hr) {
    scheduleNotification(60, 'In 1 hour')
  }
  
  if (event.reminder_15min) {
    scheduleNotification(15, 'In 15 minutes')
  }
}