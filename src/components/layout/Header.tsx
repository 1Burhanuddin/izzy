
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Replace with actual auth state

  // Change header style on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link 
          to="/" 
          className="text-2xl font-bold tracking-tighter smooth-transition"
        >
          SleekGlass
        </Link>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/products/glass" 
            className="text-sm font-medium hover:text-gray-600 smooth-transition"
          >
            Glass
          </Link>
          <Link 
            to="/products/aluminium" 
            className="text-sm font-medium hover:text-gray-600 smooth-transition"
          >
            Aluminium
          </Link>
          <Link 
            to="/products/mirrors" 
            className="text-sm font-medium hover:text-gray-600 smooth-transition"
          >
            Mirrors
          </Link>
          <Link 
            to="/products/hardware" 
            className="text-sm font-medium hover:text-gray-600 smooth-transition"
          >
            Hardware
          </Link>
        </nav>
        
        {/* Action Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <Link to="/cart">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
              <ShoppingCart className="h-5 w-5" />
            </Button>
          </Link>
          
          {isAuthenticated ? (
            <Link to="/account">
              <Button variant="ghost" size="icon" className="rounded-full hover:bg-gray-100">
                <User className="h-5 w-5" />
              </Button>
            </Link>
          ) : (
            <Link to="/login">
              <Button 
                variant="outline" 
                className="rounded-full border-black hover:bg-black hover:text-white transition-colors"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
        
        {/* Mobile Menu Button */}
        <button 
          className="md:hidden rounded-full p-2 hover:bg-gray-100"
          onClick={toggleMobileMenu}
        >
          {isMobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>
      
      {/* Mobile Menu */}
      <div 
        className={`md:hidden absolute w-full bg-white shadow-lg transition-all duration-300 ease-in-out ${
          isMobileMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
        } overflow-hidden`}
      >
        <div className="container mx-auto px-4 py-4 flex flex-col space-y-4">
          <Link 
            to="/products/glass" 
            className="text-lg font-medium py-2 hover:text-gray-600 smooth-transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Glass
          </Link>
          <Link 
            to="/products/aluminium" 
            className="text-lg font-medium py-2 hover:text-gray-600 smooth-transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Aluminium
          </Link>
          <Link 
            to="/products/mirrors" 
            className="text-lg font-medium py-2 hover:text-gray-600 smooth-transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Mirrors
          </Link>
          <Link 
            to="/products/hardware" 
            className="text-lg font-medium py-2 hover:text-gray-600 smooth-transition"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Hardware
          </Link>
          <div className="flex justify-between pt-4 border-t">
            <Link 
              to="/cart" 
              className="flex items-center space-x-2"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              <ShoppingCart className="h-5 w-5" />
              <span>Cart</span>
            </Link>
            {isAuthenticated ? (
              <Link 
                to="/account" 
                className="flex items-center space-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Account</span>
              </Link>
            ) : (
              <Link 
                to="/login" 
                className="flex items-center space-x-2"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <User className="h-5 w-5" />
                <span>Sign In</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
