
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import ProductGrid from './ProductGrid';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
};

interface RelatedProductsProps {
  currentProductId: string;
  category?: string;
  limit?: number;
}

const RelatedProducts: React.FC<RelatedProductsProps> = ({ 
  currentProductId, 
  category, 
  limit = 2 
}) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedProducts = async () => {
      try {
        setLoading(true);
        
        // For demo products, return other demo products
        if (currentProductId === '10' || currentProductId === '11' || currentProductId === '12') {
          const demoProducts = {
            '10': [
              {
                id: '11',
                name: 'Modern Aluminum Frame',
                price: 49.99,
                image: 'https://images.unsplash.com/photo-1621905244241-996e9156297c?q=80&w=1000',
                category: 'Frames',
                availability: 'in_stock' as const
              },
              {
                id: '12',
                name: 'Designer Wall Mirror',
                price: 199.99,
                image: 'https://images.unsplash.com/photo-1619855544858-e05c0dbf92b5?q=80&w=1000',
                category: 'Mirrors',
                availability: 'in_stock' as const
              }
            ],
            '11': [
              {
                id: '10',
                name: 'Elegant Glass Vase',
                price: 79.99,
                image: 'https://images.unsplash.com/photo-1584433789858-3e5f051c5f7f?q=80&w=1000',
                category: 'Decor',
                availability: 'in_stock' as const
              },
              {
                id: '12',
                name: 'Designer Wall Mirror',
                price: 199.99,
                image: 'https://images.unsplash.com/photo-1619855544858-e05c0dbf92b5?q=80&w=1000',
                category: 'Mirrors',
                availability: 'in_stock' as const
              }
            ],
            '12': [
              {
                id: '10',
                name: 'Elegant Glass Vase',
                price: 79.99,
                image: 'https://images.unsplash.com/photo-1584433789858-3e5f051c5f7f?q=80&w=1000',
                category: 'Decor',
                availability: 'in_stock' as const
              },
              {
                id: '11',
                name: 'Modern Aluminum Frame',
                price: 49.99,
                image: 'https://images.unsplash.com/photo-1621905244241-996e9156297c?q=80&w=1000',
                category: 'Frames',
                availability: 'in_stock' as const
              }
            ]
          };
          
          const relatedProducts = demoProducts[currentProductId as keyof typeof demoProducts] || [];
          setProducts(relatedProducts);
          setLoading(false);
          return;
        }

        let query = supabase
          .from('products')
          .select('*')
          .neq('id', currentProductId)
          .limit(limit);
        
        if (category) {
          query = query.eq('category', category);
        }
        
        const { data, error } = await query;

        if (error) throw error;
        
        // Format the data
        const formattedProducts = data?.map(product => ({
          ...product,
          availability: (product.availability === 'in_stock' || 
                       product.availability === 'low_stock' || 
                       product.availability === 'out_of_stock') 
                       ? product.availability as 'in_stock' | 'low_stock' | 'out_of_stock'
                       : 'in_stock'
        })) || [];
        
        setProducts(formattedProducts);
      } catch (error) {
        console.error('Error fetching related products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRelatedProducts();
  }, [currentProductId, category, limit]);

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <div>
      <h3 className="text-xl font-bold mb-4 text-gray-800">Also See</h3>
      <ProductGrid products={products} columns={2} />
    </div>
  );
};

export default RelatedProducts;
