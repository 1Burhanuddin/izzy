
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, User, Mail, LogOut, Package, CheckCircle, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { getOrderStatusBadge } from '@/utils/orderUtils';

type Order = {
  id: string;
  status: string;
  created_at: string;
  total_amount: number;
  payment_status: string;
  updated_at: string;
};

const UserProfile: React.FC = () => {
  const { user, profile, signOut, isLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user && !isLoading) {
      navigate('/login');
    } else if (user) {
      fetchOrders();
    }
  }, [user, isLoading, navigate]);

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      setLoadingOrders(true);
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching orders:', error);
        toast.error(`Error fetching orders: ${error.message}`);
        return;
      }

      setOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error(`Error fetching orders: ${error.message}`);
    } finally {
      setLoadingOrders(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const goBack = () => {
    navigate(-1);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!user) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Please Sign In</h2>
          <p className="mb-4">You need to be signed in to view your profile.</p>
          <Button onClick={() => navigate('/login')}>
            Go to Login
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center"
          onClick={goBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-6 border-b">
            <h1 className="text-2xl font-bold">My Profile</h1>
          </div>
          
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <div className="flex flex-col items-center">
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center mb-4">
                      <User className="h-12 w-12 text-gray-400" />
                    </div>
                    <h2 className="text-xl font-medium mb-1">{profile?.username || user.email?.split('@')[0]}</h2>
                    <div className="flex items-center text-gray-500 mb-4">
                      <Mail className="h-4 w-4 mr-1" />
                      <span>{user.email}</span>
                    </div>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleSignOut}
                    >
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="md:col-span-2">
                <h3 className="text-xl font-semibold mb-4">Order History</h3>
                {loadingOrders ? (
                  <div className="py-4 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-800"></div>
                  </div>
                ) : orders.length > 0 ? (
                  <div className="space-y-4">
                    {orders.map((order: Order) => (
                      <div key={order.id} className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-medium">Order #{order.id.substring(0, 8)}</span>
                          {getOrderStatusBadge(order.status)}
                        </div>
                        <div className="text-sm text-gray-500">
                          <p>Date: {new Date(order.created_at).toLocaleDateString()}</p>
                          <p>Total: ₹{order.total_amount.toFixed(2)}</p>
                          <p>Payment Status: {order.payment_status}</p>
                        </div>
                        {order.status === 'shipped' && (
                          <div className="mt-2 text-sm text-blue-600 flex items-center">
                            <Package className="h-4 w-4 mr-1" />
                            <span>Your order has been shipped and is on its way!</span>
                          </div>
                        )}
                        {order.status === 'delivered' && (
                          <div className="mt-2 text-sm text-green-600 flex items-center">
                            <CheckCircle className="h-4 w-4 mr-1" />
                            <span>Your order has been delivered. Thank you for shopping with us!</span>
                          </div>
                        )}
                        {order.status === 'processing' && (
                          <div className="mt-2 text-sm text-blue-600 flex items-center">
                            <Package className="h-4 w-4 mr-1" />
                            <span>Your order is being processed!</span>
                          </div>
                        )}
                        {order.status === 'cancelled' && (
                          <div className="mt-2 text-sm text-red-600 flex items-center">
                            <X className="h-4 w-4 mr-1" />
                            <span>Your order has been cancelled.</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center bg-gray-50 rounded-lg">
                    <p className="text-gray-500">
                      You haven't placed any orders yet.
                    </p>
                    <Button 
                      className="mt-4" 
                      onClick={() => navigate('/products/glass')}
                    >
                      Start Shopping
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default UserProfile;
