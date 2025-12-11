import React from 'react';
import { SEOHead } from '../components/SEOHead';
import {
  HeroSection,
  AwardSection,
  UpcomingTripsSection,
  TravelStoriesSection,
  ShopTeaserSection,
  AboutSection,
  NewsletterSection
} from '../components/home';

export function HomePage() {
  return (
    <div className="min-h-screen bg-white">
      <SEOHead
        title="Travel With Muchina - Explore Kenya & East Africa"
        description="Join Muchina Malomba, Kenya's premier radio host and travel curator, on unforgettable adventures across East Africa. Book trips, shop travel gear, and connect with fellow travelers."
        keywords="Kenya travel, East Africa tours, safari adventures, travel with Muchina, Kenyan radio host, travel gear, adventure trips, Maasai Mara, Mount Kenya, Diani Beach"
        type="website"
      />
      
      <HeroSection />
      <AwardSection />
      <UpcomingTripsSection />
      <TravelStoriesSection />
      <ShopTeaserSection />
      <AboutSection />
      <NewsletterSection />
    </div>
  );
}