import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { ShoppingCart, ArrowLeft } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import RelatedProducts from '@/components/product/RelatedProducts';

interface Product {
  id: string;
  name: string;
  price: number;
  description: string | null;
  image: string | null;
  category: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        if (!id) return;

        console.log("Fetching product with ID:", id);
        
        if (id === '10' || id === '11' || id === '12') {
          const demoProducts = {
            '10': {
              id: '10',
              name: 'Elegant Glass Vase',
              price: 79.99,
              image: 'https://images.unsplash.com/photo-1584433789858-3e5f051c5f7f?q=80&w=1000',
              category: 'Decor',
              availability: 'in_stock' as const,
              description: 'A beautiful hand-crafted glass vase perfect for modern home decor.'
            },
            '11': {
              id: '11',
              name: 'Modern Aluminum Frame',
              price: 49.99,
              image: 'https://images.unsplash.com/photo-1621905244241-996e9156297c?q=80&w=1000',
              category: 'Frames',
              availability: 'in_stock' as const,
              description: 'Sleek aluminum picture frame with minimalist design for contemporary spaces.'
            },
            '12': {
              id: '12',
              name: 'Designer Wall Mirror',
              price: 199.99,
              image: 'https://images.unsplash.com/photo-1619855544858-e05c0dbf92b5?q=80&w=1000',
              category: 'Mirrors',
              availability: 'in_stock' as const,
              description: 'Premium wall mirror with elegant design to enhance your living space.'
            }
          };
          
          setProduct(demoProducts[id as keyof typeof demoProducts]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching product:', error);
          toast.error('Error loading product details');
          navigate('/products/glass');
          return;
        }

        const formattedProduct = {
          ...data,
          availability: (data.availability === 'in_stock' || 
                        data.availability === 'low_stock' || 
                        data.availability === 'out_of_stock') 
                        ? data.availability as 'in_stock' | 'low_stock' | 'out_of_stock'
                        : 'in_stock'
        };

        console.log("Product data loaded:", formattedProduct);
        setProduct(formattedProduct);
      } catch (error) {
        console.error('Error:', error);
        toast.error('Failed to load product details');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, navigate]);

  const handleAddToCart = async () => {
    if (!product) return;
    
    if (!user) {
      toast.error('Please sign in to add items to your cart');
      navigate('/login');
      return;
    }
    
    try {
      await addToCart(product.id, quantity);
      toast.success(`${product.name} added to cart`);
    } catch (error) {
      console.error('Error adding to cart:', error);
      toast.error('Failed to add item to cart');
    }
  };

  const goBack = () => {
    navigate(-1);
  };

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

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-4">The product you're looking for doesn't exist or has been removed.</p>
          <Button onClick={() => navigate('/products/glass')}>
            Browse Products
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center"
          onClick={goBack}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-lg overflow-hidden bg-gray-100 shadow-md hover:shadow-lg transition-all duration-300">
            {product.image ? (
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-auto object-cover"
              />
            ) : (
              <div className="w-full aspect-square flex items-center justify-center bg-gray-200">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2 mb-4">
              <Badge variant={getBadgeVariant(product.availability) as any}>
                {getAvailabilityText(product.availability)}
              </Badge>
              <span className="text-blue-600">{product.category}</span>
            </div>
            
            <p className="text-2xl font-bold mb-4">₹{product.price.toFixed(2)}</p>
            
            {product.description && (
              <div className="mb-6 bg-gray-50 p-4 rounded-lg">
                <h3 className="text-lg font-medium mb-2 text-blue-800">Description</h3>
                <p className="text-gray-700">{product.description}</p>
              </div>
            )}
            
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-2 text-blue-800">Quantity</h3>
              <div className="flex items-center">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1 border border-gray-300 rounded-l-md bg-gray-50 hover:bg-gray-100 transition-colors"
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <input 
                  type="number" 
                  min="1"
                  value={quantity} 
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)} 
                  className="w-16 text-center border-y border-gray-300 py-1"
                />
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1 border border-gray-300 rounded-r-md bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  +
                </button>
              </div>
            </div>
            
            <div className="space-y-4">
              <Button 
                onClick={handleAddToCart} 
                disabled={product.availability === 'out_of_stock'}
                className="w-full bg-blue-600 hover:bg-blue-700"
                size="lg"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart
              </Button>
              
              {product.availability === 'out_of_stock' && (
                <p className="text-red-500 text-sm">
                  This product is currently out of stock
                </p>
              )}
              
              {!user && (
                <p className="text-gray-500 text-sm">
                  Please sign in to add items to your cart
                </p>
              )}
            </div>
          </div>
        </div>
        
        {/* Added Related Products section */}
        <div className="mt-16">
          <RelatedProducts 
            currentProductId={product.id} 
            category={product.category} 
          />
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
