
import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import CategoryNav from '../product/CategoryNav';
import { Category } from '../product/CategoryNav';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const isHomePage = location.pathname === '/';
  
  // Scroll to top on page change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  // Define categories with the proper structure
  const categories: Category[] = [
    { id: "1", name: "Glass", slug: "glass" },
    { id: "2", name: "Aluminium", slug: "aluminium" },
    { id: "3", name: "Mirrors", slug: "mirrors" }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow pt-10">
        {children}
        {isHomePage && (
          // <div className="container mx-auto px-4 py-8">
          //   <h2 className="text-3xl font-bold mb-6 text-center">Shop By Category</h2>
          //   <CategoryNav categories={categories} />
          // </div>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
