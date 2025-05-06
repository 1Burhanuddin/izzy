
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselNext,
  CarouselPrevious 
} from '@/components/ui/carousel';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

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
  limit = 4  // Increased default to show more products in carousel
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

  const getBadgeVariant = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return 'success';
      case 'low_stock':
        return 'warning';
      default:
        return 'destructive';
    }
  };

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
    <div className="py-8">
      <h3 className="text-xl font-bold mb-6 text-gray-800 flex items-center">
        <span className="relative">
          Also See
          <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-500 transform -translate-y-1"></span>
        </span>
      </h3>
      
      <Carousel
        opts={{
          align: "start",
          loop: products.length > 3,
        }}
        className="w-full"
      >
        <CarouselContent>
          {products.map((product) => (
            <CarouselItem key={product.id} className="md:basis-1/2 lg:basis-1/3 xl:basis-1/4">
              <Link to={`/product/${product.id}`}>
                <Card className="overflow-hidden hover:shadow-md transition-all duration-300 h-full">
                  <div className="aspect-square w-full relative overflow-hidden">
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                      />
                    ) : (
                      <div className="bg-gray-100 h-full w-full flex items-center justify-center">
                        <span className="text-gray-400 text-sm">No image</span>
                      </div>
                    )}
                    
                    <Badge
                      variant={getBadgeVariant(product.availability) as any}
                      className="absolute top-2 right-2 text-xs"
                    >
                      {product.availability.replace('_', ' ')}
                    </Badge>
                  </div>
                  
                  <CardContent className="p-3">
                    <div className="text-xs font-medium text-blue-600 mb-1">{product.category}</div>
                    <h4 className="font-medium text-sm line-clamp-1">{product.name}</h4>
                    <p className="text-sm font-bold mt-1">₹{product.price.toFixed(2)}</p>
                  </CardContent>
                </Card>
              </Link>
            </CarouselItem>
          ))}
        </CarouselContent>
        <div className="flex items-center justify-end gap-2 mt-4">
          <CarouselPrevious className="relative -left-0 h-8 w-8" />
          <CarouselNext className="relative -right-0 h-8 w-8" />
        </div>
      </Carousel>
    </div>
  );
};

export default RelatedProducts;
