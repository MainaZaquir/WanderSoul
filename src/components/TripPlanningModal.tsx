import { useState } from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { X, MapPin, Calendar, Users, DollarSign, Plus, Trash2 } from 'lucide-react';
import { useForm, useFieldArray } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { supabase } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { ImageUpload, ImagePreview } from './ImageUpload';
import toast from 'react-hot-toast';

interface TripPlanningModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

const tripSchema = yup.object({
  title: yup.string().required('Trip title is required'),
  description: yup.string().required('Description is required'),
  destination: yup.string().required('Destination is required'),
  startDate: yup
    .date()
    .transform((value, originalValue) =>
      originalValue ? new Date(originalValue) : value
    )
    .required('Start date is required')
    .min(new Date(), 'Start date must be in the future'),
  endDate: yup
    .date()
    .transform((value, originalValue) =>
      originalValue ? new Date(originalValue) : value
    )
    .required('End date is required')
    .min(yup.ref('startDate'), 'End date must be after start date'),
  price: yup
    .number()
    .typeError('Price must be a number')
    .required('Price is required')
    .min(0, 'Price must be positive'),
  maxCapacity: yup
    .number()
    .typeError('Max capacity must be a number')
    .required('Max capacity is required')
    .min(1, 'Must allow at least 1 person'),
  difficultyLevel: yup
    .string()
    .oneOf(['easy', 'moderate', 'challenging'])
    .required('Difficulty level is required'),
  highlights: yup
    .array()
    .of(yup.string().trim().required('Highlight cannot be empty'))
    .min(1, 'At least one highlight is required'),
  includes: yup
    .array()
    .of(yup.string().trim())
    .optional(),
  excludes: yup
    .array()
    .of(yup.string().trim())
    .optional(),
});


export type TripFormData = yup.InferType<typeof tripSchema>;

export function TripPlanningModal({ onClose, onSuccess }: TripPlanningModalProps) {
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const { user, profile } = useAuth();

  const { register, handleSubmit, control, formState: { errors } } = useForm<TripFormData>({
    resolver: yupResolver(tripSchema),
    defaultValues: {
      highlights: [''],
      includes: [''],
      excludes: [''],
    },
  });

  const { fields: highlightFields, append: appendHighlight, remove: removeHighlight } = useFieldArray<TripFormData, 'highlights'>({
    control,
    name: 'highlights',
  });

  const { fields: includeFields, append: appendInclude, remove: removeInclude } = useFieldArray<TripFormData, 'includes'>({
    control,
    name: 'includes',
  });

  const { fields: excludeFields, append: appendExclude, remove: removeExclude } = useFieldArray<TripFormData, 'excludes'>({
    control,
    name: 'excludes',
  });

  const handleImageUpload = (urls: string[]) => {
    setImages(prev => [...prev, ...urls].slice(0, 6));
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const onSubmit: SubmitHandler<TripFormData> = async (data) => {
    if (!user || !profile?.is_admin) {
      toast.error('Only admins can create trips');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase
        .from('trips')
        .insert([
          {
            title: data.title,
            description: data.description,
            destination: data.destination,
            start_date: data.startDate.toISOString().split('T')[0],
            end_date: data.endDate.toISOString().split('T')[0],
            price: data.price,
            max_capacity: data.maxCapacity,
            difficulty_level: data.difficultyLevel,
            highlights: (data.highlights ?? []).filter((h): h is string => typeof h === 'string' && h.trim().length > 0),
            includes: (data.includes ?? []).filter((i): i is string => typeof i === 'string' && i.trim().length > 0),
            excludes: (data.excludes ?? []).filter((e): e is string => typeof e === 'string' && e.trim().length > 0),
            images: images,
            is_active: true,
          },
        ]);

      if (error) throw error;

      toast.success('Trip created successfully!');
      onSuccess();
    } catch (error) {
      console.error('Error creating trip:', error);
      toast.error('Failed to create trip. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!profile?.is_admin) {
    return (
      <div className="modal-backdrop">
        <div className="modal-content max-w-md">
          <div className="p-8 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-6">Only administrators can create trips.</p>
            <button onClick={onClose} className="btn-primary">
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">Create New Trip</h2>
            <p className="text-gray-600 mt-1">Plan an amazing adventure for your cousins</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit as any)} className="p-8 space-y-8">
        
          <div className="grid md:grid-cols-2 gap-8">
            <div className="form-group">
              <label className="form-label">
                <MapPin className="inline mr-2" size={16} />
                Trip Title *
              </label>
              <input
                {...register('title')}
                className="input-base"
                placeholder="Amazing Safari Adventure"
              />
              {errors.title && (
                <p className="form-error">{errors.title.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <MapPin className="inline mr-2" size={16} />
                Destination *
              </label>
              <input
                {...register('destination')}
                className="input-base"
                placeholder="Maasai Mara, Kenya"
              />
              {errors.destination && (
                <p className="form-error">{errors.destination.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar className="inline mr-2" size={16} />
                Start Date *
              </label>
              <input
                {...register('startDate')}
                type="date"
                className="input-base"
              />
              {errors.startDate && (
                <p className="form-error">{errors.startDate.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Calendar className="inline mr-2" size={16} />
                End Date *
              </label>
              <input
                {...register('endDate')}
                type="date"
                className="input-base"
              />
              {errors.endDate && (
                <p className="form-error">{errors.endDate.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <DollarSign className="inline mr-2" size={16} />
                Price per Person *
              </label>
              <input
                {...register('price')}
                type="number"
                step="0.01"
                className="input-base"
                placeholder="1250.00"
              />
              {errors.price && (
                <p className="form-error">{errors.price.message}</p>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">
                <Users className="inline mr-2" size={16} />
                Max Capacity *
              </label>
              <input
                {...register('maxCapacity')}
                type="number"
                className="input-base"
                placeholder="12"
              />
              {errors.maxCapacity && (
                <p className="form-error">{errors.maxCapacity.message}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div className="form-group">
            <label className="form-label">Description *</label>
            <textarea
              {...register('description')}
              rows={4}
              className="input-base resize-none"
              placeholder="Describe this amazing adventure..."
            />
            {errors.description && (
              <p className="form-error">{errors.description.message}</p>
            )}
          </div>

          {/* Difficulty Level */}
          <div className="form-group">
            <label className="form-label">Difficulty Level *</label>
            <select {...register('difficultyLevel')} className="input-base">
              <option value="">Select difficulty</option>
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="challenging">Challenging</option>
            </select>
            {errors.difficultyLevel && (
              <p className="form-error">{errors.difficultyLevel.message}</p>
            )}
          </div>

          {/* Dynamic Fields */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Highlights */}
            <div className="form-group">
              <label className="form-label">Trip Highlights *</label>
              {highlightFields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2 mb-2">
                  <input
                    {...register(`highlights.${index}` as const)}
                    className="input-base flex-1"
                    placeholder="Amazing wildlife viewing"
                  />
                  {highlightFields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeHighlight(index)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendHighlight('')}
                className="btn-outline text-sm"
              >
                <Plus size={16} className="mr-1" />
                Add Highlight
              </button>
              {errors.highlights && (
                <p className="form-error">{errors.highlights.message}</p>
              )}
            </div>

            {/* Includes */}
            <div className="form-group">
              <label className="form-label">What's Included</label>
              {includeFields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2 mb-2">
                  <input
                    {...register(`includes.${index}` as const)}
                    className="input-base flex-1"
                    placeholder="Accommodation"
                  />
                  <button
                    type="button"
                    onClick={() => removeInclude(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendInclude('')}
                className="btn-outline text-sm"
              >
                <Plus size={16} className="mr-1" />
                Add Item
              </button>
            </div>

            {/* Excludes */}
            <div className="form-group">
              <label className="form-label">What's Excluded</label>
              {excludeFields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2 mb-2">
                  <input
                    {...register(`excludes.${index}` as const)}
                    className="input-base flex-1"
                    placeholder="International flights"
                  />
                  <button
                    type="button"
                    onClick={() => removeExclude(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => appendExclude('')}
                className="btn-outline text-sm"
              >
                <Plus size={16} className="mr-1" />
                Add Item
              </button>
            </div>
          </div>

          {/* Image Upload */}
          <div className="form-group">
            <label className="form-label">Trip Images</label>
            <ImageUpload
              bucket="TRIP_IMAGES"
              path="trips"
              multiple
              maxFiles={6}
              onUpload={handleImageUpload}
            />

            <ImagePreview
              images={images}
              onRemove={removeImage}
              className="mt-6"
            />
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
              {loading ? 'Creating Trip...' : 'Create Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}