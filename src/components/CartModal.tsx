import { useState } from 'react';
import { X, Plus, Minus, Trash2, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../hooks/useAuth';
import { supabase } from '../lib/supabase';
import { formatPrice } from '../lib/currency';
import toast from 'react-hot-toast';
import { ManualPaymentForm } from './ManualPaymentForm';

interface CartModalProps {
  onClose: () => void;
}

export function CartModal({ onClose }: CartModalProps) {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice } = useCart();
  const { user } = useAuth();
  const [step, setStep] = useState<'cart' | 'checkout'>('cart');
  const [loading, setLoading] = useState(false);
  const [orderReference, setOrderReference] = useState('');

  const totalPrice = getTotalPrice();
  const hasPhysicalItems = cartItems.some(item => item.product.category === 'physical');

  const generateOrderReference = () => `ORD${Date.now().toString().slice(-8)}`;

  const handleCheckout = async () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      return;
    }

    setLoading(true);
    try {
      const reference = generateOrderReference();

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_reference: reference,
          total_amount: totalPrice,
          payment_method: 'mpesa',
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

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
      setStep('checkout');
    } catch (err) {
      console.error(err);
      toast.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  const handleManualPaymentSubmit = async (details: {
    fullName: string;
    email: string;
    phone: string;
    mpesaCode: string;
  }) => {
    try {
      await supabase
        .from('orders')
        .update({
          payment_reference: details.mpesaCode,
          shipping_address: {
            full_name: details.fullName,
            email: details.email,
            phone: details.phone,
            manual_payment: true,
          },
        })
        .eq('order_reference', orderReference);

      clearCart();
      toast.success('Order submitted successfully');
      onClose();
    } catch (err) {
      console.error(err);
      toast.error('Failed to submit payment details');
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center overflow-y-auto">
      <div
        className="
          w-full
          sm:max-w-4xl
          h-full
          sm:h-auto
          sm:max-h-[90vh]
          bg-white
          sm:rounded-2xl
          overflow-y-auto
          overscroll-contain
        "
      >
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold">
              {step === 'cart' ? 'Shopping Cart' : 'Checkout & Payment'}
            </h2>
            <p className="text-sm text-gray-500">
              {step === 'cart'
                ? `${cartItems.length} item${cartItems.length !== 1 ? 's' : ''}`
                : 'Submit M-Pesa payment details'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <X />
          </button>
        </div>

        {/* Empty cart */}
        {cartItems.length === 0 && step === 'cart' && (
          <div className="p-6 sm:p-8 text-center">
            <ShoppingCart className="mx-auto text-gray-400 mb-4" size={40} />
            <h3 className="text-xl font-semibold mb-2">Your cart is empty</h3>
            <button onClick={onClose} className="btn-primary w-full">
              Continue Shopping
            </button>
          </div>
        )}

        {/* Cart */}
        {step === 'cart' && cartItems.length > 0 && (
          <div className="p-4 sm:p-6 lg:p-8 space-y-6">
            {cartItems.map(item => (
              <div key={item.product.id} className="flex gap-4 bg-gray-50 p-4 rounded-xl">
                <img
                  src={item.product.images[0]}
                  className="w-20 h-20 rounded-lg object-cover"
                />

                <div className="flex-1">
                  <h3 className="font-semibold">{item.product.name}</h3>
                  <p className="text-sm text-gray-500 line-clamp-2">
                    {item.product.description}
                  </p>

                  {item.product.category === 'physical' && (
                    <div className="flex items-center gap-2 mt-2">
                      <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>
                        <Minus size={16} />
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>
                        <Plus size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="text-right">
                  <p className="font-bold">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-500 mt-2"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}

            <div className="bg-orange-50 p-4 rounded-xl space-y-4">
              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>

              <div className="flex gap-4">
                <button onClick={clearCart} className="btn-outline flex-1">
                  Clear
                </button>
                <button onClick={() => setStep('checkout')} className="btn-primary flex-1">
                  Checkout
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Checkout */}
        {step === 'checkout' && (
          <div className="p-4 sm:p-6 lg:p-8 space-y-8">
            <ManualPaymentForm
              amount={totalPrice}
              description={orderReference || 'Order Payment'}
              tillNumber="6928821"
              initialName={user?.user_metadata?.full_name || ''}
              initialEmail={user?.email || ''}
              onSubmit={handleManualPaymentSubmit}
            />

            {hasPhysicalItems && (
              <div className="bg-blue-50 p-4 rounded-xl text-sm">
                Shipping details will be collected after payment confirmation.
              </div>
            )}

            <div className="flex gap-4">
              <button onClick={() => setStep('cart')} className="btn-outline flex-1">
                Back
              </button>
              <button
                onClick={handleCheckout}
                disabled={loading}
                className="btn-secondary flex-1"
              >
                {loading ? 'Preparing...' : 'Generate Order'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
