/*
  # M-Pesa Callback Handler

  1. Callback Processing
    - Handle M-Pesa payment callbacks
    - Validate transaction data
    - Update payment status

  2. Database Updates
    - Update booking/order status
    - Log transaction details
    - Trigger confirmation notifications

  3. Error Handling
    - Handle failed payments
    - Log callback errors
    - Graceful error recovery
*/

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
    const callbackData = await req.json()
    console.log('M-Pesa callback received:', callbackData)

    const { Body } = callbackData
    const { stkCallback } = Body

    const checkoutRequestId = stkCallback.CheckoutRequestID
    const merchantRequestId = stkCallback.MerchantRequestID
    const resultCode = stkCallback.ResultCode
    const resultDesc = stkCallback.ResultDesc

    // Update transaction status
    const { data: transaction, error: fetchError } = await supabase
      .from('mpesa_transactions')
      .select('*')
      .eq('checkout_request_id', checkoutRequestId)
      .single()

    if (fetchError) {
      console.error('Error fetching transaction:', fetchError)
      return new Response('Transaction not found', { status: 404 })
    }

    if (resultCode === 0) {
      // Payment successful
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

      // Update booking or order
      if (transaction.booking_id) {
        await supabase
          .from('bookings')
          .update({
            payment_status: 'completed',
            status: 'confirmed',
            payment_reference: mpesaReceiptNumber,
          })
          .eq('id', transaction.booking_id)

        // Trigger booking confirmation
        await fetch(`${Deno.env.get('SUPABASE_URL')}/functions/v1/send-booking-confirmation`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ bookingId: transaction.booking_id }),
        })
      }

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
      // Payment failed
      await supabase
        .from('mpesa_transactions')
        .update({
          status: 'failed',
          result_desc: resultDesc,
        })
        .eq('checkout_request_id', checkoutRequestId)

      // Update booking or order
      if (transaction.booking_id) {
        await supabase
          .from('bookings')
          .update({
            payment_status: 'failed',
            status: 'cancelled',
          })
          .eq('id', transaction.booking_id)
      }

      if (transaction.order_id) {
        await supabase
          .from('orders')
          .update({
            payment_status: 'failed',
            status: 'cancelled',
          })
          .eq('id', transaction.order_id)
      }
    }

    return new Response(
      JSON.stringify({ ResultCode: 0, ResultDesc: 'Success' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    console.error('M-Pesa callback error:', error)
    return new Response(
      JSON.stringify({ ResultCode: 1, ResultDesc: 'Error processing callback' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})