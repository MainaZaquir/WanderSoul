import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin } from 'lucide-react';

interface Trip {
  id: string;
  title: string;
  destination: string;
  startDate: string;
  endDate: string;
  price: number;
  duration: string;
  status: string;
  image: string;
}

interface TripCardProps {
  trip: Trip;
  index: number;
}

export function TripCard({ trip, index }: TripCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800';
      case 'Few Spots Left':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  const getStatusDot = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-400';
      case 'Few Spots Left':
        return 'bg-yellow-400';
      default:
        return 'bg-blue-400';
    }
  };

  return (
    <div className={`bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 overflow-hidden animate-slide-up cursor-pointer`} style={{ animationDelay: `${index * 0.1}s` }}>
      <div className="relative h-72 overflow-hidden">
        <img 
          src={trip.image}
          alt={trip.title}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
        <div className={`absolute top-4 right-4 ${getStatusColor(trip.status)} px-3 py-1 rounded-full text-sm font-medium shadow-lg`}>
          {trip.duration}
        </div>
        <div className="absolute bottom-4 left-4 text-white">
          <div className="flex items-center space-x-2 mb-2">
            <div className={`w-2 h-2 ${getStatusDot(trip.status)} rounded-full`}></div>
            <span className="text-sm font-medium">{trip.status}</span>
          </div>
        </div>
      </div>
      <div className="p-8">
        <h3 className="text-xl font-bold text-gray-900 mb-4 hover:text-orange-600 transition-colors duration-300">{trip.title}</h3>
        <div className="flex items-center text-gray-600 mb-3">
          <Calendar size={16} className="mr-2" />
          <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center text-gray-600 mb-6">
          <MapPin size={16} className="mr-2" />
          <span>{trip.destination}</span>
        </div>
        <Link 
          to="/trips"
          className="btn-secondary w-full justify-center"
        >
          Book Now - ${trip.price.toLocaleString()}
        </Link>
      </div>
    </div>
  );
}