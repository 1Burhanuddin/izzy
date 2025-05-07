
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white py-16 px-6">
      <div className="container mx-auto">
        {/* Logo and Tagline */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-20 border-b border-gray-800 pb-10">
          <div className="text-4xl md:text-5xl font-bold mb-4 md:mb-0">IZZY</div>
          <div className="text-xl md:text-2xl text-gray-300">Premium Glass & Aluminum Solutions</div>
        </div>
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-16">
          <div>
            <h3 className="text-xl font-bold mb-6">Company</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/careers" className="text-gray-400 hover:text-white transition-colors">
                  Careers
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6">Products</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/products/glass" className="text-gray-400 hover:text-white transition-colors">
                  Glass
                </Link>
              </li>
              <li>
                <Link to="/products/aluminium" className="text-gray-400 hover:text-white transition-colors">
                  Aluminium
                </Link>
              </li>
              <li>
                <Link to="/products/mirrors" className="text-gray-400 hover:text-white transition-colors">
                  Mirrors
                </Link>
              </li>
              <li>
                <Link to="/products/hardware" className="text-gray-400 hover:text-white transition-colors">
                  Hardware
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6">Legal</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/shipping" className="text-gray-400 hover:text-white transition-colors">
                  Shipping
                </Link>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xl font-bold mb-6">Support</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/help" className="text-gray-400 hover:text-white transition-colors">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Large watermark logo in background */}
        <div className="relative mb-10">
          <div className="absolute inset-0 flex justify-center items-center opacity-10 pointer-events-none">
            <span className="text-[15rem] font-bold">IZZY</span>
          </div>
        </div>
        
        {/* Footer Bottom */}
        <div className="pt-8 mt-8 text-center md:text-left">
          <p className="text-gray-500">
            © {new Date().getFullYear()}. All rights reserved. IZZY
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
