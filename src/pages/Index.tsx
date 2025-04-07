
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

// Define a type for raw category data from Supabase
type CategoryData = {
  id: string;
  name: string;
  slug: string;
  created_at: string;
};

// Image mapping for categories
const categoryImages = {
  'mirror': 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=1080&auto=format&fit=crop',
  'glass': 'https://images.unsplash.com/photo-1518281361980-b26bfd556770?q=80&w=1080&auto=format&fit=crop',
  'hardware': 'https://images.unsplash.com/photo-1621905252507-b35492cc74b4?q=80&w=1080&auto=format&fit=crop',
  'aluminum': 'https://images.unsplash.com/photo-1535382651921-5e1fa3e3a084?q=80&w=1080&auto=format&fit=crop',
};

const Index = () => {
  const { isCartOpen, closeCart } = useCart();
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Type assertion to any to bypass TypeScript checking for the table name
        const { data, error } = await (supabase as any)
          .from('categories')
          .select('*')
          .order('name');

        if (error) throw error;
        
        // Explicitly type the data to match our Category type
        const mappedCategories: Category[] = (data as CategoryData[])?.map((cat) => ({
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
      {/* Cart Drawer */}
      <CartDrawer open={isCartOpen} onClose={closeCart} />
      
      {/* Hero Section with neutral colors and cloud effect */}
      <section className="relative overflow-hidden bg-gradient-to-r from-gray-700 to-gray-500 text-white min-h-[85vh] flex items-center">
        <div className="absolute inset-0 z-0">
          {/* Hero background image */}
          <img 
           src="https://t4.ftcdn.net/jpg/05/12/76/37/360_F_512763745_aH8NST04ptKP863Tz0QHuj1FdHGqxmo5.jpg"
            alt="Sky with clouds" 
            className="w-full h-full object-cover "
          />
          
          {/* Cloud-like overlay effect */}
          <div className=""></div>
          
          {/* Cloud elements using SVG filters */}
          <div className="">
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>
            <div className=""></div>
          </div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-20 md:py-32 flex flex-col items-center">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 animate-fade-in text-black drop-shadow-lg">
              Transform Your Space with Izzy
            </h1>
            <p className="text-lg md:text-xl text-center max-w-2xl mb-10 animate-fade-up text-black/90 drop-shadow-md">
              Premium glass and aluminum solutions for modern homes and offices.
              Expert craftsmanship with timeless designs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: "0.3s"}}>
              <Button
                asChild
                size="lg"
                className="px-8 bg-white text-black hover:bg-gray-50 shadow-md"
              >
                <Link to="/products/glass">Shop Now</Link>
              </Button>
            
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <NewArrivals />

      {/* Category Showcase Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3 text-gray-800">Explore Our Categories</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">Discover our curated collections tailored to elevate your space</p>
          </div>
          
          {isLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-800"></div>
            </div>
          ) : (
            <div className="flex flex-col gap-8 max-w-4xl mx-auto">
              {categories.map((category) => (
                <Link key={category.id} to={`/products/${category.slug}`}>
                  <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-2 hover:shadow-lg border border-gray-100 h-56 flex flex-col md:flex-row">
                    <div className="md:w-1/2 h-52 md:h-full">
                      <img 
                        src={categoryImages[category.slug as keyof typeof categoryImages]} 
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-6 flex flex-col justify-center items-center md:items-start md:w-1/2">
                      <h3 className="font-semibold text-2xl text-gray-800 mb-3">{category.name}</h3>
                      <Separator className="my-2 bg-gray-200 w-16" />
                      <p className="text-gray-500 mt-2 mb-4">Premium quality {category.name.toLowerCase()} solutions for modern spaces</p>
                      <Button variant="outline" className="mt-auto">
                        View Collection
                      </Button>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
          
          <div className="text-center mt-12">
            <Button asChild variant="outline" className="px-8">
              <Link to="/products">View All Categories</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section with more subtle colors */}
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
    </Layout>
  );
};

export default Index;
