import { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart, CreditCard, Smartphone } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { StripePayment } from './StripePayment';
import { MpesaPayment } from './MpesaPayment';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/currency';
import toast from 'react-hot-toast';

interface CartModalProps {
  onClose: () => void;
}

export function CartModal({ onClose }: CartModalProps) {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<'cart' | 'checkout' | 'payment'>('cart');
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'mpesa'>('stripe');
  const [loading, setLoading] = useState(false);
  const [orderReference, setOrderReference] = useState('');

  const totalPrice = getTotalPrice();
  const hasPhysicalItems = cartItems.some(item => item.product.category === 'physical');

  const generateOrderReference = () => {
    return `ORD${Date.now().toString().slice(-8)}`;
  };

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      return;
    }

    setLoading(true);
    try {
      const reference = generateOrderReference();
      
      // Create order
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user.id,
            order_reference: reference,
            total_amount: totalPrice,
            payment_method: paymentMethod,
            status: 'pending',
          },
        ])
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = cartItems.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        unit_price: item.product.price,
        total_price: item.product.price * item.quantity,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      setOrderReference(reference);
      setStep('payment');
      
    } catch (error) {
      console.error('Error creating order:', error);
      toast.error('Failed to create order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentSuccess = async () => {
    try {
      // Update order status
      await supabase
        .from('orders')
        .update({
          payment_status: 'completed',
          status: 'processing',
        })
        .eq('order_reference', orderReference);

      // Clear cart
      clearCart();
      toast.success('Order placed successfully!');
      onClose();
    } catch (error) {
      console.error('Payment success error:', error);
      toast.error('Order completed but there was an issue. Please contact support.');
    }
  };

  if (cartItems.length === 0 && step === 'cart') {
    return (
      <div className="modal-backdrop">
        <div className="modal-content max-w-md">
          <div className="p-8 text-center">
            <div className="flex justify-center mb-6">
              <div className="bg-gray-100 p-4 rounded-full">
                <ShoppingCart className="text-gray-400" size={32} />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Cart is Empty</h2>
            <p className="text-gray-600 mb-6">Add some amazing travel gear or digital guides to get started!</p>
            <button onClick={onClose} className="btn-primary w-full">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-backdrop">
      <div className="modal-content max-w-4xl">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div>
            <h2 className="text-3xl font-bold text-gray-900">
              {step === 'cart' && 'Shopping Cart'}
              {step === 'checkout' && 'Checkout'}
              {step === 'payment' && 'Payment'}
            </h2>
            <p className="text-gray-600 mt-1">
              {step === 'cart' && `${cartItems.length} item${cartItems.length > 1 ? 's' : ''} in your cart`}
              {step === 'checkout' && 'Review your order details'}
              {step === 'payment' && 'Complete your purchase'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl transition-all duration-300"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cart Items */}
        {step === 'cart' && (
          <div className="p-8">
            <div className="space-y-6 mb-8">
              {cartItems.map((item) => (
                <div key={item.product.id} className="flex items-center space-x-6 bg-gray-50 p-6 rounded-2xl">
                  <img
                    src={item.product.images[0] || 'https://images.pexels.com/photos/346768/pexels-photo-346768.jpeg'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{item.product.name}</h3>
                    <p className="text-gray-600 text-sm line-clamp-2">{item.product.description}</p>
                    <div className="flex items-center space-x-2 mt-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.product.category === 'physical' 
                          ? 'bg-blue-100 text-blue-800' 
                          : 'bg-green-100 text-green-800'
                      }`}>
                        {item.product.category === 'physical' ? 'Physical' : 'Digital'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    {item.product.category === 'physical' && (
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-8 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="p-1 text-gray-500 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                    )}
                    
                    <div className="text-right">
                      <p className="text-lg font-bold text-gray-900">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                      {item.quantity > 1 && (
                        <p className="text-sm text-gray-500">
                          {formatPrice(item.product.price)} each
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Cart Summary */}
            <div className="bg-gradient-to-r from-orange-50 to-teal-50 p-8 rounded-2xl border border-orange-200">
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-bold text-gray-900">Total:</span>
                <span className="text-3xl font-bold text-teal-600">{formatPrice(totalPrice)}</span>
              </div>
              
              <div className="flex space-x-4">
                <button
                  onClick={clearCart}
                  className="btn-outline flex-1"
                >
                  Clear Cart
                </button>
                <button
                  onClick={() => setStep('checkout')}
                  className="btn-primary flex-1"
                >
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Checkout */}
        {step === 'checkout' && (
          <div className="p-8 space-y-8">
            {/* Order Summary */}
            <div className="bg-gray-50 p-6 rounded-2xl">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Order Summary</h3>
              <div className="space-y-3">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="flex justify-between">
                    <span className="text-gray-700">
                      {item.product.name} {item.quantity > 1 && `x${item.quantity}`}
                    </span>
                    <span className="font-semibold">
                      {formatPrice(item.product.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-teal-600">{formatPrice(totalPrice)}</span>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Payment Method</h3>
              <div className="grid md:grid-cols-2 gap-6">
                <label className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                  paymentMethod === 'stripe' 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50'
                }`}>
                  <input
                    type="radio"
                    value="stripe"
                    checked={paymentMethod === 'stripe'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'stripe')}
                    className="mr-4 w-5 h-5 text-blue-600"
                  />
                  <CreditCard className="mr-4 text-blue-600" size={28} />
                  <div>
                    <p className="font-semibold text-lg">Credit/Debit Card</p>
                    <p className="text-sm text-gray-600">Pay with Visa, Mastercard, etc.</p>
                  </div>
                </label>

                <label className={`flex items-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${
                  paymentMethod === 'mpesa' 
                    ? 'border-green-500 bg-green-50' 
                    : 'border-gray-200 hover:border-green-300 hover:bg-green-50'
                }`}>
                  <input
                    type="radio"
                    value="mpesa"
                    checked={paymentMethod === 'mpesa'}
                    onChange={(e) => setPaymentMethod(e.target.value as 'mpesa')}
                    className="mr-4 w-5 h-5 text-green-600"
                  />
                  <Smartphone className="mr-4 text-green-600" size={28} />
                  <div>
                    <p className="font-semibold text-lg">M-Pesa</p>
                    <p className="text-sm text-gray-600">Pay with M-Pesa mobile money</p>
                  </div>
                </label>
              </div>
            </div>

            {hasPhysicalItems && (
              <div className="bg-blue-50 p-6 rounded-2xl border border-blue-200">
                <h4 className="font-semibold text-blue-900 mb-3">Shipping Information</h4>
                <p className="text-blue-800 text-sm">
                  Physical items will be shipped to your address. Shipping details will be collected after payment confirmation.
                </p>
              </div>
            )}

            <div className="flex justify-between space-x-6">
              <button
                onClick={() => setStep('cart')}
                className="btn-outline flex-1"
              >
                Back to Cart
              </button>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className={`btn-primary flex-1 ${loading ? 'btn-loading' : ''}`}
              >
                {loading ? 'Processing...' : 'Continue to Payment'}
              </button>
            </div>
          </div>
        )}

        {/* Payment */}
        {step === 'payment' && (
          <div className="p-8 space-y-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-3">Complete Your Purchase</h3>
              <p className="text-gray-600">Order Reference: <span className="font-mono font-bold text-orange-600 bg-orange-50 px-3 py-1 rounded-lg">{orderReference}</span></p>
            </div>

            {paymentMethod === 'stripe' && (
              <StripePayment
                amount={totalPrice}
                orderId={orderReference}
                onSuccess={handlePaymentSuccess}
                onError={(error) => toast.error(error)}
              />
            )}

            {paymentMethod === 'mpesa' && (
              <MpesaPayment
                amount={totalPrice}
                orderId={orderReference}
                onSuccess={handlePaymentSuccess}
                onError={(error) => toast.error(error)}
              />
            )}

            <div className="flex justify-center">
              <button
                onClick={() => setStep('checkout')}
                className="btn-outline"
              >
                Back to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}