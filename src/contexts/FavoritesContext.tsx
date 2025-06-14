
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
};

interface FavoritesContextType {
  favorites: Product[];
  loading: boolean;
  addToFavorites: (productId: string) => Promise<void>;
  removeFromFavorites: (productId: string) => Promise<void>;
  isFavorite: (productId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch favorites when user changes
  useEffect(() => {
    if (user) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const fetchFavorites = async () => {
    if (!user) return;

    try {
      setLoading(true);
      
      // First get the favorite product IDs
      const { data: favoriteIds, error: favError } = await supabase
        .from('favorites')
        .select('product_id')
        .eq('user_id', user.id);

      if (favError) {
        console.error('Error fetching favorite IDs:', favError);
        return;
      }

      if (!favoriteIds || favoriteIds.length === 0) {
        setFavorites([]);
        return;
      }

      // Then get the full product details
      const productIds = favoriteIds.map(fav => fav.product_id);
      const { data: products, error: prodError } = await supabase
        .from('products')
        .select('id, name, price, image, category, availability')
        .in('id', productIds);

      if (prodError) {
        console.error('Error fetching products:', prodError);
        return;
      }

      // Type assertion to ensure proper typing
      const typedProducts = (products || []).map(product => ({
        ...product,
        availability: product.availability as 'in_stock' | 'low_stock' | 'out_of_stock'
      }));

      setFavorites(typedProducts);
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  const addToFavorites = async (productId: string) => {
    if (!user) {
      toast.error('Please sign in to add favorites');
      return;
    }

    try {
      const { error } = await supabase
        .from('favorites')
        .insert({
          user_id: user.id,
          product_id: productId
        });

      if (error) {
        if (error.code === '23505') {
          toast.info('Product is already in favorites');
          return;
        }
        throw error;
      }

      // Fetch the product details and add to local state
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (productError) {
        throw productError;
      }

      const typedProduct = {
        ...productData,
        availability: productData.availability as 'in_stock' | 'low_stock' | 'out_of_stock'
      };

      setFavorites(prev => [...prev, typedProduct]);
      toast.success('Added to favorites');
    } catch (error: any) {
      console.error('Error adding to favorites:', error);
      toast.error('Failed to add to favorites');
    }
  };

  const removeFromFavorites = async (productId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('favorites')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', productId);

      if (error) {
        throw error;
      }

      setFavorites(prev => prev.filter(product => product.id !== productId));
      toast.success('Removed from favorites');
    } catch (error: any) {
      console.error('Error removing from favorites:', error);
      toast.error('Failed to remove from favorites');
    }
  };

  const isFavorite = (productId: string) => {
    return favorites.some(product => product.id === productId);
  };

  return (
    <FavoritesContext.Provider
      value={{
        favorites,
        loading,
        addToFavorites,
        removeFromFavorites,
        isFavorite
      }}
    >
      {children}
    </FavoritesContext.Provider>
  );
};
