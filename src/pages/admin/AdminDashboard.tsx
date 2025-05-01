
import React from 'react';
import Layout from '@/components/layout/Layout';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { ShoppingBag, Users, Settings, Package } from 'lucide-react';
import { TextShimmer } from '@/components/ui/text-shimmer';

const AdminDashboard: React.FC = () => {
  const { user, profile } = useAuth();

  const menuItems = [
    {
      title: 'Products',
      description: 'Manage product catalog',
      icon: <ShoppingBag className="h-8 w-8" />,
      link: '/admin/products',
      color: 'bg-blue-50',
      textColor: 'text-blue-600',
    },
    {
      title: 'Users',
      description: 'Manage user accounts',
      icon: <Users className="h-8 w-8" />,
      link: '/admin/users',
      color: 'bg-purple-50',
      textColor: 'text-purple-600',
    },
    {
      title: 'Orders',
      description: 'Track and manage orders',
      icon: <Package className="h-8 w-8" />,
      link: '/admin/orders',
      color: 'bg-green-50',
      textColor: 'text-green-600',
    },
    {
      title: 'Settings',
      description: 'Configure store settings',
      icon: <Settings className="h-8 w-8" />,
      link: '/admin/settings',
      color: 'bg-amber-50',
      textColor: 'text-amber-600',
    },
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <TextShimmer 
            as="h1" 
            className="text-3xl font-bold mb-2
              [--base-color:theme(colors.slate.800)] 
              [--base-gradient-color:theme(colors.blue.500)]
              dark:[--base-color:theme(colors.slate.200)]
              dark:[--base-gradient-color:theme(colors.blue.300)]"
            duration={2.5}
          >
            Admin Dashboard
          </TextShimmer>
          <p className="text-gray-600">
            Welcome back, {profile?.username || user?.email}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <Link 
              key={item.title} 
              to={item.link}
              className="block group"
            >
              <div className="p-6 rounded-xl border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md">
                <div className={`p-4 rounded-full ${item.color} ${item.textColor} inline-flex mb-4`}>
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-1">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
