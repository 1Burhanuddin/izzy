
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/product/ProductGrid';
import { supabase } from '@/integrations/supabase/client';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
};

const ProductsPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let query = supabase
          .from('products')
          .select('*');
          
        if (category) {
          query = query.eq('category', category);
        }
        
        const { data, error } = await query.order('name');

        if (error) {
          console.error('Error fetching products:', error);
          toast.error('Failed to load products');
          return;
        }

        console.log(`Fetched ${data.length} products for category: ${category}`);
        
        // Convert the data to ensure availability is of the correct type
        const typedProducts = data?.map(product => ({
          ...product,
          availability: (product.availability === 'in_stock' || 
                         product.availability === 'low_stock' || 
                         product.availability === 'out_of_stock') 
                         ? product.availability as 'in_stock' | 'low_stock' | 'out_of_stock'
                         : 'in_stock' // Default to in_stock if value is unexpected
        })) || [];
        
        setProducts(typedProducts);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [category]);

  // Format category name for display
  const formatCategoryName = (cat: string | undefined) => {
    if (!cat) return 'All';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };
  
  const goBack = () => {
    navigate(-1);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center"
          onClick={goBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{formatCategoryName(category)} Products</h1>
          <p className="text-gray-600">
            Explore our range of high-quality {category || 'glass and aluminum'} products for your home or office.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : products.length > 0 ? (
          <ProductGrid products={products} columns={3} />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">No products found</h2>
            <p className="text-gray-600">
              We couldn't find any products in this category. Please check back later or browse other categories.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductsPage;
