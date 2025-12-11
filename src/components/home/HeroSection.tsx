import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, Camera, ChevronDown } from 'lucide-react';

export function HeroSection() {
  const handleScrollToAward = () => {
    document.getElementById('award-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-[10s] hover:scale-105"
        style={{
          backgroundImage: 'url(https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/40 to-black/60"></div>
      </div>
      
      <div className="relative z-10 text-center text-white container-padding max-w-5xl mx-auto animate-slide-up">
        <div className="mb-6">
          <span className="inline-flex items-center space-x-2 bg-white/10 glass px-4 py-2 rounded-full text-sm font-medium backdrop-blur-md">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
            <span>Live from Nairobi, Kenya</span>
          </span>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 tracking-tight leading-tight">
          Travel With <span className="text-gradient bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">Muchina</span>
        </h1>
        
        <p className="text-xl md:text-3xl mb-4 text-gray-200 font-light animate-slide-up stagger-1">
          Explore. Connect. Experience. 
        </p>
        
        <p className="text-lg md:text-xl mb-12 text-gray-300 max-w-2xl mx-auto leading-relaxed animate-slide-up stagger-2">
          Join Kenya's premier radio host and adventure curator on unforgettable journeys across East Africa and beyond.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-slide-up stagger-3">
          <Link 
            to="/trips"
            className="btn-hero-primary hover-glow"
          >
            <Users className="mr-3" size={24} />
            Hey Cousins Join My Next Trip
          </Link>
          <Link 
            to="/community"
            className="btn-hero-secondary"
          >
            <Camera className="mr-3" size={24} />
            Explore My Past Adventures
          </Link>
        </div>
        
        <div className="mt-16 animate-slide-up stagger-4">
          <button 
            onClick={handleScrollToAward}
            className="btn-discover group"
          >
            <span className="text-sm font-medium">Discover More</span>
            <ChevronDown size={24} className="animate-bounce group-hover:translate-y-1 transition-transform duration-300" />
          </button>
        </div>
      </div>
    </section>
  );
}