/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState, useEffect } from 'react';
import { Calendar, MapPin, Star, Users, ArrowRight, ListFilter as Filter } from 'lucide-react';
import { supabase, Trip } from '../lib/supabase';
import { useAuth } from '../hooks/useAuth';
import { BookingModal } from '../components/BookingModal';
import toast from 'react-hot-toast';

export function TripsPage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTrip, setSelectedTrip] = useState<Trip | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [filter, setFilter] = useState<'all' | 'easy' | 'moderate' | 'challenging'>('all');
  const { user } = useAuth();

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('is_active', true)
        .order('start_date', { ascending: true });

      if (error) throw error;
      setTrips(data || []);
    } catch (error) {
      console.error('Error fetching trips:', error);
      toast.error('Failed to load trips');
    } finally {
      setLoading(false);
    }
  };

  const handleBookTrip = (trip: Trip) => {
    if (!user) {
      toast.error('Please sign in to book a trip');
      return;
    }
    setSelectedTrip(trip);
    setShowBookingModal(true);
  };

  const filteredTrips = trips.filter(trip => 
    filter === 'all' || trip.difficulty_level === filter
  );

  const getDifficultyColor = (level?: string) => {
    switch (level) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'challenging': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getAvailableSpots = (trip: Trip) => {
    return trip.max_capacity - trip.current_bookings;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-teal-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Adventure Awaits
          </h1>
          <p className="text-xl text-teal-100 max-w-2xl mx-auto">
            Join me on carefully curated journeys across Kenya and East Africa. 
            From wildlife safaris to mountain expeditions, every trip is an unforgettable experience.
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">
              Available Trips ({filteredTrips.length})
            </h2>
            <div className="flex items-center space-x-4">
              <Filter size={20} className="text-gray-600" />
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value as any)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="all">All Difficulties</option>
                <option value="easy">Easy</option>
                <option value="moderate">Moderate</option>
                <option value="challenging">Challenging</option>
              </select>
            </div>
          </div>
        </div>
      </section>

      {/* Trips Grid */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {filteredTrips.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No trips available for the selected filter.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredTrips.map((trip) => {
                const availableSpots = getAvailableSpots(trip);
                const isFullyBooked = availableSpots <= 0;
                
                return (
                  <div key={trip.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="relative h-64">
                      <img 
                        src={trip.images[0] || 'https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg'}
                        alt={trip.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyColor(trip.difficulty_level)}`}>
                          {(trip.difficulty_level ?? 'Unknown').charAt(0).toUpperCase() + (trip.difficulty_level ?? 'Unknown').slice(1)}
                        </span>
                      </div>
                      <div className="absolute top-4 right-4 bg-white bg-opacity-90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                        {Math.ceil((new Date(trip.end_date).getTime() - new Date(trip.start_date).getTime()) / (1000 * 60 * 60 * 24))} Days
                      </div>
                      {isFullyBooked && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold">
                            Fully Booked
                          </span>
                        </div>
                      )}
                    </div>
                    
                    <div className="p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">{trip.title}</h3>
                      <p className="text-gray-600 mb-4 line-clamp-2">{trip.description}</p>
                      
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center text-gray-600">
                          <Calendar size={16} className="mr-2" />
                          <span className="text-sm">
                            {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <MapPin size={16} className="mr-2" />
                          <span className="text-sm">{trip.destination}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Users size={16} className="mr-2" />
                          <span className="text-sm">
                            {availableSpots} spots available ({trip.max_capacity} total)
                          </span>
                        </div>
                      </div>

                      {trip.highlights && trip.highlights.length > 0 && (
                        <div className="mb-4">
                          <h4 className="font-semibold text-gray-900 mb-2">Highlights:</h4>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {trip.highlights.slice(0, 3).map((highlight, index) => (
                              <li key={index} className="flex items-center">
                                <Star size={12} className="mr-2 text-orange-400" />
                                {highlight}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div>
                          <span className="text-2xl font-bold text-teal-600">
                            ${trip.price.toLocaleString()}
                          </span>
                          <span className="text-gray-600 text-sm ml-1">per person</span>
                        </div>
                        <button
                          onClick={() => handleBookTrip(trip)}
                          disabled={isFullyBooked}
                          className={`inline-flex items-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                            isFullyBooked
                              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                              : 'bg-orange-500 hover:bg-orange-600 text-white transform hover:scale-105'
                          }`}
                        >
                          {isFullyBooked ? 'Fully Booked' : 'Book Now'}
                          {!isFullyBooked && <ArrowRight className="ml-2" size={16} />}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Booking Modal */}
      {showBookingModal && selectedTrip && (
        <BookingModal
          trip={selectedTrip}
          onClose={() => {
            setShowBookingModal(false);
            setSelectedTrip(null);
          }}
          onSuccess={() => {
            setShowBookingModal(false);
            setSelectedTrip(null);
            fetchTrips(); // Refresh trips to update availability
          }}
        />
      )}
    </div>
  );
}