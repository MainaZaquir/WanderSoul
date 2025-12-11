import React, { useState, useEffect } from 'react';
import { Award, ExternalLink, Mail, Calendar, Building, Users, Target, TrendingUp } from 'lucide-react';
import { supabase, Sponsorship } from '../lib/supabase';
import { SponsorshipInquiryModal } from '../components/SponsorshipInquiryModal';
import toast from 'react-hot-toast';

export function SponsorshipPage() {
  const [sponsorships, setSponsorships] = useState<Sponsorship[]>([]);
  const [loading, setLoading] = useState(true);
  const [showInquiryModal, setShowInquiryModal] = useState(false);

  useEffect(() => {
    fetchSponsorships();
  }, []);

  const fetchSponsorships = async () => {
    try {
      const { data, error } = await supabase
        .from('sponsorships')
        .select('*')
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false });

      if (error) throw error;
      setSponsorships(data || []);
    } catch (error) {
      console.error('Error fetching sponsorships:', error);
      toast.error('Failed to load sponsorships');
    } finally {
      setLoading(false);
    }
  };

  const currentSponsors = sponsorships.filter(s => s.partnership_type === 'current');
  const pastSponsors = sponsorships.filter(s => s.partnership_type === 'past');

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
      <section className="relative py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="bg-white bg-opacity-20 p-4 rounded-full">
              <Award className="text-white" size={48} />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Partnership Opportunities
          </h1>
          <p className="text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
            Join forces with Kenya's leading travel influencer to reach engaged audiences 
            and create meaningful brand connections across East Africa.
          </p>
          <button
            onClick={() => setShowInquiryModal(true)}
            className="inline-flex items-center space-x-2 bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-full text-lg font-semibold transition-all duration-300 transform hover:scale-105"
          >
            <Mail size={20} />
            <span>Partner With Us</span>
          </button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 p-6 rounded-2xl">
              <Users className="mx-auto text-blue-600 mb-4" size={32} />
              <div className="text-3xl font-bold text-gray-900 mb-2">50K+</div>
              <div className="text-gray-600">Social Media Followers</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 p-6 rounded-2xl">
              <TrendingUp className="mx-auto text-green-600 mb-4" size={32} />
              <div className="text-3xl font-bold text-gray-900 mb-2">85%</div>
              <div className="text-gray-600">Engagement Rate</div>
            </div>
            <div className="bg-gradient-to-br from-orange-50 to-amber-100 p-6 rounded-2xl">
              <Target className="mx-auto text-orange-600 mb-4" size={32} />
              <div className="text-3xl font-bold text-gray-900 mb-2">25-45</div>
              <div className="text-gray-600">Target Age Range</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-violet-100 p-6 rounded-2xl">
              <Building className="mx-auto text-purple-600 mb-4" size={32} />
              <div className="text-3xl font-bold text-gray-900 mb-2">12+</div>
              <div className="text-gray-600">Brand Partnerships</div>
            </div>
          </div>
        </div>
      </section>

      {/* Current Partners */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Current Partners</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Proud to work with these amazing brands that share our passion for adventure and exploration.
            </p>
          </div>

          {currentSponsors.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No current partnerships to display.</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {currentSponsors.map((sponsor) => (
                <div key={sponsor.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                  <div className="relative h-48">
                    <img
                      src={sponsor.logo_url || 'https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg'}
                      alt={sponsor.company_name}
                      className="w-full h-full object-cover"
                    />
                    {sponsor.is_featured && (
                      <div className="absolute top-4 right-4 bg-gradient-to-r from-orange-400 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                        Featured
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{sponsor.company_name}</h3>
                    <p className="text-gray-600 mb-4 line-clamp-3">{sponsor.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-500 text-sm">
                        <Calendar size={16} className="mr-2" />
                        <span>
                          {sponsor.start_date ? new Date(sponsor.start_date).getFullYear() : 'Ongoing'}
                        </span>
                      </div>
                      {sponsor.website_url && (
                        <a
                          href={sponsor.website_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center space-x-1 text-indigo-600 hover:text-indigo-700 font-medium"
                        >
                          <span>Visit</span>
                          <ExternalLink size={16} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Partnership Benefits */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Partner With Us?</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Authentic storytelling meets engaged audiences for maximum brand impact.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="bg-blue-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Users className="text-blue-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Engaged Audience</h3>
              <p className="text-gray-600">
                Reach 50,000+ highly engaged followers who trust our travel recommendations and lifestyle choices.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-green-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Target className="text-green-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Targeted Reach</h3>
              <p className="text-gray-600">
                Connect with adventure-seeking millennials and Gen Z travelers across Kenya and East Africa.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-orange-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Award className="text-orange-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Authentic Content</h3>
              <p className="text-gray-600">
                Professional content creation with genuine storytelling that resonates with our community.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-purple-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <TrendingUp className="text-purple-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Multi-Platform Presence</h3>
              <p className="text-gray-600">
                Exposure across radio, social media, website, and live events for maximum brand visibility.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-pink-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Building className="text-pink-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Brand Integration</h3>
              <p className="text-gray-600">
                Seamless brand integration into travel experiences and lifestyle content.
              </p>
            </div>

            <div className="text-center p-6">
              <div className="bg-indigo-100 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <ExternalLink className="text-indigo-600" size={24} />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Measurable Results</h3>
              <p className="text-gray-600">
                Detailed analytics and reporting to track campaign performance and ROI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Past Collaborations */}
      {pastSponsors.length > 0 && (
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">Past Collaborations</h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Successful partnerships that have created lasting impact and memorable campaigns.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {pastSponsors.map((sponsor) => (
                <div key={sponsor.id} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
                  <img
                    src={sponsor.logo_url || 'https://images.pexels.com/photos/912050/pexels-photo-912050.jpeg'}
                    alt={sponsor.company_name}
                    className="w-full h-24 object-contain mb-4"
                  />
                  <h4 className="font-semibold text-gray-900 text-center">{sponsor.company_name}</h4>
                  {sponsor.end_date && (
                    <p className="text-sm text-gray-500 text-center mt-2">
                      {new Date(sponsor.end_date).getFullYear()}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-orange-500 to-pink-500">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Partner?</h2>
          <p className="text-xl text-orange-100 mb-8">
            Let's create something amazing together. Reach out to discuss partnership opportunities.
          </p>
          <button
            onClick={() => setShowInquiryModal(true)}
            className="inline-flex items-center space-x-2 bg-white text-orange-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105"
          >
            <Mail size={20} />
            <span>Start the Conversation</span>
          </button>
        </div>
      </section>

      {/* Sponsorship Inquiry Modal */}
      {showInquiryModal && (
        <SponsorshipInquiryModal
          onClose={() => setShowInquiryModal(false)}
          onSuccess={() => {
            setShowInquiryModal(false);
            toast.success('Partnership inquiry sent successfully!');
          }}
        />
      )}
    </div>
  );
}