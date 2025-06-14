
"use client"

import { ProductRevealCard } from "@/components/ui/product-reveal-card"

export default function ProductRevealCardDemo() {
  const sampleProducts = [
    {
      name: "Toughened Glass Panel",
      price: "₹149",
      originalPrice: "₹199",
      image: "https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=800&h=600&fit=crop",
      description: "High-quality toughened glass panel perfect for modern architectural applications. Durable, safe, and aesthetically pleasing with excellent clarity.",
      category: "Glass",
      availability: "in_stock" as const,
      rating: 4.8,
      reviewCount: 156
    },
    {
      name: "Aluminum Window Frame",
      price: "₹299",
      originalPrice: "₹399",
      image: "https://images.unsplash.com/photo-1541233349642-6e425fe6190e?w=800&h=600&fit=crop",
      description: "Premium aluminum window frame with superior durability and weather resistance. Perfect for modern homes and commercial buildings.",
      category: "Aluminum",
      availability: "low_stock" as const,
      rating: 4.6,
      reviewCount: 89
    },
    {
      name: "LED Backlit Mirror",
      price: "₹249",
      image: "https://images.unsplash.com/photo-1439337153520-7082a56a81f4?w=800&h=600&fit=crop",
      description: "Elegant LED backlit mirror with energy-efficient lighting. Perfect for bathrooms and vanity areas with modern design aesthetics.",
      category: "Mirrors",
      availability: "in_stock" as const,
      rating: 4.9,
      reviewCount: 203
    }
  ];

  return (
    <div className="min-h-screen p-8 bg-background">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Product Reveal Cards</h1>
          <p className="text-muted-foreground">Hover over the cards to see the reveal effect</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {sampleProducts.map((product, index) => (
            <ProductRevealCard
              key={index}
              {...product}
              onAdd={() => console.log(`Added ${product.name} to cart`)}
              onFavorite={() => console.log(`Favorited ${product.name}`)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
