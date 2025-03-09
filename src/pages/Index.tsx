import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/product/ProductGrid';
import NewArrivals from '@/components/product/NewArrivals';
import { Button } from '@/components/ui/button';

const Index = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching featured products
    setLoading(true);
    setTimeout(() => {
      setFeaturedProducts([
        {
          id: '10',
          name: 'Elegant Glass Vase',
          price: 79.99,
          image: 'https://images.unsplash.com/photo-1584433789858-3e5f051c5f7f?q=80&w=1000',
          category: 'Decor',
          availability: 'in_stock' as const,
        },
        {
          id: '11',
          name: 'Modern Aluminum Frame',
          price: 49.99,
          image: 'https://images.unsplash.com/photo-1621905244241-996e9156297c?q=80&w=1000',
          category: 'Frames',
          availability: 'in_stock' as const,
        },
        {
          id: '12',
          name: 'Designer Wall Mirror',
          price: 199.99,
          image: 'https://images.unsplash.com/photo-1619855544858-e05c0dbf92b5?q=80&w=1000',
          category: 'Mirrors',
          availability: 'in_stock' as const,
        },
      ]);
      setLoading(false);
    }, 500);
  }, []);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-black text-white">
        <div className="absolute inset-0 z-0">
          <video
            className="w-full h-full object-cover opacity-60"
            autoPlay
            muted
            loop
            playsInline
          >
            <source
              src="https://d1xzdqg8s8ggsr.cloudfront.net/654bb41e6a54e30008612d94/654e31ebca0b8600070af2af/9c76eb5e-aa87-480f-b5ba-5eb3d416798b.mp4"
              type="video/mp4"
            />
          </video>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-32 md:py-48 flex flex-col items-center">
          <h1 className="text-4xl md:text-6xl font-bold text-center mb-6">
            Transform Your Space with Izzy
          </h1>
          <p className="text-lg md:text-xl text-center max-w-2xl mb-10">
            Premium glass and aluminum solutions for modern homes and offices.
            Expert craftsmanship with timeless designs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              asChild
              size="lg"
              className="px-8 bg-white text-black hover:bg-gray-200"
            >
              <Link to="/products/glass">Shop Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="px-8 border-white text-black bg-transparent hover:bg-white hover:text-black"
            >
              <Link to="/about">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">
            Featured Products
          </h2>
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            </div>
          ) : (
            <ProductGrid products={featuredProducts} columns={3} />
          )}
        </div>
      </section>

      {/* New Arrivals Section */}
      <NewArrivals />

      {/* Testimonial Section */}
      <section className="py-24 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              What Our Customers Say
            </h2>
            <div className="text-xl italic text-gray-700 mb-4">
              "SleekGlass transformed my living room with their stunning glass
              table. The quality is exceptional, and the service was
              impeccable. Highly recommended!"
            </div>
            <p className="text-gray-600 font-medium">
              - Emily R., Satisfied Customer
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
