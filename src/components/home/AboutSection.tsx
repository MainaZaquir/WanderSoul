import { Instagram, Facebook, Heart } from 'lucide-react';

export function AboutSection() {
  return (
    <section className="section-padding bg-white">
      <div className="max-w-7xl mx-auto container-padding">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative animate-slide-up">
            <div className="absolute inset-0 gradient-sunset rounded-3xl transform rotate-3 shadow-2xl"></div>
            <img 
              src="https://hstcfojtlwsneyopuofq.supabase.co/storage/v1/object/public/images/gallery/image4.jpeg"
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
              Muchina is a full-time adventure junkie, storyteller, and your energetic morning companion on Kiss FM. 
              Tune in every weekday from 6 AM to 10 AM for lively conversations, great music, and a fresh start to your day. 
              When I’m off the air, you’ll usually find me backpacking solo, uncovering hidden gems, chasing breathtaking sunsets, 
              and intentionally getting lost just to see where the world takes me. I share my travel adventures and behind-the-scenes
               moments from the radio studio online, giving you a glimpse into my life both on and off the mic. Whether I’m navigating 
               crowded city streets, sampling local street food, or making new friends along the way, my goal is simple: to inspire
                curiosity, adventure, and a love for life’s unexpected moments.
            </p>
            
            <div className="flex space-x-4 mb-10">
              <a
                href="https://www.instagram.com/muchinamalomba?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 text-white p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-pink-500/25"
              >
                <Instagram size={20} />
              </a>
              <a
                href="https://www.facebook.com/p/muchina-malomba-100066466611519/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white p-4 rounded-2xl transition-all duration-300 transform hover:scale-110 shadow-lg hover:shadow-blue-600/25"
              >
              <Facebook size={20} />
              </a>

            </div>
            
            <a 
              href="https://www.instagram.com/muchinamalomba?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" 
              target="_blank" 
               rel="noopener noreferrer"
            >
              <button className="btn-primary text-lg px-10 py-4 hover-glow">
              <Heart className="mr-2" size={20} />
              Connect With Me
            </button>
            </a>
            
          </div>
        </div>
      </div>
    </section>
  );
}