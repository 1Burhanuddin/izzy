
import React from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, X } from 'lucide-react';
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

interface OrderDetailsProps {
  selectedOrder: Order | null;
  orderItems: OrderItem[];
  orderItemsLoading: boolean;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  handleCloseDetails: () => void;
  getStatusBadge: (status: string) => JSX.Element;
  getPaymentStatusBadge: (status: string) => JSX.Element;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({ 
  selectedOrder, 
  orderItems, 
  orderItemsLoading, 
  updateOrderStatus, 
  handleCloseDetails, 
  getStatusBadge, 
  getPaymentStatusBadge 
}) => {
  if (!selectedOrder) return null;

  return (
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
                <p className="text-sm">{selectedOrder.shipping_address.address || selectedOrder.shipping_address.street}</p>
                <p className="text-sm">{selectedOrder.shipping_address.city}, {selectedOrder.shipping_address.state} {selectedOrder.shipping_address.zipCode || selectedOrder.shipping_address.pincode}</p>
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
  );
};

export default OrderDetails;
