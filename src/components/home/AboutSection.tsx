import React from 'react';
import { Instagram, Twitter, Facebook, Heart } from 'lucide-react';

export function AboutSection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative animate-slide-up">
            <div className="absolute inset-0 gradient-sunset rounded-3xl transform rotate-3 shadow-2xl"></div>
            <img 
              src="https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=500"
              alt="Muchina Malomba"
              className="relative rounded-3xl shadow-2xl w-full h-[450px] object-cover transition-transform duration-300 hover:rotate-1"
            />
            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-700">Live on KissFM</span>
              </div>
            </div>
          </div>
          
          <div className="animate-slide-up stagger-1">
            <span className="inline-block bg-teal-100 text-teal-800 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              About Me
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-8">Meet Muchina</h2>
            <p className="text-2xl text-gray-700 mb-8 font-light">
              Radio Host • Adventure Curator • Travel Enthusiast
            </p>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              From the airwaves of KissFM to the African wilderness, I'm Muchina Malomba a full-time adventure junkie and part-time comedian.Catch me 😄 on Kiss FM every morning from 7 AM to 10 AM, bringing you good vibes and even better tunes! When I'm not on air, I'm off solo backpacking chasing sunsets, getting lost (on purpose), and sharing my travel tales online to spark your wanderlust.Life's too short to stay still! With years of experience curating unforgettable adventures, I believe travel is more than just visiting places its about creating connections,embracing cultures, and making memories that last a lifetime. Join me cousins as we explore the heart of Africa together.
            </p>
            
            <div className="flex space-x-4 mb-10">
              <a href="#" className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-pink-500/25">
                <Instagram size={20} />
              </a>
              <a href="#" className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-blue-500/25">
                <Twitter size={20} />
              </a>
              <a href="#" className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-blue-600/25">
                <Facebook size={20} />
              </a>
            </div>
            
            <button className="btn-primary text-lg px-10 py-4 hover-glow">
              <Heart className="mr-2" size={20} />
              Connect With Me
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}