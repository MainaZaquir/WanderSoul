/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { X, CreditCard, Smartphone, CircleAlert as AlertCircle, CircleCheck as CheckCircle } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { supabase, Trip } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { StripePayment } from './StripePayment';
import { MpesaPayment } from './MpesaPayment';
// import { ImageUpload, ImagePreview } from './ImageUpload';
import toast from 'react-hot-toast';

interface BookingModalProps {
  trip: Trip;
  onClose: () => void;
  onSuccess: () => void;
}

const bookingSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  emergencyContact: yup.string().required('Emergency contact is required'),
  emergencyPhone: yup.string().required('Emergency phone is required'),
  specialRequests: yup.string(),
  paymentMethod: yup.string().oneOf(['mpesa', 'stripe']).required('Payment method is required'),
});

type BookingFormData = yup.InferType<typeof bookingSchema>;

export function BookingModal({ trip, onClose, onSuccess }: BookingModalProps) {
  const [step, setStep] = useState<'details' | 'payment' | 'confirmation'>('details');
  const [loading, setLoading] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const { user, profile } = useAuth();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<BookingFormData>({
    resolver: yupResolver(bookingSchema) as any,
    defaultValues: {
      fullName: profile?.full_name || '',
      email: profile?.email || '',
      phone: profile?.phone || '',
      emergencyContact: profile?.emergency_contact || '',
      emergencyPhone: profile?.emergency_phone || '',
    },
  });

  const paymentMethod = watch('paymentMethod');

  const generateBookingReference = () => {
    return `TM${Date.now().toString().slice(-8)}`;
  };

  const onSubmit = async (data: BookingFormData) => {
    if (!user) return;

    setLoading(true);
    try {
      const reference = generateBookingReference();
      
      // Create booking
      const { data: booking, error: bookingError } = await supabase
        .from('bookings')
        .insert([
          {
            trip_id: trip.id,
            user_id: user.id,
            booking_reference: reference,
            total_amount: trip.price,
            payment_method: data.paymentMethod,
            special_requests: data.specialRequests,
          },
        ])
        .select()
        .single();

      if (bookingError) throw bookingError;

      // Update user profile with emergency contact info
      await supabase
        .from('users')
        .update({
          full_name: data.fullName,
          phone: data.phone,
          emergency_contact: data.emergencyContact,
          emergency_phone: data.emergencyPhone,
        })
        .eq('id', user.id);

      // Update trip booking count
      await supabase
        .from('trips')
        .update({
          current_bookings: trip.current_bookings + 1,
        })
        .eq('id', trip.id);

      setBookingReference(reference);
      setStep('confirmation');
      
      toast.success('Booking created successfully!');
      console.log('Booking created:', booking);
      
    } catch (error) {
      console.error('Error creating booking:', error);
      toast.error('Failed to create booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStripeSuccess = async () => {
    setLoading(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update booking payment status
      await supabase
        .from('bookings')
        .update({
          payment_status: 'completed',
          status: 'confirmed',
        })
        .eq('booking_reference', bookingReference);

      toast.success('Payment successful! Booking confirmed.');
      onSuccess();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content max-w-3xl">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
            {step === 'details' && 'Book Your Adventure'}
            {step === 'payment' && 'Payment Details'}
            {step === 'confirmation' && 'Booking Confirmed'}
          </h2>
            <p className="text-gray-600 mt-1">
              {step === 'details' && 'Fill in your details to secure your spot'}
              {step === 'payment' && 'Complete your payment to confirm booking'}
              {step === 'confirmation' && 'Your adventure awaits!'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Trip Summary */}
        <div className="p-8 bg-gradient-to-r from-orange-50 to-teal-50 border-b border-gray-100">
          <div className="flex items-center space-x-6">
            <img
              src={trip.images[0] || 'https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg'}
              alt={trip.title}
              className="w-20 h-20 rounded-2xl object-cover shadow-lg"
            />
            <div className="flex-1">
              <h3 className="text-xl font-bold text-gray-900 mb-2">{trip.title}</h3>
              <p className="text-gray-600 mb-1">{trip.destination}</p>
              <p className="text-sm text-gray-500">
                {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
              </p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-3xl font-bold text-teal-600">${trip.price.toLocaleString()}</p>
              <p className="text-sm text-gray-500">per person</p>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="p-8">
          {step === 'details' && (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="form-group">
                  <label className="form-label">
                    Full Name *
                  </label>
                  <input
                    {...register('fullName')}
                    className="input-base"
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && (
                    <p className="form-error">{errors.fullName.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Email Address *
                  </label>
                  <input
                    {...register('email')}
                    type="email"
                    className="input-base"
                    placeholder="Enter your email"
                  />
                  {errors.email && (
                    <p className="form-error">{errors.email.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Phone Number *
                  </label>
                  <input
                    {...register('phone')}
                    className="input-base"
                    placeholder="Enter your phone number"
                  />
                  {errors.phone && (
                    <p className="form-error">{errors.phone.message}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="form-label">
                    Emergency Contact *
                  </label>
                  <input
                    {...register('emergencyContact')}
                    className="input-base"
                    placeholder="Emergency contact name"
                  />
                  {errors.emergencyContact && (
                    <p className="form-error">{errors.emergencyContact.message}</p>
                  )}
                </div>

                <div className="md:col-span-2 form-group">
                  <label className="form-label">
                    Emergency Phone *
                  </label>
                  <input
                    {...register('emergencyPhone')}
                    className="input-base"
                    placeholder="Emergency contact phone"
                  />
                  {errors.emergencyPhone && (
                    <p className="form-error">{errors.emergencyPhone.message}</p>
                  )}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">
                  Special Requests
                </label>
                <textarea
                  {...register('specialRequests')}
                  rows={3}
                  className="input-base resize-none"
                  placeholder="Any dietary requirements, accessibility needs, or special requests..."
                />
              </div>

              <div className="form-group">
                <label className="form-label mb-4">
                  Payment Method *
                </label>
                <div className="grid md:grid-cols-2 gap-6">
                  <label className="flex items-center p-6 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-green-300 hover:bg-green-50 transition-all duration-300 group">
                    <input
                      {...register('paymentMethod')}
                      type="radio"
                      value="mpesa"
                      className="mr-4 w-5 h-5 text-green-600"
                    />
                    <Smartphone className="mr-4 text-green-600 group-hover:scale-110 transition-transform duration-300" size={28} />
                    <div>
                      <p className="font-semibold text-lg">M-Pesa</p>
                      <p className="text-sm text-gray-600">Pay with M-Pesa mobile money</p>
                    </div>
                  </label>

                  <label className="flex items-center p-6 border-2 border-gray-200 rounded-2xl cursor-pointer hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 group">
                    <input
                      {...register('paymentMethod')}
                      type="radio"
                      value="stripe"
                      className="mr-4 w-5 h-5 text-blue-600"
                    />
                    <CreditCard className="mr-4 text-blue-600 group-hover:scale-110 transition-transform duration-300" size={28} />
                    <div>
                      <p className="font-semibold text-lg">Credit/Debit Card</p>
                      <p className="text-sm text-gray-600">Pay with Visa, Mastercard, etc.</p>
                    </div>
                  </label>
                </div>
                {errors.paymentMethod && (
                  <p className="form-error">{errors.paymentMethod.message}</p>
                )}
              </div>

              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100">
                <div className="flex items-start">
                  <AlertCircle className="text-blue-600 mr-4 mt-1 flex-shrink-0" size={24} />
                  <div className="text-blue-800">
                    <p className="font-semibold mb-3 text-lg">Important Information:</p>
                    <ul className="space-y-2 text-sm">
                      <li>• Full payment is required to secure your booking</li>
                      <li>• Cancellation policy applies (see terms & conditions)</li>
                      <li>• You will receive booking confirmation via email and WhatsApp</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-6 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="btn-outline"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="btn-secondary disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Continue to Payment'}
                </button>
              </div>
            </form>
          )}

          {step === 'payment' && (
            <div className="space-y-8">
              <div className="text-center">
                <h3 className="text-2xl font-bold mb-3">Complete Your Payment</h3>
                <p className="text-gray-600">Booking Reference: <span className="font-mono font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">{bookingReference}</span></p>
              </div>

              {paymentMethod === 'mpesa' && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-200">
                  <MpesaPayment
                    amount={trip.price}
                    bookingId={bookingReference}
                    onSuccess={handleStripeSuccess}
                    onError={(error) => toast.error(error)}
                  />
                </div>
              )}

              {paymentMethod === 'stripe' && (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-200">
                  <StripePayment
                    amount={trip.price}
                    bookingId={bookingReference}
                    onSuccess={handleStripeSuccess}
                    onError={(error) => toast.error(error)}
                  />
                </div>
              )}

              <div className="flex justify-end space-x-6 pt-4">
                <button
                  onClick={() => setStep('details')}
                  className="btn-outline"
                >
                  Back
                </button>
              </div>
            </div>
          )}

          {step === 'confirmation' && (
            <div className="text-center space-y-8">
              <div className="flex justify-center">
                <div className="bg-gradient-to-r from-green-100 to-emerald-100 p-8 rounded-full shadow-lg animate-scale-in">
                  <CheckCircle className="text-green-600" size={64} />
                </div>
              </div>
              
              <div>
                <h3 className="text-3xl font-bold text-gray-900 mb-4">Booking Confirmed!</h3>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Your adventure is booked and confirmed. You'll receive detailed information via email and WhatsApp.
                </p>
              </div>

              <div className="bg-gradient-to-r from-gray-50 to-blue-50 p-8 rounded-2xl border border-gray-200">
                <h4 className="font-bold text-xl mb-6">Booking Details</h4>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Booking Reference:</span>
                    <span className="font-mono font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">{bookingReference}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trip:</span>
                    <span className="font-semibold">{trip.title}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount Paid:</span>
                    <span className="font-bold text-green-600">${trip.price.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={onSuccess}
                className="btn-secondary w-full text-lg py-4"
              >
                Close
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}