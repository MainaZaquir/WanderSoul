/*
  # Send Order Confirmation Email and WhatsApp (optional)

  1. Email Notifications
    - Send order confirmation to user
    - Send order notification to admin
    - Include order details and payment information

  2. WhatsApp Integration (optional)
    - Send WhatsApp message to user with order details

  Expected payload:
  {
    order: {
      id: string;
      order_reference: string;
      total_amount: number;
      payment_status: string;
      payment_reference?: string;
      created_at: string;
    };
    user: {
      full_name?: string;
      email: string;
      phone?: string;
    };
    shipping_address?: {
      full_name?: string;
      email?: string;
      phone?: string;
      manual_payment?: boolean;
    };
    adminEmail: string;
  }
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
    const { order, user, shipping_address, adminEmail } = await req.json()

    const customerName = shipping_address?.full_name || user.full_name || 'there'
    const customerEmail = shipping_address?.email || user.email
    const customerPhone = shipping_address?.phone || user.phone

    // Send email to user
    const userEmailResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Travel With Muchina <orders@travelwithmuchina.com>',
        to: [customerEmail],
        subject: `Order Received - ${order.order_reference}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #f97316;">Order Received ✅</h1>
            <p>Hi ${customerName},</p>
            <p>We’ve received your order and are confirming your payment. Your itinerary or product details will be sent shortly via WhatsApp and email.</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h2 style="color: #1f2937; margin-top: 0;">Order Details</h2>
              <p><strong>Order Reference:</strong> ${order.order_reference}</p>
              <p><strong>Amount:</strong> KES ${Number(order.total_amount).toFixed(2)}</p>
              <p><strong>Payment Status:</strong> ${order.payment_status}</p>
              ${order.payment_reference ? `<p><strong>M-Pesa Code:</strong> ${order.payment_reference}</p>` : ''}
            </div>
            
            <p>If you have any questions, just reply to this email.</p>
            <p>With gratitude,<br/>Travel With Muchina Team</p>
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
        from: 'Travel With Muchina <orders@travelwithmuchina.com>',
        to: [adminEmail],
        subject: `New Order - ${order.order_reference}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #f97316;">New Order Received</h1>
            <p>A new order has been placed:</p>
            
            <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p><strong>Customer:</strong> ${customerName}</p>
              <p><strong>Email:</strong> ${customerEmail}</p>
              ${customerPhone ? `<p><strong>Phone:</strong> ${customerPhone}</p>` : ''}
              <p><strong>Order Reference:</strong> ${order.order_reference}</p>
              <p><strong>Amount:</strong> KES ${Number(order.total_amount).toFixed(2)}</p>
              <p><strong>Payment Status:</strong> ${order.payment_status}</p>
              ${order.payment_reference ? `<p><strong>M-Pesa Code:</strong> ${order.payment_reference}</p>` : ''}
            </div>
          </div>
        `,
      }),
    })

    // Optional WhatsApp notification
    let whatsappOk = false
    if (customerPhone && Deno.env.get('WHATSAPP_ACCESS_TOKEN') && Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')) {
      const whatsappResponse = await fetch(`https://graph.facebook.com/v17.0/${Deno.env.get('WHATSAPP_PHONE_NUMBER_ID')}/messages`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${Deno.env.get('WHATSAPP_ACCESS_TOKEN')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messaging_product: 'whatsapp',
          to: customerPhone,
          type: 'template',
          template: {
            name: 'order_confirmation',
            language: {
              code: 'en'
            },
            components: [
              {
                type: 'body',
                parameters: [
                  { type: 'text', text: customerName },
                  { type: 'text', text: order.order_reference },
                  { type: 'text', text: `KES ${Number(order.total_amount).toFixed(2)}` },
                ]
              }
            ]
          }
        }),
      })

      whatsappOk = whatsappResponse.ok
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        userEmail: userEmailResponse.ok,
        adminEmail: adminEmailResponse.ok,
        whatsapp: whatsappOk
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    console.error('Error sending order notifications:', error)
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})


