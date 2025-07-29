"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import type { Product, CartItem } from "@/lib/types"
import ProductCard from "@/components/ProductCard"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Sparkles, RefreshCw, AlertCircle, TrendingUp, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface RecommendedProductsProps {
  cartItems: CartItem[]
}

interface RecommendationState {
  products: Product[]
  loading: boolean
  error: string | null
  retryCount: number
}

export default function RecommendedProducts({ cartItems }: RecommendedProductsProps) {
  const [state, setState] = useState<RecommendationState>({
    products: [],
    loading: true,
    error: null,
    retryCount: 0
  })

  useEffect(() => {
    fetchRecommendations()
  }, [cartItems])

  const fetchRecommendations = async (isRetry = false) => {
    if (isRetry) {
      setState(prev => ({ ...prev, loading: true, error: null }))
    } else {
      setState(prev => ({ ...prev, loading: true, error: null, retryCount: 0 }))
    }

    try {
      // Get categories from cart items
      const categories = cartItems
        .map((item) => item.product?.category)
        .filter(Boolean)
        .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates

      // Get product IDs to exclude (already in cart)
      const excludeIds = cartItems.map(item => item.product?._id).filter(Boolean)

      const queryParams = new URLSearchParams({
        categories: categories.join(","),
        exclude: excludeIds.join(","),
        limit: "12",
        featured: "true"
      })

      const response = await fetch(`/api/products/recommendations?${queryParams}`)
      
      if (!response.ok) {
        throw new Error(`Failed to fetch recommendations: ${response.status}`)
      }

      const data = await response.json()
      
      if (!data.products || !Array.isArray(data.products)) {
        throw new Error('Invalid response format')
      }

      setState(prev => ({ 
        ...prev, 
        products: data.products,
        loading: false,
        error: null
      }))

    } catch (error: any) {
      console.error("Error fetching recommendations:", error)
      setState(prev => ({ 
        ...prev, 
        loading: false,
        error: error.message || 'Failed to load recommendations',
        retryCount: prev.retryCount + 1
      }))
    }
  }

  const handleRetry = () => {
    fetchRecommendations(true)
  }

  // Loading state
  if (state.loading) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }}
      >
        <Card className=" dark:from-blue-950/20 dark:to-indigo-950/20">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-blue-700 dark:text-blue-300">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Sparkles className="h-5 w-5" />
              </div>
              Recommended for You
              <Badge variant="secondary" className="ml-auto">
                <TrendingUp className="h-3 w-3 mr-1" />
                Personalized
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl mb-3"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded"></div>
                    <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // Error state
  if (state.error) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }}
      >
        <Card className="border-red-200 dark:border-red-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700 dark:text-red-300">
              <AlertCircle className="h-5 w-5" />
              Recommendations Unavailable
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Alert className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-red-800 dark:text-red-200">
                {state.error}
                {state.retryCount < 3 && (
                  <Button
                    variant="link"
                    size="sm"
                    onClick={handleRetry}
                    className="ml-2 p-0 h-auto text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <RefreshCw className="h-3 w-3 mr-1" />
                    Try Again
                  </Button>
                )}
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  // No recommendations
  if (state.products.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-900 dark:to-slate-900 border-gray-200 dark:border-gray-700">
          <CardContent className="py-12 text-center">
            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-300 mb-2">
              No Recommendations Available
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              Add more items to your cart to get personalized recommendations
            </p>
          </CardContent>
        </Card>
      </motion.div>
    )
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ delay: 0.3 }}
    >
      <Card className=" border-none bg-transparent shadow-none  overflow-hidden">
        <CardHeader className="pb-6">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                <Sparkles className="h-5 w-5" />
              </div>
              Recommended for You
              <Badge variant="secondary" className="hidden sm:flex">
                <TrendingUp className="h-3 w-3 mr-1" />
                Personalized
              </Badge>
            </CardTitle>
            <Badge variant="outline" className="text-blue-600 dark:text-blue-400">
              {state.products.length} Products
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="px-4 pb-6">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {state.products.map((product, index) => (
                <CarouselItem
                  key={product._id}
                  className="pl-2 md:pl-4 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                >
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="relative group"
                  >
                    <div className="absolute top-1 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Badge 
                        variant="secondary" 
                        className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 border-green-300 dark:border-green-600 text-xs"
                      >
                        Recommended
                      </Badge>
                    </div>
                    <div className="transform transition-transform duration-300 group-hover:scale-[1.02]">
                      <ProductCard 
                        product={product} 
                        showDescription={false}
                        showCategory={false}
                      />
                    </div>
                  </motion.div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200 dark:border-blue-700 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300" />
            <CarouselNext className="right-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-blue-200 dark:border-blue-700 hover:bg-white dark:hover:bg-gray-700 transition-all duration-300" />
          </Carousel>
        </CardContent>
      </Card>
    </motion.div>
  )
}
