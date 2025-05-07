
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
import { useCarouselAutoplay } from '@/hooks/use-carousel-autoplay';
import { useIsMobile } from '@/hooks/use-mobile';

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
  const isMobile = useIsMobile();

  useEffect(() => {
    const fetchNewProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(8);

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
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Featured Products</h2>
            <p className="text-gray-600">Premium selections for modern spaces</p>
          </div>
          <Link 
            to="/products" 
            className="mt-4 sm:mt-0 inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
          >
            <span>View All Products</span>
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
        
        <Carousel 
          className="mx-auto" 
          opts={{ 
            loop: true, 
            align: "start",
            containScroll: "trimSnaps" 
          }} 
          autoplay={true}
          autoplayInterval={5000}
        >
          <CarouselContent className="-ml-4">
            {newProducts.map((product) => (
              <CarouselItem 
                key={product.id} 
                className="pl-4 md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
              >
                <ProductCard product={product} />
              </CarouselItem>
            ))}
          </CarouselContent>
          <div className="flex justify-center mt-4 gap-2">
            <CarouselPrevious className="static translate-y-0 h-8 w-8" />
            <CarouselNext className="static translate-y-0 h-8 w-8" />
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default NewArrivals;
