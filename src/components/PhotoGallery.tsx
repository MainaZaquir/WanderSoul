/* eslint-disable react-hooks/rules-of-hooks */
import { useState, useEffect, useRef } from 'react';
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

export function PhotoGallery({
  photos,
  onClose,
  initialPhotoIndex = 0,
}: PhotoGalleryProps) {
  if (!photos.length) return null;

  const [currentIndex, setCurrentIndex] = useState(initialPhotoIndex);
  const [isLoading, setIsLoading] = useState(true);
  const modalRef = useRef<HTMLDivElement>(null);

  const currentPhoto = photos[currentIndex];
  const isFirst = currentIndex === 0;
  const isLast = currentIndex === photos.length - 1;

  // Reset loading state when photo changes
  useEffect(() => {
    setIsLoading(true);
  }, [currentIndex]);

  // Global keyboard handling
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft' && !isFirst) {
        setCurrentIndex((i) => i - 1);
      }
      if (e.key === 'ArrowRight' && !isLast) {
        setCurrentIndex((i) => i + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFirst, isLast, onClose]);

  // Initial focus
  useEffect(() => {
    modalRef.current?.focus();
  }, []);

  return (
    <div
      ref={modalRef}
      tabIndex={-1}
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 bg-black bg-opacity-90 backdrop-blur-sm flex items-center justify-center focus:outline-none"
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Close gallery"
        className="absolute top-6 right-6 z-20 p-3 rounded-full bg-black bg-opacity-40 hover:bg-opacity-60 transition"
      >
        <X size={24} className="text-white" />
      </button>

      {/* Navigation */}
      <button
        onClick={() => setCurrentIndex((i) => i - 1)}
        disabled={isFirst}
        aria-label="Previous photo"
        className={`absolute left-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full transition ${
          isFirst
            ? 'opacity-30 cursor-not-allowed'
            : 'bg-black bg-opacity-40 hover:bg-opacity-60'
        }`}
      >
        <ChevronLeft size={28} className="text-white" />
      </button>

      <button
        onClick={() => setCurrentIndex((i) => i + 1)}
        disabled={isLast}
        aria-label="Next photo"
        className={`absolute right-4 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full transition ${
          isLast
            ? 'opacity-30 cursor-not-allowed'
            : 'bg-black bg-opacity-40 hover:bg-opacity-60'
        }`}
      >
        <ChevronRight size={28} className="text-white" />
      </button>

      <div className="flex flex-col lg:flex-row w-full max-h-[90vh] px-4 gap-8">
        {/* Image */}
        <div className="flex-1 flex items-center justify-center">
          <div className="relative max-w-4xl max-h-[80vh]">
            <img
              src={currentPhoto.url}
              alt={currentPhoto.title}
              onLoad={() => setIsLoading(false)}
              className={`rounded-lg shadow-2xl object-contain max-h-[80vh] transition-opacity duration-500 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              }`}
            />

            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded-lg">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-white" />
              </div>
            )}
          </div>
        </div>

        {/* Info Panel */}
        <aside className="flex-1 text-white space-y-6 overflow-y-auto max-h-[80vh]">
          <h2 className="text-3xl font-bold">{currentPhoto.title}</h2>
          <p className="text-gray-300 leading-relaxed">
            {currentPhoto.description}
          </p>

          <div className="space-y-2 text-gray-300">
            <div>{currentPhoto.location}</div>
            <div>{currentPhoto.date}</div>
          </div>

          {/* Disabled actions (honest UX) */}
          <div className="flex gap-4">
            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white bg-opacity-20 opacity-50 cursor-not-allowed"
            >
              <Heart size={16} />
              Like
            </button>

            <button
              disabled
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white bg-opacity-20 opacity-50 cursor-not-allowed"
            >
              <Share2 size={16} />
              Share
            </button>
          </div>

          {/* Thumbnails */}
          <div>
            <h3 className="font-semibold mb-2">
              All Photos ({photos.length})
            </h3>

            <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
              {photos.map((photo, index) => (
                <button
                  key={photo.id}
                  aria-current={index === currentIndex}
                  onClick={() => setCurrentIndex(index)}
                  className={`aspect-square overflow-hidden rounded-lg transition transform hover:scale-105 ${
                    index === currentIndex
                      ? 'ring-2 ring-orange-400'
                      : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.title}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="text-center text-gray-400">
            {currentIndex + 1} of {photos.length}
          </div>
        </aside>
      </div>
    </div>
  );
}
