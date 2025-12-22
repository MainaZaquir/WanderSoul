import { Award, Star } from 'lucide-react';

export function AwardSection() {
  return (
    <section id="award-section" className="section-padding bg-gradient-to-br from-orange-50 via-pink-50 to-teal-50">
      <div className="max-w-5xl mx-auto container-padding text-center">
        <div className="card-base p-8 md:p-16 animate-slide-up">
          <div className="flex justify-center mb-8">
            <div className="gradient-sunset p-6 rounded-3xl shadow-2xl animate-pulse-soft">
              <Award className="text-white" size={48} />
            </div>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Lifestyle Influencer of the Year
          </h2>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            Recently nominated for this prestigious award, recognizing excellence in travel content creation and community building across Kenya and East Africa.
          </p>
          <div className="flex justify-center space-x-2 mb-6">
            {[1, 2, 3, 4].map((star) => (
              <Star key={star} className="text-orange-400 fill-current hover:scale-110 transition-transform duration-300" size={28} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}