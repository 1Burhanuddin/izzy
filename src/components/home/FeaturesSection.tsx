
import React from 'react';
import { Award, Star } from 'lucide-react';

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-12 md:py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-8 md:mb-10">
          <h2 className="text-2xl md:text-3xl font-bold mb-2 text-gray-800">Why Choose Izzy</h2>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="bg-white p-4 md:p-5 rounded-lg text-center hover-lift shadow-sm border border-gray-100">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="h-5 w-5 md:h-6 md:w-6 text-blue-500" />
            </div>
            <h3 className="text-base md:text-lg font-bold mb-2 text-gray-800">Quality Materials</h3>
            <p className="text-xs md:text-sm text-gray-600">Premium glass and aluminum sourced from the finest suppliers.</p>
          </div>
          
          <div className="bg-white p-4 md:p-5 rounded-lg text-center hover-lift shadow-sm border border-gray-100">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 md:h-6 md:w-6 text-purple-500">
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"></path>
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-bold mb-2 text-gray-800">Expert Craftsmanship</h3>
            <p className="text-xs md:text-sm text-gray-600">Skilled artisans with decades of experience in fabrication.</p>
          </div>
          
          <div className="bg-white p-4 md:p-5 rounded-lg text-center hover-lift shadow-sm border border-gray-100">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-cyan-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 md:h-6 md:w-6 text-cyan-500">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
              </svg>
            </div>
            <h3 className="text-base md:text-lg font-bold mb-2 text-gray-800">Trusted Service</h3>
            <p className="text-xs md:text-sm text-gray-600">Customer satisfaction is our highest priority with every project.</p>
          </div>
          
          <div className="bg-white p-4 md:p-5 rounded-lg text-center hover-lift shadow-sm border border-gray-100">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-3">
              <Star className="h-5 w-5 md:h-6 md:w-6 text-amber-500" />
            </div>
            <h3 className="text-base md:text-lg font-bold mb-2 text-gray-800">Custom Solutions</h3>
            <p className="text-xs md:text-sm text-gray-600">Bespoke designs tailored to your specific needs and preferences.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
