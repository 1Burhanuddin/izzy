
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { Minus, Plus, X, ShoppingBag } from 'lucide-react';

interface CartDrawerProps {
  open: boolean;
  onClose: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ open, onClose }) => {
  const { cartItems, cartTotal, removeFromCart, updateQuantity } = useCart();

  // Close the drawer when navigating to cart or checkout
  const handleNavigate = () => {
    onClose();
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-sm flex flex-col h-full">
        <SheetHeader className="border-b pb-4">
          <SheetTitle className="flex items-center">
            <ShoppingBag className="mr-2 h-5 w-5" />
            Your Cart ({cartItems.length})
          </SheetTitle>
        </SheetHeader>
        
        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-6">
            <ShoppingBag className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium mb-2">Your cart is empty</h3>
            <p className="text-gray-500 mb-6">Start shopping to add items to your cart</p>
            <Button onClick={onClose}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="flex-1 overflow-auto py-6">
            <ul className="space-y-4">
              {cartItems.map((item) => (
                <li key={item.id} className="flex border-b pb-4">
                  <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="h-full w-full flex items-center justify-center">
                        <span className="text-xs text-gray-500">No image</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="ml-4 flex flex-1 flex-col">
                    <div className="flex justify-between text-base font-medium">
                      <h3 className="line-clamp-2">{item.product.name}</h3>
                      <p className="ml-4">₹{item.product.price.toFixed(2)}</p>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">{item.product.category}</p>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center border rounded">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-gray-100"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-2 py-1 text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-gray-100"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-gray-500"
                      >
                        <X className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {cartItems.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between text-base font-medium mb-4">
              <p>Subtotal</p>
              <p>₹{cartTotal.toFixed(2)}</p>
            </div>
            <SheetFooter className="flex-col gap-2 sm:flex-col">
              <Button asChild className="w-full">
                <Link to="/checkout" onClick={handleNavigate}>
                  Checkout
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full">
                <Link to="/cart" onClick={handleNavigate}>
                  View Cart
                </Link>
              </Button>
            </SheetFooter>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartDrawer;
