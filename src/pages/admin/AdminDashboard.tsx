
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { 
  Package, 
  ShoppingBag,
  Users,
  BarChart,
  Settings
} from 'lucide-react';

const AdminDashboard = () => {
  const { isAdmin } = useAuth();

  if (!isAdmin) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Access Denied</h1>
            <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
            <Link to="/" className="text-blue-600 hover:underline">
              Return to Home
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Product Management Card */}
          <Link to="/admin/products">
            <Card className="p-6 hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="bg-black rounded-full p-4 mb-4">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2">Product Management</h2>
              <p className="text-gray-600">
                Add, edit, and manage your product inventory
              </p>
            </Card>
          </Link>
          
          {/* Order Management Card */}
          <Link to="/admin/orders">
            <Card className="p-6 hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="bg-blue-600 rounded-full p-4 mb-4">
                <ShoppingBag className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2">Order Management</h2>
              <p className="text-gray-600">
                Track, update, and manage customer orders
              </p>
            </Card>
          </Link>
          
          {/* User Management Card */}
          <Link to="/admin/users">
            <Card className="p-6 hover:shadow-lg transition-shadow flex flex-col items-center text-center">
              <div className="bg-green-600 rounded-full p-4 mb-4">
                <Users className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-xl font-bold mb-2">User Management</h2>
              <p className="text-gray-600">
                View and manage user accounts
              </p>
            </Card>
          </Link>
          
          {/* Analytics Card - Placeholder for future implementation */}
          <Card className="p-6 hover:shadow-lg transition-shadow flex flex-col items-center text-center bg-gray-50">
            <div className="bg-purple-600 rounded-full p-4 mb-4">
              <BarChart className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">Analytics</h2>
            <p className="text-gray-600">
              View sales reports and performance metrics
            </p>
            <span className="mt-2 text-xs px-2 py-1 bg-gray-200 rounded-full">Coming Soon</span>
          </Card>
          
          {/* Settings Card - Placeholder for future implementation */}
          <Card className="p-6 hover:shadow-lg transition-shadow flex flex-col items-center text-center bg-gray-50">
            <div className="bg-gray-700 rounded-full p-4 mb-4">
              <Settings className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-xl font-bold mb-2">Store Settings</h2>
            <p className="text-gray-600">
              Configure store policies and settings
            </p>
            <span className="mt-2 text-xs px-2 py-1 bg-gray-200 rounded-full">Coming Soon</span>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
