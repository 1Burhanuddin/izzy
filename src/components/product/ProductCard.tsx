
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
}

const ProductCard: React.FC<ProductCardProps> = ({ 
  id, 
  name, 
  price, 
  image, 
  category,
  availability 
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setIsImageLoaded(true);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.5 }}
      className="group relative flex flex-col h-full bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
    >
      {/* Product Image */}
      <Link to={`/product/${id}`} className="relative overflow-hidden aspect-square">
        <div className={`absolute inset-0 bg-gray-100 ${isImageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}></div>
        <img 
          src={image} 
          alt={name} 
          className={`w-full h-full object-cover transition-all duration-700 ease-out transform group-hover:scale-105 ${isImageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={handleImageLoad}
        />
        
        {/* Category Tag */}
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 text-xs font-medium bg-black text-white rounded">
            {category}
          </span>
        </div>
        
        {/* Availability Tag */}
        {availability !== 'in_stock' && (
          <div className="absolute top-3 right-3">
            <span className={`px-2 py-1 text-xs font-medium rounded ${
              availability === 'low_stock' 
                ? 'bg-amber-500 text-white' 
                : 'bg-red-500 text-white'
            }`}>
              {availability === 'low_stock' ? 'Low Stock' : 'Out of Stock'}
            </span>
          </div>
        )}
      </Link>
      
      {/* Product Info */}
      <div className="p-4 flex-grow flex flex-col">
        <Link to={`/product/${id}`}>
          <h3 className="text-lg font-medium mb-1 group-hover:text-gray-700 transition-colors">
            {name}
          </h3>
        </Link>
        <div className="mt-auto pt-2 flex items-center justify-between">
          <p className="font-semibold text-lg">${price.toFixed(2)}</p>
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="rounded-full hover:bg-gray-100 transition-all duration-300"
          >
            <ShoppingCart className="h-5 w-5" />
          </Button>
        </div>
      </div>
      
      {/* Quick Add Overlay */}
      <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none group-hover:pointer-events-auto">
        <Button 
          className="bg-white text-black hover:bg-white/90 hover:text-black transition-all duration-300 flex items-center gap-1 rounded-full px-4 py-2"
        >
          <Plus className="h-4 w-4" />
          Quick Add
        </Button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
