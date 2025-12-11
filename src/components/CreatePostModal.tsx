import React, { useState } from 'react';
import { X, Camera, Upload } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { ImageUpload, ImagePreview } from './ImageUpload';
import toast from 'react-hot-toast';

interface CreatePostModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const postSchema = yup.object({
  title: yup.string().required('Title is required').max(100, 'Title must be less than 100 characters'),
  content: yup.string().required('Content is required').max(1000, 'Content must be less than 1000 characters'),
});

type PostFormData = yup.InferType<typeof postSchema>;

export function CreatePostModal({ onClose, onSuccess }: CreatePostModalProps) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const { user } = useAuth();

  const { register, handleSubmit, formState: { errors }, watch } = useForm<PostFormData>({
    resolver: yupResolver(postSchema),
  });

  const content = watch('content', '');

  const handleImageUpload = (urls: string[]) => {
    setImages(prev => [...prev, ...urls].slice(0, 6));
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit = async (data: PostFormData) => {
    if (!user) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('community_posts')
        .insert([
          {
            user_id: user.id,
            title: data.title,
            content: data.content,
            images: images,
          },
        ]);

      if (error) throw error;

      toast.success('Post created successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Share Your Travel Story</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Title *
            </label>
            <input
              {...register('title')}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Give your story a catchy title..."
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Story * ({content.length}/1000)
            </label>
            <textarea
              {...register('content')}
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Share your adventure, tips, experiences, or anything travel-related..."
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">{errors.content.message}</p>
            )}
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photos (Optional)
            </label>
            <ImageUpload
              bucket="COMMUNITY_POSTS"
              path="posts"
              multiple
              maxFiles={6}
              onUpload={handleImageUpload}
            />

            <ImagePreview
              images={images}
              onRemove={removeImage}
              className="mt-4"
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Community Guidelines</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Share authentic travel experiences and tips</li>
              <li>• Be respectful and supportive of fellow travelers</li>
              <li>• No spam, promotional content, or inappropriate material</li>
              <li>• Use your own photos and give credit where due</li>
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
              className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-colors disabled:opacity-50"
            >
              {loading ? 'Sharing...' : 'Share Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}