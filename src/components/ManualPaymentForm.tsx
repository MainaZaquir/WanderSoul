import { useState } from 'react';
import { Smartphone, Info, CheckCircle2 } from 'lucide-react';
import { formatPrice } from '../lib/currency';

interface ManualPaymentFormProps {
  amount: number;
  description: string;
  tillNumber: string;
  initialName?: string;
  initialEmail?: string;
  initialPhone?: string;
  onSubmit: (details: {
    fullName: string;
    email: string;
    phone: string;
    mpesaCode: string;
  }) => Promise<void> | void;
  submitting?: boolean;
}

export function ManualPaymentForm({
  amount,
  description,
  tillNumber,
  initialName = '',
  initialEmail = '',
  initialPhone = '',
  onSubmit,
  submitting = false,
}: ManualPaymentFormProps) {
  const [fullName, setFullName] = useState(initialName);
  const [email, setEmail] = useState(initialEmail);
  const [phone, setPhone] = useState(initialPhone);
  const [mpesaCode, setMpesaCode] = useState('');
  const [step, setStep] = useState<'instructions' | 'confirm' | 'success'>('instructions');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !phone || !mpesaCode) {
      return;
    }

    await onSubmit({ fullName, email, phone, mpesaCode });
    setStep('success');
  };

  if (step === 'success') {
    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="bg-green-100 p-4 rounded-full">
            <CheckCircle2 className="text-green-600" size={40} />
          </div>
          <h3 className="text-2xl font-bold text-green-800">Order Received</h3>
          <p className="text-green-700">
            We’ve received your details and are confirming your payment.
            Your itinerary will be sent shortly via WhatsApp and email.
          </p>
        </div>
      </div>
    );
  }

  if (step === 'instructions') {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
          <div className="flex items-start space-x-4">
            <div className="bg-green-100 p-3 rounded-xl">
              <Smartphone className="text-green-700" size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-bold text-green-900">Pay via MPesa</h3>
              <p className="text-green-800 text-sm">
                Use the Till number below to complete your payment.
                After payment, click <span className="font-semibold">“I’ve Paid”</span> to confirm your order.
              </p>
              <div className="bg-white border border-green-200 rounded-xl p-4 inline-flex flex-col items-start">
                <span className="text-xs font-semibold uppercase tracking-wide text-green-700">Till Number</span>
                <span className="mt-1 text-2xl font-extrabold tracking-wider text-green-900">{tillNumber}</span>
              </div>
              <p className="text-xs text-green-700 mt-2">
                Amount: <span className="font-semibold">{formatPrice(amount)}</span>
              </p>
              <p className="text-xs text-green-700">
                Reference: <span className="font-mono font-semibold">{description}</span>
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setStep('confirm')}
          className="btn-primary w-full text-lg py-3"
        >
          I’ve Paid
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center">
        <h3 className="text-2xl font-bold text-gray-900">Confirm Your Payment</h3>
        <p className="text-gray-700 text-sm">
          Please enter your details below so we can confirm your payment and send your itinerary via WhatsApp and email.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="input-base"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-base"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="input-base"
              placeholder="0712 345 678"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              M-Pesa Transaction Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={mpesaCode}
              onChange={(e) => setMpesaCode(e.target.value.toUpperCase())}
              className="input-base font-mono"
              placeholder="e.g. QJT5K2ABCD"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              You can find the transaction code in your MPesa confirmation message.
            </p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-100 rounded-2xl p-4 flex items-start space-x-3 text-sm text-blue-800">
          <Info className="mt-0.5" size={18} />
          <p>
            After submitting this form, your order will be marked as <span className="font-semibold">“Pending
            Manual Confirmation”</span>. We’ll review the payment and then send you your booking or product access.
          </p>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className={`btn-primary w-full text-lg py-3 ${submitting ? 'btn-loading' : ''}`}
        >
          {submitting ? 'Submitting...' : 'Submit Payment Details'}
        </button>
      </form>
    </div>
  );
}


