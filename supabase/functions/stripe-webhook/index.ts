// @ts-nocheck - Deno specific imports will work in Edge Functions
import { serve } from 'https://deno.fresh.dev/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.7.1'
import { Buffer } from 'https://deno.fresh.dev/std@0.168.0/node/buffer.ts'

const STRIPE_SECRET_KEY = Deno.env.get('STRIPE_SECRET_KEY')
const STRIPE_WEBHOOK_SECRET = Deno.env.get('STRIPE_WEBHOOK_SECRET')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

serve(async (req) => {
  try {
    const signature = req.headers.get('stripe-signature')
    if (!signature || !STRIPE_WEBHOOK_SECRET) {
      return new Response('Missing signature or webhook secret', { status: 400 })
    }

    const body = await req.text()
    const event = await constructEvent(body, signature, STRIPE_WEBHOOK_SECRET)

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    switch (event.type) {
      case 'checkout.session.completed':
        const session = event.data.object
        
        // Update subscription in database
        const { error } = await supabase
          .from('subscriptions')
          .upsert({
            user_id: session.client_reference_id, // This should be set when creating checkout
            stripe_customer_id: session.customer,
            subscription_type: 'essentials', // This matches your $9.99 plan
            current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            updated_at: new Date().toISOString()
          })

        if (error) {
          console.error('Error updating subscription:', error)
          return new Response(JSON.stringify({ error: 'Database error' }), { status: 500 })
        }
        break

      // Handle other event types as needed
    }

    return new Response(JSON.stringify({ received: true }), { status: 200 })
  } catch (err) {
    console.error('Error:', err)
    return new Response(JSON.stringify({ error: err.message }), { status: 400 })
  }
})

// Helper function to verify Stripe webhook signature
async function constructEvent(payload: string, signature: string, secret: string) {
  const encoder = new TextEncoder()
  const message = encoder.encode(payload)
  const key = encoder.encode(secret)
  const signatureBytes = hexToBytes(signature.split(',')[1])

  const hmac = await crypto.subtle.importKey(
    'raw',
    key,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['verify']
  )

  const verified = await crypto.subtle.verify(
    'HMAC',
    hmac,
    signatureBytes,
    message
  )

  if (!verified) {
    throw new Error('Invalid signature')
  }

  return JSON.parse(payload)
}

function hexToBytes(hex: string) {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = parseInt(hex.substr(i, 2), 16)
  }
  return bytes
}
