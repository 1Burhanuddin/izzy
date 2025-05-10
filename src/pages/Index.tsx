
import React from 'react';
import Layout from '@/components/layout/Layout';
import NewArrivals from '@/components/product/NewArrivals';
import CartDrawer from '@/components/cart/CartDrawer';
import { useCart } from '@/contexts/CartContext';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ContactSection from '@/components/contact/ContactSection';
import BestSellers from '@/components/product/BestSellers';
import { LampDemo } from '@/components/ui/lamp-demo';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const Index = () => {
  const { isCartOpen, closeCart } = useCart();
  
  return (
    <Layout>
      <CartDrawer open={isCartOpen} onClose={closeCart} />
      
      <HeroSection />
      
      <NewArrivals />
      
      <BestSellers />
      
      <CategoriesSection />
      
      <FeaturesSection />

      {/* Lamp Demo Section */}
      <section className="py-12 md:py-16">
        <LampDemo />
      </section>

      <div className="container mx-auto px-4 my-8">
        <Accordion type="single" collapsible className="w-full border rounded-lg overflow-hidden shadow-sm">
          <AccordionItem value="contact">
            <AccordionTrigger className="px-4 py-3 text-lg font-medium">Contact Us</AccordionTrigger>
            <AccordionContent>
              <div className="p-4">
                <ContactSection email="111burhanuddin@gmail.com" />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </Layout>
  );
};

export default Index;
