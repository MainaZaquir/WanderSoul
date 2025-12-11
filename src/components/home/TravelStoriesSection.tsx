import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { PhotoGallery } from '../PhotoGallery';

const travelPhotos = [
  {
    id: '1',
    url: 'https://images.pexels.com/photos/1435742/pexels-photo-1435742.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Big Five Safari Experience',
    description: 'An incredible encounter with the majestic lions of Maasai Mara. This moment captured the raw beauty and power of African wildlife in their natural habitat.',
    location: 'Maasai Mara, Kenya',
    date: 'March 2024'
  },
  {
    id: '2',
    url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Coastal Sunset Vibes',
    description: 'The perfect end to an amazing day at Diani Beach. The golden hour light created magical reflections on the pristine white sand.',
    location: 'Diani Beach, Kenya',
    date: 'February 2024'
  },
  {
    id: '3',
    url: 'https://images.pexels.com/photos/1190297/pexels-photo-1190297.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Mountain Peak Conquered',
    description: 'Reaching the summit of Mount Kenya was a life-changing experience. The view from the top reminded me why I fell in love with adventure travel.',
    location: 'Mount Kenya, Kenya',
    date: 'January 2024'
  },
  {
    id: '4',
    url: 'https://images.pexels.com/photos/1598073/pexels-photo-1598073.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Cultural Immersion',
    description: 'Learning traditional dances with the Maasai community. These authentic cultural exchanges are what make travel truly meaningful.',
    location: 'Maasai Village, Kenya',
    date: 'March 2024'
  },
  {
    id: '5',
    url: 'https://images.pexels.com/photos/2356045/pexels-photo-2356045.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Elephant Migration',
    description: 'Witnessing the great elephant migration in Amboseli. These gentle giants never fail to inspire awe and respect for nature.',
    location: 'Amboseli National Park, Kenya',
    date: 'April 2024'
  },
  {
    id: '6',
    url: 'https://images.pexels.com/photos/631477/pexels-photo-631477.jpeg?auto=compress&cs=tinysrgb&w=800',
    title: 'Savanna Adventures',
    description: 'Early morning game drives offer the best wildlife viewing opportunities. The African savanna comes alive at dawn.',
    location: 'Tsavo National Park, Kenya',
    date: 'May 2024'
  }
];

export function TravelStoriesSection() {
  const [showGallery, setShowGallery] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  const handlePhotoClick = (index: number) => {
    setSelectedPhotoIndex(index);
    setShowGallery(true);
  };

  return (
    <>
      <section className="section-padding bg-white">
        <div className="max-w-7xl mx-auto container-padding">
          <div className="text-center mb-16 animate-slide-up">
            <span className="inline-block bg-pink-100 text-pink-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              Visual Stories
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Travel Stories & Adventures</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Capturing moments and memories from incredible journeys across Kenya and beyond
            </p>
          </div>
          
          {/* Photo Album Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-12">
            {travelPhotos.slice(0, 4).map((photo, index) => (
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
              View Full Album ({travelPhotos.length} Photos)
            </button>
          </div>
        </div>
      </section>

      {/* Photo Gallery Modal */}
      {showGallery && (
        <PhotoGallery
          photos={travelPhotos}
          onClose={() => setShowGallery(false)}
          initialPhotoIndex={selectedPhotoIndex}
        />
      )}
    </>
  );
}