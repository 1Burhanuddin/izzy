
import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    category: string;
    availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  };
  onAddToCart?: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { id, name, price, image, category, availability } = product;

  const getBadgeVariant = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return 'success';
      case 'low_stock':
        return 'warning';
      default:
        return 'destructive';
    }
  };

  const getAvailabilityText = (availability: string) => {
    switch (availability) {
      case 'in_stock':
        return 'In Stock';
      case 'low_stock':
        return 'Low Stock';
      default:
        return 'Out of Stock';
    }
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onAddToCart) {
      onAddToCart(id);
    }
  };

  return (
    <div className="group relative overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 bg-white">
      <Link to={`/product/${id}`} className="block">
        <div className="relative pb-[75%] overflow-hidden bg-gray-100">
          {image ? (
            <img
              src={image}
              alt={name}
              className="absolute top-0 left-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <span className="text-gray-500 text-sm">No image available</span>
            </div>
          )}
          <Badge
            variant={getBadgeVariant(availability) as any}
            className="absolute top-2 right-2"
          >
            {getAvailabilityText(availability)}
          </Badge>
          
          {onAddToCart && availability !== 'out_of_stock' && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
              <Button
                onClick={handleAddToCart}
                className="w-full justify-center"
                size="sm"
                variant="secondary"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
              </Button>
            </div>
          )}
        </div>
        
        <div className="p-4">
          <h3 className="font-medium text-lg mb-1 line-clamp-2">{name}</h3>
          <p className="text-sm text-gray-500 mb-2">{category}</p>
          <p className="text-lg font-bold">₹{price.toFixed(2)}</p>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
