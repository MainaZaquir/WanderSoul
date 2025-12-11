import React, { useState, useRef } from 'react';
import { Camera, Upload, X, CircleAlert as AlertCircle } from 'lucide-react';
import { uploadImage, uploadMultipleImages, STORAGE_BUCKETS } from '../lib/storage';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  bucket: keyof typeof STORAGE_BUCKETS;
  path?: string;
  multiple?: boolean;
  maxFiles?: number;
  onUpload: (urls: string[]) => void;
  onError?: (error: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export function ImageUpload({
  bucket,
  path,
  multiple = false,
  maxFiles = 6,
  onUpload,
  onError,
  className = '',
  children
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = async (files: FileList) => {
    if (!files.length) return;

    const fileArray = Array.from(files);
    
    // Validate file count
    if (multiple && fileArray.length > maxFiles) {
      const error = `Maximum ${maxFiles} files allowed`;
      onError?.(error);
      toast.error(error);
      return;
    }

    if (!multiple && fileArray.length > 1) {
      const error = 'Only one file allowed';
      onError?.(error);
      toast.error(error);
      return;
    }

    setUploading(true);

    try {
      let urls: string[];
      
      if (multiple) {
        urls = await uploadMultipleImages(fileArray, STORAGE_BUCKETS[bucket], path);
      } else {
        const url = await uploadImage(fileArray[0], STORAGE_BUCKETS[bucket], path);
        urls = [url];
      }

      onUpload(urls);
      toast.success(`${urls.length} image${urls.length > 1 ? 's' : ''} uploaded successfully!`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed';
      onError?.(errorMessage);
      toast.error(errorMessage);
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  if (children) {
    return (
      <div className={className}>
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept="image/*"
          onChange={handleInputChange}
          className="hidden"
        />
        <div onClick={openFileDialog} className="cursor-pointer">
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept="image/*"
        onChange={handleInputChange}
        className="hidden"
      />
      
      <div
        className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-300 cursor-pointer ${
          dragActive
            ? 'border-orange-400 bg-orange-50'
            : uploading
            ? 'border-gray-300 bg-gray-50'
            : 'border-gray-300 hover:border-orange-400 hover:bg-orange-50'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        {uploading ? (
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            <span className="text-gray-600 font-medium">Uploading...</span>
          </div>
        ) : (
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-gray-100 p-4 rounded-full">
              <Camera className="text-gray-400" size={32} />
            </div>
            <div>
              <span className="text-lg font-semibold text-gray-700">
                {dragActive ? 'Drop images here' : 'Upload Images'}
              </span>
              <p className="text-gray-500 mt-2">
                Click to select or drag and drop
              </p>
              <p className="text-sm text-gray-400 mt-1">
                {multiple ? `Max ${maxFiles} images, ` : 'Single image, '}
                JPEG, PNG, WebP up to 5MB each
              </p>
            </div>
          </div>
        )}
      </div>

      {dragActive && (
        <div className="absolute inset-0 bg-orange-100 bg-opacity-50 border-2 border-orange-400 border-dashed rounded-2xl flex items-center justify-center">
          <div className="text-orange-600 font-semibold text-lg">
            Drop images here
          </div>
        </div>
      )}
    </div>
  );
}

interface ImagePreviewProps {
  images: string[];
  onRemove: (index: number) => void;
  className?: string;
}

export function ImagePreview({ images, onRemove, className = '' }: ImagePreviewProps) {
  if (images.length === 0) return null;

  return (
    <div className={`grid grid-cols-2 md:grid-cols-3 gap-4 ${className}`}>
      {images.map((image, index) => (
        <div key={index} className="relative group">
          <img
            src={image}
            alt={`Upload ${index + 1}`}
            className="w-full h-32 object-cover rounded-xl"
          />
          <button
            type="button"
            onClick={() => onRemove(index)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}