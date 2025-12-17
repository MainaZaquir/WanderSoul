import { Helmet } from 'react-helmet-async';

interface SEOHeadProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'article' | 'product';
  author?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export function SEOHead({
  title = 'Travel With Muchina - Explore Kenya & East Africa',
  description = 'Join Muchina Malomba, Kenya\'s premier radio host and travel curator, on unforgettable adventures across East Africa. Book trips, shop travel gear, and connect with fellow travelers.',
  keywords = 'Kenya travel, East Africa tours, safari adventures, travel with Muchina, Kenyan radio host, travel gear, adventure trips, Maasai Mara, Mount Kenya, Diani Beach',
  image = 'https://images.pexels.com/photos/1435752/pexels-photo-1435752.jpeg?auto=compress&cs=tinysrgb&w=1200&h=630&fit=crop',
  url = 'https://muchinamalomba.co.ke',
  type = 'website',
  author = 'Muchina Malomba',
  publishedTime,
  modifiedTime,
}: SEOHeadProps) {
  const fullTitle = title.includes('Muchina Malomba') ? title : `${title} | Muchina Malomba`;
  const canonicalUrl = `${url}${window.location.pathname}`;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Open Graph Meta Tags */}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content="Muchina Malomba" />
      <meta property="og:locale" content="en_US" />

      {/* Twitter Card Meta Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:creator" content="@MuchinaMalomba" />

      {/* Article Meta Tags (for blog posts/articles) */}
      {type === 'article' && (
        <>
          <meta property="article:author" content={author} />
          {publishedTime && <meta property="article:published_time" content={publishedTime} />}
          {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
          <meta property="article:section" content="Travel" />
          <meta property="article:tag" content="Kenya" />
          <meta property="article:tag" content="Travel" />
          <meta property="article:tag" content="Adventure" />
        </>
      )}

      {/* Additional SEO Meta Tags */}
      <meta name="robots" content="index, follow" />
      <meta name="googlebot" content="index, follow" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Language" content="en" />
      <meta name="geo.region" content="KE" />
      <meta name="geo.country" content="Kenya" />
      <meta name="geo.placename" content="Nairobi" />

      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "TravelAgency",
          "name": "Travel With Muchina",
          "description": description,
          "url": url,
          "logo": "https://muchinamalomba.co.ke/logo.png",
          "image": image,
          "founder": {
            "@type": "Person",
            "name": "Muchina Malomba",
            "jobTitle": "Radio Host & Travel Curator",
            "description": "Kenya's premier radio host and travel enthusiast, recently nominated for Lifestyle Influencer of the Year"
          },
          "address": {
            "@type": "PostalAddress",
            "addressCountry": "KE",
            "addressLocality": "Nairobi"
          },
          "contactPoint": {
            "@type": "ContactPoint",
            "telephone": "+254-XXX-XXXX",
            "contactType": "customer service",
            "email": "hello@travelwithmuchina.com"
          },
          "sameAs": [
            "https://www.instagram.com/muchinaMalomba",
            "https://www.twitter.com/MuchinaMalomba",
            "https://www.facebook.com/TravelWithMuchina"
          ],
          "offers": {
            "@type": "Offer",
            "category": "Travel Services",
            "description": "Adventure trips, safari tours, and travel experiences across Kenya and East Africa"
          }
        })}
      </script>

      <link rel="icon" type="image/x-icon" href="/favicon.ico" />
      <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
      <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
      <link rel="manifest" href="/site.webmanifest" />
      <meta name="theme-color" content="#f97316" />
    </Helmet>
  );
}