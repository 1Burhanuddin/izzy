
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
    updateLoading,
    deleteLoading,
    setPage,
    setSelectedStatus,
    handleOrderClick,
    handleCloseDetails,
    updateOrderStatus,
    deleteOrder,
    fetchOrders
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
          <button 
            onClick={() => fetchOrders()} 
            className="flex items-center px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12a9 9 0 0 0-9-9 9 9 0 0 0-9 9 9 9 0 0 0 9 9 9 9 0 0 0 9-9Z"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            Refresh Orders
          </button>
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
            deleteOrder={deleteOrder}
            handleCloseDetails={handleCloseDetails}
            getStatusBadge={getOrderStatusBadge}
            getPaymentStatusBadge={getPaymentStatusBadge}
            updateLoading={updateLoading}
            deleteLoading={deleteLoading}
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
            updateOrderStatus={updateOrderStatus}
            deleteOrder={deleteOrder}
            deleteLoading={deleteLoading}
          />
        )}
      </div>
    </Layout>
  );
};

export default OrderManagement;
