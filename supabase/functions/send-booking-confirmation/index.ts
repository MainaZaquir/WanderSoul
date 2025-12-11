/*
  # Send Booking Confirmation Email and WhatsApp

  1. Email Notifications
    - Send booking confirmation to user
    - Send booking notification to admin
    - Include booking details and payment information

  2. WhatsApp Integration
    - Send WhatsApp message to user with booking details
    - Include trip information and payment confirmation

  3. Error Handling
    - Comprehensive error logging
    - Graceful fallback mechanisms
*/

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
    const { bookingData, userEmail, adminEmail } = await req.json()

    // Send email to user
    const userEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Travel With Muchina <bookings@travelwithmuchina.com>',
        to: [userEmail],
        subject: `Booking Confirmed - ${bookingData.trip.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #f97316;">Booking Confirmed! 🎉</h1>
            <p>Dear ${bookingData.user.full_name},</p>
            <p>Your booking has been confirmed! Here are your trip details:</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #1f2937; margin-top: 0;">${bookingData.trip.title}</h2>
              <p><strong>Booking Reference:</strong> ${bookingData.booking_reference}</p>
              <p><strong>Destination:</strong> ${bookingData.trip.destination}</p>
              <p><strong>Dates:</strong> ${new Date(bookingData.trip.start_date).toLocaleDateString()} - ${new Date(bookingData.trip.end_date).toLocaleDateString()}</p>
              <p><strong>Amount Paid:</strong> $${bookingData.total_amount}</p>
              <p><strong>Payment Status:</strong> ${bookingData.payment_status}</p>
            </div>
            
            <p>We'll send you more details about the trip closer to the departure date.</p>
            <p>Safe travels!</p>
            <p>The Travel With Muchina Team</p>
          </div>
        `,
      }),
    })

    // Send email to admin
    const adminEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Travel With Muchina <bookings@travelwithmuchina.com>',
        to: [adminEmail],
        subject: `New Booking - ${bookingData.trip.title}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #f97316;">New Booking Received</h1>
            <p>A new booking has been made:</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #1f2937; margin-top: 0;">${bookingData.trip.title}</h2>
              <p><strong>Customer:</strong> ${bookingData.user.full_name}</p>
              <p><strong>Email:</strong> ${bookingData.user.email}</p>
              <p><strong>Phone:</strong> ${bookingData.user.phone}</p>
              <p><strong>Booking Reference:</strong> ${bookingData.booking_reference}</p>
              <p><strong>Amount:</strong> $${bookingData.total_amount}</p>
              <p><strong>Payment Method:</strong> ${bookingData.payment_method}</p>
              <p><strong>Special Requests:</strong> ${bookingData.special_requests || 'None'}</p>
            </div>
          </div>
        `,
      }),
    })

    // Send WhatsApp message (using WhatsApp Business API)
    const whatsappResponse = await fetch(`https://graph.facebook.com/v17.0/${Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')}/messages`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('WHATSAPP_ACCESS_TOKEN')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: bookingData.user.phone,
        type: 'template',
        template: {
          name: 'booking_confirmation',
          language: {
            code: 'en'
          },
          components: [
            {
              type: 'body',
              parameters: [
                {
                  type: 'text',
                  text: bookingData.user.full_name
                },
                {
                  type: 'text',
                  text: bookingData.trip.title
                },
                {
                  type: 'text',
                  text: bookingData.booking_reference
                }
              ]
            }
          ]
        }
      }),
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        userEmail: userEmailResponse.ok,
        adminEmail: adminEmailResponse.ok,
        whatsapp: whatsappResponse.ok
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error sending notifications:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})