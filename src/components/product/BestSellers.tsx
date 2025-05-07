
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { 
  Carousel, 
  CarouselContent, 
  CarouselItem,
  CarouselPrevious,
  CarouselNext
} from '@/components/ui/carousel';
import ProductCard from './ProductCard';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
};

const BestSellers: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBestSellerProducts = async () => {
      try {
        // In a real app, this would query products based on sales data
        // For now, we'll simulate by fetching products with a different order
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('price', { ascending: false }) // Using price as a proxy for popularity
          .limit(8);

        if (error) throw error;
        
        const typedProducts = data?.map(product => ({
          ...product,
          availability: (product.availability === 'in_stock' || 
                        product.availability === 'low_stock' || 
                        product.availability === 'out_of_stock') 
                        ? product.availability as 'in_stock' | 'low_stock' | 'out_of_stock'
                        : 'in_stock'
        })) || [];
        
        setProducts(typedProducts);
      } catch (error) {
        console.error('Error fetching best seller products:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBestSellerProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex flex-wrap items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Best Sellers</h2>
            <p className="text-gray-600">Our top selling premium products</p>
          </div>
          <Link 
            to="/products" 
            className="mt-4 sm:mt-0 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <span>View All Products</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <Carousel className="mx-auto" opts={{ loop: true, align: "start" }} autoplay={true}>
          <CarouselContent className="-ml-4">
            {products.map((product) => (
              <CarouselItem key={product.id} className="pl-4 sm:basis-1/2 lg:basis-1/3 xl:basis-1/4">
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious className="hidden lg:flex -left-4" />
          <CarouselNext className="hidden lg:flex -right-4" />
        </Carousel>
      </div>
    </section>
  );
};

export default BestSellers;
