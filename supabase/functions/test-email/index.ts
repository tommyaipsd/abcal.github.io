import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to_email, test_name } = await req.json()

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY not configured')
    }

    const emailData = {
      from: 'ABCal <noreply@yourdomain.com>', // Replace with your verified domain
      to: [to_email],
      subject: 'ABCal Email Test - Everything Works! 🎉',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>ABCal Test Email</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 40px 20px;">
          
          <div style="text-align: center; margin-bottom: 40px;">
            <div style="background: linear-gradient(135deg, #3b82f6, #2563eb); width: 80px; height: 80px; border-radius: 16px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center;">
              <span style="color: white; font-size: 32px;">✅</span>
            </div>
            <h1 style="color: #1f2937; margin: 0; font-size: 28px;">Email Integration Working!</h1>
            <h2 style="color: #3b82f6; margin: 10px 0 0; font-size: 20px;">AB<span style="color: #1f2937;">Cal</span> Test Successful</h2>
          </div>

          <div style="background: #f0f9ff; border: 2px solid #3b82f6; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
            <h3 style="color: #1e40af; margin: 0 0 16px;">🎉 Congratulations!</h3>
            <p style="color: #1e40af; margin: 0; font-size: 16px;">
              Your ABCal email system is properly configured and working perfectly. 
              ${test_name ? `Hi ${test_name}! ` : ''}This test email confirms that:
            </p>
            
            <ul style="color: #1e40af; margin: 16px 0; padding-left: 20px;">
              <li>✅ Resend API integration is working</li>
              <li>✅ Supabase Edge Functions are deployed</li>
              <li>✅ Email templates render correctly</li>
              <li>✅ Your household will receive event notifications</li>
            </ul>
          </div>

          <div style="background: #fafafa; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
            <h4 style="color: #374151; margin: 0 0 12px;">Next Steps:</h4>
            <ol style="color: #4b5563; margin: 0; padding-left: 20px;">
              <li>Deploy your ABCal app to Vercel</li>
              <li>Update the SITE_URL environment variable</li>
              <li>Invite your household members</li>
              <li>Start sharing your calendar events!</li>
            </ol>
          </div>

          <div style="text-align: center;">
            <p style="color: #6b7280; margin: 0; font-size: 14px;">
              Test sent at: ${new Date().toLocaleString()}<br>
              From your ABCal deployment
            </p>
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

    const result = await response.json()

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test email sent successfully!',
        email_id: result.id,
        to: to_email
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Test email error:', error)
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