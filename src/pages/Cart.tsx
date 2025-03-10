
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { toast } from 'sonner';

const Cart = () => {
  const { cartItems, cartTotal, isLoading, removeFromCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (!user) {
      toast.error('Please sign in to checkout');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    navigate('/checkout');
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="min-h-[60vh] flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        {cartItems.length === 0 ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-center">
            <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
            <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-6">Looks like you haven't added anything to your cart yet.</p>
            <Button asChild>
              <Link to="/products/glass">Start Shopping</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-4 border-b">
                  <div className="grid grid-cols-12 gap-4 font-semibold text-gray-600">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2">Price</div>
                    <div className="col-span-2">Quantity</div>
                    <div className="col-span-2">Total</div>
                  </div>
                </div>
                <div className="divide-y">
                  {cartItems.map((item) => (
                    <div key={item.id} className="p-4">
                      <div className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-6">
                          <div className="flex items-center">
                            <div className="w-16 h-16 rounded overflow-hidden bg-gray-100 flex-shrink-0">
                              {item.product.image ? (
                                <img
                                  src={item.product.image}
                                  alt={item.product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <span className="text-gray-500 text-sm">No image</span>
                                </div>
                              )}
                            </div>
                            <div className="ml-4 overflow-hidden">
                              <h3 className="text-sm font-medium truncate">{item.product.name}</h3>
                              <p className="text-xs text-gray-500 mt-1 truncate">{item.product.category}</p>
                            </div>
                          </div>
                        </div>
                        <div className="col-span-2">
                          <span className="text-sm font-medium">₹{item.product.price.toFixed(2)}</span>
                        </div>
                        <div className="col-span-2">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 border rounded-l-md bg-gray-100 hover:bg-gray-200"
                              aria-label="Decrease quantity"
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-3 py-1 border-y text-sm">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 border rounded-r-md bg-gray-100 hover:bg-gray-200"
                              aria-label="Increase quantity"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>
                        <div className="col-span-2 flex items-center justify-between">
                          <span className="text-sm font-medium">
                            ₹{(item.product.price * item.quantity).toFixed(2)}
                          </span>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                            aria-label="Remove item"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
                <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="border-t pt-2 mt-2">
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={handleProceedToCheckout}
                  className="w-full"
                  disabled={cartItems.length === 0}
                >
                  Checkout
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="w-full mt-2"
                >
                  <Link to="/products/glass">Continue Shopping</Link>
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cart;
