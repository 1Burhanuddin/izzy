
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
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
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

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
    <section className="py-10 md:py-16 bg-white">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-6 md:mb-12">
          <div>
            <h2 className="text-xl md:text-3xl font-bold mb-1 md:mb-2 text-gray-800">Best Sellers</h2>
            <p className="text-xs md:text-base text-gray-600">Our top selling premium products</p>
          </div>
          <Link 
            to="/products" 
            className="mt-2 sm:mt-0 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm md:text-base"
          >
            <span>View All Products</span>
            <ArrowRight className="ml-1 h-3 w-3 md:h-4 md:w-4" />
          </Link>
        </div>
        
        <Carousel 
          className="w-full" 
          opts={{ 
            loop: true, 
            align: "start",
            containScroll: "trimSnaps"  
          }} 
          autoplay={true}
          autoplayInterval={6000}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {products.map((product) => (
              <CarouselItem 
                key={product.id} 
                className="pl-2 md:pl-4 basis-full xs:basis-3/4 sm:basis-1/2 md:basis-1/3 lg:basis-1/4"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4 gap-2">
            <CarouselPrevious className="static translate-y-0 h-6 w-6 md:h-8 md:w-8" />
            <CarouselNext className="static translate-y-0 h-6 w-6 md:h-8 md:w-8" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default BestSellers;
