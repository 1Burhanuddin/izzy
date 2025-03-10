
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Users, ChevronLeft, ChevronRight, Search, User, Package, ShoppingCart } from 'lucide-react';
import { format } from 'date-fns';

type UserProfile = {
  id: string;
  username: string;
  role: string;
  created_at: string;
  updated_at: string;
  order_count: number;
  total_spent: number;
};

const UserManagement: React.FC = () => {
  const { isAdmin } = useAuth();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const usersPerPage = 10;

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    }
  }, [isAdmin, page, searchTerm]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch user profiles with pagination
      let query = supabase
        .from('profiles')
        .select('*');

      if (searchTerm) {
        query = query.ilike('username', `%${searchTerm}%`);
      }

      // Get total count for pagination
      const { count: totalCount, error: countError } = await query.count();
      
      if (countError) throw countError;
      
      // Apply pagination
      const from = (page - 1) * usersPerPage;
      const to = from + usersPerPage - 1;
      
      const { data, error } = await query
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Calculate total pages
      setTotalPages(Math.ceil((totalCount || 0) / usersPerPage));

      // For each user, get their order count and total spent
      const enhancedUsers = await Promise.all(
        (data || []).map(async (user) => {
          // Get order count
          const { count: orderCount, error: orderCountError } = await supabase
            .from('orders')
            .select('*', { count: 'exact', head: true })
            .eq('user_id', user.id);

          if (orderCountError) {
            console.error('Error fetching order count:', orderCountError);
            return { ...user, order_count: 0, total_spent: 0 };
          }

          // Get total spent
          const { data: ordersData, error: ordersError } = await supabase
            .from('orders')
            .select('total_amount')
            .eq('user_id', user.id);

          if (ordersError) {
            console.error('Error fetching orders:', ordersError);
            return { ...user, order_count: orderCount || 0, total_spent: 0 };
          }

          const totalSpent = (ordersData || []).reduce((sum, order) => sum + (order.total_amount || 0), 0);

          return {
            ...user,
            order_count: orderCount || 0,
            total_spent: totalSpent,
          };
        })
      );

      setUsers(enhancedUsers);
    } catch (error: any) {
      toast.error(`Failed to fetch users: ${error.message}`);
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async (userId: string, newRole: string) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ role: newRole })
        .eq('id', userId);

      if (error) throw error;

      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));

      toast.success(`User role updated to ${newRole}`);
    } catch (error: any) {
      toast.error(`Failed to update user role: ${error.message}`);
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="outline" className="bg-purple-50 text-purple-600 border-purple-200">Admin</Badge>;
      case 'customer':
        return <Badge variant="outline" className="bg-blue-50 text-blue-600 border-blue-200">Customer</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-gray-600">
              Manage user accounts and permissions
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <div className="flex">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="focus:ring-black focus:border-black block w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md"
                placeholder="Search users by email"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Users table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : users.length > 0 ? (
          <>
            <div className="overflow-x-auto bg-white shadow rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      User
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Role
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Registered On
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orders
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total Spent
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="h-5 w-5 text-gray-500" />
                            </div>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {user.username}
                            </div>
                            <div className="text-sm text-gray-500">
                              {user.id.substring(0, 8)}...
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getRoleBadge(user.role)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {format(new Date(user.created_at), 'dd MMM yyyy')}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center">
                          <Package className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-900">{user.order_count}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="inline-flex items-center">
                          <ShoppingCart className="h-4 w-4 mr-1 text-gray-500" />
                          <span className="text-sm text-gray-900">₹{user.total_spent.toFixed(2)}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex space-x-2">
                          {user.role === 'customer' ? (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateUserRole(user.id, 'admin')}
                            >
                              Make Admin
                            </Button>
                          ) : (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => updateUserRole(user.id, 'customer')}
                            >
                              Remove Admin
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
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
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
              <Users className="h-8 w-8 text-gray-400" />
            </div>
            <h2 className="text-xl font-medium mb-2">No users found</h2>
            <p className="text-gray-500">
              {searchTerm ? 'No users match your search criteria' : 'There are no users registered yet'}
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserManagement;
