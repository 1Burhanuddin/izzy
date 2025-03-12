
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import NewArrivals from '@/components/product/NewArrivals';
import { Button } from '@/components/ui/button';
import { Award, Star } from 'lucide-react';

const Index = () => {
  return (
    <Layout>
      {/* Hero Section with blue colors and cloud effect */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-700 to-blue-500 text-white min-h-[85vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <video
            className="w-full h-full object-cover opacity-40"
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source
              src="https://d1xzdqg8s8ggsr.cloudfront.net/654bb41e6a54e30008612d94/654e31ebca0b8600070af2af/9c76eb5e-aa87-480f-b5ba-5eb3d416798b.mp4"
              type="video/mp4"
            />
          </video>
          
          {/* Cloud-like overlay effect */}
          <div className="absolute inset-0 bg-gradient-to-b from-blue-400/30 via-blue-600/20 to-blue-900/40"></div>
          
          {/* Cloud elements using SVG filters */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30">
            <div className="cloud absolute top-[10%] left-[5%] w-64 h-24 bg-white rounded-full"></div>
            <div className="cloud absolute top-[15%] right-[10%] w-80 h-20 bg-white rounded-full"></div>
            <div className="cloud absolute top-[40%] left-[20%] w-48 h-16 bg-white rounded-full"></div>
            <div className="cloud absolute bottom-[30%] right-[25%] w-56 h-18 bg-white rounded-full"></div>
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
                className="px-8 bg-white text-blue-700 hover:bg-blue-50 shadow-md"
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
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg text-center hover-lift">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Materials</h3>
              <p className="text-gray-600">Premium glass and aluminum sourced from the finest suppliers around the world.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center hover-lift">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-8 w-8 text-white">
                  <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Expert Craftsmanship</h3>
              <p className="text-gray-600">Skilled artisans with decades of experience in glass and aluminum fabrication.</p>
            </div>
            
            <div className="bg-gray-50 p-6 rounded-lg text-center hover-lift">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
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
      <section className="py-24 bg-blue-50">
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
