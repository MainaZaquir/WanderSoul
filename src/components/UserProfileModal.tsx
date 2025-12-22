import React, { useState } from 'react';
import { X, User, Mail, Phone, Shield, Camera, Save } from 'lucide-react';
import { useForm } from 'react-hook-form';
import type { SubmitHandler, Resolver } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';

interface UserProfileModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const profileSchema = yup.object({
  fullName: yup.string().required('Full name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
  phone: yup.string(),
  emergencyContact: yup.string(),
  emergencyPhone: yup.string(),
});

type ProfileFormData = yup.InferType<typeof profileSchema>;

export function UserProfileModal({ onClose, onSuccess }: UserProfileModalProps) {
  const [loading, setLoading] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const { user, profile, updateProfile } = useAuth();

  const { register, handleSubmit, formState: { errors } } = useForm<ProfileFormData>({
    resolver: (yupResolver(profileSchema) as unknown) as Resolver<ProfileFormData>,
    defaultValues: {
      fullName: profile?.full_name || '',
      email: profile?.email || user?.email || '',
      phone: profile?.phone || '',
      emergencyContact: profile?.emergency_contact || '',
      emergencyPhone: profile?.emergency_phone || '',
    },
  });

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const avatarUrl = `https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop`;
    setAvatarUrl(avatarUrl);
    toast.success('Avatar updated!');
  };

  const onSubmit: SubmitHandler<ProfileFormData> = async (data) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await updateProfile({
        full_name: data.fullName,
        phone: data.phone,
        emergency_contact: data.emergencyContact,
        emergency_phone: data.emergencyPhone,
      });

      if (error) throw error;

      toast.success('Profile updated successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="modal-backdrop">
      <div className="modal-content max-w-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">My Profile</h2>
            <p className="text-gray-600 mt-1">Manage your account information and preferences</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            {/* Avatar Section */}
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-pink-500 rounded-full flex items-center justify-center overflow-hidden">
                  {avatarUrl ? (
                    <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-white text-2xl font-bold">
                      {profile?.full_name?.charAt(0) || user.email?.charAt(0) || 'U'}
                    </span>
                  )}
                </div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleAvatarUpload}
                  className="hidden"
                  id="avatar-upload"
                />
                <label
                  htmlFor="avatar-upload"
                  className="absolute -bottom-2 -right-2 bg-white border-2 border-gray-200 rounded-full p-2 cursor-pointer hover:bg-gray-50 transition-colors duration-300 shadow-lg"
                >
                  <Camera size={16} className="text-gray-600" />
                </label>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {profile?.full_name || 'Travel Enthusiast'}
                </h3>
                <p className="text-gray-600">{user.email}</p>
                {profile?.is_admin && (
                  <div className="flex items-center space-x-2 mt-2">
                    <Shield size={16} className="text-orange-500" />
                    <span className="text-sm font-medium text-orange-600">Administrator</span>
                  </div>
                )}
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="form-group">
                <label className="form-label">
                  <User className="inline mr-2" size={16} />
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
                  <Mail className="inline mr-2" size={16} />
                  Email Address *
                </label>
                <input
                  {...register('email')}
                  type="email"
                  className="input-base bg-gray-50"
                  disabled
                />
                <p className="text-sm text-gray-500 mt-1">
                  Email cannot be changed. Contact support if needed.
                </p>
              </div>

              <div className="form-group">
                <label className="form-label">
                  <Phone className="inline mr-2" size={16} />
                  Phone Number
                </label>
                <input
                  {...register('phone')}
                  className="input-base"
                  placeholder="+254 xxx xxx xxx"
                />
              </div>

              <div className="form-group">
                <label className="form-label">
                  Emergency Contact Name
                </label>
                <input
                  {...register('emergencyContact')}
                  className="input-base"
                  placeholder="Emergency contact name"
                />
              </div>

              <div className="md:col-span-2 form-group">
                <label className="form-label">
                  Emergency Contact Phone
                </label>
                <input
                  {...register('emergencyPhone')}
                  className="input-base"
                  placeholder="Emergency contact phone number"
                />
              </div>
            </div>

            {/* Travel Preferences */}
            <div className="bg-gradient-to-r from-orange-50 to-teal-50 p-6 rounded-2xl border border-orange-200">
              <h4 className="font-bold text-lg text-gray-900 mb-4">Travel Preferences</h4>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Preferred Trip Type
                  </label>
                  <select className="input-base">
                    <option>Adventure & Safari</option>
                    <option>Beach & Coastal</option>
                    <option>Mountain & Hiking</option>
                    <option>Cultural Experiences</option>
                    <option>All Types</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Budget Range
                  </label>
                  <select className="input-base">
                    <option>Under $500</option>
                    <option>$500 - $1,000</option>
                    <option>$1,000 - $2,000</option>
                    <option>$2,000+</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Group Size Preference
                  </label>
                  <select className="input-base">
                    <option>Small (2-6 people)</option>
                    <option>Medium (7-12 people)</option>
                    <option>Large (13+ people)</option>
                    <option>No preference</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Notification Preferences */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200">
              <h4 className="font-bold text-lg text-gray-900 mb-4">Notification Preferences</h4>
              <div className="space-y-3">
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-gray-700">Email notifications for new trips</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-gray-700">WhatsApp updates for booked trips</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-gray-700">SMS reminders for upcoming trips</span>
                </label>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                  <span className="text-gray-700">Community updates and featured posts</span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-6 pt-8 border-t border-gray-100">
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
                <Save className="mr-2" size={16} />
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}