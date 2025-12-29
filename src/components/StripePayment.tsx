import React, { useState } from 'react';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { stripePromise, createPaymentIntent } from '../lib/stripe';
import { CreditCard, Lock } from 'lucide-react';
import { formatPrice } from '../lib/currency';
import toast from 'react-hot-toast';

interface StripePaymentProps {
  amount: number;
  bookingId?: string;
  orderId?: string;
  onSuccess: (paymentIntentId: string) => void;
  onError: (error: string) => void;
}

const cardElementOptions = {
  style: {
    base: {
      fontSize: '16px',
      color: '#424770',
      '::placeholder': {
        color: '#aab7c4',
      },
      padding: '12px',
    },
    invalid: {
      color: '#9e2146',
    },
  },
};

function PaymentForm({ amount, bookingId, orderId, onSuccess, onError }: StripePaymentProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setLoading(true);

    try {
      // Create payment intent
      const { clientSecret } = await createPaymentIntent(amount, bookingId, orderId);

      // Get card element
      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        throw new Error('Card element not found');
      }

      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
        },
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent?.status === 'succeeded') {
        onSuccess(paymentIntent.id);
        toast.success('Payment successful!');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Payment failed';
      onError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
        <div className="flex items-center mb-4">
          <CreditCard className="text-blue-600 mr-3" size={24} />
          <h4 className="font-bold text-lg text-blue-800">Secure Card Payment</h4>
        </div>
        
        <div className="bg-white p-4 rounded-xl border border-blue-200">
          <CardElement options={cardElementOptions} />
        </div>
        
        <div className="flex items-center justify-between mt-4 text-sm text-blue-600">
          <div className="flex items-center space-x-2">
            <Lock size={16} />
            <span>256-bit SSL encryption</span>
          </div>
          <div className="flex items-center space-x-4">
            <span>Powered by Stripe</span>
          </div>
        </div>
      </div>

      <button
        type="submit"
        disabled={!stripe || loading}
        className={`btn-primary w-full text-lg py-4 ${loading ? 'btn-loading' : ''}`}
      >
        {loading ? 'Processing Payment...' : `Pay ${formatPrice(amount)}`}
      </button>
    </form>
  );
}

export function StripePayment(props: StripePaymentProps) {
  return (
    <Elements stripe={stripePromise}>
      <PaymentForm {...props} />
    </Elements>
  );
}