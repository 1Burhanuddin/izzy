
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, LogOut, Menu, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { useIsMobile } from '@/hooks/use-mobile';

const Header: React.FC = () => {
  const { user, isAdmin, signOut } = useAuth();
  const { cartCount } = useCart();
  const { favorites } = useFavorites();
  const [isScrolled, setIsScrolled] = useState(false);
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  
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

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-md shadow-sm py-2' 
          : 'bg-transparent py-3 md:py-5'
      }`}
    >
      <div className="container mx-auto flex items-center justify-between">
        {/* Menu Trigger and Logo */}
        <div className="flex items-center space-x-2 md:space-x-4">
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-gray-100 h-8 w-8 md:h-10 md:w-10"
            onClick={toggleSidebar}
          >
            <Menu className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          
          <Link 
            to="/" 
            className="text-xl md:text-2xl font-bold tracking-tighter smooth-transition"
          >
            Izzy
          </Link>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-2 md:space-x-4">
          {user && (
            <Link to="/favorites" className="relative">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-full hover:bg-gray-100 h-8 w-8 md:h-10 md:w-10"
              >
                <Heart className="h-4 w-4 md:h-5 md:w-5" />
                {favorites.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] md:text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center">
                    {favorites.length}
                  </span>
                )}
              </Button>
            </Link>
          )}
          
          <Link to="/cart" className="relative">
            <Button 
              variant="ghost" 
              size="icon" 
              className="rounded-full hover:bg-gray-100 h-8 w-8 md:h-10 md:w-10"
            >
              <ShoppingCart className="h-4 w-4 md:h-5 md:w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] md:text-xs rounded-full h-4 w-4 md:h-5 md:w-5 flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </Button>
          </Link>
          
          {user ? (
            <div className="flex items-center space-x-1 md:space-x-2">
              <Link to="/profile">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-gray-100 h-8 w-8 md:h-10 md:w-10"
                >
                  <User className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              </Link>
              
              {!isMobile && (
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="rounded-full hover:bg-gray-100 h-8 w-8 md:h-10 md:w-10"
                  onClick={() => signOut()}
                >
                  <LogOut className="h-4 w-4 md:h-5 md:w-5" />
                </Button>
              )}
            </div>
          ) : (
            <Link to="/login" className={isMobile ? "hidden" : "block"}>
              <Button 
                variant="outline" 
                className="rounded-full border-black hover:bg-black hover:text-white transition-colors text-xs md:text-sm py-1 px-3 md:py-2 md:px-4 h-8 md:h-9"
              >
                Sign In
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
