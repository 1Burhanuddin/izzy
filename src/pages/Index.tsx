
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import NewArrivals from '@/components/product/NewArrivals';
import { Button } from '@/components/ui/button';
import { Award, Sparkles, Star } from 'lucide-react';
import CartDrawer from '@/components/cart/CartDrawer';
import { useCart } from '@/contexts/CartContext';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import CategoryNav, { Category } from '@/components/product/CategoryNav';
import { TextShimmer } from '@/components/ui/text-shimmer';
import ContactSection from '@/components/contact/ContactSection';
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

const Index = () => {
  const { isCartOpen, closeCart } = useCart();
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
    <Layout>
      <CartDrawer open={isCartOpen} onClose={closeCart} />
      
      <section className="relative overflow-hidden bg-gradient-to-r from-gray-700 to-gray-500 text-white min-h-[85vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <img 
           src="https://t4.ftcdn.net/jpg/05/12/76/37/360_F_512763745_aH8NST04ptKP863Tz0QHuj1FdHGqxmo5.jpg"
            alt="Sky with clouds" 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-r from-black/40 to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32 flex flex-col items-center">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 animate-fade-in text-black drop-shadow-md">
              Transform Your Space with Izzy
            </h1>
            <p className="text-lg md:text-xl text-center max-w-2xl mb-10 animate-fade-up text-black drop-shadow-md">
              Premium glass and aluminum solutions for modern homes and offices.
              Expert craftsmanship with timeless designs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: "0.3s"}}>
              <Button
                asChild
                size="lg"
                className="px-8 bg-blue-600 hover:bg-blue-700 text-black shadow-md transition-all"
              >
                <Link to="/products/glass">Shop Now</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <NewArrivals />

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

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2 text-gray-800">Why Choose Izzy</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg text-center hover-lift shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-7 w-7 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Quality Materials</h3>
              <p className="text-gray-600">Premium glass and aluminum sourced from the finest suppliers.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg text-center hover-lift shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-purple-500">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Expert Craftsmanship</h3>
              <p className="text-gray-600">Skilled artisans with decades of experience in fabrication.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg text-center hover-lift shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-7 w-7 text-cyan-500">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Trusted Service</h3>
              <p className="text-gray-600">Customer satisfaction is our highest priority with every project.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg text-center hover-lift shadow-sm border border-gray-100">
              <div className="w-14 h-14 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-7 w-7 text-amber-500" />
              </div>
              <h3 className="text-xl font-bold mb-2 text-gray-800">Custom Solutions</h3>
              <p className="text-gray-600">Bespoke designs tailored to your specific needs and preferences.</p>
            </div>
          </div>
        </div>
      </section>

      <ContactSection email="111burhanuddin@gmail.com" />
    </Layout>
  );
};

export default Index;
