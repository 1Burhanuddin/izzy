
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Check, 
  Clock, 
  Search, 
  TruckIcon, 
  Package, 
  X, 
  ArrowUpDown,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type Order = {
  id: string;
  created_at: string;
  user_id: string;
  total_amount: number;
  payment_method: string;
  payment_status: string;
  status: string;
  shipping_address: any;
  transaction_id: string | null;
  user_email?: string;
};

const OrderManagement = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<any[]>([]);

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
    } else {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Fetch orders
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order(sortBy, { ascending: sortDirection === 'asc' });

      if (ordersError) throw ordersError;

      // Get user emails for each order
      const userIds = [...new Set(ordersData.map(order => order.user_id))];
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('id, username')
        .in('id', userIds);

      if (profilesError) throw profilesError;

      // Map profile data to orders
      const ordersWithUserData = ordersData.map(order => {
        const profile = profilesData.find(profile => profile.id === order.user_id);
        return {
          ...order,
          user_email: profile?.username || 'Unknown'
        };
      });

      setOrders(ordersWithUserData);
    } catch (error: any) {
      console.error('Error fetching orders:', error);
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const handleViewOrder = async (order: Order) => {
    setSelectedOrder(order);
    
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select(`
          id,
          quantity,
          price,
          products (
            id,
            name,
            image
          )
        `)
        .eq('order_id', order.id);

      if (error) throw error;
      setOrderItems(data || []);
    } catch (error: any) {
      console.error('Error fetching order items:', error);
      toast.error('Failed to fetch order details');
    }
  };

  const handleUpdateStatus = async (orderId: string, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) throw error;
      
      setOrders(orders.map(order => 
        order.id === orderId ? { ...order, status } : order
      ));
      
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...selectedOrder, status });
      }
      
      toast.success(`Order status updated to ${status}`);
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error('Failed to update order status');
    }
  };

  const closeModal = () => {
    setSelectedOrder(null);
    setOrderItems([]);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'processing':
        return <Package className="h-5 w-5 text-blue-500" />;
      case 'shipped':
        return <TruckIcon className="h-5 w-5 text-purple-500" />;
      case 'delivered':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <X className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-gray-500" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      order.id.toLowerCase().includes(searchTermLower) ||
      (order.user_email && order.user_email.toLowerCase().includes(searchTermLower)) ||
      order.status.toLowerCase().includes(searchTermLower) ||
      order.payment_status.toLowerCase().includes(searchTermLower) ||
      (order.transaction_id && order.transaction_id.toLowerCase().includes(searchTermLower))
    );
  });

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Order Management</h1>
            <p className="text-gray-600">
              View and manage customer orders
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search orders by ID, customer, status..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>

        {/* Orders table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('id')}>
                    <div className="flex items-center">
                      Order ID
                      {sortBy === 'id' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('created_at')}>
                    <div className="flex items-center">
                      Date
                      {sortBy === 'created_at' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3">Customer</th>
                  <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('total_amount')}>
                    <div className="flex items-center">
                      Amount
                      {sortBy === 'total_amount' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('status')}>
                    <div className="flex items-center">
                      Status
                      {sortBy === 'status' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('payment_status')}>
                    <div className="flex items-center">
                      Payment
                      {sortBy === 'payment_status' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id.substring(0, 8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.user_email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      ₹{order.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {getStatusIcon(order.status)}
                        <span className="ml-2 text-sm capitalize">
                          {order.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        order.payment_status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : order.payment_status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {order.payment_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-medium mb-2">No orders found</h2>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'No orders match your search criteria.' : 'There are no orders yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">
                Order Details <span className="text-gray-500">#{selectedOrder.id.substring(0, 8)}</span>
              </h2>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-medium mb-2">Order Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm mb-1"><span className="font-medium">Order ID:</span> #{selectedOrder.id}</p>
                    <p className="text-sm mb-1"><span className="font-medium">Date:</span> {formatDate(selectedOrder.created_at)}</p>
                    <p className="text-sm mb-1"><span className="font-medium">Customer:</span> {selectedOrder.user_email}</p>
                    <p className="text-sm mb-1"><span className="font-medium">Payment Method:</span> {selectedOrder.payment_method}</p>
                    <p className="text-sm mb-1">
                      <span className="font-medium">Payment Status:</span> 
                      <span className={`ml-1 ${
                        selectedOrder.payment_status === 'completed' ? 'text-green-600' : 'text-yellow-600'
                      }`}>
                        {selectedOrder.payment_status}
                      </span>
                    </p>
                    {selectedOrder.transaction_id && (
                      <p className="text-sm mb-1"><span className="font-medium">Transaction ID:</span> {selectedOrder.transaction_id}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Shipping Information</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {selectedOrder.shipping_address ? (
                      <>
                        <p className="text-sm mb-1"><span className="font-medium">Name:</span> {selectedOrder.shipping_address.name}</p>
                        <p className="text-sm mb-1"><span className="font-medium">Email:</span> {selectedOrder.shipping_address.email}</p>
                        <p className="text-sm mb-1"><span className="font-medium">Phone:</span> {selectedOrder.shipping_address.phone}</p>
                        <p className="text-sm mb-1"><span className="font-medium">Address:</span> {selectedOrder.shipping_address.address}</p>
                        <p className="text-sm mb-1"><span className="font-medium">City:</span> {selectedOrder.shipping_address.city}</p>
                        <p className="text-sm mb-1"><span className="font-medium">State:</span> {selectedOrder.shipping_address.state}</p>
                        <p className="text-sm mb-1"><span className="font-medium">Pincode:</span> {selectedOrder.shipping_address.pincode}</p>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500">No shipping information available</p>
                    )}
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium mb-2">Order Items</h3>
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                {orderItems.length > 0 ? (
                  <div className="divide-y">
                    {orderItems.map((item) => (
                      <div key={item.id} className="py-3 flex items-center">
                        <div className="w-12 h-12 bg-white rounded border overflow-hidden mr-3">
                          {item.products?.image ? (
                            <img src={item.products.image} alt={item.products.name} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400">No img</div>
                          )}
                        </div>
                        <div className="flex-grow">
                          <p className="font-medium">{item.products?.name || 'Unknown Product'}</p>
                          <p className="text-sm text-gray-500">Quantity: {item.quantity} × ₹{item.price.toFixed(2)}</p>
                        </div>
                        <div className="font-medium">
                          ₹{(item.quantity * item.price).toFixed(2)}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">No items found for this order</p>
                )}
                
                <div className="mt-4 pt-4 border-t flex justify-between">
                  <span className="font-medium">Total:</span>
                  <span className="font-bold">₹{selectedOrder.total_amount.toFixed(2)}</span>
                </div>
              </div>
              
              <h3 className="font-medium mb-2">Update Order Status</h3>
              <div className="bg-gray-50 p-4 rounded-lg flex flex-wrap gap-2">
                <Button 
                  variant={selectedOrder.status === 'pending' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'pending')}
                  className="flex items-center"
                >
                  <Clock className="mr-1 h-4 w-4" />
                  Pending
                </Button>
                <Button 
                  variant={selectedOrder.status === 'processing' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                  className="flex items-center"
                >
                  <Package className="mr-1 h-4 w-4" />
                  Processing
                </Button>
                <Button 
                  variant={selectedOrder.status === 'shipped' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'shipped')}
                  className="flex items-center"
                >
                  <TruckIcon className="mr-1 h-4 w-4" />
                  Shipped
                </Button>
                <Button 
                  variant={selectedOrder.status === 'delivered' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                  className="flex items-center"
                >
                  <Check className="mr-1 h-4 w-4" />
                  Delivered
                </Button>
                <Button 
                  variant={selectedOrder.status === 'cancelled' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                  className="flex items-center text-red-500 hover:text-red-600"
                >
                  <X className="mr-1 h-4 w-4" />
                  Cancelled
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default OrderManagement;
