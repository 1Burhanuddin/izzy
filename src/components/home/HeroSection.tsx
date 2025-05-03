
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  return (
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
  );
};

export default HeroSection;
