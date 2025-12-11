import { loadStripe } from '@stripe/stripe-js';

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;

if (!stripePublishableKey) {
  console.warn('Stripe publishable key not found. Please add VITE_STRIPE_PUBLISHABLE_KEY to your environment variables.');
}

export const stripePromise = loadStripe(stripePublishableKey || '');

export const createPaymentIntent = async (amount: number, bookingId?: string, orderId?: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-stripe-payment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount,
        currency: 'usd',
        bookingId,
        orderId,
        metadata: {
          bookingId: bookingId || '',
          orderId: orderId || '',
        },
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating payment intent:', error);
    throw error;
  }
};

export const processMpesaPayment = async (phoneNumber: string, amount: number, bookingId?: string, orderId?: string) => {
  try {
    const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/process-mpesa-payment`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        phoneNumber,
        amount,
        bookingId,
        orderId,
        accountReference: bookingId || orderId,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to process M-Pesa payment');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error processing M-Pesa payment:', error);
    throw error;
  }
};