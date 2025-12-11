import React, { useState } from 'react';
import { X, Users, Mail, MessageCircle, Copy, Check } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Trip } from '../lib/supabase';
import toast from 'react-hot-toast';

interface InvitationModalProps {
  trip: Trip;
  onClose: () => void;
  onSuccess: () => void;
}

const invitationSchema = yup.object({
  emails: yup.string().required('Email addresses are required'),
  message: yup.string().required('Personal message is required'),
});

type InvitationFormData = yup.InferType<typeof invitationSchema>;

export function InvitationModal({ trip, onClose, onSuccess }: InvitationModalProps) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<InvitationFormData>({
    resolver: yupResolver(invitationSchema),
    defaultValues: {
      message: `Hey cousin! 🌍 I found this amazing trip that I think you'd love. Join me on "${trip.title}" - it's going to be an incredible adventure! Let me know if you're interested. Can't wait to explore together! ✈️`,
    },
  });

  const message = watch('message', '');
  const shareUrl = `${window.location.origin}/trips/${trip.id}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Failed to copy link');
    }
  };

  const onSubmit = async (data: InvitationFormData) => {
    setLoading(true);
    try {
      // Parse email addresses
      const emailList = data.emails
        .split(/[,;\n]/)
        .map(email => email.trim())
        .filter(email => email.length > 0);

      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const invalidEmails = emailList.filter(email => !emailRegex.test(email));
      
      if (invalidEmails.length > 0) {
        toast.error(`Invalid email addresses: ${invalidEmails.join(', ')}`);
        return;
      }

      // In production, this would send actual emails
      console.log('Sending invitations to:', emailList);
      console.log('Message:', data.message);
      console.log('Trip:', trip);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      toast.success(`Invitations sent to ${emailList.length} cousin${emailList.length > 1 ? 's' : ''}!`);
      onSuccess();
    } catch (error) {
      console.error('Error sending invitations:', error);
      toast.error('Failed to send invitations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppShare = () => {
    const whatsappMessage = encodeURIComponent(
      `${message}\n\nTrip Details:\n📍 ${trip.destination}\n📅 ${new Date(trip.start_date).toLocaleDateString()} - ${new Date(trip.end_date).toLocaleDateString()}\n💰 $${trip.price}\n\nBook here: ${shareUrl}`
    );
    window.open(`https://wa.me/?text=${whatsappMessage}`, '_blank');
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Invite Your Cousins</h2>
            <p className="text-gray-600 mt-1">Share this amazing adventure with friends and family</p>
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
            <div className="text-right">
              <p className="text-2xl font-bold text-teal-600">${trip.price.toLocaleString()}</p>
              <p className="text-sm text-gray-500">per person</p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* Quick Share Options */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl border border-green-200">
              <h4 className="font-bold text-lg text-green-800 mb-4 flex items-center">
                <MessageCircle className="mr-2" size={20} />
                Share via WhatsApp
              </h4>
              <p className="text-green-700 mb-4 text-sm">
                Instantly share with your WhatsApp contacts
              </p>
              <button
                onClick={handleWhatsAppShare}
                className="btn-secondary w-full"
              >
                Share on WhatsApp
              </button>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
              <h4 className="font-bold text-lg text-blue-800 mb-4 flex items-center">
                <Copy className="mr-2" size={20} />
                Copy Trip Link
              </h4>
              <p className="text-blue-700 mb-4 text-sm">
                Share the direct link to this trip
              </p>
              <button
                onClick={handleCopyLink}
                className={`btn-primary w-full ${copied ? 'bg-green-500 hover:bg-green-600' : ''}`}
              >
                {copied ? (
                  <>
                    <Check className="mr-2" size={16} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2" size={16} />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Email Invitations */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="form-group">
              <label className="form-label">
                <Mail className="inline mr-2" size={16} />
                Email Addresses
              </label>
              <textarea
                {...register('emails')}
                rows={3}
                className="input-base resize-none"
                placeholder="Enter email addresses separated by commas or new lines&#10;example@email.com, cousin@email.com&#10;friend@email.com"
              />
              {errors.emails && (
                <p className="form-error">{errors.emails.message}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">
                Separate multiple email addresses with commas or new lines
              </p>
            </div>

            <div className="form-group">
              <label className="form-label">
                Personal Message ({message.length}/500)
              </label>
              <textarea
                {...register('message')}
                rows={4}
                maxLength={500}
                className="input-base resize-none"
                placeholder="Add a personal message to your invitation..."
              />
              {errors.message && (
                <p className="form-error">{errors.message.message}</p>
              )}
            </div>

            <div className="bg-gradient-to-r from-orange-50 to-pink-50 p-6 rounded-2xl border border-orange-200">
              <h4 className="font-semibold text-orange-800 mb-3">Preview Message:</h4>
              <div className="bg-white p-4 rounded-xl border border-orange-200">
                <p className="text-gray-700 whitespace-pre-wrap">{message}</p>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    <strong>Trip:</strong> {trip.title}<br />
                    <strong>Destination:</strong> {trip.destination}<br />
                    <strong>Dates:</strong> {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}<br />
                    <strong>Price:</strong> ${trip.price}<br />
                    <strong>Book:</strong> <span className="text-blue-600">{shareUrl}</span>
                  </p>
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
                className={`btn-primary ${loading ? 'btn-loading' : ''}`}
              >
                <Users className="mr-2" size={16} />
                {loading ? 'Sending Invitations...' : 'Send Invitations'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}