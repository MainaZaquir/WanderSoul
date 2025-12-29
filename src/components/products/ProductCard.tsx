
import { useState } from 'react';
import { ShoppingCart, Download, MapPin, Clock, Eye } from 'lucide-react';
import { Product } from '../../types/product';
import { ProductImageGallery } from './ProductImageGallery';
import { formatPrice } from '../../lib/currency';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onViewDetails: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart, onViewDetails }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  const isOutOfStock = product.category === 'physical' && product.stock_quantity <= 0;
  const isDigital = product.category === 'digital';

  return (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image */}
      <div className="relative h-64">
        <ProductImageGallery
          images={product.images}
          productName={product.name}
          className="h-full"
        />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium shadow-lg ${
            isDigital 
              ? 'bg-green-100 text-green-800' 
              : 'bg-blue-100 text-blue-800'
          }`}>
            {isDigital ? 'Digital' : 'Physical'}
          </span>
        </div>

        {/* Digital Download Icon */}
        {isDigital && (
          <div className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded-full shadow-lg">
            <Download size={16} className="text-gray-700" />
          </div>
        )}

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="bg-red-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Quick View Button */}
        <div className={`absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}>
          <button
            onClick={() => onViewDetails(product)}
            className="bg-white text-gray-900 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 flex items-center space-x-2"
          >
            <Eye size={16} />
            <span>Quick View</span>
          </button>
        </div>
      </div>
      
      {/* Product Details */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-orange-600 transition-colors duration-300">
          {product.name}
        </h3>
        
        <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
          {product.description}
        </p>
        
        {/* Digital Product Info */}
        {isDigital && (
          <div className="space-y-2 mb-4">
            {product.destination && (
              <div className="flex items-center text-gray-600">
                <MapPin size={14} className="mr-2 text-teal-600" />
                <span className="text-sm font-medium">{product.destination}</span>
              </div>
            )}
            {product.duration && (
              <div className="flex items-center text-gray-600">
                <Clock size={14} className="mr-2 text-teal-600" />
                <span className="text-sm font-medium">{product.duration}</span>
              </div>
            )}
          </div>
        )}

        {/* Highlights */}
        {product.highlights && product.highlights.length > 0 && (
          <div className="mb-4">
            <div className="flex flex-wrap gap-1">
              {product.highlights.slice(0, 3).map((highlight, index) => (
                <span key={index} className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                  {highlight}
                </span>
              ))}
              {product.highlights.length > 3 && (
                <span className="text-xs text-gray-500 px-2 py-1">
                  +{product.highlights.length - 3} more
                </span>
              )}
            </div>
          </div>
        )}

        {/* Price and Actions */}
        <div className="flex items-center justify-between">
          <div>
            <span className="text-2xl font-bold text-teal-600">
              {formatPrice(product.price)}
            </span>
            {!isDigital && (
              <p className="text-xs text-gray-500 mt-1">
                {product.stock_quantity > 0 
                  ? `${product.stock_quantity} in stock` 
                  : 'Out of stock'
                }
              </p>
            )}
          </div>
          
          <button
            onClick={() => onAddToCart(product)}
            disabled={isOutOfStock}
            className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 ${
              isOutOfStock
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-orange-500 hover:bg-orange-600 text-white transform hover:scale-105 shadow-lg hover:shadow-orange-500/25'
            }`}
          >
            {isDigital ? (
              <>
                <Download size={16} />
                <span>Buy Now</span>
              </>
            ) : (
              <>
                <ShoppingCart size={16} />
                <span>{isOutOfStock ? 'Sold Out' : 'Add to Cart'}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}