
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-[#1a1a1a] text-white py-12 px-4 relative overflow-hidden">
      <div className="container mx-auto relative z-10">
        {/* Logo and Tagline */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 border-b border-gray-800 pb-6">
          <div className="text-3xl md:text-4xl font-bold mb-4 md:mb-0">IZZY</div>
          <div className="text-lg md:text-xl text-gray-300">Premium Glass & Aluminum Solutions</div>
        </div>
        
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div>
            <h3 className="text-lg font-bold mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Privacy Policy
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
            <h3 className="text-lg font-bold mb-4">Products</h3>
            <ul className="space-y-2">
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
            <h3 className="text-lg font-bold mb-4">Legal</h3>
            <ul className="space-y-2">
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
            <h3 className="text-lg font-bold mb-4">Support</h3>
            <ul className="space-y-2">
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
        
        {/* Footer Bottom */}
        <div className="pt-4 text-center">
          <p className="text-gray-500">
            © {new Date().getFullYear()}. All rights reserved. IZZY
          </p>
        </div>
      </div>
      
      {/* Large watermark logo in background */}
      <div className="absolute inset-0 flex justify-center items-center opacity-5 pointer-events-none">
        <span className="text-[8rem] md:text-[15rem] font-bold">IZZY</span>
      </div>
    </footer>
  );
};

export default Footer;
