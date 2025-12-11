import React from 'react';
import { Users } from 'lucide-react';

export function NewsletterSection() {
  return (
    <section className="section-padding gradient-blue">
      <div className="max-w-5xl mx-auto container-padding text-center">
        <div className="flex justify-center mb-8 animate-slide-up">
          <Users className="text-white" size={48} />
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-slide-up stagger-1">Join My Travel Circle</h2>
        <p className="text-xl md:text-2xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed animate-slide-up stagger-2">
          Get updates on upcoming trips, exclusive travel tips, and behind-the-scenes stories
        </p>
        
        <div className="bg-white rounded-3xl p-8 md:p-12 shadow-2xl animate-slide-up stagger-3">
          <form className="flex flex-col sm:flex-row gap-6 max-w-2xl mx-auto">
            <div className="flex-1">
              <input 
                type="email" 
                placeholder="Enter your email address"
                className="input-base rounded-2xl text-lg"
              />
            </div>
            <button 
              type="submit"
              className="btn-primary whitespace-nowrap"
            >
              <Users className="mr-2" size={20} />
              Join The Cousins Circle
            </button>
          </form>
          <p className="text-gray-600 text-sm mt-6">
            No spam, just adventure. Unsubscribe anytime.
          </p>
          <div className="flex items-center justify-center space-x-6 mt-8 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span>2,000+ subscribers</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span>Monthly updates</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span>Exclusive content</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}