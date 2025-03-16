
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
                className="px-8 bg-white text-black hover:bg-gray-50 shadow-md"
              >
                <Link to="/products/glass">Shop Now</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="px-8 border-white text-black hover:bg-white/20 hover:text-white transition-colors"
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
