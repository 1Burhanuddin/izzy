
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

interface Category {
  id: string;
  name: string;
  slug: string;
}

interface CategoryNavProps {
  categories: Category[];
  currentCategory?: string;
}

const CategoryNav: React.FC<CategoryNavProps> = ({ categories, currentCategory }) => {
  const location = useLocation();
  const [activeCategory, setActiveCategory] = useState<string | undefined>(currentCategory);
  
  // Update active category based on URL change
  useEffect(() => {
    const pathParts = location.pathname.split('/');
    const categoryFromUrl = pathParts[pathParts.length - 1];
    
    if (categories.some(cat => cat.slug === categoryFromUrl)) {
      setActiveCategory(categoryFromUrl);
    } else {
      setActiveCategory(undefined);
    }
  }, [location.pathname, categories]);

  return (
    <div className="w-full overflow-x-auto pb-2 mb-6">
      <div className="flex items-center space-x-1 min-w-max">
        <Link 
          to="/products"
          className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
            ${!activeCategory ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
        >
          All Products
        </Link>
        
        {categories.map((category) => (
          <Link 
            key={category.id}
            to={`/products/${category.slug}`}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap
              ${activeCategory === category.slug ? 'bg-black text-white' : 'bg-gray-100 text-gray-800 hover:bg-gray-200'}`}
          >
            {category.name}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoryNav;
