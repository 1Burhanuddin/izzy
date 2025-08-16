
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
import { TextShimmer } from '@/components/ui/text-shimmer';

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
    <section className="py-10 md:py-16 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex flex-wrap items-center justify-between mb-8 md:mb-12">
          <div className="w-full flex justify-between items-center">
            <div>
              <TextShimmer
                as="h2"
                className="text-2xl md:text-4xl font-bold mb-2 md:mb-3 text-black"
                duration={2.5}
              >
                Featured Collections
              </TextShimmer>
              <p className="text-sm md:text-base text-gray-600 italic">Premium selections for modern spaces</p>
            </div>
            <Link 
              to="/products" 
              className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 hover:bg-blue-200 transition-colors"
              aria-label="View all products"
            >
              <ArrowRight className="h-5 w-5 text-blue-700" />
            </Link>
          </div>
        </div>
        
        <Carousel 
          className="w-full" 
          opts={{ 
            loop: true, 
            align: "start",
            containScroll: "trimSnaps" 
          }} 
          autoplay={true}
          autoplayInterval={5000}
        >
          <CarouselContent className="-ml-2 md:-ml-4">
            {newProducts.map((product) => (
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

export default NewArrivals;
