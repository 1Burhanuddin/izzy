
import React from 'react';
import Layout from '@/components/layout/Layout';
import NewArrivals from '@/components/product/NewArrivals';
import CartDrawer from '@/components/cart/CartDrawer';
import { useCart } from '@/contexts/CartContext';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ContactSection from '@/components/contact/ContactSection';
import BestSellers from '@/components/product/BestSellers';
import { LampDemo } from '@/components/ui/lamp-demo';
import HeroSection from '@/components/home/HeroSection';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Index = () => {
  const { isCartOpen, closeCart } = useCart();
  
  return (
    <Layout>
      <CartDrawer open={isCartOpen} onClose={closeCart} />
      
      {/* Hero Section with Background */}
      <HeroSection />
      
      {/* Lamp Demo Section */}
      <div className="relative min-h-screen bg-black overflow-hidden">
        <LampDemo />
      </div>
      
      {/* Features Section - Early placement for impact */}
      <FeaturesSection />
      
      {/* New Arrivals with enhanced styling */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50"></div>
        <div className="relative z-10">
          <NewArrivals />
        </div>
      </div>
      
      {/* Categories Section with enhanced background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-blue-50"></div>
        <div className="relative z-10">
          <CategoriesSection />
        </div>
      </div>
      
      {/* Best Sellers with different background */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-white to-pink-50"></div>
        <div className="relative z-10">
          <BestSellers />
        </div>
      </div>

      {/* Contact Section in Accordion */}
      <div className="container mx-auto px-4 my-16">
        <div className="max-w-2xl mx-auto">
          <Accordion type="single" collapsible className="w-full border rounded-xl overflow-hidden shadow-lg bg-white/80 backdrop-blur-sm">
            <AccordionItem value="contact" className="border-none">
              <AccordionTrigger className="px-6 py-4 text-lg font-semibold hover:bg-blue-50/50 transition-colors">
                Get In Touch With Us
              </AccordionTrigger>
              <AccordionContent>
                <div className="p-6 bg-gradient-to-br from-blue-50 to-purple-50">
                  <ContactSection email="111burhanuddin@gmail.com" />
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </div>
    </Layout>
  );
};

export default Index;
