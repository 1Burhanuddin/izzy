
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import ProductGrid from '@/components/product/ProductGrid';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
};

const NewArrivals: React.FC = () => {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(6);

        if (error) throw error;
        
        // Convert the data to ensure availability is of the correct type
        const typedProducts = data?.map(product => ({
          ...product,
          availability: (product.availability === 'in_stock' || 
                         product.availability === 'low_stock' || 
                         product.availability === 'out_of_stock') 
                         ? product.availability as 'in_stock' | 'low_stock' | 'out_of_stock'
                         : 'in_stock' // Default to in_stock if value is unexpected
        })) || [];
        
        setNewProducts(typedProducts);
      } catch (error) {
        console.error('Error fetching new products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchNewProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (newProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2">New Arrivals</h2>
            <p className="text-gray-600">Check out our latest product additions</p>
          </div>
          <Link 
            to="/products" 
            className="mt-4 sm:mt-0 inline-flex items-center text-black hover:text-gray-700 font-medium"
          >
            <span>View All New Products</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <ProductGrid products={newProducts} columns={3} />
      </div>
    </section>
  );
};

export default NewArrivals;
