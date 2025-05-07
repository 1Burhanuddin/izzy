
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-white text-black min-h-[80vh] flex items-center">
      <div className="absolute inset-0 z-0">
        <img 
          src="https://t4.ftcdn.net/jpg/05/12/76/37/360_F_512763745_aH8NST04ptKP863Tz0QHuj1FdHGqxmo5.jpg"
          alt="Sky with clouds" 
          className="w-full h-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-white/50"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-6 text-center md:text-left">
            Transform Your Space with Izzy
          </h1>
          
          <p className="text-base md:text-lg mb-8 max-w-xl text-gray-600 text-center md:text-left">
            Our premium glass and aluminum solutions blend exceptional craftsmanship with unparalleled elegance for modern homes and offices.
          </p>
          
          <div className="flex justify-center md:justify-start">
            <Button
              asChild
              variant="apple"
              className="rounded-full px-6 py-5 text-sm md:text-base font-medium flex items-center gap-2"
            >
              <Link to="/products/glass">
                Shop now
                <ArrowRight size={18} className="ml-1" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
