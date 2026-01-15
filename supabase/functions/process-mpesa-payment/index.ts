import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
)

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { phoneNumber, amount, bookingId, orderId, accountReference } = await req.json()

    // Get M-Pesa access token
    const tokenResponse = await getMpesaAccessToken()
    if (!tokenResponse.success) {
      throw new Error('Failed to get M-Pesa access token')
    }

    // Initiate STK Push
    const stkPushResponse = await initiateStkPush({
      accessToken: tokenResponse.accessToken,
      phoneNumber,
      amount,
      accountReference: accountReference || bookingId || orderId,
      transactionDesc: `Payment for ${bookingId ? 'booking' : 'order'} ${accountReference}`,
    })

    if (!stkPushResponse.success) {
      throw new Error('Failed to initiate M-Pesa payment')
    }

    // Store transaction for tracking
    const { error } = await supabase
      .from('mpesa_transactions')
      .insert([
        {
          checkout_request_id: stkPushResponse.checkoutRequestId,
          merchant_request_id: stkPushResponse.merchantRequestId,
          phone_number: phoneNumber,
          amount,
          booking_id: bookingId,
          order_id: orderId,
          status: 'pending',
        },
      ])

    if (error) {
      console.error('Error storing M-Pesa transaction:', error)
    }

    return new Response(
      JSON.stringify({
        success: true,
        checkoutRequestId: stkPushResponse.checkoutRequestId,
        merchantRequestId: stkPushResponse.merchantRequestId,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('M-Pesa payment error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})

async function getMpesaAccessToken() {
  try {
    const consumerKey = Deno.env.get('MPESA_CONSUMER_KEY')
    const consumerSecret = Deno.env.get('MPESA_CONSUMER_SECRET')
    const credentials = btoa(`${consumerKey}:${consumerSecret}`)

    const response = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${credentials}`,
      },
    })

    const data = await response.json()
    
    if (data.access_token) {
      return { success: true, accessToken: data.access_token }
    } else {
      return { success: false, error: 'No access token received' }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}

async function initiateStkPush({ accessToken, phoneNumber, amount, accountReference, transactionDesc }) {
  try {
    const businessShortCode = Deno.env.get('MPESA_BUSINESS_SHORT_CODE')
    const passkey = Deno.env.get('MPESA_PASSKEY')
    const timestamp = new Date().toISOString().replace(/[^0-9]/g, '').slice(0, -3)
    const password = btoa(`${businessShortCode}${passkey}${timestamp}`)

    const stkPushPayload = {
      BusinessShortCode: businessShortCode,
      Password: password,
      Timestamp: timestamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phoneNumber,
      PartyB: businessShortCode,
      PhoneNumber: phoneNumber,
      CallBackURL: `${Deno.env.get('SUPABASE_URL')}/functions/v1/mpesa-callback`,
      AccountReference: accountReference,
      TransactionDesc: transactionDesc,
    }

    const response = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(stkPushPayload),
    })

    const data = await response.json()

    if (data.ResponseCode === '0') {
      return {
        success: true,
        checkoutRequestId: data.CheckoutRequestID,
        merchantRequestId: data.MerchantRequestID,
      }
    } else {
      return { success: false, error: data.ResponseDescription }
    }
  } catch (error) {
    return { success: false, error: error.message }
  }
}