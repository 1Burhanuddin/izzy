
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
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from 'react';

const Index = () => {
  const { isCartOpen, closeCart } = useCart();
  const [isContactOpen, setIsContactOpen] = useState(false);
  
  return (
    <Layout>
      <CartDrawer open={isCartOpen} onClose={closeCart} />
      
      <HeroSection />
      
      <NewArrivals />
      
      <BestSellers />
      
      <CategoriesSection />
      
      <FeaturesSection />

      <div className="container mx-auto px-4 my-8">
        <Collapsible
          open={isContactOpen}
          onOpenChange={setIsContactOpen}
          className="w-full border rounded-lg overflow-hidden shadow-sm"
        >
          <CollapsibleTrigger asChild>
            <Button 
              variant="ghost" 
              className="flex w-full justify-between p-4 text-lg font-medium"
            >
              <span>Contact Us</span>
              {isContactOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <div className="p-4">
              <ContactSection email="111burhanuddin@gmail.com" />
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>
    </Layout>
  );
};

export default Index;
