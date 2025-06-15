
import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  Landmark, 
  Phone, 
  ShieldCheck,
  AlertCircle,
  Loader2,
  AlertTriangle,
  Info
} from 'lucide-react';
import UPIPayment from '@/components/payment/UPIPayment';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const canceled = searchParams.get('canceled');
  
  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });

  useEffect(() => {
    // Check if user is authenticated
    if (!user) {
      toast.error('Please sign in to continue with checkout');
      navigate('/login', { state: { returnTo: '/checkout' } });
      return;
    }

    // Check if cart is empty
    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart', { replace: true });
      return;
    }

    if (canceled) {
      toast.error('Payment was canceled. Please try again.');
    }
    
    if (user?.email) {
      setFormData(prev => ({...prev, email: user.email || ''}));
    }
  }, [canceled, user, cartItems, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast.error('You must be logged in to checkout');
      navigate('/login');
      return;
    }

    if (cartItems.length === 0) {
      toast.error('Your cart is empty');
      navigate('/cart');
      return;
    }

    const requiredFields = ['name', 'email', 'phone', 'address', 'city', 'state', 'pincode'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast.error(`Please fill in all required fields: ${missingFields.join(', ')}`);
      return;
    }

    if (paymentMethod === 'upi' && !upiId) {
      toast.error('Please enter a valid UPI ID');
      return;
    }

    setError(null);
    try {
      setLoading(true);

      const shippingAddress = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode
      };

      if (paymentMethod === 'upi') {
        // Handle UPI payment method
        try {
          // Create a direct order in the database
          const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
              user_id: user.id,
              total_amount: cartTotal,
              payment_method: 'upi',
              shipping_address: shippingAddress,
              status: 'pending',
              payment_status: 'pending',
              transaction_id: `UPI_${Date.now()}`
            })
            .select()
            .single();
          
          if (orderError) {
            throw new Error(`Failed to create order: ${orderError.message}`);
          }
          
          // Create order items
          const orderItems = cartItems.map(item => ({
            order_id: order.id,
            product_id: item.product_id,
            quantity: item.quantity,
            price: item.product.price
          }));
          
          const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems);
          
          if (itemsError) {
            throw new Error(`Failed to create order items: ${itemsError.message}`);
          }
          
          // Save order ID and redirect to confirmation page
          localStorage.setItem('pendingOrderId', order.id);
          await clearCart();
          toast.success('Order placed successfully!');
          navigate('/order-confirmation');
        } catch (error: any) {
          console.error('Error creating UPI order:', error);
          setError(`Failed to create order: ${error.message}`);
          toast.error(`Failed to create order: ${error.message}`);
        }
      } else {
        setError('This payment method is not implemented yet');
        toast.error('This payment method is not implemented yet');
      }
    } catch (error: any) {
      console.error('Error processing order:', error);
      setError(`Failed to process your order: ${error.message || 'Unknown error'}`);
      toast.error('Failed to process your order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Redirect if not authenticated or cart is empty
  if (!user || cartItems.length === 0) {
    return null; // Will be redirected in useEffect
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {canceled && (
          <Alert variant="destructive" className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your payment was canceled. You can try again by proceeding to checkout.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <form onSubmit={handleSubmit}>
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="address">Address</Label>
                    <Input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="state">State</Label>
                      <Input
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="pincode">Pincode</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Payment Method</h2>
                
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-3"
                >
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="upi" id="upi" />
                    <Label htmlFor="upi" className="flex items-center cursor-pointer">
                      <Phone className="mr-2 h-5 w-5 text-green-500" />
                      <span>UPI</span>
                    </Label>
                  </div>
                  
                  <div className="flex items-center space-x-2 border rounded-md p-3 cursor-pointer hover:bg-gray-50">
                    <RadioGroupItem value="banking" id="banking" />
                    <Label htmlFor="banking" className="flex items-center cursor-pointer">
                      <Landmark className="mr-2 h-5 w-5 text-purple-500" />
                      <span>Net Banking</span>
                    </Label>
                  </div>
                </RadioGroup>

                {paymentMethod === 'upi' && (
                  <div className="mt-4">
                    <UPIPayment upiId={upiId} setUpiId={setUpiId} amount={cartTotal} />
                  </div>
                )}

                {paymentMethod !== 'upi' && (
                  <div className="mt-4 p-4 bg-gray-100 rounded-md text-center">
                    <p className="text-gray-500">This payment method is currently unavailable</p>
                  </div>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            </form>
          </div>

          <div>
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
              
              <div className="divide-y">
                {cartItems.map((item) => (
                  <div key={item.id} className="py-3 flex justify-between">
                    <div>
                      <p className="font-medium">{item.product.name}</p>
                      <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">Free</span>
                </div>
                <div className="border-t pt-2 mt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>₹{cartTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 bg-gray-50 p-4 rounded-md flex items-start">
                <ShieldCheck className="h-5 w-5 text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                <p className="text-sm text-gray-600">
                  Your personal data will be used to process your order, support your experience, and for other purposes described in our privacy policy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Checkout;
