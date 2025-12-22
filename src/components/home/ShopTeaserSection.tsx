
import { Link } from 'react-router-dom';
import { Backpack, ArrowRight } from 'lucide-react';

export function ShopTeaserSection() {
  return (
    <section className="section-padding bg-gradient-to-br from-orange-50 via-pink-50 to-teal-50">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="bg-white rounded-xl shadow-md overflow-hidden animate-slide-up">
          <div className="grid md:grid-cols-2 items-center">
            <div className="p-8 md:p-16">
              <div className="flex items-center mb-6">
                <Backpack className="text-orange-500 mr-3" size={32} />
                <span className="badge-primary">Gear Collection</span>
              </div>
              <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Wander Backpacks Kenya
              </h3>
              <p className="text-2xl text-gray-700 mb-6 font-light">
                Built for the Journey
              </p>
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Premium quality travel gear designed for the modern African explorer. Durable, functional, and stylish backpacks that have been tested on countless adventures across Kenya and beyond.
              </p>
              <Link 
                to="/shop"
                className="btn-secondary text-lg px-8 py-3"
              >
                Shop Now
                <ArrowRight className="ml-2" size={20} />
              </Link>
            </div>
            <div className="relative h-80 md:h-full overflow-hidden">
              <img 
                src="https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/Wander-pack.jpeg"
                alt="Wander Backpacks Kenya"
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/10"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}