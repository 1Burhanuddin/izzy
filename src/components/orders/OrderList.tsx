
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Eye, Package, Trash2, RefreshCw } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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

interface OrderListProps {
  orders: Order[];
  loading: boolean;
  selectedStatus: string;
  page: number;
  totalPages: number;
  handleOrderClick: (order: Order) => void;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  getStatusBadge: (status: string) => JSX.Element;
  getPaymentStatusBadge: (status: string) => JSX.Element;
  updateOrderStatus: (orderId: string, status: string) => Promise<void>;
  deleteOrder: (orderId: string) => Promise<void>;
  deleteLoading?: boolean;
}

const OrderList: React.FC<OrderListProps> = ({ 
  orders, 
  loading, 
  selectedStatus, 
  page, 
  totalPages, 
  handleOrderClick, 
  setPage, 
  getStatusBadge, 
  getPaymentStatusBadge,
  updateOrderStatus,
  deleteOrder,
  deleteLoading = false
}) => {
  const [updatingOrderId, setUpdatingOrderId] = React.useState<string | null>(null);
  const [deletingOrderId, setDeletingOrderId] = React.useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingOrderId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus);
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    setDeletingOrderId(orderId);
    try {
      await deleteOrder(orderId);
    } finally {
      setDeletingOrderId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
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
    );
  }

  return (
    <>
      <Table className="bg-white shadow rounded-lg">
        <TableHeader className="bg-gray-50">
          <TableRow>
            <TableHead>Order ID</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Total</TableHead>
            <TableHead>Payment Status</TableHead>
            <TableHead>Order Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const isDelivered = order.status === 'delivered';
            const isDeleting = deletingOrderId === order.id;
            
            return (
              <TableRow key={order.id} className="hover:bg-gray-50">
                <TableCell>
                  <div className="text-sm font-medium text-gray-900">#{order.id.substring(0, 8)}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">{order.customer_email}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">{new Date(order.created_at).toLocaleDateString()}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-gray-900">₹{order.total_amount.toFixed(2)}</div>
                </TableCell>
                <TableCell>
                  {getPaymentStatusBadge(order.payment_status)}
                </TableCell>
                <TableCell>
                  <div className="flex items-center space-x-2">
                    {getStatusBadge(order.status)}
                    {!isDelivered && (
                      <Select
                        value={order.status}
                        onValueChange={(value) => handleStatusChange(order.id, value)}
                        disabled={updatingOrderId === order.id}
                      >
                        <SelectTrigger className="h-8 w-32 text-xs">
                          <SelectValue placeholder="Update" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="pending">Pending</SelectItem>
                          <SelectItem value="processing">Processing</SelectItem>
                          <SelectItem value="shipped">Shipped</SelectItem>
                          <SelectItem value="delivered">Delivered</SelectItem>
                          <SelectItem value="cancelled">Cancelled</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOrderClick(order)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      <span>View</span>
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-600 hover:text-red-800"
                          disabled={isDeleting}
                        >
                          {isDeleting ? (
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4 mr-1" />
                          )}
                          <span>Delete</span>
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the order 
                            #{order.id.substring(0, 8)} and all associated order items from the database.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDeleteOrder(order.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

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
  );
};

export default OrderList;
