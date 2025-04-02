
import { useState, useEffect } from 'react';
import { Order, OrderItem } from '@/types/orderTypes';
import { 
  fetchOrdersFromDB, 
  fetchOrderItemsFromDB, 
  updateOrderStatusInDB,
  ORDERS_PER_PAGE 
} from '@/services/orderService';
import { toast } from 'sonner';

export const useOrderManagement = (isAdmin: boolean) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [orderItemsLoading, setOrderItemsLoading] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updateLoading, setUpdateLoading] = useState(false);

  useEffect(() => {
    if (isAdmin) {
      fetchOrders();
    }
  }, [isAdmin, selectedStatus, page]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const { orders: ordersData, totalCount } = await fetchOrdersFromDB(page, selectedStatus);
      setOrders(ordersData);
      setTotalPages(Math.ceil(totalCount / ORDERS_PER_PAGE));
      console.log("Fetched orders:", ordersData);
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
      const items = await fetchOrderItemsFromDB(orderId);
      setOrderItems(items);
    } catch (error: any) {
      console.error("Error fetching order items:", error);
      toast.error(`Failed to fetch order items: ${error.message}`);
    } finally {
      setOrderItemsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    setUpdateLoading(true);
    try {
      console.log(`Starting update of order ${orderId} to status ${status}`);
      
      // Update the database
      const updatedOrder = await updateOrderStatusInDB(orderId, status);
      console.log("Order updated successfully:", updatedOrder);
      
      // Update local state
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...updatedOrder, customer_email: order.customer_email } 
            : order
        )
      );
      
      // Update the selected order if it's currently being viewed
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({ ...updatedOrder, customer_email: selectedOrder.customer_email });
      }

      toast.success(`Order status updated to ${status}`);
      
      // Refresh orders list to ensure we have the latest data
      await fetchOrders();
      
    } catch (error: any) {
      console.error("Error updating order status:", error);
      toast.error(`Failed to update order: ${error.message}`);
    } finally {
      setUpdateLoading(false);
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
    updateLoading,
    setPage,
    setSelectedStatus,
    handleOrderClick,
    handleCloseDetails,
    fetchOrders,
    updateOrderStatus
  };
};
