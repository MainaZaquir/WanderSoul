import { X, Download, MapPin, Clock, Star, ShoppingCart } from 'lucide-react';
import { Product } from '../lib/supabase';

interface ProductModalProps {
  product: Product;
  onClose: () => void;
  onAddToCart: (product: Product) => void;
}

export function ProductModal({ product, onClose, onAddToCart }: ProductModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">{product.name}</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid md:grid-cols-2 gap-8 p-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative h-80 rounded-lg overflow-hidden">
              <img
                src={product.images[0] || 'https://images.pexels.com/photos/346768/pexels-photo-346768.jpeg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  product.category === 'physical' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {product.category === 'physical' ? 'Physical Product' : 'Digital Download'}
                </span>
              </div>
              {product.category === 'digital' && (
                <div className="absolute top-4 right-4 bg-white bg-opacity-90 p-2 rounded-full">
                  <Download size={20} className="text-gray-700" />
                </div>
              )}
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(1, 5).map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${product.name} ${index + 2}`}
                    className="w-full h-20 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-3xl font-bold text-teal-600">
                  ${product.price}
                </span>
                {product.category === 'physical' && (
                  <span className="text-sm text-gray-600">
                    {product.stock_quantity > 0 
                      ? `${product.stock_quantity} in stock` 
                      : 'Out of stock'
                    }
                  </span>
                )}
              </div>
              
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {product.category === 'digital' && (
              <div className="space-y-4">
                {product.destination && (
                  <div className="flex items-center text-gray-700">
                    <MapPin size={20} className="mr-3 text-teal-600" />
                    <span className="font-medium">{product.destination}</span>
                  </div>
                )}
                
                {product.duration && (
                  <div className="flex items-center text-gray-700">
                    <Clock size={20} className="mr-3 text-teal-600" />
                    <span className="font-medium">{product.duration}</span>
                  </div>
                )}

                {product.highlights && product.highlights.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">What's Included:</h4>
                    <ul className="space-y-2">
                      {product.highlights.map((highlight, index) => (
                        <li key={index} className="flex items-center text-gray-700">
                          <Star size={16} className="mr-3 text-orange-400" />
                          {highlight}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {product.category === 'physical' && (
              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-semibold text-blue-900 mb-2">Product Features:</h4>
                <ul className="text-sm text-blue-800 space-y-1">
                  <li>• Durable, weather-resistant materials</li>
                  <li>• Ergonomic design for comfort</li>
                  <li>• Multiple compartments for organization</li>
                  <li>• Tested on African adventures</li>
                </ul>
              </div>
            )}

            {product.category === 'digital' && (
              <div className="bg-green-50 p-4 rounded-lg">
                <h4 className="font-semibold text-green-900 mb-2">Digital Package Includes:</h4>
                <ul className="text-sm text-green-800 space-y-1">
                  <li>• Detailed day-by-day itinerary</li>
                  <li>• Recommended accommodations</li>
                  <li>• Local restaurant suggestions</li>
                  <li>• Transportation options</li>
                  <li>• Cultural tips and insights</li>
                  <li>• Emergency contacts and resources</li>
                </ul>
              </div>
            )}

            <div className="flex space-x-4">
              <button
                onClick={() => onAddToCart(product)}
                disabled={product.category === 'physical' && product.stock_quantity <= 0}
                className={`flex-1 flex items-center justify-center space-x-2 py-4 px-6 rounded-lg font-semibold transition-all duration-300 ${
                  product.category === 'physical' && product.stock_quantity <= 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-orange-500 hover:bg-orange-600 text-white transform hover:scale-105'
                }`}
              >
                {product.category === 'digital' ? (
                  <>
                    <Download size={20} />
                    <span>Buy & Download Now</span>
                  </>
                ) : (
                  <>
                    <ShoppingCart size={20} />
                    <span>
                      {product.stock_quantity <= 0 ? 'Out of Stock' : 'Add to Cart'}
                    </span>
                  </>
                )}
              </button>
            </div>

            {product.category === 'digital' && (
              <div className="text-sm text-gray-600">
                <p>• Instant download after purchase</p>
                <p>• PDF format compatible with all devices</p>
                <p>• Lifetime access to your purchase</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}