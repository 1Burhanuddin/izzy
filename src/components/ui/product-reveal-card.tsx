"use client"

import { motion, useReducedMotion } from "framer-motion"
import { buttonVariants } from "@/components/ui/button"
import { ShoppingCart, Star, Heart } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { useIsMobile } from "@/hooks/use-mobile"

interface ProductRevealCardProps {
  name?: string
  price?: string
  originalPrice?: string
  image?: string
  description?: string
  rating?: number
  reviewCount?: number
  isFavorite?: boolean
  onAdd?: () => void
  onFavorite?: () => void
  onViewDetails?: () => void
  enableAnimations?: boolean
  className?: string
  category?: string
  availability?: 'in_stock' | 'low_stock' | 'out_of_stock'
  discountPercentage?: number
}

export function ProductRevealCard({
  name = "Premium Glass Panel",
  price = "₹199",
  originalPrice,
  image = "https://images.unsplash.com/photo-1496307653780-42ee777d4833?w=800&h=600&fit=crop",
  description = "High-quality toughened glass panel perfect for modern architectural applications. Durable, safe, and aesthetically pleasing.",
  rating = 4.8,
  reviewCount = 124,
  isFavorite = false,
  onAdd,
  onFavorite,
  onViewDetails,
  enableAnimations = true,
  className,
  category = "Glass",
  availability = "in_stock",
  discountPercentage,
}: ProductRevealCardProps) {
  const [showDetails, setShowDetails] = useState(false)
  const shouldReduceMotion = useReducedMotion()
  const shouldAnimate = enableAnimations && !shouldReduceMotion
  const isMobile = useIsMobile()

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    onFavorite?.()
  }

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    onAdd?.()
  }

  const handleCardClick = () => {
    if (isMobile) {
      onViewDetails?.()
    }
  }

  const handleToggleDetails = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDetails(!showDetails)
  }

  // Calculate original price from discount percentage if not provided
  const getOriginalPrice = () => {
    if (originalPrice) return originalPrice;
    if (discountPercentage && discountPercentage > 0) {
      const currentPrice = parseFloat(price.replace('₹', ''));
      const calculatedOriginalPrice = currentPrice / (1 - discountPercentage / 100);
      return `₹${calculatedOriginalPrice.toFixed(2)}`;
    }
    return null;
  }

  const calculatedOriginalPrice = getOriginalPrice();

  const containerVariants = {
    rest: { 
      scale: 1,
      y: 0,
      filter: "blur(0px)",
    },
    hover: shouldAnimate ? { 
      scale: 1.03, 
      y: -8,
      filter: "blur(0px)",
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 30,
        mass: 0.8,
      }
    } : {},
  }

  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1 },
  }

  const overlayVariants = {
    rest: { 
      y: isMobile && !showDetails ? "100%" : "100%", 
      opacity: isMobile && !showDetails ? 0 : 0,
      filter: "blur(4px)",
    },
    hover: { 
      y: isMobile ? (showDetails ? "0%" : "100%") : "0%", 
      opacity: isMobile ? (showDetails ? 1 : 0) : 1,
      filter: "blur(0px)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 28,
        mass: 0.6,
        staggerChildren: 0.1,
        delayChildren: 0.1,
      },
    },
  }

  const contentVariants = {
    rest: { 
      opacity: 0, 
      y: 20,
      scale: 0.95,
    },
    hover: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 25,
        mass: 0.5,
      },
    },
  }

  const buttonVariants_motion = {
    rest: { scale: 1, y: 0 },
    hover: shouldAnimate ? { 
      scale: 1.05, 
      y: -2,
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 25 
      }
    } : {},
    tap: shouldAnimate ? { scale: 0.95 } : {},
  }

  const favoriteVariants = {
    rest: { scale: 1, rotate: 0 },
    favorite: { 
      scale: [1, 1.3, 1], 
      rotate: [0, 10, -10, 0],
      transition: { 
        duration: 0.5,
        ease: "easeInOut"
      }
    },
  }

  const getAvailabilityColor = () => {
    switch (availability) {
      case 'in_stock':
        return 'bg-green-500'
      case 'low_stock':
        return 'bg-yellow-500'
      case 'out_of_stock':
        return 'bg-red-500'
      default:
        return 'bg-green-500'
    }
  }

  const getAvailabilityText = () => {
    switch (availability) {
      case 'in_stock':
        return 'In Stock'
      case 'low_stock':
        return 'Low Stock'
      case 'out_of_stock':
        return 'Out of Stock'
      default:
        return 'In Stock'
    }
  }

  const getFeatures = () => {
    if (category.toLowerCase().includes('glass')) {
      return [
        { title: 'Toughened', subtitle: 'Safety first' },
        { title: 'Clear', subtitle: 'Crystal clear' }
      ]
    } else if (category.toLowerCase().includes('aluminum')) {
      return [
        { title: 'Durable', subtitle: 'Long lasting' },
        { title: 'Lightweight', subtitle: 'Easy install' }
      ]
    } else if (category.toLowerCase().includes('mirror')) {
      return [
        { title: 'HD Reflection', subtitle: 'Crystal clear' },
        { title: 'Scratch Resistant', subtitle: 'Durable finish' }
      ]
    } else {
      return [
        { title: 'Premium', subtitle: 'High quality' },
        { title: 'Certified', subtitle: 'Standards met' }
      ]
    }
  }

  return (
    <motion.div
      data-slot="product-reveal-card"
      initial="rest"
      whileHover={!isMobile ? "hover" : "rest"}
      animate={isMobile && showDetails ? "hover" : "rest"}
      variants={containerVariants}
      onClick={handleCardClick}
      className={cn(
        "relative w-full max-w-sm mx-auto rounded-2xl border border-border/50 bg-card text-card-foreground overflow-hidden",
        "shadow-lg shadow-black/5 cursor-pointer group",
        "h-auto min-h-[400px]",
        className
      )}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <motion.img
          src={image}
          alt={name}
          className="h-48 sm:h-56 w-full object-cover"
          variants={!isMobile ? imageVariants : {}}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        
        {/* Favorite Button */}
        <motion.button
          onClick={handleFavorite}
          variants={favoriteVariants}
          animate={isFavorite ? "favorite" : "rest"}
          className={cn(
            "absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm border border-white/20",
            "z-10",
            isFavorite 
              ? "bg-red-500 text-white" 
              : "bg-white/20 text-white hover:bg-white/30"
          )}
        >
          <Heart className={cn("w-4 h-4", isFavorite && "fill-current")} />
        </motion.button>

        {/* Availability Badge */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 20 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className={cn(
            "absolute top-3 left-3 text-white px-2 py-1 rounded-full text-xs font-bold",
            getAvailabilityColor()
          )}
        >
          {getAvailabilityText()}
        </motion.div>

        {/* Discount Badge */}
        {(calculatedOriginalPrice || discountPercentage) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="absolute top-10 left-3 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold"
          >
            {discountPercentage ? `${Math.round(discountPercentage)}% OFF` : 
             calculatedOriginalPrice ? `${Math.round(((parseFloat(calculatedOriginalPrice.replace('₹', '')) - parseFloat(price.replace('₹', ''))) / parseFloat(calculatedOriginalPrice.replace('₹', ''))) * 100)}% OFF` : ''}
          </motion.div>
        )}

        {/* Mobile Details Toggle Button */}
        {isMobile && (
          <button
            onClick={handleToggleDetails}
            className="absolute bottom-3 right-3 bg-white/90 text-gray-800 px-3 py-1 rounded-full text-xs font-medium"
          >
            {showDetails ? 'Hide' : 'Details'}
          </button>
        )}
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Rating */}
        <div className="flex items-center gap-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "w-3 h-3 sm:w-4 sm:h-4",
                  i < Math.floor(rating) 
                    ? "text-yellow-400 fill-current" 
                    : "text-muted-foreground"
                )}
              />
            ))}
          </div>
          <span className="text-xs sm:text-sm text-muted-foreground">
            {rating} ({reviewCount})
          </span>
        </div>

        {/* Product Info */}
        <div className="space-y-1">
          <motion.h3 
            className="text-lg sm:text-xl font-bold leading-tight tracking-tight line-clamp-2"
            initial={{ opacity: 0.9 }}
            whileHover={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {name}
          </motion.h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl sm:text-2xl font-bold text-primary">{price}</span>
              {calculatedOriginalPrice && (
                <span className="text-sm sm:text-lg text-muted-foreground line-through">
                  {calculatedOriginalPrice}
                </span>
              )}
            </div>
            <span className="text-xs sm:text-sm text-blue-600 font-medium">{category}</span>
          </div>
        </div>

        {/* Mobile Action Buttons - Always Visible */}
        {isMobile && (
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleAddToCart}
              disabled={availability === 'out_of_stock'}
              className={cn(
                "flex-1 h-10 px-3 rounded-lg font-medium text-sm",
                "bg-primary text-primary-foreground",
                "disabled:opacity-50 disabled:cursor-not-allowed",
                "flex items-center justify-center gap-2"
              )}
            >
              <ShoppingCart className="w-4 h-4" />
              {availability === 'out_of_stock' ? 'Out of Stock' : 'Add'}
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                onViewDetails?.()
              }}
              className="px-4 h-10 rounded-lg border border-input bg-background hover:bg-accent text-sm font-medium"
            >
              View
            </button>
          </div>
        )}
      </div>

      {/* Reveal Overlay - Desktop Hover / Mobile Toggle */}
      <motion.div
        variants={overlayVariants}
        className="absolute inset-0 bg-background/96 backdrop-blur-xl flex flex-col justify-end"
      >
        <div className="p-4 sm:p-6 space-y-4">
          {/* Product Description */}
          <motion.div variants={contentVariants}>
            <h4 className="font-semibold mb-2">Product Details</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {description}
            </p>
          </motion.div>

          {/* Features */}
          <motion.div variants={contentVariants}>
            <div className="grid grid-cols-2 gap-3 text-xs">
              {getFeatures().map((feature, index) => (
                <div key={index} className="bg-muted/50 rounded-lg p-2 text-center">
                  <div className="font-semibold">{feature.title}</div>
                  <div className="text-muted-foreground">{feature.subtitle}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons - Desktop */}
          {!isMobile && (
            <motion.div variants={contentVariants} className="space-y-3">
              <motion.button
                onClick={handleAddToCart}
                variants={buttonVariants_motion}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                disabled={availability === 'out_of_stock'}
                className={cn(
                  buttonVariants({ variant: "default" }), 
                  "w-full h-12 font-medium",
                  "bg-gradient-to-r from-primary to-primary/90",
                  "hover:from-primary/90 hover:to-primary",
                  "shadow-lg shadow-primary/25",
                  availability === 'out_of_stock' && "opacity-50 cursor-not-allowed"
                )}
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                {availability === 'out_of_stock' ? 'Out of Stock' : 'Add to Cart'}
              </motion.button>
              
              <motion.button
                onClick={(e) => {
                  e.stopPropagation()
                  onViewDetails?.()
                }}
                variants={buttonVariants_motion}
                initial="rest"
                whileHover="hover"
                whileTap="tap"
                className={cn(
                  buttonVariants({ variant: "outline" }), 
                  "w-full h-10 font-medium"
                )}
              >
                View Details
              </motion.button>
            </motion.div>
          )}
        </div>
      </motion.div>
    </motion.div>
  )
}
