
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import ProductGrid from '@/components/product/ProductGrid';

// Sample product data - this would normally come from a database
const sampleProducts = {
  glass: [
    {
      id: '1',
      name: 'Float Glass Panel',
      price: 149.99,
      image: 'https://images.unsplash.com/photo-1598998625250-378736ef300b?q=80&w=1000',
      category: 'Float Glass',
      availability: 'in_stock' as const,
    },
    {
      id: '2',
      name: 'Toughened Glass Sheet',
      price: 249.99,
      image: 'https://images.unsplash.com/photo-1585998656426-03b8dd5f15f3?q=80&w=1000',
      category: 'Toughened Glass',
      availability: 'in_stock' as const,
    },
    {
      id: '3',
      name: 'Custom Cut Glass Panel',
      price: 199.99,
      image: 'https://images.unsplash.com/photo-1564540586763-123a45ba33d7?q=80&w=1000',
      category: 'Custom Glass',
      availability: 'low_stock' as const,
    },
  ],
  aluminium: [
    {
      id: '4',
      name: 'Sliding Aluminium Door',
      price: 599.99,
      image: 'https://images.unsplash.com/photo-1534536281715-e28d76689b4d?q=80&w=1000',
      category: 'Doors',
      availability: 'in_stock' as const,
    },
    {
      id: '5',
      name: 'Aluminium Window Frame',
      price: 349.99,
      image: 'https://images.unsplash.com/photo-1592513388667-a5c5e8c3523e?q=80&w=1000',
      category: 'Windows',
      availability: 'in_stock' as const,
    },
  ],
  mirrors: [
    {
      id: '6',
      name: 'Standard Wall Mirror',
      price: 129.99,
      image: 'https://images.unsplash.com/photo-1619855544858-e05c0dbf92b5?q=80&w=1000',
      category: 'Standard',
      availability: 'in_stock' as const,
    },
    {
      id: '7',
      name: 'LED Bathroom Mirror',
      price: 279.99,
      image: 'https://images.unsplash.com/photo-1584622650111-993a426nbgf0?q=80&w=1000',
      category: 'LED',
      availability: 'in_stock' as const,
    },
  ],
  hardware: [
    {
      id: '8',
      name: 'F Bracket for Glass Shelf',
      price: 24.99,
      image: 'https://images.unsplash.com/photo-1617104424032-5344f82842ab?q=80&w=1000',
      category: 'Brackets',
      availability: 'in_stock' as const,
    },
    {
      id: '9',
      name: 'D Bracket Set',
      price: 29.99,
      image: 'https://images.unsplash.com/photo-1591129841117-3adfd313a592?q=80&w=1000',
      category: 'Brackets',
      availability: 'low_stock' as const,
    },
  ],
};

const ProductsPage: React.FC = () => {
  const { category } = useParams<{ category: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading data from API
    setLoading(true);
    setTimeout(() => {
      const categoryProducts = category && sampleProducts[category as keyof typeof sampleProducts] || [];
      setProducts(categoryProducts);
      setLoading(false);
    }, 500);
  }, [category]);

  // Format category name for display
  const formatCategoryName = (cat: string | undefined) => {
    if (!cat) return '';
    return cat.charAt(0).toUpperCase() + cat.slice(1);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{formatCategoryName(category)} Products</h1>
          <p className="text-gray-600">
            Explore our range of high-quality {category} products for your home or office.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
          </div>
        ) : products.length > 0 ? (
          <ProductGrid products={products} columns={3} />
        ) : (
          <div className="text-center py-12">
            <h2 className="text-xl font-medium mb-2">No products found</h2>
            <p className="text-gray-600">
              We couldn't find any products in this category. Please check back later or browse other categories.
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ProductsPage;
