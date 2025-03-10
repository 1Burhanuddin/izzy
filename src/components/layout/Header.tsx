
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Menu, User, Search, X, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import CategoryNav from '../product/CategoryNav';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { user, profile, signOut, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchOpen(false);
      setSearchTerm('');
    }
  };

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleSearch = () => {
    setSearchOpen(!searchOpen);
    if (!searchOpen) {
      setTimeout(() => {
        document.getElementById('search-input')?.focus();
      }, 100);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };

    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, []);

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="text-2xl font-bold">
              Izzy
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-600 hover:text-black font-medium">
              Home
            </Link>
            <Link to="/products/glass" className="text-gray-600 hover:text-black font-medium">
              Glass
            </Link>
            <Link to="/products/aluminium" className="text-gray-600 hover:text-black font-medium">
              Aluminium
            </Link>
            <Link to="/products/mirrors" className="text-gray-600 hover:text-black font-medium">
              Mirrors
            </Link>
          </nav>

          {/* Desktop Header Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={toggleSearch}
              className="p-2 text-gray-600 hover:text-black"
              aria-label="Search"
            >
              <Search className="h-5 w-5" />
            </button>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 text-gray-600 hover:text-black" aria-label="User Profile">
                    <User className="h-5 w-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {profile?.username || user.email?.split('@')[0]}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/profile" className="cursor-pointer w-full">
                      Profile
                    </Link>
                  </DropdownMenuItem>
                  {isAdmin && (
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="cursor-pointer w-full">
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link to="/login">
                <Button variant="ghost">Sign In</Button>
              </Link>
            )}

            <Link to="/cart" className="p-2 text-gray-600 hover:text-black relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <div className="flex md:hidden items-center space-x-4">
            <Link to="/cart" className="p-2 text-gray-600 hover:text-black relative">
              <ShoppingBag className="h-5 w-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cartCount}
                </span>
              )}
            </Link>
            <button
              onClick={toggleMenu}
              className="p-2 text-gray-600 hover:text-black"
              aria-label={menuOpen ? "Close Menu" : "Open Menu"}
            >
              {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Search Overlay */}
        {searchOpen && (
          <div className="fixed inset-0 bg-white z-50 flex flex-col">
            <div className="container mx-auto px-4 py-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Search Products</h2>
                <button
                  onClick={toggleSearch}
                  className="p-2 text-gray-600 hover:text-black"
                  aria-label="Close Search"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    id="search-input"
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for products..."
                    className="w-full border-b border-gray-300 py-3 pl-4 pr-12 focus:outline-none focus:border-black"
                    autoComplete="off"
                  />
                  <button
                    type="submit"
                    className="absolute right-0 top-1/2 -translate-y-1/2 p-2"
                    aria-label="Submit Search"
                  >
                    <Search className="h-5 w-5" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
            menuOpen ? 'translate-x-0' : 'translate-x-full'
          } md:hidden`}
        >
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between mb-8">
              <Link to="/" className="text-2xl font-bold" onClick={() => setMenuOpen(false)}>
                Izzy
              </Link>
              <button
                onClick={toggleMenu}
                className="p-2 text-gray-600 hover:text-black"
                aria-label="Close Menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col space-y-4 mb-8">
              <Link
                to="/"
                className="text-gray-800 hover:text-black py-2 text-lg"
                onClick={() => setMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/products/glass"
                className="text-gray-800 hover:text-black py-2 text-lg"
                onClick={() => setMenuOpen(false)}
              >
                Glass
              </Link>
              <Link
                to="/products/aluminium"
                className="text-gray-800 hover:text-black py-2 text-lg"
                onClick={() => setMenuOpen(false)}
              >
                Aluminium
              </Link>
              <Link
                to="/products/mirrors"
                className="text-gray-800 hover:text-black py-2 text-lg"
                onClick={() => setMenuOpen(false)}
              >
                Mirrors
              </Link>
            </nav>

            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  toggleMenu();
                  toggleSearch();
                }}
                className="flex items-center py-2 text-gray-800 hover:text-black"
              >
                <Search className="h-5 w-5 mr-3" />
                Search
              </button>

              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="flex items-center py-2 text-gray-800 hover:text-black"
                    onClick={() => setMenuOpen(false)}
                  >
                    <User className="h-5 w-5 mr-3" />
                    Profile
                  </Link>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      className="flex items-center py-2 text-gray-800 hover:text-black"
                      onClick={() => setMenuOpen(false)}
                    >
                      <ShoppingCart className="h-5 w-5 mr-3" />
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={() => {
                      handleSignOut();
                      setMenuOpen(false);
                    }}
                    className="flex items-center py-2 text-red-600"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center py-2 text-gray-800 hover:text-black"
                  onClick={() => setMenuOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      <CategoryNav />
    </header>
  );
};

export default Header;
