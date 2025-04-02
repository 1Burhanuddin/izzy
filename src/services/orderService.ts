
import { supabase } from '@/integrations/supabase/client';
import { Order, OrderItem } from '@/types/orderTypes';
import { toast } from 'sonner';

export const ORDERS_PER_PAGE = 10;

/**
 * Fetches orders from the database with optional filtering by status
 */
export const fetchOrdersFromDB = async (
  page: number, 
  selectedStatus: string
): Promise<{ orders: Order[], totalCount: number }> => {
  try {
    // Fetch orders with pagination
    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })
      .range((page - 1) * ORDERS_PER_PAGE, page * ORDERS_PER_PAGE - 1);

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

    // Fetch user emails for each order
    const ordersWithUserEmails = await Promise.all(
      ordersData.map(async (order: Order) => {
        try {
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

    return { 
      orders: ordersWithUserEmails, 
      totalCount: count || 0 
    };
  } catch (error: any) {
    console.error("Error fetching orders:", error);
    throw error;
  }
};

/**
 * Fetches items for a specific order
 */
export const fetchOrderItemsFromDB = async (orderId: string): Promise<OrderItem[]> => {
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

    return formattedItems;
  } catch (error: any) {
    console.error("Error fetching order items:", error);
    throw error;
  }
};

/**
 * Updates an order's status in the database
 */
export const updateOrderStatusInDB = async (orderId: string, status: string): Promise<Order> => {
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
    
    return updatedOrderData;
  } catch (error: any) {
    console.error("Error updating order status:", error);
    throw error;
  }
};
