
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import NewArrivals from '@/components/product/NewArrivals';
import { Button } from '@/components/ui/button';
import { Award, Star } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section with neutral colors and cloud effect */}
      <section className="relative overflow-hidden bg-gradient-to-r from-gray-700 to-gray-500 text-white min-h-[85vh] flex items-center">
        <div className="absolute inset-0 z-0">
          {/* Hero background image */}
          <img 
            src="data:image/jpeg;base64,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" 
            alt="Sky with clouds" 
            className="w-full h-full object-cover opacity-40"
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
            <h1 className="text-4xl md:text-6xl font-bold text-center mb-6 animate-fade-in text-white drop-shadow-lg">
              Transform Your Space with Izzy
            </h1>
            <p className="text-lg md:text-xl text-center max-w-2xl mb-10 animate-fade-up text-white/90 drop-shadow-md">
              Premium glass and aluminum solutions for modern homes and offices.
              Expert craftsmanship with timeless designs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in" style={{animationDelay: "0.3s"}}>
              <Button
                asChild
                size="lg"
                className="px-8 bg-white text-gray-700 hover:bg-gray-50 shadow-md"
              >
                <Link to="/products/glass">Shop Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 border-white text-white hover:bg-white/20 hover:text-white transition-colors"
              >
                <Link to="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <NewArrivals />

      {/* Why Choose Us Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">Why Choose Izzy</h2>
            <div className="w-24 h-1 bg-gray-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center hover-lift">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Materials</h3>
              <p className="text-gray-600">Premium glass and aluminum sourced from the finest suppliers around the world.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center hover-lift">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Craftsmanship</h3>
              <p className="text-gray-600">Skilled artisans with decades of experience in glass and aluminum fabrication.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center hover-lift">
              <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">5-Year Warranty</h3>
              <p className="text-gray-600">We stand behind our products with an industry-leading warranty on all items.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial Section */}
      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-8">
              What Our Customers Say
            </h2>
            <div className="mb-8 flex justify-center">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-6 w-6 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
            </div>
            <div className="text-xl italic text-gray-700 mb-4">
              "Izzy transformed my living room with their stunning glass
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
