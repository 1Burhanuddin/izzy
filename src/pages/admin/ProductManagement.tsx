
import React, { useState, useEffect } from 'react';
import Layout from '@/components/layout/Layout';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Edit, Trash, Plus, X, Save, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  image: string | null;
  category: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
};

const ProductManagement: React.FC = () => {
  const { isAdmin } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // New product template
  const newProductTemplate: Omit<Product, 'id'> = {
    name: '',
    description: '',
    price: 0,
    image: '',
    category: 'glass',
    availability: 'in_stock',
  };

  useEffect(() => {
    if (isAdmin) {
      fetchProducts();
    }
  }, [isAdmin]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;
      setProducts(data as Product[]);
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async () => {
    if (!currentProduct) return;

    try {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: currentProduct.name,
          description: currentProduct.description,
          price: currentProduct.price,
          image: currentProduct.image,
          category: currentProduct.category,
          availability: currentProduct.availability,
        }])
        .select()
        .single();

      if (error) throw error;
      
      setProducts([...products, data as Product]);
      setIsCreating(false);
      setCurrentProduct(null);
      toast.success('Product created successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to create product');
    }
  };

  const handleUpdateProduct = async () => {
    if (!currentProduct) return;

    try {
      const { data, error } = await supabase
        .from('products')
        .update({
          name: currentProduct.name,
          description: currentProduct.description,
          price: currentProduct.price,
          image: currentProduct.image,
          category: currentProduct.category,
          availability: currentProduct.availability,
        })
        .eq('id', currentProduct.id)
        .select()
        .single();

      if (error) throw error;
      
      setProducts(products.map((product) => 
        product.id === currentProduct.id ? (data as Product) : product
      ));
      setIsEditing(false);
      setCurrentProduct(null);
      toast.success('Product updated successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setProducts(products.filter((product) => product.id !== id));
      toast.success('Product deleted successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  const filteredProducts = products.filter(product => 
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.description && product.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Product Management</h1>
            <p className="text-gray-600">
              Manage your product catalog
            </p>
          </div>
          <Button 
            onClick={() => {
              setCurrentProduct(newProductTemplate as any);
              setIsCreating(true);
            }}
            className="bg-black hover:bg-gray-800"
          >
            <Plus className="mr-2 h-4 w-4" /> Add Product
          </Button>
        </div>

        {/* Search bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
          />
        </div>

        {/* Products table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-200 rounded-lg">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Availability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {product.image ? (
                        <img 
                          src={product.image} 
                          alt={product.name} 
                          className="h-10 w-10 object-cover rounded"
                        />
                      ) : (
                        <div className="h-10 w-10 bg-gray-200 rounded flex items-center justify-center">
                          <AlertCircle className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{product.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 py-1 text-xs rounded-full bg-gray-100">{product.category}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${product.price.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        product.availability === 'in_stock' 
                          ? 'bg-green-100 text-green-800' 
                          : product.availability === 'low_stock'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.availability === 'in_stock' 
                          ? 'In Stock' 
                          : product.availability === 'low_stock'
                          ? 'Low Stock'
                          : 'Out of Stock'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => {
                          setCurrentProduct(product);
                          setIsEditing(true);
                        }}
                        className="mr-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleDeleteProduct(product.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <h2 className="text-xl font-medium mb-2">No products found</h2>
            <p className="text-gray-600 mb-6">
              {searchTerm ? 'No products match your search criteria.' : 'Get started by adding your first product.'}
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => {
                  setCurrentProduct(newProductTemplate as any);
                  setIsCreating(true);
                }}
                className="bg-black hover:bg-gray-800"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Product
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Edit/Create Product Modal */}
      {(isEditing || isCreating) && currentProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg w-full max-w-2xl">
            <div className="flex justify-between items-center border-b p-4">
              <h2 className="text-xl font-semibold">
                {isCreating ? 'Add New Product' : 'Edit Product'}
              </h2>
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => {
                  setIsEditing(false);
                  setIsCreating(false);
                  setCurrentProduct(null);
                }}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={currentProduct.name}
                    onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    value={currentProduct.description || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={currentProduct.price}
                    onChange={(e) => setCurrentProduct({...currentProduct, price: parseFloat(e.target.value)})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={currentProduct.category}
                    onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="glass">Glass</option>
                    <option value="aluminium">Aluminium</option>
                    <option value="mirrors">Mirrors</option>
                    <option value="hardware">Hardware</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
                  <input
                    type="text"
                    value={currentProduct.image || ''}
                    onChange={(e) => setCurrentProduct({...currentProduct, image: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                  <select
                    value={currentProduct.availability}
                    onChange={(e) => setCurrentProduct({...currentProduct, availability: e.target.value as 'in_stock' | 'low_stock' | 'out_of_stock'})}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="in_stock">In Stock</option>
                    <option value="low_stock">Low Stock</option>
                    <option value="out_of_stock">Out of Stock</option>
                  </select>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button 
                  variant="outline" 
                  onClick={() => {
                    setIsEditing(false);
                    setIsCreating(false);
                    setCurrentProduct(null);
                  }}
                  className="mr-2"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={isCreating ? handleCreateProduct : handleUpdateProduct}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isCreating ? 'Create Product' : 'Save Changes'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default ProductManagement;
