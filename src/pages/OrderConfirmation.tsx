
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { CheckCircle, Package, ShoppingBag, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const { session } = useAuth();
  const { clearCart } = useCart();
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(!!sessionId);
  const [orderId, setOrderId] = useState<string | null>(null);

  useEffect(() => {
    // Verify Stripe payment if session_id is present
    if (sessionId && session) {
      verifyPayment();
    }
    
    // If no sessionId, the user probably came from a non-Stripe payment
    // No need to verify payment in that case
  }, [sessionId, session]);

  const verifyPayment = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase.functions.invoke('verify-payment', {
        body: { sessionId },
        headers: {
          Authorization: `Bearer ${session?.access_token}`
        }
      });
      
      if (error) {
        console.error('Error verifying payment:', error);
        toast.error('Unable to verify payment status');
        return;
      }
      
      if (data.paid) {
        setOrderId(data.orderId);
        // Clear cart on successful payment verification
        await clearCart();
        toast.success('Payment confirmed! Your order is being processed.');
      } else {
        toast.error('Payment verification failed. Please contact support.');
        // Optionally redirect to a different page
      }
    } catch (error) {
      console.error('Error in payment verification:', error);
      toast.error('An error occurred while verifying your payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto text-center">
          {loading ? (
            <div className="flex flex-col items-center justify-center">
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
              <h2 className="text-xl font-semibold">Verifying your payment...</h2>
              <p className="text-gray-600 mt-2">Please wait while we confirm your order details.</p>
            </div>
          ) : (
            <>
              <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-green-100 mb-6">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Order Confirmed!</h1>
              
              <p className="text-xl text-gray-600 mb-8">
                Thank you for your order. {orderId && `Your order ID is #${orderId.substring(0, 8)}.`} We're processing your order and will ship it soon.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-center justify-center mt-8">
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link to="/" className="inline-flex items-center">
                    <ShoppingBag className="mr-2 h-4 w-4" />
                    Continue Shopping
                  </Link>
                </Button>
                
                <Button asChild className="w-full sm:w-auto">
                  <Link to="/account" className="inline-flex items-center">
                    <Package className="mr-2 h-4 w-4" />
                    View Your Orders
                  </Link>
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default OrderConfirmation;
