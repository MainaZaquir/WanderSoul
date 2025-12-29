 
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { TripCard } from '../ui/TripCard';

const upcomingTrips = [
  {
    id: '1',
    title: 'Arusha, Tanzania Adventure',
    destination: 'Arusha, Tanzania',
    startDate: '2026-03-10',
    endDate: '2026-03-16',
    price: 'Price to be Announced',
    duration: '10',
    status: 'Available',
    image: 'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/image1.jpeg'
  },
  {
    id: '2',
    title: 'Zanzibar Beach Getaway',
    destination: 'Zanzibar, Tanzania',
    startDate: '2026-06-01',
    endDate: '2026-06-07',
    price: 'Price to be Announced',
    duration: '10',
    status: 'Available',
    image: 'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/image33.jpeg'
  },
  {
    id: '3',
    title: 'Cape Town 2-7 Day Trip',
    destination: 'Cape Town, South Africa',
    startDate: '2026-07-01',
    endDate: '2026-07-07',
    price: 'Price to be Announced',
    duration: '10',
    status: 'Available',
    image: 'https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/image21.jpeg'
  }
];

export function UpcomingTripsSection() {
  return (
    <section className="section-padding bg-gray-50">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="text-center mb-16 animate-slide-up">
          <span className="inline-block bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Next Adventures
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Upcoming Adventures</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join me on these incredible journeys across Kenya and beyond
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {upcomingTrips.map((trip, index) => (
            <TripCard 
              key={trip.id} 
              trip={trip} 
              index={index}
            />
          ))}
        </div>

        <div className="text-center">
          <Link 
            to="/trips"
            className="btn-primary"
          >
            <Calendar className="mr-2" size={20} />
            View All Trips
            <ArrowRight className="ml-2" size={20} />
          </Link>
        </div>
      </div>
    </section>
  );
}