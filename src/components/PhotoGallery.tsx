import React, { useState, useEffect, useRef } from 'react';
import { X, ChevronLeft, ChevronRight, Heart, Share2 } from 'lucide-react';

interface Photo {
  id: string;
  url: string;
  title: string;
  description: string;
  location: string;
  date: string;
}

interface PhotoGalleryProps {
  photos: Photo[];
  onClose: () => void;
  initialPhotoIndex?: number;
}

export function PhotoGallery({ photos, onClose, initialPhotoIndex = 0 }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialPhotoIndex);
  const [isLoading, setIsLoading] = useState(true);
  const galleryRef = useRef<HTMLDivElement>(null);

  const currentPhoto = photos[currentIndex];

  useEffect(() => {
    galleryRef.current?.focus();
  }, [currentIndex]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') onClose();
  };

  return (
    <div
      ref={galleryRef}
      className="fixed inset-0 bg-black bg-opacity-90 backdrop-blur-sm z-50 flex items-center justify-center animate-fadeIn focus:outline-none"
      onKeyDown={handleKeyDown}
      tabIndex={0}
    >
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-6 right-6 z-20 bg-black bg-opacity-30 text-white p-3 rounded-full hover:bg-opacity-50 shadow-lg transition-all duration-300"
      >
        <X size={24} />
      </button>

      {/* Navigation Buttons */}
      <button
        onClick={goToPrevious}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-30 text-white p-4 rounded-full hover:bg-opacity-50 shadow-lg transition-all duration-300"
      >
        <ChevronLeft size={28} />
      </button>
      <button
        onClick={goToNext}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 z-20 bg-black bg-opacity-30 text-white p-4 rounded-full hover:bg-opacity-50 shadow-lg transition-all duration-300"
      >
        <ChevronRight size={28} />
      </button>

      
      <div className="flex flex-col lg:flex-row items-center justify-center max-h-[90vh] w-full lg:space-x-8 px-4">
        
        <div className="lg:flex-2 flex items-center justify-center w-full lg:w-2/3">
          <div className="relative max-w-4xl max-h-[80vh]">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.title}
              className={`max-w-full max-h-full object-contain rounded-lg shadow-2xl transition-opacity duration-500 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
              onLoad={() => setIsLoading(false)}
              onLoadStart={() => setIsLoading(true)}
            />
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
              </div>
            )}
          </div>
        </div>

        {/* Photo Info Panel */}
        <div className="lg:flex-1 text-white space-y-6 max-h-[80vh] overflow-y-auto mt-6 lg:mt-0">
          <h2 className="text-3xl font-bold mb-2 sticky top-0 bg-black bg-opacity-30 py-2">{currentPhoto.title}</h2>
          <p className="text-gray-300 text-lg leading-relaxed">{currentPhoto.description}</p>

          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-orange-400 rounded-full"></div>
              <span className="text-gray-300">{currentPhoto.location}</span>
            </div>
            <div className="flex items-center space-x-3">
              <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
              <span className="text-gray-300">{currentPhoto.date}</span>
            </div>
          </div>

          
          <div className="flex space-x-4">
            <button className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105">
              <Heart size={16} />
              <span>Like</span>
            </button>
            <button className="flex items-center space-x-2 bg-white bg-opacity-20 hover:bg-opacity-30 px-4 py-2 rounded-lg transition-all duration-300 hover:scale-105">
              <Share2 size={16} />
              <span>Share</span>
            </button>
          </div>

          
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">All Photos ({photos.length})</h3>
            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  onClick={() => setCurrentIndex(index)}
                  className={`relative aspect-square rounded-lg overflow-hidden transition-all duration-300 transform hover:scale-105 focus:outline-none ${
                    index === currentIndex
                      ? 'ring-2 ring-orange-400 shadow-lg opacity-100'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={photo.url} alt={photo.title} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="text-center text-gray-400 mt-2">
            {currentIndex + 1} of {photos.length}
          </div>
        </div>
      </div>
    </div>
  );
}
