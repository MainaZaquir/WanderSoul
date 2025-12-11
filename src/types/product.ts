export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'digital' | 'physical';
  type: 'digital' | 'physical' | 'rucksack' | 'itinerary' | 'gear';
  images: string[];
  digital_file_url?: string;
  destination?: string;
  duration?: string;
  highlights?: string[];
  is_active: boolean;
  stock_quantity: number;
  created_at: string;
  updated_at: string;
}

export interface ProductFilters {
  category?: 'all' | 'digital' | 'physical';
  priceRange?: [number, number];
  destination?: string;
  searchTerm?: string;
}

export interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}