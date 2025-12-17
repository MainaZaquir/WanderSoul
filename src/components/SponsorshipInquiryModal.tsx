import{ useState } from 'react';
import { X, Building, Mail, Phone, Globe, DollarSign } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import toast from 'react-hot-toast';

interface SponsorshipInquiryModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const inquirySchema = yup.object({
  companyName: yup.string().required('Company name is required'),
  contactName: yup.string().required('Contact name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string().required('Phone number is required'),
  website: yup.string().url('Invalid website URL'),
  partnershipType: yup.string().required('Partnership type is required'),
  budget: yup.string().required('Budget range is required'),
  message: yup.string().required('Message is required').max(1000, 'Message must be less than 1000 characters'),
});

type InquiryFormData = yup.InferType<typeof inquirySchema>;

export function SponsorshipInquiryModal({ onClose, onSuccess }: SponsorshipInquiryModalProps) {
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<InquiryFormData>({
    resolver: yupResolver(inquirySchema),
  });

  const message = watch('message', '');

  const onSubmit = async (data: InquiryFormData) => {
    setLoading(true);
    try {
      console.log('Partnership inquiry:', data);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Partnership inquiry sent successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error sending inquiry:', error);
      toast.error('Failed to send inquiry. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Partnership Inquiry</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Building className="inline mr-2" size={16} />
                Company Name *
              </label>
              <input
                {...register('companyName')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your company name"
              />
              {errors.companyName && (
                <p className="text-red-500 text-sm mt-1">{errors.companyName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name *
              </label>
              <input
                {...register('contactName')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Your full name"
              />
              {errors.contactName && (
                <p className="text-red-500 text-sm mt-1">{errors.contactName.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Mail className="inline mr-2" size={16} />
                Email Address *
              </label>
              <input
                {...register('email')}
                type="email"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="your@company.com"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Phone className="inline mr-2" size={16} />
                Phone Number *
              </label>
              <input
                {...register('phone')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="+254 xxx xxx xxx"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Globe className="inline mr-2" size={16} />
                Company Website
              </label>
              <input
                {...register('website')}
                type="url"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="https://www.yourcompany.com"
              />
              {errors.website && (
                <p className="text-red-500 text-sm mt-1">{errors.website.message}</p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Partnership Type *
              </label>
              <select
                {...register('partnershipType')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select partnership type</option>
                <option value="sponsored-content">Sponsored Content</option>
                <option value="brand-ambassador">Brand Ambassador</option>
                <option value="event-partnership">Event Partnership</option>
                <option value="product-collaboration">Product Collaboration</option>
                <option value="long-term-partnership">Long-term Partnership</option>
                <option value="other">Other</option>
              </select>
              {errors.partnershipType && (
                <p className="text-red-500 text-sm mt-1">{errors.partnershipType.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <DollarSign className="inline mr-2" size={16} />
                Budget Range *
              </label>
              <select
                {...register('budget')}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="">Select budget range</option>
                <option value="under-1000">Under $1,000</option>
                <option value="1000-5000">$1,000 - $5,000</option>
                <option value="5000-10000">$5,000 - $10,000</option>
                <option value="10000-25000">$10,000 - $25,000</option>
                <option value="25000-50000">$25,000 - $50,000</option>
                <option value="over-50000">Over $50,000</option>
                <option value="discuss">Prefer to discuss</option>
              </select>
              {errors.budget && (
                <p className="text-red-500 text-sm mt-1">{errors.budget.message}</p>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Partnership Details * ({message.length}/1000)
            </label>
            <textarea
              {...register('message')}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Tell us about your brand, partnership goals, target audience, timeline, and any specific requirements or ideas you have in mind..."
            />
            {errors.message && (
              <p className="text-red-500 text-sm mt-1">{errors.message.message}</p>
            )}
          </div>

          <div className="bg-indigo-50 p-4 rounded-lg">
            <h4 className="font-medium text-indigo-900 mb-2">What happens next?</h4>
            <ul className="text-sm text-indigo-800 space-y-1">
              <li>• We'll review your inquiry within 24-48 hours</li>
              <li>• Our team will reach out to discuss your partnership goals</li>
              <li>• We'll create a customized proposal tailored to your needs</li>
              <li>• Together, we'll plan an authentic campaign that resonates</li>
            </ul>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg hover:from-indigo-600 hover:to-purple-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Inquiry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}