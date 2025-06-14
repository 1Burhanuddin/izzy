
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { useCart } from '@/contexts/CartContext';
import { useFavorites } from '@/contexts/FavoritesContext';
import { ProductRevealCard } from '@/components/ui/product-reveal-card';

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
  const { addToFavorites, removeFromFavorites, isFavorite } = useFavorites();

  const handleAddToCart = () => {
    if (!user) {
      toast.error('Please sign in to add items to your cart');
      navigate('/login');
      return;
    }
    
    addToCart(id);
    toast.success(`${name} added to cart`);
  };

  const handleFavorite = () => {
    if (!user) {
      toast.error('Please sign in to add items to favorites');
      return;
    }

    if (isFavorite(id)) {
      removeFromFavorites(id);
    } else {
      addToFavorites(id);
    }
  };

  const handleViewDetails = () => {
    navigate(`/product/${id}`);
  };

  // Generate description based on category
  const getDescription = () => {
    if (category.toLowerCase().includes('glass')) {
      return `High-quality ${name.toLowerCase()} perfect for modern architectural applications. Durable, safe, and aesthetically pleasing with excellent clarity.`;
    } else if (category.toLowerCase().includes('aluminum') || category.toLowerCase().includes('aluminium')) {
      return `Premium ${name.toLowerCase()} with superior durability and weather resistance. Perfect for modern homes and commercial buildings.`;
    } else if (category.toLowerCase().includes('mirror')) {
      return `Elegant ${name.toLowerCase()} with modern design aesthetics. Perfect for enhancing your living space with style and functionality.`;
    } else {
      return `Premium ${name.toLowerCase()} with excellent quality and design. Perfect for modern spaces and professional applications.`;
    }
  };

  // Generate rating (simulated based on price and availability)
  const getRating = () => {
    let baseRating = 4.0;
    if (price > 200) baseRating += 0.5;
    if (price > 300) baseRating += 0.3;
    if (availability === 'in_stock') baseRating += 0.2;
    return Math.min(5.0, baseRating);
  };

  // Generate review count (simulated)
  const getReviewCount = () => {
    return Math.floor(Math.random() * 200) + 50;
  };

  return (
    <ProductRevealCard
      name={name}
      price={`₹${price.toFixed(2)}`}
      image={image || "https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=800&h=600&fit=crop"}
      description={getDescription()}
      category={category}
      availability={availability}
      rating={getRating()}
      reviewCount={getReviewCount()}
      isFavorite={isFavorite(id)}
      onAdd={handleAddToCart}
      onFavorite={handleFavorite}
      onViewDetails={handleViewDetails}
    />
  );
};

export default ProductCard;
