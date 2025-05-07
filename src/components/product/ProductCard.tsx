
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useIsMobile } from '@/hooks/use-mobile';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    category: string;
    availability: 'in_stock' | 'low_stock' | 'out_of_stock';
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { id, name, price, image, category, availability } = product;
  const { user } = useAuth();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const isMobile = useIsMobile();

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
    
    if (!user) {
      toast.error('Please sign in to add items to your cart');
      navigate('/login');
      return;
    }
    
    addToCart(id);
  };

  return (
    <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] max-w-full">
      <Link to={`/product/${id}`} className="block">
        <div className="relative overflow-hidden pt-[65%] md:pt-[75%]">
          {image ? (
            <img
              src={image}
              alt={name}
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <span className="text-sm text-gray-500">No image available</span>
            </div>
          )}
          
          <Badge
            variant={getBadgeVariant(availability) as any}
            className="absolute top-2 right-2 text-xs"
          >
            {getAvailabilityText(availability)}
          </Badge>
          
          {/* Desktop hover overlay */}
          <div className="absolute bottom-0 left-0 right-0 flex transform gap-2 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:opacity-100 md:flex hidden">
            <Button 
              size="sm" 
              variant="secondary" 
              className="flex-1 text-xs"
              onClick={handleAddToCart}
              disabled={availability === 'out_of_stock'}
            >
              <ShoppingCart className="mr-1 h-3 w-3" />
              Add to Cart
            </Button>
            
            <Button 
              size="sm" 
              variant="outline" 
              className="bg-white text-black"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/product/${id}`);
              }}
            >
              <Eye className="h-3 w-3" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-3 md:p-4">
          <div className="mb-1 text-xs md:text-sm font-medium text-blue-600">{category}</div>
          <h3 className="mb-2 line-clamp-2 text-sm md:text-base font-semibold text-gray-800 transition-colors group-hover:text-blue-600">{name}</h3>
          <p className="font-bold text-gray-900 text-sm">₹{price.toFixed(2)}</p>
          
          {/* Mobile-only buttons */}
          <div className="flex gap-1 mt-2 md:hidden">
            <Button 
              size="sm" 
              variant="secondary"
              className="flex-1 py-1 h-8 text-xs bg-blue-600 hover:bg-blue-700 text-white"
              onClick={handleAddToCart}
              disabled={availability === 'out_of_stock'}
            >
              <ShoppingCart className="mr-1 h-3 w-3" />
              Add
            </Button>
            
            <Button 
              size="sm" 
              variant="outline"
              className="aspect-square p-0 h-8 w-8"
              onClick={(e) => {
                e.preventDefault();
                navigate(`/product/${id}`);
              }}
            >
              <Eye className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
