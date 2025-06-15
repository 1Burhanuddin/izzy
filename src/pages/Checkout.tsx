import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { 
  ShieldCheck,
  AlertCircle,
  Loader2,
  CheckCircle2,
  Clock
} from 'lucide-react';
import UPIPayment from '@/components/payment/UPIPayment';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Checkout = () => {
  const { cartItems, cartTotal, clearCart } = useCart();
  const { user, session } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const canceled = searchParams.get('canceled');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [orderCreated, setOrderCreated] = useState(false);
  const [pendingOrderId, setPendingOrderId] = useState<string | null>(null);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [checkingPayment, setCheckingPayment] = useState(false);
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

  // Auto-check payment status when payment is initiated
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (paymentInitiated && pendingOrderId) {
      setCheckingPayment(true);
      console.log('Starting payment verification for order:', pendingOrderId);
      
      interval = setInterval(async () => {
        try {
          const { data: order, error } = await supabase
            .from('orders')
            .select('payment_status, status')
            .eq('id', pendingOrderId)
            .single();
            
          if (error) {
            console.error('Error checking payment status:', error);
            return;
          }
          
          console.log('Payment status check:', order);
          
          // In a real implementation, you would check with your payment gateway
          // For demo purposes, we'll simulate a successful payment after some time
          // You would replace this with actual payment gateway verification
          
          if (order && order.payment_status === 'completed') {
            clearInterval(interval);
            setCheckingPayment(false);
            await clearCart();
            localStorage.setItem('pendingOrderId', pendingOrderId);
            toast.success('Payment confirmed! Your order has been placed successfully.');
            navigate('/order-confirmation');
          }
        } catch (error) {
          console.error('Error in payment verification:', error);
        }
      }, 3000); // Check every 3 seconds
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [paymentInitiated, pendingOrderId, clearCart, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handlePaymentInitiated = () => {
    setPaymentInitiated(true);
    toast.info('Payment initiated. We are automatically checking for confirmation...');
  };

  const handlePaymentTimeout = async () => {
    // Cancel the pending order and reset state
    if (pendingOrderId) {
      try {
        await supabase
          .from('orders')
          .update({ status: 'cancelled', payment_status: 'failed' })
          .eq('id', pendingOrderId);
          
        toast.error('Payment timeout. Order has been cancelled. Please try again.');
      } catch (error) {
        console.error('Error cancelling order:', error);
      }
    }
    
    setPaymentInitiated(false);
    setOrderCreated(false);
    setPendingOrderId(null);
    setCheckingPayment(false);
  };

  const createPendingOrder = async () => {
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

      // Create a pending order in the database
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: cartTotal,
          payment_method: 'upi',
          shipping_address: shippingAddress,
          status: 'pending',
          payment_status: 'pending',
          transaction_id: `UPI_PENDING_${Date.now()}`
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
      
      setPendingOrderId(order.id);
      setOrderCreated(true);
      toast.success('Order created! Please complete the payment using UPI.');
      
    } catch (error: any) {
      console.error('Error creating order:', error);
      setError(`Failed to create order: ${error.message}`);
      toast.error(`Failed to create order: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!orderCreated) {
      await createPendingOrder();
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

        {orderCreated && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <CheckCircle2 className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              Order created successfully! Please complete the payment using the UPI options below. We will automatically detect when your payment is confirmed.
            </AlertDescription>
          </Alert>
        )}

        {checkingPayment && (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Clock className="h-4 w-4 text-blue-600" />
            <AlertDescription className="text-blue-800">
              <div className="flex items-center">
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Checking payment status... Please wait while we verify your payment.
              </div>
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
                      disabled={orderCreated}
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
                        disabled={orderCreated}
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
                        disabled={orderCreated}
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
                      disabled={orderCreated}
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
                        disabled={orderCreated}
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
                        disabled={orderCreated}
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
                      disabled={orderCreated}
                    />
                  </div>
                </div>
              </div>

              {!orderCreated && (
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Creating Order...
                    </>
                  ) : (
                    'Create Order'
                  )}
                </Button>
              )}
            </form>

            {orderCreated && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold mb-4">Complete Payment</h2>
                <UPIPayment 
                  upiId=""
                  setUpiId={() => {}}
                  amount={cartTotal}
                  onPaymentInitiated={handlePaymentInitiated}
                  onPaymentTimeout={handlePaymentTimeout}
                  orderId={pendingOrderId || undefined}
                />
              </div>
            )}
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
