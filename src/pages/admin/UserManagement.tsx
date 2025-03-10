import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  User, 
  ShieldCheck, 
  ShoppingBag, 
  ArrowUpDown,
  X,
  Eye
} from 'lucide-react';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

type UserProfile = {
  id: string;
  username: string;
  role: string;
  created_at: string;
  order_count?: number;
};

const UserManagement = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('created_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);
  const [userOrders, setUserOrders] = useState<any[]>([]);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
    } else {
      navigate('/');
    }
  }, [isAdmin, navigate]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Fetch user profiles
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .order(sortBy, { ascending: sortDirection === 'asc' });

      if (profilesError) throw profilesError;

      // Get order counts for each user
      const { data: orderCountsData, error: orderCountsError } = await supabase
        .from('orders')
        .select('user_id, count(*)', { count: 'exact' })
        .groupBy('user_id');

      if (orderCountsError) throw orderCountsError;

      // Map order counts to user profiles
      const usersWithOrderCounts = profilesData.map(profile => {
        const userOrderCount = orderCountsData.find(item => item.user_id === profile.id);
        return {
          ...profile,
          order_count: userOrderCount ? parseInt(userOrderCount.count) : 0
        };
      });

      setUsers(usersWithOrderCounts);
    } catch (error: any) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleSort = (column: string) => {
    if (sortBy === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortDirection('asc');
    }
  };

  const handleViewUser = async (user: UserProfile) => {
    setSelectedUser(user);
    
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          created_at,
          total_amount,
          status,
          payment_status
        `)
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setUserOrders(data || []);
    } catch (error: any) {
      console.error('Error fetching user orders:', error);
      toast.error('Failed to fetch user orders');
    }
  };

  const closeModal = () => {
    setSelectedUser(null);
    setUserOrders([]);
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric'
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredUsers = users.filter(user => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      user.id.toLowerCase().includes(searchTermLower) ||
      (user.username && user.username.toLowerCase().includes(searchTermLower)) ||
      user.role.toLowerCase().includes(searchTermLower)
    );
  });

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">User Management</h1>
            <p className="text-gray-600">
              View and manage user accounts
            </p>
          </div>
        </div>

        {/* Search bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <Input
            type="text"
            placeholder="Search users by email, role..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full"
          />
        </div>

        {/* Users table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredUsers.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <th className="px-6 py-3">User</th>
                  <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('created_at')}>
                    <div className="flex items-center">
                      Joined
                      {sortBy === 'created_at' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3 cursor-pointer" onClick={() => handleSort('role')}>
                    <div className="flex items-center">
                      Role
                      {sortBy === 'role' && (
                        <ArrowUpDown className="ml-1 h-4 w-4" />
                      )}
                    </div>
                  </th>
                  <th className="px-6 py-3">Orders</th>
                  <th className="px-6 py-3">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {user.username || 'No Email'}
                          </div>
                          <div className="text-sm text-gray-500">
                            ID: {user.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(user.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Badge variant={user.role === 'admin' ? 'default' : 'outline'}>
                        {user.role === 'admin' ? (
                          <div className="flex items-center">
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Admin
                          </div>
                        ) : (
                          'Customer'
                        )}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <ShoppingBag className="h-4 w-4 mr-1 text-gray-400" />
                        {user.order_count || 0}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <Button 
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewUser(user)}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-medium mb-2">No users found</h2>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'No users match your search criteria.' : 'There are no users registered yet.'}
            </p>
          </div>
        )}
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">
                User Details
              </h2>
              <Button variant="ghost" size="icon" onClick={closeModal}>
                <X className="h-5 w-5" />
              </Button>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center mb-4">
                  <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium">{selectedUser.username || 'No Email'}</h3>
                    <p className="text-sm text-gray-500">User ID: {selectedUser.id}</p>
                    <div className="flex items-center mt-1">
                      <Badge variant={selectedUser.role === 'admin' ? 'default' : 'outline'} className="mr-2">
                        {selectedUser.role === 'admin' ? (
                          <div className="flex items-center">
                            <ShieldCheck className="h-3 w-3 mr-1" />
                            Admin
                          </div>
                        ) : (
                          'Customer'
                        )}
                      </Badge>
                      <span className="text-sm text-gray-500">Joined: {formatDate(selectedUser.created_at)}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <h3 className="font-medium mb-2">Order History</h3>
              {userOrders.length > 0 ? (
                <div className="bg-gray-50 rounded-lg overflow-hidden">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {userOrders.map((order) => (
                        <tr key={order.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3 whitespace-nowrap text-sm font-medium">
                            #{order.id.substring(0, 8)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                            {formatDate(order.created_at)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            ₹{order.total_amount.toFixed(2)}
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <Badge 
                              variant={
                                order.status === 'delivered' ? 'default' : 
                                order.status === 'shipped' ? 'default' :
                                order.status === 'processing' ? 'outline' :
                                order.status === 'cancelled' ? 'destructive' : 'secondary'
                              }
                            >
                              {order.status}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 whitespace-nowrap text-sm">
                            <Badge 
                              variant={
                                order.payment_status === 'completed' ? 'default' : 
                                order.payment_status === 'pending' ? 'secondary' : 'destructive'
                              }
                            >
                              {order.payment_status}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="bg-gray-50 p-8 rounded-lg text-center">
                  <ShoppingBag className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">This user hasn't placed any orders yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default UserManagement;
