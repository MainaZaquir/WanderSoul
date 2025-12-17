
import { ProductCatalog } from '../components/products/ProductCatalog';
import { SEOHead } from '../components/SEOHead';

export function ShopPage() {
  return (
    <>
      <SEOHead
        title="Travel Shop - Premium Gear & Digital Guides"
        description="Shop premium travel gear and digital itineraries curated by Muchina Malomba. From adventure backpacks to detailed travel guides for Kenya and East Africa."
        keywords="travel gear, backpacks, travel guides, Kenya itineraries, safari gear, adventure equipment"
        type="website"
      />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-r from-orange-500 to-teal-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            WanderSoul Backpacks & Guides
          </h1>
          <p className="text-xl text-orange-100 max-w-2xl mx-auto">
            Premium backpacks and digital itineraries curated for the modern African explorer.
          </p>
        </div>
      </section>

      {/* Product Catalog */}
      <ProductCatalog />
    </>
  );
}