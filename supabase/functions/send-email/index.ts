import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    // Get the current user
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      throw new Error('User not authenticated')
    }

    // Parse request body
    const { event_id, event_title, creator_id, recipients } = await req.json()

    // Get event details
    const { data: event, error: eventError } = await supabase
      .from('events')
      .select('*, profiles!created_by(name, email)')
      .eq('id', event_id)
      .single()

    if (eventError) throw eventError

    // Get all household members if recipients not specified
    let emailRecipients = recipients
    if (!emailRecipients) {
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('email, name')
        .neq('id', creator_id) // Don't email the creator

      if (profilesError) throw profilesError
      emailRecipients = profiles
    }

    // Prepare email content
    const creatorName = event.profiles?.name || 'Someone'
    const eventDate = new Date(event.start_time).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    const eventTime = event.all_day 
      ? 'All day' 
      : new Date(event.start_time).toLocaleTimeString('en-US', {
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        })

    // Send emails using Resend
    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured')
    }

    const emailPromises = emailRecipients.map(async (recipient: any) => {
      const emailData = {
        from: 'ABCal <noreply@yourdomain.com>', // Replace with your verified domain
        to: [recipient.email],
        subject: `New Event: ${event.title}`,
        html: `
          <!DOCTYPE html>
          <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Event Added</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            
            <!-- Header -->
            <div style="text-align: center; margin-bottom: 30px;">
              <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); width: 60px; height: 60px; border-radius: 12px; margin: 0 auto 15px; display: flex; align-items: center; justify-content: center;">
                <span style="color: white; font-size: 24px;">📅</span>
              </div>
              <h1 style="color: #1f2937; margin: 0; font-size: 24px;">AB<span style="color: #3b82f6;">Cal</span></h1>
              <p style="color: #6b7280; margin: 5px 0 0;">Household Calendar</p>
            </div>

            <!-- Main Content -->
            <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <h2 style="color: #1f2937; margin: 0 0 16px; font-size: 20px;">New Event Added</h2>
              <p style="color: #4b5563; margin: 0 0 20px;">${creatorName} has added a new event to your household calendar:</p>
              
              <div style="background: white; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb;">
                <h3 style="color: #1f2937; margin: 0 0 12px; font-size: 18px;">${event.title}</h3>
                
                ${event.description ? `<p style="color: #6b7280; margin: 0 0 16px;">${event.description}</p>` : ''}
                
                <div style="display: flex; flex-wrap: wrap; gap: 16px; margin-top: 16px;">
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: #3b82f6;">📅</span>
                    <span style="color: #374151; font-weight: 500;">${eventDate}</span>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span style="color: #3b82f6;">⏰</span>
                    <span style="color: #374151; font-weight: 500;">${eventTime}</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${Deno.env.get('SITE_URL') || 'https://your-abcal-site.vercel.app'}" 
                 style="background: #3b82f6; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: 500; display: inline-block;">
                View in ABCal
              </a>
            </div>

            <!-- Footer -->
            <div style="text-align: center; color: #9ca3af; font-size: 14px;">
              <p>You're receiving this because you're part of the household calendar.</p>
              <p style="margin: 8px 0 0;">Sent by ABCal - Household Calendar</p>
            </div>
          </body>
          </html>
        `
      }

      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(emailData),
      })

      if (!response.ok) {
        const error = await response.text()
        throw new Error(`Resend API error: ${error}`)
      }

      return await response.json()
    })

    const results = await Promise.all(emailPromises)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Email sent to ${emailRecipients.length} recipients`,
        results 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        success: false 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})