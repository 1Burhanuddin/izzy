
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight, Star, Award, Sparkles } from 'lucide-react';
import { TextShimmer } from '@/components/ui/text-shimmer';

const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white min-h-screen flex items-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 w-32 h-32 bg-cyan-500/30 rounded-full blur-2xl animate-bounce"></div>
      </div>

      {/* Main background image with overlay */}
      <div className="absolute inset-0 z-10">
        <img 
          src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=1926&auto=format&fit=crop"
          alt="Modern glass architecture" 
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/60 to-transparent"></div>
      </div>

      <div className="relative z-20 container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          {/* Floating badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8 animate-fade-in">
            <Sparkles className="h-4 w-4 text-yellow-400" />
            <span className="text-sm font-medium">Premium Quality Since 2020</span>
            <Award className="h-4 w-4 text-blue-400" />
          </div>
          
          {/* Main heading with shimmer effect */}
          <TextShimmer
            as="h1"
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 [--base-color:#ffffff] [--base-gradient-color:#60a5fa]"
            duration={3}
          >
            Transform Your Space
          </TextShimmer>
          
          <TextShimmer
            as="h2"
            className="text-3xl md:text-5xl lg:text-6xl font-bold mb-8 [--base-color:#ffffff] [--base-gradient-color:#a855f7]"
            duration={3}
            spread={3}
          >
            with Premium Glass & Aluminum
          </TextShimmer>
          
          <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto text-gray-300 leading-relaxed animate-fade-up">
            Experience the perfect blend of <span className="text-blue-400 font-semibold">exceptional craftsmanship</span> and 
            <span className="text-purple-400 font-semibold"> unparalleled elegance</span> for modern homes and offices. 
            Our premium solutions bring your vision to life.
          </p>
          
          {/* Stats row */}
          <div className="flex flex-wrap justify-center gap-8 mb-12 animate-fade-up delay-200">
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-blue-400">500+</div>
              <div className="text-sm text-gray-400">Happy Clients</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-purple-400">1000+</div>
              <div className="text-sm text-gray-400">Projects Done</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl font-bold text-cyan-400">5⭐</div>
              <div className="text-sm text-gray-400">Average Rating</div>
            </div>
          </div>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-up delay-300">
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0 rounded-full px-8 py-6 text-lg font-semibold shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
            >
              <Link to="/products/glass">
                <Sparkles className="h-5 w-5 mr-2" />
                Explore Products
                <ArrowRight size={20} className="ml-2" />
              </Link>
            </Button>
            
            <Button
              asChild
              variant="outline"
              className="border-2 border-white/30 text-white hover:bg-white/10 backdrop-blur-sm rounded-full px-8 py-6 text-lg font-semibold transition-all duration-300 hover:scale-105"
            >
              <Link to="/products">
                <Star className="h-5 w-5 mr-2" />
                View All Categories
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
