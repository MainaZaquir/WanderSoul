/*
  # Stripe Webhook Handler

  1. Webhook Processing
    - Verify webhook signatures
    - Handle payment events
    - Update database records

  2. Event Types
    - payment_intent.succeeded
    - payment_intent.payment_failed
    - payment_intent.canceled

  3. Database Updates
    - Update booking/order payment status
    - Trigger confirmation emails
    - Log payment events
*/

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import Stripe from 'https://esm.sh/stripe@13.6.0?target=deno'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, stripe-signature',
}

const stripe = new Stripe(Deno.env.get('STRIPE_SECRET_KEY') || '', {
  apiVersion: '2023-10-16',
})

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.text()
    const signature = req.headers.get('stripe-signature')

    if (!signature) {
      throw new Error('No signature provided')
    }

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      Deno.env.get('STRIPE_WEBHOOK_SECRET') || ''
    )

    console.log('Received webhook event:', event.type)

    switch (event.type) {
      case 'payment_intent.succeeded':
        await handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)
        break
      case 'payment_intent.payment_failed':
        await handlePaymentFailed(event.data.object as Stripe.PaymentIntent)
        break
      case 'payment_intent.canceled':
        await handlePaymentCanceled(event.data.object as Stripe.PaymentIntent)
        break
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    console.error('Webhook error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const { bookingId, orderId } = paymentIntent.metadata

  if (bookingId) {
    // Update booking payment status
    const { error } = await supabase
      .from('bookings')
      .update({
        payment_status: 'completed',
        status: 'confirmed',
        payment_reference: paymentIntent.id,
      })
      .eq('id', bookingId)

    if (error) {
      console.error('Error updating booking:', error)
      return
    }

    // Trigger booking confirmation email
    await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-booking-confirmation`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ bookingId }),
    })
  }

  if (orderId) {
    // Update order payment status
    const { error } = await supabase
      .from('orders')
      .update({
        payment_status: 'completed',
        status: 'processing',
        payment_reference: paymentIntent.id,
      })
      .eq('id', orderId)

    if (error) {
      console.error('Error updating order:', error)
    }
  }
}

async function handlePaymentFailed(paymentIntent: Stripe.PaymentIntent) {
  const { bookingId, orderId } = paymentIntent.metadata

  if (bookingId) {
    await supabase
      .from('bookings')
      .update({
        payment_status: 'failed',
        status: 'cancelled',
      })
      .eq('id', bookingId)
  }

  if (orderId) {
    await supabase
      .from('orders')
      .update({
        payment_status: 'failed',
        status: 'cancelled',
      })
      .eq('id', orderId)
  }
}

async function handlePaymentCanceled(paymentIntent: Stripe.PaymentIntent) {
  const { bookingId, orderId } = paymentIntent.metadata

  if (bookingId) {
    await supabase
      .from('bookings')
      .update({
        payment_status: 'cancelled',
        status: 'cancelled',
      })
      .eq('id', bookingId)
  }

  if (orderId) {
    await supabase
      .from('orders')
      .update({
        payment_status: 'cancelled',
        status: 'cancelled',
      })
      .eq('id', orderId)
  }
}