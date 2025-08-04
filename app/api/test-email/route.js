import { createClient } from '@supabase/supabase-js'

export async function POST(request) {
  try {
    const { to_email, test_name } = await request.json()

    // Call Supabase Edge Function
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY // You'll need this for server-side calls
    )

    const { data, error } = await supabase.functions.invoke('test-email', {
      body: { to_email, test_name }
    })

    if (error) throw error

    return Response.json(data)
  } catch (error) {
    console.error('Test email API error:', error)
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}