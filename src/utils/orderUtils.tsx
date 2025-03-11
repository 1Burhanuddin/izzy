
import React from 'react';
import { Badge } from '@/components/ui/badge';

export const getOrderStatusBadge = (status: string) => {
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

export const getPaymentStatusBadge = (status: string) => {
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

export const getOrderStatusText = (status: string) => {
  switch (status) {
    case 'pending':
      return 'Pending';
    case 'processing':
      return 'Processing';
    case 'shipped':
      return 'Shipped';
    case 'delivered':
      return 'Delivered';
    case 'cancelled':
      return 'Cancelled';
    default:
      return status;
  }
};
