
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { Category } from '@/components/product/CategoryNav';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

type CategoryData = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

// Enhanced category images with high-quality relevant images
const categoryImages = {
  'mirror': 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop',
  'glass': 'https://images.unsplash.com/photo-1518281361980-b26bfd556770?q=80&w=800&auto=format&fit=crop',
  'hardware': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=800&auto=format&fit=crop',
  'aluminum': 'https://images.unsplash.com/photo-1535382651921-5e1fa3e3a084?q=80&w=800&auto=format&fit=crop',
  // Adding fallback image for any missing categories
  'default': 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=800&auto=format&fit=crop',
};

const CategoriesSection: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await (supabase as any)
          .from('categories')
          .select('*')
          .order('name');

        if (error) throw error;
        
        // Filter out any "railing" or "shower" related categories
        const filteredData = (data as CategoryData[])?.filter(cat => 
          !cat.name.toLowerCase().includes('railing') && 
          !cat.name.toLowerCase().includes('shower') &&
          !cat.slug?.toLowerCase().includes('railing') && 
          !cat.slug?.toLowerCase().includes('shower')
        );
        
        const mappedCategories: Category[] = filteredData.map((cat) => ({
          id: cat.id,
          name: cat.name,
          slug: cat.slug || cat.name.toLowerCase().replace(/\s+/g, '-')
        })) || [];
        
        setCategories(mappedCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold mb-3 text-gray-800">
            Explore Our Categories
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Discover our curated collections tailored to elevate your space</p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto px-4 md:px-8">
            <Carousel
              opts={{
                align: "start",
                loop: true,
              }}
              className="w-full"
            >
              <CarouselContent>
                {categories.map((category) => (
                  <CarouselItem key={category.id} className="md:basis-1/2 lg:basis-1/3 pl-4 md:pl-6">
                    <Link to={`/products/${category.slug}`} className="group">
                      <div className="overflow-hidden rounded-xl relative h-[320px] shadow-md transition-all duration-300 group-hover:shadow-xl">
                        <div className="absolute inset-0">
                          <img 
                            src={categoryImages[category.slug as keyof typeof categoryImages] || categoryImages.default} 
                            alt={category.name}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = categoryImages.default;
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent"></div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                          <h3 className="font-semibold text-2xl mb-2 group-hover:text-blue-200 transition-colors">{category.name}</h3>
                          <p className="text-gray-200 mb-4 opacity-90 line-clamp-2">Premium quality {category.name.toLowerCase()} solutions</p>
                          <Button variant="outline" size="sm" className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 transition-colors">
                            View Collection
                          </Button>
                        </div>
                      </div>
                    </Link>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <div className="flex items-center justify-center mt-8 gap-2">
                <CarouselPrevious className="relative inset-0 translate-y-0 h-10 w-10" />
                <CarouselNext className="relative inset-0 translate-y-0 h-10 w-10" />
              </div>
            </Carousel>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Button asChild variant="outline" className="px-8 border-blue-200 text-blue-600 hover:bg-blue-50">
            <Link to="/products">View All Categories</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default CategoriesSection;
