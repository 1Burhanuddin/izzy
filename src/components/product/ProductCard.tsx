
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ShoppingCart, Eye } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';

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
    <Card className="group h-full overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px]">
      <Link to={`/product/${id}`} className="block">
        <div className="relative overflow-hidden pt-[75%]">
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
            className="absolute top-2 right-2"
          >
            {getAvailabilityText(availability)}
          </Badge>
          
          <div className="absolute bottom-0 left-0 right-0 flex transform gap-2 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition-all duration-300 group-hover:opacity-100">
            <Button 
              size="sm" 
              variant="secondary" 
              className="flex-1"
              onClick={handleAddToCart}
              disabled={availability === 'out_of_stock'}
            >
              <ShoppingCart className="mr-2 h-4 w-4" />
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
              <Eye className="h-4 w-4" />
            </Button>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="mb-1 text-sm font-medium text-purple-600">{category}</div>
          <h3 className="mb-2 line-clamp-2 text-lg font-semibold text-gray-800 transition-colors group-hover:text-blue-600">{name}</h3>
          <p className="font-bold text-gray-900">₹{price.toFixed(2)}</p>
        </CardContent>
      </Link>
    </Card>
  );
};

export default ProductCard;
