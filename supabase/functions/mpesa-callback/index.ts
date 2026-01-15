import 'dotenv/config'

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

// --- Helper: STK Push ---
async function lipaNaMpesa(phoneNumber: string, amount: number) {
  const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY') ?? ''
  const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET') ?? ''
  const shortcode = Deno.env.get('MPESA_SHORTCODE') ?? ''
  const passkey = Deno.env.get('MPESA_PASSKEY') ?? ''
  const callbackURL = Deno.env.get('MPESA_CALLBACK_URL') ?? ''

  // 1️⃣ Get access token
  const auth = btoa(`${consumerKey}:${consumerSecret}`)
  const tokenResp = await fetch(
    'https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
    { headers: { Authorization: `Basic ${auth}` } }
  )
  const { access_token } = await tokenResp.json()

  // 2️⃣ Timestamp & password
  const timestamp = new Date().toISOString().replace(/[-:TZ.]/g, '').slice(0, 14)
  const password = btoa(shortcode + passkey + timestamp)

  // 3️⃣ STK Push request
  const body = {
    BusinessShortCode: shortcode,
    Password: password,
    Timestamp: timestamp,
    TransactionType: 'CustomerPayBillOnline',
    Amount: amount,
    PartyA: phoneNumber,
    PartyB: shortcode,
    PhoneNumber: phoneNumber,
    CallBackURL: callbackURL,
    AccountReference: 'ORDER001',
    TransactionDesc: 'Payment for order #001',
  }

  const stkResp = await fetch(
    'https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
    {
      method: 'POST',
      headers: { Authorization: `Bearer ${access_token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }
  )

  return await stkResp.json()
}

// --- Serve requests ---
serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  const url = new URL(req.url)

  try {
    // 1️⃣ Trigger payment endpoint
    if (url.pathname === '/api/pay' && req.method === 'POST') {
      const { phoneNumber, amount, bookingId, orderId } = await req.json()

      // Save transaction as pending
      const { data: transaction, error } = await supabase
        .from('mpesa_transactions')
        .insert({
          phone_number: phoneNumber,
          amount,
          status: 'pending',
          booking_id: bookingId ?? null,
          order_id: orderId ?? null,
        })
        .select()
        .single()

      if (error) throw error

      // Trigger STK Push
      const stkResponse = await lipaNaMpesa(phoneNumber, amount)

      // Update transaction with CheckoutRequestID
      await supabase
        .from('mpesa_transactions')
        .update({ checkout_request_id: stkResponse.CheckoutRequestID })
        .eq('id', transaction.id)

      return new Response(JSON.stringify(stkResponse), { headers: corsHeaders })
    }

    // 2️⃣ Callback from M-Pesa
    if (url.pathname === '/api/mpesa/callback' && req.method === 'POST') {
      const callbackData = await req.json()
      console.log('M-Pesa callback received:', callbackData)

      const { Body } = callbackData
      const { stkCallback } = Body

      const checkoutRequestId = stkCallback.CheckoutRequestID
      const merchantRequestId = stkCallback.MerchantRequestID
      const resultCode = stkCallback.ResultCode
      const resultDesc = stkCallback.ResultDesc

      // Fetch transaction
      const { data: transaction, error: fetchError } = await supabase
        .from('mpesa_transactions')
        .select('*')
        .eq('checkout_request_id', checkoutRequestId)
        .single()

      if (fetchError) return new Response('Transaction not found', { status: 404 })

      if (resultCode === 0) {
        // Successful payment
        const callbackMetadata = stkCallback.CallbackMetadata?.Item || []
        const mpesaReceiptNumber = callbackMetadata.find(item => item.Name === 'MpesaReceiptNumber')?.Value
        const transactionDate = callbackMetadata.find(item => item.Name === 'TransactionDate')?.Value
        const phoneNumber = callbackMetadata.find(item => item.Name === 'PhoneNumber')?.Value

        // Update transaction
        await supabase
          .from('mpesa_transactions')
          .update({
            status: 'completed',
            mpesa_receipt_number: mpesaReceiptNumber,
            transaction_date: transactionDate,
            phone_number: phoneNumber,
            result_desc: resultDesc,
          })
          .eq('checkout_request_id', checkoutRequestId)

        // Update booking
        if (transaction.booking_id) {
          await supabase
            .from('bookings')
            .update({
              payment_status: 'completed',
              status: 'confirmed',
              payment_reference: mpesaReceiptNumber,
            })
            .eq('id', transaction.booking_id)

          // Optional: trigger confirmation function
          const supabaseUrl = Deno.env.get('SUPABASE_URL')
          const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')
          await fetch(`${supabaseUrl}/functions/v1/send-booking-confirmation`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${supabaseAnonKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ bookingId: transaction.booking_id }),
          })
        }

        // Update order
        if (transaction.order_id) {
          await supabase
            .from('orders')
            .update({
              payment_status: 'completed',
              status: 'processing',
              payment_reference: mpesaReceiptNumber,
            })
            .eq('id', transaction.order_id)
        }
      } else {
        // Failed payment
        await supabase
          .from('mpesa_transactions')
          .update({ status: 'failed', result_desc: resultDesc })
          .eq('checkout_request_id', checkoutRequestId)

        if (transaction.booking_id) {
          await supabase
            .from('bookings')
            .update({ payment_status: 'failed', status: 'cancelled' })
            .eq('id', transaction.booking_id)
        }

        if (transaction.order_id) {
          await supabase
            .from('orders')
            .update({ payment_status: 'failed', status: 'cancelled' })
            .eq('id', transaction.order_id)
        }
      }

      return new Response(JSON.stringify({ ResultCode: 0, ResultDesc: 'Success' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      })
    }

    return new Response('Not Found', { status: 404 })
  } catch (error) {
    console.error('Error:', error)
    return new Response(JSON.stringify({ ResultCode: 1, ResultDesc: 'Error processing request' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    })
  }
})
