
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

type CartItem = {
  id: string;
  product_id: string;
  user_id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
    price: number;
    image: string | null;
    category: string;
    availability: string;
  };
};

interface CartContextProps {
  cartItems: CartItem[];
  cartCount: number;
  cartTotal: number;
  isLoading: boolean;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  removeFromCart: (cartItemId: string) => Promise<void>;
  updateQuantity: (cartItemId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
}

const CartContext = createContext<CartContextProps | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { user } = useAuth();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);

  // Fetch cart items when user changes
  useEffect(() => {
    if (user) {
      fetchCartItems();
    } else {
      setCartItems([]);
      setIsLoading(false);
    }
  }, [user]);

  // Fetch cart items from database
  const fetchCartItems = async () => {
    try {
      setIsLoading(true);
      
      console.log("Fetching cart items for user:", user?.id);
      
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          id,
          product_id,
          user_id,
          quantity,
          product:products(id, name, price, image, category, availability)
        `)
        .eq('user_id', user?.id);

      if (error) {
        console.error('Error fetching cart items:', error);
        throw error;
      }
      
      console.log("Cart items fetched:", data);
      setCartItems(data || []);
    } catch (error: any) {
      console.error('Error fetching cart items:', error);
      toast.error('Failed to load your cart');
    } finally {
      setIsLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId: string, quantity: number = 1) => {
    try {
      if (!user) {
        toast.error('Please sign in to add items to your cart');
        return;
      }

      console.log("Adding to cart:", productId, quantity);
      
      // Check if product already in cart
      const existingItem = cartItems.find(item => item.product_id === productId);

      if (existingItem) {
        // Update quantity if product already in cart
        await updateQuantity(existingItem.id, existingItem.quantity + quantity);
        toast.success('Cart updated');
      } else {
        // Add new item to cart
        const { data, error } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: productId,
            quantity
          })
          .select(`
            id,
            product_id,
            user_id,
            quantity,
            product:products(id, name, price, image, category, availability)
          `)
          .single();

        if (error) {
          console.error('Error adding item to cart:', error);
          throw error;
        }
        
        if (data) {
          console.log("Item added to cart:", data);
          setCartItems([...cartItems, data]);
          toast.success('Item added to cart');
        }
      }
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  // Remove item from cart
  const removeFromCart = async (cartItemId: string) => {
    try {
      console.log("Removing from cart:", cartItemId);
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('id', cartItemId);

      if (error) {
        console.error('Error removing item from cart:', error);
        throw error;
      }

      setCartItems(cartItems.filter(item => item.id !== cartItemId));
      toast.success('Item removed from cart');
    } catch (error: any) {
      console.error('Error removing item from cart:', error);
      toast.error('Failed to remove item from cart');
    }
  };

  // Update item quantity
  const updateQuantity = async (cartItemId: string, quantity: number) => {
    if (quantity < 1) {
      return removeFromCart(cartItemId);
    }

    try {
      console.log("Updating quantity:", cartItemId, quantity);
      
      const { error } = await supabase
        .from('cart_items')
        .update({ quantity })
        .eq('id', cartItemId);

      if (error) {
        console.error('Error updating cart item:', error);
        throw error;
      }

      setCartItems(
        cartItems.map(item => 
          item.id === cartItemId ? { ...item, quantity } : item
        )
      );
      
      toast.success('Cart updated');
    } catch (error: any) {
      console.error('Error updating cart item:', error);
      toast.error('Failed to update cart');
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!user) return;
    
    try {
      console.log("Clearing cart for user:", user.id);
      
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Error clearing cart:', error);
        throw error;
      }

      setCartItems([]);
      toast.success('Cart cleared');
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      toast.error('Failed to clear cart');
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        cartTotal,
        isLoading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
