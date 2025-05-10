
import React from 'react';
import { Award, Star } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';

const FeaturesSection: React.FC = () => {
  const isMobile = useIsMobile();
  
  return (
    <section className="py-10 md:py-16 bg-gray-50">
      <div className="container mx-auto">
        <div className="text-center mb-6 md:mb-10">
          <h2 className="text-xl md:text-3xl font-bold mb-2 text-gray-800">Why Choose Izzy</h2>
        </div>
        
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
          <div className="bg-white p-3 md:p-5 rounded-lg text-center hover-lift shadow-sm border border-gray-100">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
              <Award className="h-4 w-4 md:h-6 md:w-6 text-blue-500" />
            </div>
            <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2 text-gray-800">Quality Materials</h3>
            <p className="text-xs md:text-sm text-gray-600">Premium glass and aluminum sourced from the finest suppliers.</p>
          </div>
          
          <div className="bg-white p-3 md:p-5 rounded-lg text-center hover-lift shadow-sm border border-gray-100">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 md:h-6 md:w-6 text-purple-500">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </div>
            <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2 text-gray-800">Expert Craftsmanship</h3>
            <p className="text-xs md:text-sm text-gray-600">Skilled artisans with decades of experience.</p>
          </div>
          
          <div className="bg-white p-3 md:p-5 rounded-lg text-center hover-lift shadow-sm border border-gray-100">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 md:h-6 md:w-6 text-cyan-500">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2 text-gray-800">Trusted Service</h3>
            <p className="text-xs md:text-sm text-gray-600">Customer satisfaction is our highest priority.</p>
          </div>
          
          <div className="bg-white p-3 md:p-5 rounded-lg text-center hover-lift shadow-sm border border-gray-100">
            <div className="w-8 h-8 md:w-12 md:h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-2 md:mb-3">
              <Star className="h-4 w-4 md:h-6 md:w-6 text-amber-500" />
            </div>
            <h3 className="text-sm md:text-lg font-bold mb-1 md:mb-2 text-gray-800">Custom Solutions</h3>
            <p className="text-xs md:text-sm text-gray-600">Bespoke designs tailored to your specific needs.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
