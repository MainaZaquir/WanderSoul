/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Camera } from 'lucide-react';
import { PhotoGallery } from '../PhotoGallery';
import { supabase } from '../../lib/supabaseClient';

export function TravelStoriesSection() {
  const [photos, setPhotos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGallery, setShowGallery] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', 'digital')
      .eq('type', 'digital')
      .eq('is_active', true);

    if (error) {
      console.error('Error fetching photos:', error);
      setLoading(false);
      return;
    }

    const formatted = data.flatMap((product: any) =>
      product.images.map((imgUrl: string, index: number) => ({
        id: `${product.id}-${index}`,
        url: imgUrl,
        title: product.name,
        description: product.description,
        location: product.destination,
        date: product.created_at
      }))
    );

    setPhotos(formatted);
    setLoading(false);
  };

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
    setShowGallery(true);
  };

  if (loading) return <p className="text-center py-20">Loading...</p>;

  return (
    <>
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16 animate-slide-up">
            <span className="inline-block bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Visual Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Travel Stories & Adventures
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Capturing moments and memories from incredible journeys across Kenya and beyond
            </p>
          </div>

          {/* Photo Album Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {photos.slice(0, 4).map((photo, index) => (
              <div
                key={photo.id}
                className="relative group cursor-pointer overflow-hidden rounded-xl animate-slide-up hover:shadow-xl transition-all duration-300"
                style={{ animationDelay: `${index * 0.1}s` }}
                onClick={() => handlePhotoClick(index)}
              >
                <img
                  src={photo.url}
                  alt={photo.title}
                  className="w-full h-56 object-cover transition-transform duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end">
                  <div className="p-4 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    <p className="font-semibold text-sm">{photo.title}</p>
                    <p className="text-xs text-gray-300 mt-1">{photo.location}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center">
            <button
              onClick={() => handlePhotoClick(0)}
              className="btn-primary text-lg px-8 py-3"
            >
              <Camera className="mr-2" size={20} />
              View Full Album ({photos.length} Photos)
            </button>
          </div>
        </div>
      </section>

      {/* Photo Gallery Modal */}
      {showGallery && (
        <PhotoGallery
          photos={photos}
          onClose={() => setShowGallery(false)}
          initialPhotoIndex={selectedPhotoIndex}
        />
      )}
    </>
  );
}
