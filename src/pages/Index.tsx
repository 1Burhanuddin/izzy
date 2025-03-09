import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/product/ProductGrid';
import NewArrivals from '@/components/product/NewArrivals';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';

// Sample featured products
const featuredProducts = [
  {
    id: '1',
    name: 'Float Glass Panel',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833',
    category: 'Glass',
    availability: 'in_stock' as const,
  },
  {
    id: '2',
    name: 'Aluminium Sliding Door',
    price: 329.99,
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625',
    category: 'Aluminium',
    availability: 'in_stock' as const,
  },
  {
    id: '3',
    name: 'LED Backlit Mirror',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1439337153520-7082a56a81f4',
    category: 'Mirrors',
    availability: 'low_stock' as const,
  },
];

const Index = () => {
  // Refs for animation triggers
  const heroRef = useRef<HTMLDivElement>(null);
  const categoriesRef = useRef<HTMLDivElement>(null);
  const featuredRef = useRef<HTMLDivElement>(null);
  
  const { user } = useAuth();
  const { addToCart } = useCart();

  // Observer for scroll animations
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-up');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    // Observe elements
    if (heroRef.current) observer.observe(heroRef.current);
    if (categoriesRef.current) observer.observe(categoriesRef.current);
    if (featuredRef.current) observer.observe(featuredRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleAddToCart = (productId: string) => {
    addToCart(productId, 1);
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-[85vh] flex items-center opacity-0">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            src="https://images.unsplash.com/photo-1496307653780-42ee777d4833" 
            alt="Glass Architecture" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="container mx-auto relative z-10 px-4">
          <div className="max-w-3xl space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight tracking-tight">
              Premium Glass & Hardware Solutions
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              Transform your space with our curated collection of premium glass, aluminium, mirrors, and hardware.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Button 
                className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-lg"
                asChild
              >
                <Link to="/products/glass">Shop Now</Link>
              </Button>
              <Button 
                variant="outline" 
                className="text-white border-white hover:bg-white hover:text-black rounded-full px-8 py-6 text-lg"
                asChild
              >
                <Link to="/products">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section ref={categoriesRef} className="py-20 bg-gray-50 opacity-0">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Shop by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our wide range of products designed for modern spaces.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Glass Category */}
            <div className="relative rounded-xl overflow-hidden group h-80 shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1496307653780-42ee777d4833" 
                alt="Glass" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 group-hover:from-black/80 transition-all duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Glass</h3>
                <p className="text-sm text-white/80 mb-4">Float glass, toughened glass, and custom options</p>
                <Link 
                  to="/products/glass" 
                  className="inline-flex items-center text-sm font-medium hover:underline"
                >
                  <span>View Collection</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* Aluminium Category */}
            <div className="relative rounded-xl overflow-hidden group h-80 shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1487958449943-2429e8be8625" 
                alt="Aluminium" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 group-hover:from-black/80 transition-all duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Aluminium</h3>
                <p className="text-sm text-white/80 mb-4">Doors & windows in various designs and sizes</p>
                <Link 
                  to="/products/aluminium" 
                  className="inline-flex items-center text-sm font-medium hover:underline"
                >
                  <span>View Collection</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* Mirrors Category */}
            <div className="relative rounded-xl overflow-hidden group h-80 shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1493552152660-f915ab47ae9d" 
                alt="Mirrors" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 group-hover:from-black/80 transition-all duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Mirrors</h3>
                <p className="text-sm text-white/80 mb-4">Standard and LED mirrors with customization</p>
                <Link 
                  to="/products/mirrors" 
                  className="inline-flex items-center text-sm font-medium hover:underline"
                >
                  <span>View Collection</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
            
            {/* Hardware Category */}
            <div className="relative rounded-xl overflow-hidden group h-80 shadow-md">
              <img 
                src="https://images.unsplash.com/photo-1483058712412-4245e9b90334" 
                alt="Hardware" 
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out transform group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-black/20 group-hover:from-black/80 transition-all duration-300"></div>
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <h3 className="text-xl font-semibold mb-2">Hardware</h3>
                <p className="text-sm text-white/80 mb-4">F brackets, D brackets, and other fittings</p>
                <Link 
                  to="/products/hardware" 
                  className="inline-flex items-center text-sm font-medium hover:underline"
                >
                  <span>View Collection</span>
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <NewArrivals />

      {/* Featured Products Section */}
      <section ref={featuredRef} className="py-20 opacity-0">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl font-bold mb-2">Featured Products</h2>
              <p className="text-gray-600">Our most popular selections this season</p>
            </div>
            <Link 
              to="/products" 
              className="mt-4 sm:mt-0 inline-flex items-center text-black hover:text-gray-700 font-medium"
            >
              <span>View All Products</span>
              <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </div>
          
          <ProductGrid 
            products={featuredProducts} 
            columns={3} 
            onAddToCart={user ? handleAddToCart : undefined}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-black text-white animate-fade-in">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to transform your space?</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Contact our design experts for a free consultation and quote.
          </p>
          <Button 
            className="bg-white text-black hover:bg-white/90 rounded-full px-8 py-6 text-lg"
            asChild
          >
            <Link to="/products">Get Started</Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
