
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/layout/Layout';
import CategoryNav from '@/components/product/CategoryNav';
import ProductGrid from '@/components/product/ProductGrid';
import { Separator } from '@/components/ui/separator';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Search, SlidersHorizontal, X } from 'lucide-react';

// Sample categories
const categories = [
  { id: '1', name: 'Glass', slug: 'glass' },
  { id: '2', name: 'Aluminium', slug: 'aluminium' },
  { id: '3', name: 'Mirrors', slug: 'mirrors' },
  { id: '4', name: 'Hardware', slug: 'hardware' },
];

// Sample products
const allProducts = [
  {
    id: '1',
    name: 'Float Glass Panel',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1496307653780-42ee777d4833',
    category: 'Glass',
    availability: 'in_stock' as const,
    subcategory: 'float'
  },
  {
    id: '2',
    name: 'Toughened Glass Panel',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1549887534-1541e9326642',
    category: 'Glass',
    availability: 'in_stock' as const,
    subcategory: 'toughened'
  },
  {
    id: '3',
    name: 'Aluminium Sliding Door',
    price: 329.99,
    image: 'https://images.unsplash.com/photo-1487958449943-2429e8be8625',
    category: 'Aluminium',
    availability: 'in_stock' as const,
    subcategory: 'doors'
  },
  {
    id: '4',
    name: 'Aluminium Window Frame',
    price: 189.99,
    image: 'https://images.unsplash.com/photo-1541233349642-6e425fe6190e',
    category: 'Aluminium',
    availability: 'low_stock' as const,
    subcategory: 'windows'
  },
  {
    id: '5',
    name: 'LED Backlit Mirror',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1439337153520-7082a56a81f4',
    category: 'Mirrors',
    availability: 'low_stock' as const,
    subcategory: 'led'
  },
  {
    id: '6',
    name: 'Frameless Round Mirror',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013',
    category: 'Mirrors',
    availability: 'in_stock' as const,
    subcategory: 'frameless'
  },
  {
    id: '7',
    name: 'F Bracket for Glass Shelf',
    price: 24.99,
    image: 'https://images.unsplash.com/photo-1483058712412-4245e9b90334',
    category: 'Hardware',
    availability: 'in_stock' as const,
    subcategory: 'brackets'
  },
  {
    id: '8',
    name: 'D Bracket Set',
    price: 29.99,
    image: 'https://images.unsplash.com/photo-1586864387789-628af9feed72',
    category: 'Hardware',
    availability: 'in_stock' as const,
    subcategory: 'brackets'
  },
];

const Products = () => {
  const { category } = useParams<{ category?: string }>();
  const [filteredProducts, setFilteredProducts] = useState(allProducts);
  const [priceRange, setPriceRange] = useState([0, 500]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>([]);
  const [currentCategory, setCurrentCategory] = useState<string | undefined>(category);

  // Filter products based on selected category, price range, and availability
  useEffect(() => {
    setCurrentCategory(category);
    
    let filtered = allProducts;
    
    // Filter by category
    if (category) {
      const categoryName = categories.find(cat => cat.slug === category)?.name;
      filtered = filtered.filter(product => product.category === categoryName);
    }
    
    // Filter by price range
    filtered = filtered.filter(
      product => product.price >= priceRange[0] && product.price <= priceRange[1]
    );
    
    // Filter by availability
    if (selectedAvailability.length > 0) {
      filtered = filtered.filter(product => 
        selectedAvailability.includes(product.availability)
      );
    }
    
    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        product => product.name.toLowerCase().includes(query) || 
                  product.category.toLowerCase().includes(query)
      );
    }
    
    setFilteredProducts(filtered);
  }, [category, priceRange, selectedAvailability, searchQuery]);

  // Handle availability checkbox changes
  const handleAvailabilityChange = (value: string) => {
    setSelectedAvailability(prev => {
      if (prev.includes(value)) {
        return prev.filter(item => item !== value);
      } else {
        return [...prev, value];
      }
    });
  };

  // Toggle mobile filter panel
  const toggleMobileFilter = () => {
    setIsMobileFilterOpen(!isMobileFilterOpen);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            {category ? categories.find(cat => cat.slug === category)?.name : 'All Products'}
          </h1>
          <p className="text-gray-600">
            Browse our collection of premium {category ? categories.find(cat => cat.slug === category)?.name.toLowerCase() : 'products'}
          </p>
        </div>
        
        {/* Category Navigation */}
        <CategoryNav categories={categories} currentCategory={category} />
        
        {/* Search and Filter Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div className="relative w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full sm:w-80 px-4 py-2 pl-10 pr-4 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
          
          <Button 
            variant="outline" 
            onClick={toggleMobileFilter}
            className="sm:hidden w-full flex items-center justify-center gap-2"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Filters - Desktop */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <div className="space-y-6">
                {/* Price Range Filter */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Price Range</h3>
                  <Slider
                    defaultValue={[0, 500]}
                    max={500}
                    step={10}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
                
                <Separator />
                
                {/* Availability Filter */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Availability</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox 
                        id="in-stock"
                        checked={selectedAvailability.includes('in_stock')}
                        onCheckedChange={() => handleAvailabilityChange('in_stock')}
                      />
                      <label htmlFor="in-stock" className="ml-2 text-sm font-medium">In Stock</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="low-stock"
                        checked={selectedAvailability.includes('low_stock')}
                        onCheckedChange={() => handleAvailabilityChange('low_stock')}
                      />
                      <label htmlFor="low-stock" className="ml-2 text-sm font-medium">Low Stock</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="out-of-stock"
                        checked={selectedAvailability.includes('out_of_stock')}
                        onCheckedChange={() => handleAvailabilityChange('out_of_stock')}
                      />
                      <label htmlFor="out-of-stock" className="ml-2 text-sm font-medium">Out of Stock</label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Mobile Filters - Offcanvas */}
          <div 
            className={`fixed inset-0 bg-black/50 z-50 md:hidden transition-opacity duration-300 ${
              isMobileFilterOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
            onClick={toggleMobileFilter}
          >
            <div 
              className={`absolute top-0 right-0 w-[80%] max-w-sm h-full bg-white p-6 transition-transform duration-300 ${
                isMobileFilterOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filters</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={toggleMobileFilter}
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
              
              <div className="space-y-6">
                {/* Price Range Filter - Mobile */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Price Range</h3>
                  <Slider
                    defaultValue={[0, 500]}
                    max={500}
                    step={10}
                    value={priceRange}
                    onValueChange={(value) => setPriceRange(value as [number, number])}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between text-sm">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
                
                <Separator />
                
                {/* Availability Filter - Mobile */}
                <div>
                  <h3 className="text-lg font-medium mb-4">Availability</h3>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <Checkbox 
                        id="in-stock-mobile"
                        checked={selectedAvailability.includes('in_stock')}
                        onCheckedChange={() => handleAvailabilityChange('in_stock')}
                      />
                      <label htmlFor="in-stock-mobile" className="ml-2 text-sm font-medium">In Stock</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="low-stock-mobile"
                        checked={selectedAvailability.includes('low_stock')}
                        onCheckedChange={() => handleAvailabilityChange('low_stock')}
                      />
                      <label htmlFor="low-stock-mobile" className="ml-2 text-sm font-medium">Low Stock</label>
                    </div>
                    <div className="flex items-center">
                      <Checkbox 
                        id="out-of-stock-mobile"
                        checked={selectedAvailability.includes('out_of_stock')}
                        onCheckedChange={() => handleAvailabilityChange('out_of_stock')}
                      />
                      <label htmlFor="out-of-stock-mobile" className="ml-2 text-sm font-medium">Out of Stock</label>
                    </div>
                  </div>
                </div>
                
                <Button 
                  className="w-full bg-black text-white hover:bg-gray-800"
                  onClick={toggleMobileFilter}
                >
                  Apply Filters
                </Button>
              </div>
            </div>
          </div>
          
          {/* Product Grid */}
          <div className="flex-grow">
            {filteredProducts.length > 0 ? (
              <ProductGrid products={filteredProducts} columns={3} />
            ) : (
              <div className="text-center py-16">
                <h3 className="text-xl font-medium mb-2">No products found</h3>
                <p className="text-gray-600">
                  Try adjusting your filters or search criteria.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Products;
