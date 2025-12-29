import React, { useState } from 'react';
import { Smartphone, CircleAlert as AlertCircle } from 'lucide-react';
import { processMpesaPayment } from '../lib/stripe';
import { formatPrice } from '../lib/currency';
import toast from 'react-hot-toast';

interface MpesaPaymentProps {
  amount: number;
  bookingId?: string;
  orderId?: string;
  onSuccess: (receiptNumber: string) => void;
  onError: (error: string) => void;
}

export function MpesaPayment({ amount, bookingId, orderId, onSuccess, onError }: MpesaPaymentProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'input' | 'processing' | 'instructions'>('input');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!phoneNumber) {
      toast.error('Please enter your phone number');
      return;
    }

    // Validate phone number format
    const phoneRegex = /^254[0-9]{9}$/;
    const cleanPhone = phoneNumber.replace(/\D/g, '');
    const formattedPhone = cleanPhone.startsWith('0') ? `254${cleanPhone.slice(1)}` : cleanPhone;
    
    if (!phoneRegex.test(formattedPhone)) {
      toast.error('Please enter a valid Kenyan phone number (e.g., 0712345678)');
      return;
    }

    setLoading(true);
    setStep('processing');

    try {
      const response = await processMpesaPayment(formattedPhone, amount, bookingId, orderId);
      
      if (response.success) {
        setStep('instructions');
        toast.success('Payment request sent to your phone!');
        
        setTimeout(() => {
          onSuccess('MOCK_RECEIPT_123');
        }, 10000);
      } else {
        throw new Error('Failed to initiate M-Pesa payment');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'M-Pesa payment failed';
      onError(errorMessage);
      toast.error(errorMessage);
      setStep('input');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'instructions') {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200">
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <Smartphone className="text-green-600" size={32} />
            </div>
          </div>
          
          <h3 className="text-2xl font-bold text-green-800 mb-4">Check Your Phone</h3>
          <p className="text-green-700 mb-6">
            We've sent a payment request to <strong>{phoneNumber}</strong>. 
            Please check your phone and enter your M-Pesa PIN to complete the payment.
          </p>
          
          <div className="bg-white p-6 rounded-xl border border-green-200 mb-6">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <div className="animate-pulse w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-green-800 font-medium">Waiting for payment confirmation...</span>
            </div>
            <p className="text-sm text-green-600">
              This usually takes 1-2 minutes. Please don't close this window.
            </p>
          </div>
          
          <button
            onClick={() => setStep('input')}
            className="btn-outline text-green-700 border-green-300 hover:bg-green-50"
          >
            Try Different Number
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200">
      <div className="flex items-center mb-6">
        <Smartphone className="text-green-600 mr-4" size={32} />
        <h4 className="font-bold text-xl text-green-800">M-Pesa Payment</h4>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-green-800 mb-2">
            Phone Number
          </label>
          <input
            type="tel"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            placeholder="0712345678"
            className="w-full px-4 py-3 border border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            disabled={loading}
          />
          <p className="text-sm text-green-600 mt-2">
            Enter your Safaricom number to receive the payment prompt
          </p>
        </div>

        <div className="bg-white p-4 rounded-xl border border-green-200">
          <h5 className="font-semibold text-green-800 mb-3">Payment Steps:</h5>
          <div className="space-y-2 text-sm text-green-700">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</div>
              <span>Enter your phone number and click "Send Payment Request"</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</div>
              <span>Check your phone for the M-Pesa payment prompt</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-green-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</div>
              <span>Enter your M-Pesa PIN to complete the payment</span>
            </div>
          </div>
        </div>

        <div className="bg-green-100 p-4 rounded-xl">
          <div className="flex items-start space-x-3">
            <AlertCircle className="text-green-600 mt-0.5" size={20} />
            <div className="text-sm text-green-800">
              <p className="font-medium mb-1">Amount to Pay:</p>
              <p className="text-lg font-bold">{formatPrice(amount)}</p>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading || !phoneNumber}
          className={`btn-secondary w-full text-lg py-4 ${loading ? 'btn-loading' : ''}`}
        >
          {loading ? 'Sending Payment Request...' : 'Send Payment Request'}
        </button>
      </form>
    </div>
  );
}