
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Package, Eye, X, Check, ChevronLeft, ChevronRight } from 'lucide-react';

type Order = {
  id: string;
  user_id: string;
  total_amount: number;
  payment_status: string;
  status: string;
  created_at: string;
  payment_method: string;
  transaction_id: string | null;
  shipping_address: any;
  customer_email?: string;
};

type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  price: number;
  product_name?: string;
  product_image?: string;
};

const OrderManagement: React.FC = () => {
  const { isAdmin } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderItemsLoading, setOrderItemsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin, selectedStatus, page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('orders')
        .select('*, profiles(email:username)')
        .order('created_at', { ascending: false })
        .range((page - 1) * ordersPerPage, page * ordersPerPage - 1);

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      const { data: ordersData, error, count } = await query;

      if (error) throw error;

      // Get count for pagination
      const { count: totalCount, error: countError } = await supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });

      if (countError) throw countError;

      // Calculate total pages
      setTotalPages(Math.ceil((totalCount || 0) / ordersPerPage));

      // Format the order data
      const formattedOrders = ordersData.map((order: any) => ({
        ...order,
        customer_email: order.profiles?.email || 'N/A',
      }));

      setOrders(formattedOrders);
    } catch (error: any) {
      toast.error(`Failed to fetch orders: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrderItems = async (orderId: string) => {
    setOrderItemsLoading(true);
    try {
      const { data: items, error } = await supabase
        .from('order_items')
        .select('*, products(name, image)')
        .eq('order_id', orderId);

      if (error) throw error;

      // Format the items with product details
      const formattedItems = items.map((item: any) => ({
        ...item,
        product_name: item.products?.name || 'Unknown Product',
        product_image: item.products?.image || null,
      }));

      setOrderItems(formattedItems);
    } catch (error: any) {
      toast.error(`Failed to fetch order items: ${error.message}`);
    } finally {
      setOrderItemsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
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
      toast.error(`Failed to update order: ${error.message}`);
    }
  };

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    fetchOrderItems(order.id);
  };

  const handleCloseDetails = () => {
    setSelectedOrder(null);
    setOrderItems([]);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pending</Badge>;
      case 'processing':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Processing</Badge>;
      case 'shipped':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Shipped</Badge>;
      case 'delivered':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Delivered</Badge>;
      case 'cancelled':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200">Pending</Badge>;
      case 'completed':
        return <Badge variant="outline" className="bg-green-50 text-green-600 border-green-200">Completed</Badge>;
      case 'failed':
        return <Badge variant="outline" className="bg-red-50 text-red-600 border-red-200">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Order Management</h1>
            <p className="text-gray-600">
              Manage and track customer orders
            </p>
          </div>
        </div>

        {/* Filter by status */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <Button 
              variant={selectedStatus === 'all' ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedStatus('all')}
            >
              All
            </Button>
            <Button 
              variant={selectedStatus === 'pending' ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedStatus('pending')}
            >
              Pending
            </Button>
            <Button 
              variant={selectedStatus === 'processing' ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedStatus('processing')}
            >
              Processing
            </Button>
            <Button 
              variant={selectedStatus === 'shipped' ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedStatus('shipped')}
            >
              Shipped
            </Button>
            <Button 
              variant={selectedStatus === 'delivered' ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedStatus('delivered')}
            >
              Delivered
            </Button>
            <Button 
              variant={selectedStatus === 'cancelled' ? "default" : "outline"} 
              size="sm"
              onClick={() => setSelectedStatus('cancelled')}
            >
              Cancelled
            </Button>
          </div>
        </div>

        {/* Order table or selected order details */}
        {selectedOrder ? (
          <div className="bg-white rounded-lg shadow">
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-xl font-semibold">Order #{selectedOrder.id.substring(0, 8)}</h2>
              <Button variant="ghost" size="sm" onClick={handleCloseDetails}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Order Information</h3>
                  <div className="space-y-2">
                    <p className="text-sm"><span className="font-medium">Order ID:</span> {selectedOrder.id}</p>
                    <p className="text-sm"><span className="font-medium">Date:</span> {new Date(selectedOrder.created_at).toLocaleString()}</p>
                    <p className="text-sm"><span className="font-medium">Customer:</span> {selectedOrder.customer_email}</p>
                    <p className="text-sm"><span className="font-medium">Payment Method:</span> {selectedOrder.payment_method}</p>
                    <p className="text-sm"><span className="font-medium">Total Amount:</span> ₹{selectedOrder.total_amount.toFixed(2)}</p>
                    <div className="text-sm"><span className="font-medium">Payment Status:</span> {getPaymentStatusBadge(selectedOrder.payment_status)}</div>
                    <div className="text-sm"><span className="font-medium">Order Status:</span> {getStatusBadge(selectedOrder.status)}</div>
                    {selectedOrder.transaction_id && (
                      <p className="text-sm"><span className="font-medium">Transaction ID:</span> {selectedOrder.transaction_id}</p>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Address</h3>
                  {selectedOrder.shipping_address ? (
                    <div className="space-y-1">
                      <p className="text-sm">{selectedOrder.shipping_address.name}</p>
                      <p className="text-sm">{selectedOrder.shipping_address.street}</p>
                      <p className="text-sm">{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zipCode}</p>
                      <p className="text-sm">{selectedOrder.shipping_address.phone}</p>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">No shipping address provided</p>
                  )}
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-500 mb-2">Update Order Status</h3>
                <div className="flex flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                    disabled={selectedOrder.status === 'processing'}
                  >
                    Mark Processing
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                    disabled={selectedOrder.status === 'shipped'}
                  >
                    Mark Shipped
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                    disabled={selectedOrder.status === 'delivered'}
                  >
                    Mark Delivered
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="text-red-500 hover:text-red-600"
                    onClick={() => updateOrderStatus(selectedOrder.id, 'cancelled')}
                    disabled={selectedOrder.status === 'cancelled'}
                  >
                    Cancel Order
                  </Button>
                </div>
              </div>
              
              <h3 className="text-lg font-medium mb-3">Order Items</h3>
              {orderItemsLoading ? (
                <div className="flex justify-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                </div>
              ) : orderItems.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Product
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Price
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Quantity
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Subtotal
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orderItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                {item.product_image ? (
                                  <img className="h-10 w-10 rounded-full object-cover" src={item.product_image} alt="" />
                                ) : (
                                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                                    <Package className="h-5 w-5 text-gray-500" />
                                  </div>
                                )}
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.product_name}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">₹{item.price.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.quantity}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">₹{(item.price * item.quantity).toFixed(2)}</div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No items found for this order</p>
              )}
            </div>
          </div>
        ) : (
          <>
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              </div>
            ) : orders.length > 0 ? (
              <>
                <div className="overflow-x-auto bg-white shadow rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Payment Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">#{order.id.substring(0, 8)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{order.customer_email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{new Date(order.created_at).toLocaleDateString()}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">₹{order.total_amount.toFixed(2)}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getPaymentStatusBadge(order.payment_status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(order.status)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleOrderClick(order)}
                              className="text-blue-600 hover:text-blue-800"
                            >
                              <Eye className="h-4 w-4" />
                              <span className="ml-1">View</span>
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center mt-6">
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                        disabled={page === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      <span className="text-sm text-gray-600">
                        Page {page} of {totalPages}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={page === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12 bg-gray-50 rounded-lg">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                  <Package className="h-8 w-8 text-gray-400" />
                </div>
                <h2 className="text-xl font-medium mb-2">No orders found</h2>
                <p className="text-gray-500">
                  {selectedStatus !== 'all'
                    ? `There are no orders with '${selectedStatus}' status`
                    : 'There are no orders placed yet'}
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </Layout>
  );
};

export default OrderManagement;
