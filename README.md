# ABCal - Household Calendar

A modern, real-time shared calendar application for households built with Next.js and Supabase.

## Features

- 🔐 **User Authentication** - Sign up/sign in with email
- 📅 **Shared Calendar** - Real-time calendar sync across all household members
- ✨ **Event Management** - Create, edit, and delete events with details
- 🎨 **Theme Customization** - 6 beautiful color themes
- 📧 **Email Notifications** - Get notified when events are added
- 🔔 **Push Notifications** - Browser notifications for reminders
- 📱 **PWA Support** - Install as mobile app
- 👥 **Profile Management** - Customize your profile and avatar

## Tech Stack

- **Frontend**: Next.js 13 (App Router), React, Tailwind CSS
- **Backend**: Supabase (Database, Authentication, Real-time)
- **Email**: Resend API for notifications
- **Icons**: Lucide React
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ 
- Supabase account
- Resend account (for email notifications)

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   ```

4. Set up the database schema in Supabase SQL editor (see `lib/supabase.js`)

5. Deploy Edge Functions (optional, for email notifications):
   ```bash
   supabase functions deploy send-email
   supabase functions deploy test-email
   ```

6. Run the development server:
   ```bash
   npm run dev
   ```

## Deployment

Deploy to Vercel:

1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy!

## Contributing

Feel free to contribute to this project by submitting issues or pull requests.

## License

MIT License - see LICENSE file for details.