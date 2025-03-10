
import React, { useEffect } from 'react';
import Header from './Header';
import Footer from './Footer';
import CategoryNav from '../product/CategoryNav';
import { useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  const categories = [
    { id: "1", name: "Glass", slug: "glass" },
    { id: "2", name: "Aluminium", slug: "aluminium" },
    { id: "3", name: "Mirrors", slug: "mirrors" }
  ];
  
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-20">
        {isHomePage && (
          <div className="container mx-auto px-4 mt-4">
            <CategoryNav categories={categories} />
          </div>
        )}
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
