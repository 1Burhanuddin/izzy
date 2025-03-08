
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MinusCircle, PlusCircle, Star, Check, ShoppingCart, ArrowLeft } from 'lucide-react';
import ProductGrid from '@/components/product/ProductGrid';

// Sample products
const allProducts = [
  {
    id: '1',
    name: 'Float Glass Panel',
    price: 149.99,
    images: [
      'https://images.unsplash.com/photo-1496307653780-42ee777d4833',
      'https://images.unsplash.com/photo-1617575521317-d2974f3b56d2',
      'https://images.unsplash.com/photo-1542362567-b07e54358753',
    ],
    category: 'Glass',
    subcategory: 'float',
    availability: 'in_stock' as const,
    description: 'High-quality float glass panel perfect for windows, partitions, and decorative applications. Features smooth surface and excellent light transmission properties.',
    specifications: [
      { name: 'Material', value: 'Float Glass' },
      { name: 'Thickness', value: '8mm' },
      { name: 'Dimensions', value: '1200mm x 800mm' },
      { name: 'Weight', value: '15kg' },
      { name: 'Transparency', value: 'Clear' },
    ],
    features: [
      'Smooth surface finish',
      'Excellent light transmission',
      'Consistent thickness',
      'Easy to cut and process',
      'High durability',
    ],
  },
  {
    id: '2',
    name: 'Toughened Glass Panel',
    price: 199.99,
    images: [
      'https://images.unsplash.com/photo-1549887534-1541e9326642',
      'https://images.unsplash.com/photo-1461887046916-c7426e65460d',
      'https://images.unsplash.com/photo-1541753866388-0b3c701627d3',
    ],
    category: 'Glass',
    subcategory: 'toughened',
    availability: 'in_stock' as const,
    description: 'Premium toughened glass panel with enhanced strength and safety properties. Ideal for doors, shower screens, and areas requiring safety glass.',
    specifications: [
      { name: 'Material', value: 'Toughened Glass' },
      { name: 'Thickness', value: '10mm' },
      { name: 'Dimensions', value: '1000mm x 800mm' },
      { name: 'Weight', value: '18kg' },
      { name: 'Safety Rating', value: 'Class A' },
    ],
    features: [
      'Up to 5x stronger than regular glass',
      'Breaks into small, harmless pieces if damaged',
      'Heat resistant',
      'Enhanced safety properties',
      'Suitable for high-traffic areas',
    ],
  },
  {
    id: '3',
    name: 'Aluminium Sliding Door',
    price: 329.99,
    images: [
      'https://images.unsplash.com/photo-1487958449943-2429e8be8625',
      'https://images.unsplash.com/photo-1513694203232-719a280e022f',
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
    ],
    category: 'Aluminium',
    subcategory: 'doors',
    availability: 'in_stock' as const,
    description: 'Modern aluminium sliding door system with smooth operation and elegant design. Features premium hardware and toughened glass panels.',
    specifications: [
      { name: 'Frame Material', value: 'Aluminium Alloy' },
      { name: 'Glass Type', value: 'Toughened' },
      { name: 'Glass Thickness', value: '12mm' },
      { name: 'Dimensions', value: '2100mm x 1800mm' },
      { name: 'Track System', value: 'Double' },
    ],
    features: [
      'Smooth sliding mechanism',
      'Weather-resistant seals',
      'Modern minimalist design',
      'Low maintenance',
      'Energy efficient',
    ],
  },
];

// Sample related products
const relatedProducts = [
  {
    id: '2',
    name: 'Toughened Glass Panel',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1549887534-1541e9326642',
    category: 'Glass',
    availability: 'in_stock' as const,
  },
  {
    id: '7',
    name: 'F Bracket for Glass Shelf',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334',
    category: 'Hardware',
    availability: 'in_stock' as const,
  },
  {
    id: '8',
    name: 'D Bracket Set',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1586864387789-628af9feed72',
    category: 'Hardware',
    availability: 'in_stock' as const,
  },
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [animateImage, setAnimateImage] = useState(false);
  
  useEffect(() => {
    // Simulate API fetch
    setLoading(true);
    const foundProduct = allProducts.find(prod => prod.id === id);
    
    // setTimeout to simulate network request
    setTimeout(() => {
      setProduct(foundProduct || null);
      setLoading(false);
    }, 500);
  }, [id]);
  
  const incrementQuantity = () => {
    setQuantity(prev => prev + 1);
  };
  
  const decrementQuantity = () => {
    setQuantity(prev => (prev > 1 ? prev - 1 : 1));
  };
  
  const changeImage = (index: number) => {
    if (index === selectedImage) return;
    
    setAnimateImage(true);
    setTimeout(() => {
      setSelectedImage(index);
      setAnimateImage(false);
    }, 300);
  };
  
  // Render loading state
  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col items-center justify-center h-96">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading product details...</p>
          </div>
        </div>
      </Layout>
    );
  }
  
  // Render 404 if product not found
  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-12">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-4">Product Not Found</h1>
            <p className="text-gray-600 mb-8">The product you're looking for doesn't exist or has been removed.</p>
            <Link to="/products">
              <Button>Back to Products</Button>
            </Link>
          </div>
        </div>
      </Layout>
    );
  }
  
  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <Link 
          to={`/products/${product.subcategory}`} 
          className="inline-flex items-center text-gray-600 hover:text-black mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          <span>Back to {product.category}</span>
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative rounded-lg overflow-hidden aspect-square">
              <img 
                src={product.images[selectedImage]} 
                alt={product.name} 
                className={`w-full h-full object-cover transition-opacity duration-300 ${animateImage ? 'opacity-0' : 'opacity-100'}`}
              />
            </div>
            
            {/* Thumbnail Images */}
            <div className="flex space-x-4">
              {product.images.map((image: string, index: number) => (
                <button 
                  key={index}
                  onClick={() => changeImage(index)}
                  className={`relative w-24 h-24 rounded-md overflow-hidden transition-all duration-300 ${
                    selectedImage === index ? 'ring-2 ring-black' : 'opacity-70 hover:opacity-100'
                  }`}
                >
                  <img 
                    src={image} 
                    alt={`${product.name} thumbnail ${index + 1}`} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          </div>
          
          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <span className="text-sm font-medium text-gray-500">
                {product.category} / {product.subcategory}
              </span>
              <h1 className="text-3xl font-bold mt-1">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center mt-2">
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((rating) => (
                    <Star 
                      key={rating} 
                      className={`h-4 w-4 ${rating <= 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-600">4.0 (24 reviews)</span>
              </div>
            </div>
            
            {/* Price */}
            <div>
              <p className="text-2xl font-bold">${product.price.toFixed(2)}</p>
              <p className="text-sm text-gray-600 mt-1">
                {product.availability === 'in_stock' ? (
                  <span className="flex items-center text-green-600">
                    <Check className="h-4 w-4 mr-1" />
                    In Stock
                  </span>
                ) : product.availability === 'low_stock' ? (
                  <span className="text-amber-600">Low Stock</span>
                ) : (
                  <span className="text-red-600">Out of Stock</span>
                )}
              </p>
            </div>
            
            {/* Description */}
            <p className="text-gray-700">{product.description}</p>
            
            {/* Quantity Selector */}
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium">Quantity:</span>
              <div className="flex items-center">
                <button 
                  onClick={decrementQuantity}
                  className="text-gray-500 hover:text-black transition-colors"
                  disabled={quantity <= 1}
                >
                  <MinusCircle className="h-5 w-5" />
                </button>
                <span className="mx-3 w-8 text-center">{quantity}</span>
                <button 
                  onClick={incrementQuantity}
                  className="text-gray-500 hover:text-black transition-colors"
                >
                  <PlusCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            {/* Add to Cart Button */}
            <div className="pt-2">
              <Button 
                className="w-full bg-black text-white hover:bg-gray-800 flex items-center justify-center gap-2 h-12 text-base"
              >
                <ShoppingCart className="h-5 w-5" />
                Add to Cart
              </Button>
            </div>
            
            {/* Features */}
            <div className="pt-4">
              <h3 className="text-lg font-medium mb-3">Key Features</h3>
              <ul className="space-y-2">
                {product.features.map((feature: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        
        {/* Specifications */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Specifications</h2>
          <div className="bg-gray-50 rounded-lg p-6">
            <table className="w-full">
              <tbody>
                {product.specifications.map((spec: any, index: number) => (
                  <tr key={index} className={index !== 0 ? "border-t border-gray-200" : ""}>
                    <td className="py-3 text-gray-600 font-medium w-1/3">{spec.name}</td>
                    <td className="py-3">{spec.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        {/* Related Products */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          <ProductGrid products={relatedProducts} columns={3} />
        </div>
      </div>
    </Layout>
  );
};

export default ProductDetail;
