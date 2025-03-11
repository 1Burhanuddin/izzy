
import React from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import OrderDetails from '@/components/orders/OrderDetails';
import OrderList from '@/components/orders/OrderList';
import StatusFilter from '@/components/orders/StatusFilter';
import { useOrderManagement } from '@/hooks/useOrderManagement';
import { getOrderStatusBadge, getPaymentStatusBadge } from '@/utils/orderUtils';

const OrderManagement: React.FC = () => {
  const { isAdmin } = useAuth();
  const {
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
    updateOrderStatus
  } = useOrderManagement(isAdmin);

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
        <StatusFilter 
          selectedStatus={selectedStatus} 
          setSelectedStatus={setSelectedStatus} 
        />

        {/* Order table or selected order details */}
        {selectedOrder ? (
          <OrderDetails
            selectedOrder={selectedOrder}
            orderItems={orderItems}
            orderItemsLoading={orderItemsLoading}
            updateOrderStatus={updateOrderStatus}
            handleCloseDetails={handleCloseDetails}
            getStatusBadge={getOrderStatusBadge}
            getPaymentStatusBadge={getPaymentStatusBadge}
          />
        ) : (
          <OrderList
            orders={orders}
            loading={loading}
            selectedStatus={selectedStatus}
            page={page}
            totalPages={totalPages}
            handleOrderClick={handleOrderClick}
            setPage={setPage}
            getStatusBadge={getOrderStatusBadge}
            getPaymentStatusBadge={getPaymentStatusBadge}
          />
        )}
      </div>
    </Layout>
  );
};

export default OrderManagement;
