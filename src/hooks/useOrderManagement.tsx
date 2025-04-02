
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

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
  updated_at: string;
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

export const useOrderManagement = (isAdmin: boolean) => {
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
      // First, fetch orders with pagination
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .range((page - 1) * ordersPerPage, page * ordersPerPage - 1);

      if (selectedStatus !== 'all') {
        query = query.eq('status', selectedStatus);
      }

      const { data: ordersData, error } = await query;

      if (error) throw error;

      // Get total count for pagination
      const countQuery = supabase
        .from('orders')
        .select('*', { count: 'exact', head: true });
        
      if (selectedStatus !== 'all') {
        countQuery.eq('status', selectedStatus);
      }

      const { count, error: countError } = await countQuery;

      if (countError) throw countError;

      setTotalPages(Math.ceil((count || 0) / ordersPerPage));

      // Fetch user emails for each order separately to avoid relationship errors
      const ordersWithUserEmails = await Promise.all(
        ordersData.map(async (order: Order) => {
          try {
            // Using eq operator and maybeSingle instead of single to avoid errors
            const { data: userData, error: userError } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', order.user_id)
              .maybeSingle();

            if (userError) {
              console.error(`Error fetching user data for order ${order.id}:`, userError);
              return { ...order, customer_email: 'Unknown' };
            }

            return { ...order, customer_email: userData?.username || 'Unknown' };
          } catch (error) {
            console.error(`Error processing order ${order.id}:`, error);
            return { ...order, customer_email: 'Unknown' };
          }
        })
      );

      setOrders(ordersWithUserEmails);
      console.log("Fetched orders:", ordersWithUserEmails);
    } catch (error: any) {
      console.error("Error fetching orders:", error);
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
      const now = new Date().toISOString();
      
      // Step 1: Update the database
      const { error } = await supabase
        .from('orders')
        .update({ 
          status, 
          updated_at: now 
        })
        .eq('id', orderId);

      if (error) {
        console.error("Supabase update error:", error);
        throw error;
      }
      
      // Step 2: Verify the update with a direct fetch
      const { data: updatedOrderData, error: fetchError } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
        
      if (fetchError) {
        console.error("Error fetching updated order:", fetchError);
        throw fetchError;
      }
      
      if (!updatedOrderData || updatedOrderData.status !== status) {
        throw new Error(`Status update failed. Expected: ${status}, Got: ${updatedOrderData?.status || 'unknown'}`);
      }
      
      // Step 3: Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, status, updated_at: now } 
            : order
        )
      );
      
      // Update the selected order if it's currently being viewed
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...updatedOrderData, customer_email: selectedOrder.customer_email });
      }

      toast.success(`Order status updated to ${status}`);
      
      // Step 4: Refresh orders list to ensure we have the latest data
      setTimeout(() => {
        fetchOrders();
      }, 500);
      
    } catch (error: any) {
      console.error("Error updating order status:", error);
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

  return {
    orders,
    loading,
    selectedOrder,
    orderItems,
    orderItemsLoading,
    selectedStatus,
    page,
    totalPages,
    setPage,
    setSelectedStatus,
    handleOrderClick,
    handleCloseDetails,
    fetchOrders,
    updateOrderStatus
  };
};
