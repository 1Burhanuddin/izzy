
import React from 'react';
import Layout from '@/components/layout/Layout';
import NewArrivals from '@/components/product/NewArrivals';
import CartDrawer from '@/components/cart/CartDrawer';
import { useCart } from '@/contexts/CartContext';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturesSection from '@/components/home/FeaturesSection';
import ContactSection from '@/components/contact/ContactSection';

const Index = () => {
  const { isCartOpen, closeCart } = useCart();
  
  return (
    <Layout>
      <CartDrawer open={isCartOpen} onClose={closeCart} />
      
      <HeroSection />
      
      <NewArrivals />
      
      <CategoriesSection />
      
      <FeaturesSection />

      <ContactSection email="111burhanuddin@gmail.com" />
    </Layout>
  );
};

export default Index;
