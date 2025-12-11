import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight } from 'lucide-react';
import { TripCard } from '../ui/TripCard';

const upcomingTrips = [
  {
    id: '1',
    title: 'Maasai Mara Safari Experience',
    destination: 'Maasai Mara, Kenya',
    startDate: '2025-03-15',
    endDate: '2025-03-20',
    price: 1250,
    duration: '6 Days',
    status: 'Available',
    image: 'https://images.pexels.com/photos/631477/pexels-photo-631477.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '2',
    title: 'Diani Beach Coastal Retreat',
    destination: 'Diani Beach, Kenya',
    startDate: '2025-04-08',
    endDate: '2025-04-11',
    price: 850,
    duration: '4 Days',
    status: 'Few Spots Left',
    image: 'https://images.pexels.com/photos/1288484/pexels-photo-1288484.jpeg?auto=compress&cs=tinysrgb&w=600'
  },
  {
    id: '3',
    title: 'Mount Kenya Climbing Expedition',
    destination: 'Mount Kenya, Kenya',
    startDate: '2025-05-20',
    endDate: '2025-05-26',
    price: 1450,
    duration: '7 Days',
    status: 'Available',
    image: 'https://images.pexels.com/photos/346885/pexels-photo-346885.jpeg?auto=compress&cs=tinysrgb&w=600'
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