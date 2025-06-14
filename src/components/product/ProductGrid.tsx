
import React from 'react';
import ProductCard from './ProductCard';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string | null;
  category: string;
  availability: 'in_stock' | 'low_stock' | 'out_of_stock';
};

interface ProductGridProps {
  products: Product[];
  columns?: 2 | 3 | 4;
}

const ProductGrid: React.FC<ProductGridProps> = ({ 
  products, 
  columns = 2
}) => {
  const getGridClass = () => {
    switch (columns) {
      case 2:
        return 'grid-cols-1 sm:grid-cols-2';
      case 3:
        return 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';
      case 4:
        return 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4';
      default:
        return 'grid-cols-1 sm:grid-cols-2';
    }
  };

  return (
    <div className={`grid ${getGridClass()} gap-4 sm:gap-6 lg:gap-8 px-2 sm:px-0`}>
      {products.map((product) => (
        <div key={product.id} className="flex justify-center">
          <ProductCard 
            product={product} 
          />
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;
